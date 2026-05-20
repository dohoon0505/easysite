/**
 * ProductList — 카테고리 필터 + 테이블/카드 반응형 + sticky 액션바.
 */
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Chip,
  DataTable,
  EmptyState,
  ProductCard,
  type DataTableColumn,
} from "@/components";
import { PackageIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useSubscribed } from "@/hooks/useFirestoreCollection";
import { useConfirm } from "@/hooks/useConfirm";
import { useAuth } from "@/state/authStore";
import { toast } from "@/state/toastStore";
import { subscribeCategories } from "@/lib/firestore/categories";
import {
  bulkDelete,
  bulkSetVisibility,
  setProductVisibility,
  subscribeProducts,
} from "@/lib/firestore/products";
import { previewSrc } from "@/lib/storage";
import type { Category, Product } from "@/types";

const won = new Intl.NumberFormat("ko-KR");

export function ProductList() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const confirm = useConfirm();
  const siteId = useAuth((s) => s.claims?.siteId);
  const uid = useAuth((s) => s.user?.uid);

  const [activeCat, setActiveCat] = useState<string | "all">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const cats = useSubscribed<Category[]>(
    (onNext, onErr) =>
      siteId ? subscribeCategories(siteId, onNext, onErr) : () => {},
    [siteId]
  );
  const prods = useSubscribed<Product[]>(
    (onNext, onErr) =>
      siteId
        ? subscribeProducts(
            siteId,
            activeCat === "all" ? {} : { categoryId: activeCat },
            onNext,
            onErr
          )
        : () => {},
    [siteId, activeCat]
  );

  const categoryLabelById = useMemo(() => {
    const map: Record<string, string> = {};
    (cats.data ?? []).forEach((c) => (map[c.categoryId] = c.name));
    return map;
  }, [cats.data]);

  if (!siteId) {
    return (
      <EmptyState
        title="사이트가 지정되지 않았습니다"
        description="좌측 메뉴에서 사이트를 먼저 선택하세요."
      />
    );
  }

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = (allSelected: boolean) => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set((prods.data ?? []).map((p) => p.productId)));
    }
  };

  const onBulkDelete = async () => {
    const ok = await confirm({
      title: `${selected.size}개 상품을 삭제하시겠습니까?`,
      message: "이 작업은 되돌릴 수 없습니다. (발행되지 않은 변경만 영향)",
      tone: "danger",
      confirmText: "삭제",
    });
    if (!ok) return;
    try {
      await bulkDelete(siteId, Array.from(selected));
      toast.success(`${selected.size}개 상품 삭제 완료.`);
      setSelected(new Set());
    } catch (e) {
      toast.danger(`삭제 실패: ${(e as Error).message}`);
    }
  };

  const onBulkVisibility = async (visible: boolean) => {
    if (!uid) return;
    try {
      await bulkSetVisibility(siteId, uid, Array.from(selected), visible);
      toast.success(`${selected.size}개 ${visible ? "노출" : "숨김"} 처리.`);
      setSelected(new Set());
    } catch (e) {
      toast.danger((e as Error).message);
    }
  };

  // ── 컬럼 정의 (데스크톱 테이블) ────────────────────
  const columns: DataTableColumn<Product>[] = [
    {
      id: "thumb",
      header: "",
      width: "64px",
      cell: (p) =>
        previewSrc(p.image) ? (
          <img
            src={previewSrc(p.image)}
            alt=""
            style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }}
          />
        ) : (
          <div
            style={{
              width: 48,
              height: 48,
              background: "var(--sm-background-muted)",
              borderRadius: 8,
            }}
          />
        ),
    },
    {
      id: "name",
      header: "상품명",
      cell: (p) => (
        <Link to={`/products/${p.productId}`} style={{ color: "var(--sm-content-primary)" }}>
          {p.name}
        </Link>
      ),
    },
    {
      id: "category",
      header: "카테고리",
      cell: (p) => (
        <span style={{ color: "var(--sm-content-secondary)" }}>
          {categoryLabelById[p.categoryId] ?? p.categoryId}
        </span>
      ),
    },
    {
      id: "price",
      header: "가격",
      align: "right",
      cell: (p) => <span>{won.format(p.price)}원</span>,
    },
    {
      id: "visible",
      header: "노출",
      align: "center",
      cell: (p) => (
        <input
          type="checkbox"
          checked={p.visible}
          onChange={(e) => {
            if (!uid) return;
            void setProductVisibility(siteId, p.productId, uid, e.target.checked);
          }}
          aria-label="노출 여부"
        />
      ),
    },
    {
      id: "status",
      header: "상태",
      cell: (p) => (
        <Badge tone={p.status === "live" ? "success" : "warning"}>
          {p.status === "live" ? "발행됨" : "드래프트"}
        </Badge>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <h1 style={{ font: "var(--text-heading-md)" }}>상품 목록</h1>
        <Button variant="primary" size="md" onClick={() => navigate("/products/new")}>
          <PlusIcon size={16} />
          상품 추가
        </Button>
      </header>

      {/* 카테고리 필터 칩 */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", overflowX: "auto" }}>
        <Chip selected={activeCat === "all"} onClick={() => setActiveCat("all")}>
          전체
        </Chip>
        {(cats.data ?? []).map((c) => (
          <Chip
            key={c.categoryId}
            selected={activeCat === c.categoryId}
            onClick={() => setActiveCat(c.categoryId)}
          >
            {c.name}
          </Chip>
        ))}
      </div>

      {prods.loading && (
        <div style={{ color: "var(--sm-content-tertiary)", padding: 12 }}>불러오는 중…</div>
      )}

      {prods.data && prods.data.length === 0 && (
        <EmptyState
          icon={<PackageIcon size={32} />}
          title="등록된 상품이 없습니다"
          description="상단 '상품 추가' 버튼으로 시작하세요."
          action={
            <Link to="/products/new">
              <Button variant="primary">상품 추가</Button>
            </Link>
          }
        />
      )}

      {prods.data && prods.data.length > 0 && (
        isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }} role="list">
            {prods.data.map((p) => (
              <ProductCard
                key={p.productId}
                thumb={previewSrc(p.image) || null}
                name={p.name}
                price={p.price}
                categoryLabel={categoryLabelById[p.categoryId]}
                visible={p.visible}
                selected={selected.has(p.productId)}
                onSelectChange={() => toggleOne(p.productId)}
                onClick={() => navigate(`/products/${p.productId}`)}
                onToggleVisible={(v) => {
                  if (!uid) return;
                  void setProductVisibility(siteId, p.productId, uid, v);
                }}
                badges={
                  <Badge tone={p.status === "live" ? "success" : "warning"}>
                    {p.status === "live" ? "발행됨" : "드래프트"}
                  </Badge>
                }
              />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            rows={prods.data}
            getRowId={(r) => r.productId}
            selectedIds={selected}
            onToggleRow={toggleOne}
            onToggleAll={toggleAll}
          />
        )
      )}

      {/* sticky 액션바 — 선택된 항목이 있을 때만 표시 */}
      {selected.size > 0 && (
        <div className="sticky-action-bar" role="region" aria-label="다중 선택 작업">
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ font: "var(--text-label-md)", color: "var(--sm-content-primary)" }}>
              {selected.size}개 선택됨
            </span>
            <Button variant="outline" size="md" onClick={() => onBulkVisibility(true)}>
              노출
            </Button>
            <Button variant="outline" size="md" onClick={() => onBulkVisibility(false)}>
              숨김
            </Button>
            <Button variant="danger" size="md" onClick={() => void onBulkDelete()}>
              <TrashIcon size={16} />
              삭제
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => setSelected(new Set())}
            >
              선택 해제
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
