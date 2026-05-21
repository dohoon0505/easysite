/* eslint-disable */
// P01 — 상품 목록 page
// Card grid + table view, filter chips, multi-select sticky action bar

// 상품 image 필드는 raw URL · repoPath · url(...) 모두 가능 — 안전하게 background-image 로 변환.
const toBgImageUrl = (src) => {
  if (!src || typeof src !== "string") return undefined;
  if (src.startsWith("url(") || src.startsWith("linear-gradient") || src.startsWith("radial-gradient")) return src;
  return `url("${src}")`;
};

const ProductsPage = ({ onEdit, onCreate, products, setProducts, onCsvImport, siteId }) => {
  const [view, setView] = React.useState("card"); // 'card' | 'table'
  const [category, setCategory] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState("updated");
  const [showHidden, setShowHidden] = React.useState(false);
  const [selected, setSelected] = React.useState([]);
  const toast = useToast();

  // 카테고리 칩은 Firestore 의 카테고리 마스터와 동기화 (카테고리 페이지와 동일 출처).
  // useLiveCategories 가 [items, setItems] 반환 → 첫 요소만 사용.
  const [liveCats] = (typeof useLiveCategories === "function"
    ? useLiveCategories(siteId)
    : [[]]);
  // "전체" 칩은 마스터에 존재하지 않으므로 UI 에서 prepend.
  const chipCats = React.useMemo(
    () => [{ id: "all", name: "전체" }, ...(liveCats || [])],
    [liveCats]
  );

  const hiddenCount = products.filter((p) => !p.visible).length;

  const filtered = React.useMemo(() => {
    let list = products;
    if (!showHidden) list = list.filter((p) => p.visible);
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (query.trim()) list = list.filter((p) => p.name.includes(query) || p.tags.some((t) => t.includes(query)));
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "ko"));
    return list;
  }, [products, category, query, sort, showHidden]);

  const allSelected = selected.length === filtered.length && filtered.length > 0;
  const someSelected = selected.length > 0 && !allSelected;

  const toggleSelect = (id) =>
    setSelected((sel) => (sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]));
  const toggleAll = () => setSelected(allSelected ? [] : filtered.map((p) => p.id));

  const toggleVisibility = (id) => {
    setProducts((ps) =>
      ps.map((p) => (p.id === id ? { ...p, visible: !p.visible, draft: true, status: "draft" } : p))
    );
    toast({ tone: "success", message: "드래프트로 저장됨 — 발행해야 사이트에 반영됩니다." });
  };

  const bulkHide = () => {
    setProducts((ps) =>
      ps.map((p) => (selected.includes(p.id) ? { ...p, visible: false, draft: true, status: "draft" } : p))
    );
    toast({ tone: "success", message: `${selected.length}개 상품을 일시 숨김 처리했습니다.` });
    setSelected([]);
  };
  const bulkShow = () => {
    setProducts((ps) =>
      ps.map((p) => (selected.includes(p.id) ? { ...p, visible: true, draft: true, status: "draft" } : p))
    );
    toast({ tone: "success", message: `${selected.length}개 상품을 노출 처리했습니다.` });
    setSelected([]);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">상품</h1>
          <div className="page-subtitle">
            전체 {products.length}개 · 드래프트 {products.filter((p) => p.draft).length}개
            {hiddenCount > 0 && (
              <> · 숨김 <span style={{ color: "var(--sm-content-secondary)", fontWeight: 600 }}>{hiddenCount}개</span></>
            )}
          </div>
        </div>
        <div className="page-actions">
          <div className="tabs">
            <button className={`tab ${view === "card" ? "active" : ""}`} onClick={() => setView("card")}>
              카드
            </button>
            <button className={`tab ${view === "table" ? "active" : ""}`} onClick={() => setView("table")}>
              테이블
            </button>
          </div>
          <Button variant="outline" iconLeft="upload" onClick={onCsvImport}>CSV 가져오기</Button>
          <Button variant="primary" iconLeft="plus" onClick={onCreate}>
            상품 등록
          </Button>
        </div>
      </div>

      {/* Filter row */}
      <div
        style={{
          display: "flex",
          gap: "var(--size-300)",
          alignItems: "center",
          marginBottom: "var(--size-500)",
          flexWrap: "wrap",
        }}
      >
        <div style={{ width: 280 }}>
          <Input
            prefix="search"
            placeholder="상품명·태그로 검색…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div style={{ flex: 1, display: "flex", gap: "var(--size-200)", flexWrap: "wrap" }}>
          {chipCats.map((c) => (
            <Chip
              key={c.id}
              selected={category === c.id}
              count={c.id === "all" ? products.length : products.filter((p) => p.category === c.id).length}
              onClick={() => setCategory(c.id)}
            >
              {c.name}
            </Chip>
          ))}
        </div>
        <div style={{ width: 160 }}>
          <Select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="updated">최근 수정순</option>
            <option value="name">이름순</option>
            <option value="price-asc">가격 낮은 순</option>
            <option value="price-desc">가격 높은 순</option>
          </Select>
        </div>
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "0 var(--size-300)",
            height: 40,
            background: showHidden ? "var(--sm-interactive-brand-subtle)" : "var(--sm-background-default)",
            border: `1px solid ${showHidden ? "var(--sm-interactive-brand-default)" : "var(--sm-border-default)"}`,
            borderRadius: "var(--radius-md)",
            cursor: "pointer",
            fontSize: "var(--text-body-sm)",
            fontWeight: 500,
            color: showHidden ? "var(--sm-interactive-brand-default)" : "var(--sm-content-secondary)",
            transition: "all var(--motion-fast)",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          <Checkbox checked={showHidden} onChange={() => setShowHidden((v) => !v)} />
          <Icon name={showHidden ? "eye" : "eyeOff"} size={14} />
          숨김 상품 포함
          {hiddenCount > 0 && (
            <span
              style={{
                fontSize: 11,
                background: showHidden ? "rgba(255,255,255,0.4)" : "var(--sm-background-muted)",
                color: showHidden ? "var(--sm-interactive-brand-default)" : "var(--sm-content-secondary)",
                padding: "1px 7px",
                borderRadius: "var(--radius-full)",
                fontWeight: 600,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {hiddenCount}
            </span>
          )}
        </label>
      </div>

      {/* Content */}
      {view === "card" ? (
        <ProductCardGrid
          products={filtered}
          selected={selected}
          onToggleSelect={toggleSelect}
          onEdit={onEdit}
          onToggleVisibility={toggleVisibility}
        />
      ) : (
        <ProductTable
          products={filtered}
          selected={selected}
          allSelected={allSelected}
          someSelected={someSelected}
          onToggleSelect={toggleSelect}
          onToggleAll={toggleAll}
          onEdit={onEdit}
          onToggleVisibility={toggleVisibility}
        />
      )}

      {/* Sticky multi-action bar */}
      {selected.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: "var(--size-600)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: "var(--z-sticky)",
            background: "var(--sm-background-inverse)",
            color: "var(--sm-content-inverse)",
            padding: "var(--size-300) var(--size-400)",
            borderRadius: "var(--radius-full)",
            boxShadow: "var(--shadow-overlay)",
            display: "flex",
            alignItems: "center",
            gap: "var(--size-400)",
            animation: "modal-in var(--motion-base) var(--ease-decelerate)",
          }}
        >
          <span style={{ fontSize: "var(--text-label-md)", fontWeight: 600 }}>
            {selected.length}개 선택됨
          </span>
          <span style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)" }} />
          <button
            onClick={bulkShow}
            style={{ color: "white", fontSize: "var(--text-label-md)", display: "flex", alignItems: "center", gap: 6, padding: "4px 8px" }}
          >
            <Icon name="eye" size={15} /> 노출
          </button>
          <button
            onClick={bulkHide}
            style={{ color: "white", fontSize: "var(--text-label-md)", display: "flex", alignItems: "center", gap: 6, padding: "4px 8px" }}
          >
            <Icon name="eyeOff" size={15} /> 숨김
          </button>
          <button
            style={{ color: "white", fontSize: "var(--text-label-md)", display: "flex", alignItems: "center", gap: 6, padding: "4px 8px" }}
          >
            <Icon name="copy" size={15} /> 복제
          </button>
          <button
            style={{ color: "#ffb4b4", fontSize: "var(--text-label-md)", display: "flex", alignItems: "center", gap: 6, padding: "4px 8px" }}
          >
            <Icon name="trash" size={15} /> 삭제
          </button>
          <button
            onClick={() => setSelected([])}
            style={{ color: "rgba(255,255,255,0.6)", padding: "4px 8px" }}
          >
            <Icon name="x" size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

const ProductCardGrid = ({ products, selected, onToggleSelect, onEdit, onToggleVisibility }) => {
  if (products.length === 0) {
    return (
      <Card>
        <div className="empty">
          <div className="empty-icon">
            <Icon name="box" size={26} />
          </div>
          <div className="empty-title">조건에 맞는 상품이 없어요</div>
          <div className="empty-desc">필터를 다시 설정하거나 새 상품을 등록해 보세요.</div>
          <Button variant="primary" iconLeft="plus">상품 등록</Button>
        </div>
      </Card>
    );
  }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "var(--size-400)",
      }}
    >
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          selected={selected.includes(p.id)}
          onToggleSelect={() => onToggleSelect(p.id)}
          onEdit={() => onEdit(p.id)}
          onToggleVisibility={() => onToggleVisibility(p.id)}
        />
      ))}
    </div>
  );
};

