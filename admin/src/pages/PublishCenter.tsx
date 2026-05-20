/**
 * PublishCenter — 드래프트 vs 라이브 비교 + 발행 트리거.
 *
 * M3 는 UI 만. 발행 함수 (publishToGitHub) 는 M5 에서 배포 예정.
 * 그때까진 "준비 중" 상태로 비활성 표시.
 */
import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  FormField,
  TextField,
} from "@/components";
import { SendIcon } from "@/components/icons";
import { useSubscribed } from "@/hooks/useFirestoreCollection";
import { useAuth } from "@/state/authStore";
import { toast } from "@/state/toastStore";
import { subscribeProducts } from "@/lib/firestore/products";
import { subscribeCategories } from "@/lib/firestore/categories";
import {
  callPublishToGitHub,
  subscribePublishes,
} from "@/lib/firestore/publish";
import type { Category, Product, Publish } from "@/types";

export function PublishCenter() {
  const siteId = useAuth((s) => s.claims?.siteId);
  const [publishing, setPublishing] = useState(false);
  const [note, setNote] = useState("");

  const cats = useSubscribed<Category[]>(
    (n, e) => (siteId ? subscribeCategories(siteId, n, e) : () => {}),
    [siteId]
  );
  const prods = useSubscribed<Product[]>(
    (n, e) => (siteId ? subscribeProducts(siteId, {}, n, e) : () => {}),
    [siteId]
  );
  const publishes = useSubscribed<Publish[]>(
    (n, e) => (siteId ? subscribePublishes(siteId, 10, n, e) : () => {}),
    [siteId]
  );

  const stats = useMemo(() => {
    const allCats = cats.data ?? [];
    const allProds = prods.data ?? [];
    return {
      catsLive: allCats.filter((c) => c.status === "live").length,
      catsDraft: allCats.filter((c) => c.status === "draft").length,
      prodsLive: allProds.filter((p) => p.status === "live").length,
      prodsDraft: allProds.filter((p) => p.status === "draft").length,
    };
  }, [cats.data, prods.data]);

  const onPublish = async () => {
    if (!siteId) return;
    setPublishing(true);
    try {
      const res = await callPublishToGitHub({ siteId, note: note || undefined });
      toast.success(
        `발행 완료. 커밋: ${res.data.commitSha.slice(0, 7)} (${res.data.filesChanged}개 파일)`
      );
      setNote("");
    } catch (e) {
      const code = (e as { code?: string }).code;
      const msg = (e as Error).message;
      if (code === "functions/not-found" || msg.includes("not-found")) {
        toast.warning(
          "발행 함수가 아직 배포되지 않았습니다. M5 단계에서 publishToGitHub 가 배포되면 동작합니다."
        );
      } else {
        toast.danger(`발행 실패: ${msg}`);
      }
    } finally {
      setPublishing(false);
    }
  };

  if (!siteId) {
    return <EmptyState title="사이트가 지정되지 않았습니다" />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <header>
        <h1 style={{ font: "var(--text-heading-md)" }}>발행 센터</h1>
        <p style={{ font: "var(--text-body-sm)", color: "var(--sm-content-secondary)", marginTop: 4 }}>
          드래프트 변경 사항을 모아서 GitHub 에 커밋·푸시하면 실제 사이트에 반영됩니다 (GitHub Pages 재빌드 1~3분).
        </p>
      </header>

      <Card density="default">
        <h2 style={{ font: "var(--text-heading-sm)", marginBottom: 12 }}>현재 상태</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          <StatCard label="발행된 카테고리" value={stats.catsLive} tone="success" />
          <StatCard label="드래프트 카테고리" value={stats.catsDraft} tone="warning" />
          <StatCard label="발행된 상품" value={stats.prodsLive} tone="success" />
          <StatCard label="드래프트 상품" value={stats.prodsDraft} tone="warning" />
        </div>
      </Card>

      <Card density="default">
        <h2 style={{ font: "var(--text-heading-sm)", marginBottom: 12 }}>발행 실행</h2>
        <p style={{ font: "var(--text-body-sm)", color: "var(--sm-content-secondary)", marginBottom: 12 }}>
          상품·카테고리 상태를 "발행 대상(live)" 으로 설정한 항목만 사이트에 반영됩니다.
          이미지는 Firebase Storage 에서 자동으로 GitHub repo 로 복사됩니다.
        </p>
        <FormField label="발행 메모 (선택)" helpText="커밋 메시지에 포함됩니다.">
          <TextField
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="예: 봄 신상 시리즈 추가"
          />
        </FormField>
        <div style={{ marginTop: 16 }}>
          <Button
            variant="primary"
            size="lg"
            loading={publishing}
            onClick={() => void onPublish()}
          >
            <SendIcon size={16} />
            지금 발행
          </Button>
        </div>
      </Card>

      <Card density="default">
        <h2 style={{ font: "var(--text-heading-sm)", marginBottom: 12 }}>발행 이력</h2>
        {publishes.loading && <p>불러오는 중…</p>}
        {publishes.data && publishes.data.length === 0 && (
          <p style={{ font: "var(--text-body-sm)", color: "var(--sm-content-tertiary)" }}>
            아직 발행 이력이 없습니다.
          </p>
        )}
        {publishes.data && publishes.data.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {publishes.data.map((p) => (
              <li
                key={p.publishId}
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  font: "var(--text-body-sm)",
                  color: "var(--sm-content-secondary)",
                }}
              >
                <code>{p.commitSha.slice(0, 7)}</code>
                <span>·</span>
                <span>{p.counts.products}개 상품 · {p.counts.categories}개 카테고리</span>
                {p.note && <span style={{ color: "var(--sm-content-tertiary)" }}>· {p.note}</span>}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: "success" | "warning" }) {
  return (
    <div
      style={{
        padding: 16,
        border: "1px solid var(--sm-border-subtle)",
        borderRadius: "var(--radius-md)",
        background: "var(--sm-surface-default)",
      }}
    >
      <div style={{ font: "var(--text-caption)", color: "var(--sm-content-tertiary)", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <strong style={{ font: "var(--text-heading-md)", color: "var(--sm-content-primary)" }}>{value}</strong>
        <Badge tone={tone}>{tone === "success" ? "발행됨" : "대기"}</Badge>
      </div>
    </div>
  );
}
