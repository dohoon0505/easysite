/* eslint-disable */
// Mobile-frame live preview for H01 home page

const HomePreview = ({ sections, products, activeId }) => {
  return (
    <div style={{ position: "relative" }}>
      {/* Phone bezel */}
      <div
        style={{
          background: "#1a1d24",
          padding: 12,
          borderRadius: 48,
          boxShadow: "var(--shadow-lg)",
          width: "100%",
          maxWidth: 400,
          margin: "0 auto",
          position: "relative",
        }}
      >
        {/* notch */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 90,
            height: 22,
            background: "#1a1d24",
            borderRadius: "0 0 14px 14px",
            zIndex: 2,
          }}
        />
        <div
          style={{
            background: "var(--sm-background-default)",
            borderRadius: 36,
            overflow: "hidden",
            position: "relative",
            height: 760,
          }}
        >
          {/* status bar */}
          <div
            style={{
              padding: "8px 18px 6px",
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--sm-content-primary)",
            }}
          >
            <span>9:41</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span>●●● </span>
            </span>
          </div>
          <div style={{ height: 700, overflowY: "auto", paddingBottom: 24 }}>
            {sections
              .filter((s) => s.enabled)
              .map((s) => (
                <div
                  key={s.id}
                  style={{
                    outline: activeId === s.id ? "2px solid var(--sm-interactive-brand-default)" : "none",
                    outlineOffset: -4,
                    borderRadius: 6,
                    position: "relative",
                  }}
                >
                  {activeId === s.id && (
                    <div
                      style={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        background: "var(--sm-interactive-brand-default)",
                        color: "white",
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "2px 6px",
                        borderRadius: 4,
                        zIndex: 1,
                      }}
                    >
                      편집 중
                    </div>
                  )}
                  {s.type === "hero" && <PreviewHero data={s.data} />}
                  {s.type === "greeting" && <PreviewGreeting data={s.data} />}
                  {s.type === "featured" && <PreviewFeatured data={s.data} products={products} />}
                  {s.type === "info" && <PreviewInfo data={s.data} />}
                  {s.type === "notice" && <PreviewNotice data={s.data} />}
                </div>
              ))}
          </div>
        </div>
      </div>
      <div
        style={{
          textAlign: "center",
          marginTop: 14,
          fontSize: "var(--text-caption)",
          color: "var(--sm-content-tertiary)",
        }}
      >
        실시간으로 반영됩니다 · 발행해야 사이트에 적용
      </div>
    </div>
  );
};

const PreviewHero = ({ data }) => (
  <div
    style={{
      aspectRatio: "4 / 5",
      background: data.image,
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
      color: "white",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      padding: 18,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 50%)",
      }}
    />
    <div style={{ position: "relative" }}>
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6, lineHeight: 1.25 }}>
        {data.headline}
      </div>
      <div style={{ fontSize: 12, lineHeight: 1.5, opacity: 0.92, marginBottom: 12, textWrap: "pretty" }}>
        {data.subhead}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button
          style={{
            background: "white",
            color: "var(--sm-content-primary)",
            padding: "8px 14px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {data.ctaPrimary}
        </button>
        <button
          style={{
            background: "transparent",
            color: "white",
            padding: "8px 14px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            border: "1px solid rgba(255,255,255,0.6)",
          }}
        >
          {data.ctaSecondary}
        </button>
      </div>
    </div>
  </div>
);

const PreviewGreeting = ({ data }) => (
  <div style={{ padding: 18 }}>
    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.01em", textWrap: "pretty" }}>
      {data.title}
    </div>
    <div style={{ fontSize: 12, lineHeight: 1.6, color: "var(--sm-content-secondary)", textWrap: "pretty" }}>
      {data.body}
    </div>
  </div>
);

const PreviewFeatured = ({ data, products }) => (
  <div style={{ padding: "0 18px 18px" }}>
    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, letterSpacing: "-0.01em" }}>
      {data.title}
    </div>
    <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
      {data.pickedIds.map((id) => {
        const p = products.find((x) => x.id === id);
        if (!p) return null;
        return (
          <div key={id} style={{ width: 110, flexShrink: 0 }}>
            <div
              style={{
                aspectRatio: "1 / 1",
                background: p.image,
                backgroundSize: "cover",
                borderRadius: 6,
                marginBottom: 4,
              }}
            />
            <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {p.name}
            </div>
            <div style={{ fontSize: 10, color: "var(--sm-content-tertiary)" }} className="mono">
              {p.price.toLocaleString()}원
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const PreviewInfo = ({ data }) => (
  <div style={{ padding: "0 18px 18px" }}>
    <div
      style={{
        background: "var(--sm-background-subtle)",
        padding: 14,
        borderRadius: 10,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {[
        ["주소", data.address],
        ["영업", data.hours],
        ["전화", data.phone],
        ["인스타", data.instagram],
      ].map(([k, v]) => (
        <div key={k} style={{ display: "flex", gap: 10, fontSize: 11 }}>
          <span style={{ width: 36, color: "var(--sm-content-tertiary)", fontWeight: 600 }}>{k}</span>
          <span style={{ flex: 1, color: "var(--sm-content-primary)" }}>{v}</span>
        </div>
      ))}
    </div>
  </div>
);

const PreviewNotice = ({ data }) => (
  <div style={{ padding: "0 18px 18px" }}>
    <div
      style={{
        background: "var(--sm-status-warning-subtle)",
        color: "var(--sm-status-warning)",
        padding: "10px 12px",
        borderRadius: 8,
        fontSize: 11,
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
      }}
    >
      <Icon name="bell" size={14} />
      <span style={{ flex: 1 }}>{data.body}</span>
    </div>
  </div>
);

Object.assign(window, { HomePreview });