const ProductCard = ({ product, selected, onToggleSelect, onEdit, onToggleVisibility }) => (
  <div
    className="card product-card"
    style={{
      borderColor: selected ? "var(--sm-interactive-brand-default)" : "var(--sm-border-subtle)",
      boxShadow: selected ? "0 0 0 1px var(--sm-interactive-brand-default)" : "none",
      transition: "border var(--motion-fast), box-shadow var(--motion-fast)",
    }}
  >
    <div
      style={{
        position: "relative",
        aspectRatio: "4 / 3",
        backgroundImage: toBgImageUrl(product.image),
        backgroundColor: "var(--sm-background-muted)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "var(--size-300)",
          left: "var(--size-300)",
          display: "flex",
          gap: "var(--size-150)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="checkbox"
          style={{ background: "white", borderColor: selected ? "var(--sm-interactive-brand-default)" : "white" }}
          aria-checked={selected}
          role="checkbox"
          onClick={onToggleSelect}
        >
          <svg viewBox="0 0 12 12" fill="none" style={{ opacity: selected ? 1 : 0 }}>
            <polyline points="2 6 5 9 10 3" stroke={selected ? "white" : "transparent"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div
        style={{
          position: "absolute",
          top: "var(--size-300)",
          right: "var(--size-300)",
          display: "flex",
          gap: "var(--size-150)",
        }}
      >
        {product.draft && <Badge tone="warning" dot>드래프트</Badge>}
        {!product.visible && <Badge tone="neutral" dot>숨김</Badge>}
        {product.stock === "품절" && <Badge tone="danger">품절</Badge>}
      </div>
    </div>
    <div style={{ padding: "var(--size-400)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--size-200)", marginBottom: "var(--size-200)" }}>
        <span style={{ fontSize: "var(--text-caption)", color: "var(--sm-content-tertiary)" }}>
          {product.categoryName}
        </span>
        <span style={{ fontSize: "var(--text-caption)", color: "var(--sm-content-disabled)" }}>·</span>
        <span style={{ fontSize: "var(--text-caption)", color: "var(--sm-content-tertiary)" }}>
          {product.updatedAt}
        </span>
      </div>
      <button
        onClick={onEdit}
        style={{
          fontSize: "var(--text-body-md)",
          fontWeight: 600,
          color: "var(--sm-content-primary)",
          marginBottom: "var(--size-200)",
          textAlign: "left",
          width: "100%",
          display: "block",
          letterSpacing: "-0.01em",
          lineHeight: 1.35,
          textWrap: "pretty",
        }}
      >
        {product.name}
      </button>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="mono" style={{ fontWeight: 700, fontSize: "var(--text-body-lg)" }}>
          {product.price.toLocaleString()}원
        </div>
        <div style={{ display: "flex", gap: "var(--size-100)" }}>
          <Toggle
            checked={product.visible}
            onChange={onToggleVisibility}
            aria-label="노출 토글"
          />
        </div>
      </div>
    </div>
  </div>
);

const ProductTable = ({
  products,
  selected,
  allSelected,
  someSelected,
  onToggleSelect,
  onToggleAll,
  onEdit,
  onToggleVisibility,
}) => (
  <div className="table-wrap">
    <table className="table">
      <thead>
        <tr>
          <th style={{ width: 40, paddingLeft: "var(--size-500)" }}>
            <Checkbox
              checked={allSelected ? true : someSelected ? "mixed" : false}
              onChange={onToggleAll}
            />
          </th>
          <th style={{ width: 64 }} />
          <th>상품명</th>
          <th>카테고리</th>
          <th style={{ textAlign: "right" }}>가격</th>
          <th>상태</th>
          <th>수정</th>
          <th style={{ width: 80 }} />
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className={selected.includes(p.id) ? "selected" : ""}>
            <td style={{ paddingLeft: "var(--size-500)" }}>
              <Checkbox checked={selected.includes(p.id)} onChange={() => onToggleSelect(p.id)} />
            </td>
            <td>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-sm)",
                  backgroundImage: toBgImageUrl(p.image),
                  backgroundColor: "var(--sm-background-muted)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </td>
            <td>
              <button
                onClick={() => onEdit(p.id)}
                style={{
                  fontWeight: 600,
                  textAlign: "left",
                  color: "var(--sm-content-primary)",
                  display: "block",
                  textWrap: "pretty",
                  maxWidth: 420,
                }}
              >
                {p.name}
              </button>
              <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                {p.tags.map((t) => (
                  <Badge key={t} tone="neutral">
                    {t}
                  </Badge>
                ))}
              </div>
            </td>
            <td>
              <span style={{ color: "var(--sm-content-secondary)" }}>{p.categoryName}</span>
            </td>
            <td style={{ textAlign: "right" }} className="mono">
              {p.price.toLocaleString()}원
            </td>
            <td>
              <div style={{ display: "flex", gap: 4 }}>
                {p.draft && <Badge tone="warning" dot>드래프트</Badge>}
                {!p.draft && p.visible && <Badge tone="success" dot>라이브</Badge>}
                {!p.visible && <Badge tone="neutral">숨김</Badge>}
              </div>
            </td>
            <td style={{ color: "var(--sm-content-tertiary)", fontSize: "var(--text-body-sm)" }}>
              {p.updatedAt}
            </td>
            <td>
              <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                <Toggle checked={p.visible} onChange={() => onToggleVisibility(p.id)} />
                <IconButton icon="edit" onClick={() => onEdit(p.id)} />
                <IconButton icon="more" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

Object.assign(window, { ProductsPage });
