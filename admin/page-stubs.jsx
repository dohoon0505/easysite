/* eslint-disable */
// Stub pages for routes we're not deeply designing (Categories, Account, Audit, etc.)

const StubPage = ({ title, subtitle, icon, children }) => (
  <div className="page">
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        <div className="page-subtitle">{subtitle}</div>
      </div>
    </div>
    {children || (
      <Card>
        <div className="empty">
          <div className="empty-icon">
            <Icon name={icon} size={26} />
          </div>
          <div className="empty-title">{title}</div>
          <div className="empty-desc">
            이 화면은 다음 라운드에서 디자인됩니다. 핵심 4개 화면 — 홈 섹션 / 상품 / 발행 — 을 먼저 보세요.
          </div>
        </div>
      </Card>
    )}
  </div>
);

const CategoriesPage = () => (
  <StubPage title="카테고리" subtitle="드래그로 정렬 · 숨김 토글 · 인라인 편집" icon="tag">
    <Card>
      <div className="card-header">
        <h2 className="card-title">카테고리 5개</h2>
        <Button variant="primary" iconLeft="plus" size="sm">카테고리 추가</Button>
      </div>
      <div style={{ padding: "var(--size-300)" }}>
        {CATEGORIES.filter((c) => c.id !== "all").map((c, i) => (
          <div
            key={c.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--size-300)",
              padding: "var(--size-300)",
              borderRadius: "var(--radius-sm)",
              cursor: "grab",
            }}
          >
            <Icon name="drag" size={16} style={{ color: "var(--sm-content-disabled)" }} />
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: "var(--radius-sm)",
                background: "var(--sm-interactive-brand-subtle)",
                color: "var(--sm-interactive-brand-default)",
                display: "grid",
                placeItems: "center",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {i + 1}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: "var(--text-body-md)" }}>{c.name}</div>
              <div style={{ fontSize: "var(--text-caption)", color: "var(--sm-content-tertiary)" }}>
                상품 {c.count}개
              </div>
            </div>
            <Toggle checked={true} />
            <IconButton icon="edit" />
            <IconButton icon="trash" />
          </div>
        ))}
      </div>
    </Card>
  </StubPage>
);

Object.assign(window, { StubPage, CategoriesPage });
