/* eslint-disable */
// Mobile product list (P01 mobile) + product detail/edit (P02/P03 mobile) + filter sheet

const MobileProductsPage = ({ products, setProducts, categories, onEdit, onAdd, onBack }) => {
  const [category, setCategory] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [showingDraft, setShowingDraft] = React.useState(false);
  const [swipedId, setSwipedId] = React.useState(null);
  const toast = useToast();

  const filtered = React.useMemo(() => {
    let l = products;
    if (category !== "all") l = l.filter((p) => p.category === category);
    if (showingDraft) l = l.filter((p) => p.draft);
    if (query.trim()) l = l.filter((p) => p.name.includes(query));
    return l;
  }, [products, category, query, showingDraft]);

  const toggleVisibility = (id) => {
    setProducts((ps) =>
      ps.map((p) => (p.id === id ? { ...p, visible: !p.visible, draft: true, status: "draft" } : p))
    );
    setSwipedId(null);
    toast({ tone: "success", message: "드래프트로 저장됨" });
  };

  return (
    <>
      <MobileAppBar
        title="상품"
        sub={`${filtered.length}개 · 드래프트 ${products.filter((p) => p.draft).length}건`}
        actions={
          <>
            <IconButton icon="search" onClick={() => setFilterOpen(true)} />
            <IconButton icon="plus" onClick={onAdd} />
          </>
        }
      />

      {/* Category strip */}
      <div
        style={{
          background: "var(--sm-background-default)",
          padding: "var(--size-300) var(--size-400)",
          display: "flex",
          gap: 8,
          overflowX: "auto",
          borderBottom: "1px solid var(--sm-border-subtle)",
        }}
      >
        {categories.map((c) => (
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
      {/* Draft filter toggle */}
      <div style={{ padding: "var(--size-300) var(--size-400)", background: "var(--sm-background-default)", borderBottom: "1px solid var(--sm-border-subtle)", display: "flex", gap: 8, alignItems: "center" }}>
        <button
          onClick={() => setShowingDraft((v) => !v)}
          className={`chip ${showingDraft ? "selected" : ""}`}
        >
          <Icon name="filter" size={12} /> 드래프트만
        </button>
        <div style={{ flex: 1 }} />
        <span className="swipe-hint">
          ← <span className="arrow">스와이프</span>해서 빠른 액션
        </span>
      </div>

      <div className="m-scroll" style={{ paddingBottom: 200 }}>
        {filtered.length === 0 ? (
          <div className="empty" style={{ padding: "var(--size-1000) var(--size-500)" }}>
            <div className="empty-icon"><Icon name="box" size={26} /></div>
            <div className="empty-title">조건에 맞는 상품이 없어요</div>
          </div>
        ) : (
          filtered.map((p) => (
            <SwipeableRow
              key={p.id}
              product={p}
              swiped={swipedId === p.id}
              onSwipe={() => setSwipedId(swipedId === p.id ? null : p.id)}
              onEdit={() => onEdit(p.id)}
              onToggleVisibility={() => toggleVisibility(p.id)}
            />
          ))
        )}
      </div>

      {/* Search sheet */}
      <BottomSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="검색"
      >
        <div style={{ paddingBottom: 24 }}>
          <Input
            prefix="search"
            placeholder="상품명·태그"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <div style={{ marginTop: 16 }}>
            <div className="m-section-title" style={{ padding: "8px 0" }}>최근 검색</div>
            {["라넌큘러스", "어버이날", "튤립"].map((q) => (
              <button
                key={q}
                onClick={() => setQuery(q)}
                style={{
                  width: "100%",
                  padding: "var(--size-300) 0",
                  textAlign: "left",
                  borderBottom: "1px solid var(--sm-border-subtle)",
                  fontSize: 15,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Icon name="clock" size={14} style={{ color: "var(--sm-content-tertiary)" }} />
                {q}
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>
    </>
  );
};

const SwipeableRow = ({ product, swiped, onSwipe, onEdit, onToggleVisibility }) => {
  return (
    <div style={{ position: "relative", overflow: "hidden", background: "var(--sm-status-warning)" }}>
      {/* Action layer behind */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          display: "flex",
          alignItems: "stretch",
        }}
      >
        <button
          onClick={onToggleVisibility}
          style={{
            background: product.visible ? "var(--sm-content-secondary)" : "var(--sm-status-success)",
            color: "white",
            padding: "0 var(--size-400)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            fontSize: 12,
            fontWeight: 600,
            minWidth: 80,
          }}
        >
          <Icon name={product.visible ? "eyeOff" : "eye"} size={18} />
          {product.visible ? "숨김" : "노출"}
        </button>
        <button
          style={{
            background: "var(--sm-status-error)",
            color: "white",
            padding: "0 var(--size-400)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            fontSize: 12,
            fontWeight: 600,
            minWidth: 80,
          }}
        >
          <Icon name="trash" size={18} />
          삭제
        </button>
      </div>
      {/* Foreground row */}
      <div
        className="m-product"
        style={{
          transform: swiped ? "translateX(-160px)" : "translateX(0)",
          transition: "transform var(--motion-base) var(--ease-emphasized)",
        }}
        onClick={() => (swiped ? onSwipe() : onEdit())}
      >
        <div className="m-product-thumb" style={{ background: product.image, backgroundSize: "cover" }}>
          {product.draft && (
            <div style={{ position: "relative", top: -4, left: -4, width: 8, height: 8, borderRadius: "50%", background: "var(--sm-signal-highlight)", boxShadow: "0 0 0 2px white" }} />
          )}
        </div>
        <div className="m-product-body">
          <div className="m-product-name">{product.name}</div>
          <div className="m-product-meta">
            <span>{product.categoryName}</span>
            <span>·</span>
            <span className="mono m-product-price">{product.price.toLocaleString()}원</span>
          </div>
          <div style={{ marginTop: 4, display: "flex", gap: 4 }}>
            {product.draft && <Badge tone="warning">드래프트</Badge>}
            {!product.visible && <Badge tone="neutral">숨김</Badge>}
            {product.stock === "품절" && <Badge tone="danger">품절</Badge>}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSwipe();
          }}
          style={{
            width: 32,
            height: 32,
            display: "grid",
            placeItems: "center",
            color: "var(--sm-content-tertiary)",
          }}
        >
          <Icon name={swiped ? "x" : "more"} size={18} />
        </button>
      </div>
    </div>
  );
};

Object.assign(window, { MobileProductsPage });
