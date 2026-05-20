/**
 * MediaLibrary — 사이트의 모든 상품 이미지 그리드 뷰.
 *
 * 이미지는 항상 product 에 묶여 있으므로 (storagePath = sites/{siteId}/products/{productId}/...)
 * 별도 미디어 컬렉션 대신 products 의 image 필드를 모아서 표시.
 *
 * 모바일에서 카메라 직접 촬영 → 새 product 폼으로 이동.
 */
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Card, EmptyState, FileUploader } from "@/components";
import { ImageIcon } from "@/components/icons";
import { useSubscribed } from "@/hooks/useFirestoreCollection";
import { useAuth } from "@/state/authStore";
import { toast } from "@/state/toastStore";
import { subscribeProducts } from "@/lib/firestore/products";
import { previewSrc, srcsetFor } from "@/lib/storage";
import type { Product } from "@/types";

export function MediaLibrary() {
  const navigate = useNavigate();
  const siteId = useAuth((s) => s.claims?.siteId);

  const prods = useSubscribed<Product[]>(
    (onNext, onErr) =>
      siteId ? subscribeProducts(siteId, {}, onNext, onErr) : () => {},
    [siteId]
  );

  const withImages = useMemo(
    () =>
      (prods.data ?? []).filter(
        (p) => p.image && (p.image.thumb || p.image.originalUrl)
      ),
    [prods.data]
  );

  if (!siteId) {
    return <EmptyState title="사이트가 지정되지 않았습니다" />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <header>
        <h1 style={{ font: "var(--text-heading-md)" }}>미디어 라이브러리</h1>
        <p style={{ font: "var(--text-body-sm)", color: "var(--sm-content-secondary)", marginTop: 4 }}>
          모든 상품 이미지를 한 눈에 봅니다. 모바일에서 카메라로 새 사진을 즉시 추가할 수 있습니다.
        </p>
      </header>

      <Card density="default">
        <h2 style={{ font: "var(--text-heading-sm)", marginBottom: 12 }}>새 사진 추가</h2>
        <p style={{ font: "var(--text-body-sm)", color: "var(--sm-content-secondary)", marginBottom: 12 }}>
          파일은 상품에 묶여 있으므로, 사진을 선택하면 새 상품 등록 화면으로 이동합니다.
        </p>
        <FileUploader
          accept="image/jpeg,image/png,image/webp"
          cameraCapture
          onFiles={() => {
            toast.info("새 상품 등록 화면에서 이미지를 이어서 업로드하세요.");
            navigate("/products/new");
          }}
        />
      </Card>

      {prods.loading && <Card>불러오는 중…</Card>}

      {!prods.loading && withImages.length === 0 && (
        <EmptyState
          icon={<ImageIcon size={32} />}
          title="등록된 이미지가 없습니다"
          description="상품을 등록하면서 이미지를 업로드하세요."
        />
      )}

      {withImages.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 12,
          }}
        >
          {withImages.map((p) => (
            <button
              key={p.productId}
              type="button"
              onClick={() => navigate(`/products/${p.productId}`)}
              style={{
                background: "var(--sm-surface-default)",
                border: "1px solid var(--sm-border-subtle)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                textAlign: "left",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <img
                src={previewSrc(p.image)}
                srcSet={srcsetFor(p.image)}
                alt={p.name}
                loading="lazy"
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div style={{ padding: 8 }}>
                <div
                  style={{
                    font: "var(--text-label-sm)",
                    color: "var(--sm-content-primary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.name}
                </div>
                <div style={{ marginTop: 4 }}>
                  <Badge tone={p.image.thumb ? "success" : "warning"}>
                    {p.image.thumb ? "OK" : "리사이즈 대기"}
                  </Badge>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
