/* eslint-disable */
// Mobile page implementations

// ── Mobile Home (dashboard) ──────────────────────────────────────────────
const MobileHomePage = ({ products, sections, site, onNav, onBulkPrice }) => {
  const draftP = products.filter((p) => p.draft).length;
  const draftS = sections.filter((s) => s.draft).length;
  const drafts = draftP + draftS;
  const hidden = products.filter((p) => !p.visible).length;
  const soldOut = products.filter((p) => p.stock === "품절").length;

  return (
    <>
      <MobileAppBar
        title="안녕하세요, 소연님"
        sub={`${site.name} · 오늘 ${new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric" })}`}
        actions={<IconButton icon="bell" />}
      />
      <div className="m-scroll">
        {/* Big publish card */}
        <div style={{ padding: "var(--size-400)" }}>
          <div
            style={{
              background: drafts > 0
                ? "linear-gradient(135deg, var(--sm-interactive-brand-default), var(--sm-interactive-brand-active))"
                : "var(--sm-background-default)",
              color: drafts > 0 ? "white" : "var(--sm-content-primary)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--size-500)",
              border: drafts === 0 ? "1px solid var(--sm-border-subtle)" : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 12, opacity: drafts > 0 ? 0.8 : 0.6 }}>
              <Icon name={drafts > 0 ? "rocket" : "check"} size={14} />
              {drafts > 0 ? "발행 대기 중" : "전부 발행됨"}
            </div>
            {drafts > 0 ? (
              <>
                <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 4 }}>
                  {drafts}건의 변경사항이<br />발행을 기다리고 있어요
                </div>
                <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 16 }}>
                  상품 {draftP}건 · 홈 섹션 {draftS}건
                </div>
                <button
                  onClick={() => onNav("m-publish")}
                  style={{
                    background: "white",
                    color: "var(--sm-interactive-brand-default)",
                    padding: "12px 20px",
                    borderRadius: "var(--radius-md)",
                    fontWeight: 700,
                    fontSize: 15,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  지금 발행 <Icon name="arrowRight" size={16} />
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.015em", marginBottom: 4 }}>
                  모든 변경사항이 라이브 상태예요
                </div>
                <div style={{ fontSize: 13, color: "var(--sm-content-secondary)" }}>
                  마지막 발행 2일 전 · {site.domain}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="m-section-title">오늘의 매장</div>
        <div style={{ padding: "0 var(--size-400)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--size-200)" }}>
            <StatCard label="라이브 상품" value={products.filter((p) => !p.draft && p.visible).length} icon="box" />
            <StatCard label="숨김" value={hidden} icon="eyeOff" tone={hidden > 0 ? "warning" : "neutral"} />
            <StatCard label="품절" value={soldOut} icon="alert" tone={soldOut > 0 ? "danger" : "neutral"} />
            <StatCard label="이번 주 조회" value="1.2k" icon="eye" />
          </div>
        </div>

        {/* Bold mobile feature: quick actions */}
        <div className="m-section-title">빠른 작업</div>
        <div style={{ padding: "0 var(--size-400)" }}>
          <div style={{ display: "grid", gap: "var(--size-200)" }}>
            <QuickAction
              icon="bolt"
              tone="signal"
              title="시즌 가격 일괄 조정"
              desc="여러 상품을 한번에 ±% 인상/할인"
              onClick={onBulkPrice}
            />
            <QuickAction
              icon="camera"
              tone="brand"
              title="사진만 빠르게 등록"
              desc="사진 → 이름 → 가격, 3탭 안에 등록"
              onClick={() => onNav("m-quick-add")}
            />
            <QuickAction
              icon="eyeOff"
              tone="neutral"
              title="일시 품절 토글"
              desc="외근 중 빠르게 숨김 처리"
              onClick={() => onNav("m-products")}
            />
          </div>
        </div>

        {/* Recent drafts */}
        {draftP > 0 && (
          <>
            <div className="m-section-title">최근 변경된 상품</div>
            <div style={{ background: "var(--sm-background-default)" }}>
              {products.filter((p) => p.draft).slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="m-product"
                  onClick={() => onNav("m-editor", p.id)}
                >
                  <div className="m-product-thumb" style={{ background: p.image, backgroundSize: "cover" }} />
                  <div className="m-product-body">
                    <div className="m-product-name">{p.name}</div>
                    <div className="m-product-meta">
                      <Badge tone="warning" dot>드래프트</Badge>
                      <span>{p.updatedAt}</span>
                    </div>
                  </div>
                  <Icon name="chevronRight" size={16} style={{ color: "var(--sm-content-tertiary)" }} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

const StatCard = ({ label, value, icon, tone = "neutral" }) => {
  const colors = {
    neutral: { bg: "var(--sm-background-default)", border: "var(--sm-border-subtle)", text: "var(--sm-content-primary)" },
    warning: { bg: "var(--sm-status-warning-subtle)", border: "transparent", text: "var(--sm-status-warning)" },
    danger: { bg: "var(--sm-status-error-subtle)", border: "transparent", text: "var(--sm-status-error)" },
  };
  const c = colors[tone] || colors.neutral;
  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: "var(--radius-md)",
        padding: "var(--size-300) var(--size-400)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: c.text }}>
        <span style={{ fontSize: 12, fontWeight: 600 }}>{label}</span>
        <Icon name={icon} size={14} />
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", color: c.text }} className="mono">
        {value}
      </div>
    </div>
  );
};

const QuickAction = ({ icon, tone, title, desc, onClick }) => {
  const tones = {
    signal: { bg: "var(--sm-status-warning-subtle)", color: "var(--sm-signal-highlight)" },
    brand: { bg: "var(--sm-interactive-brand-subtle)", color: "var(--sm-interactive-brand-default)" },
    neutral: { bg: "var(--sm-background-muted)", color: "var(--sm-content-secondary)" },
  };
  const c = tones[tone];
  return (
    <button
      onClick={onClick}
      style={{
        background: "var(--sm-background-default)",
        border: "1px solid var(--sm-border-subtle)",
        borderRadius: "var(--radius-md)",
        padding: "var(--size-400)",
        display: "flex",
        alignItems: "center",
        gap: "var(--size-400)",
        textAlign: "left",
        width: "100%",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "var(--radius-md)",
          background: c.bg,
          color: c.color,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        <Icon name={icon} size={20} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--sm-content-tertiary)" }}>{desc}</div>
      </div>
      <Icon name="chevronRight" size={16} style={{ color: "var(--sm-content-tertiary)" }} />
    </button>
  );
};

Object.assign(window, { MobileHomePage });
