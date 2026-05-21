/* eslint-disable */
// H01 — 홈 섹션 편집
// Left rail: list of sections (drag-reorder, toggle enable). Right: editor + preview.

const HomeSectionsPage = ({ sections, setSections, products, onNav, site }) => {
  const [activeId, setActiveId] = React.useState(sections[0]?.id);
  const active = sections.find((s) => s.id === activeId);
  const toast = useToast();

  const updateActive = (patch) => {
    setSections((all) =>
      all.map((s) =>
        s.id === activeId ? { ...s, data: { ...s.data, ...patch }, draft: true } : s
      )
    );
  };
  const toggleEnabled = (id) => {
    setSections((all) =>
      all.map((s) => (s.id === id ? { ...s, enabled: !s.enabled, draft: true } : s))
    );
  };
  const move = (id, dir) => {
    setSections((all) => {
      const i = all.findIndex((s) => s.id === id);
      if (i < 0) return all;
      const j = i + dir;
      if (j < 0 || j >= all.length) return all;
      const next = [...all];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">홈 섹션 편집</h1>
          <div className="page-subtitle">
            홈페이지의 첫 화면 — 섹션을 켜고/끄고, 순서를 바꾸고, 내용을 편집하세요.
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr 440px",
          gap: "var(--size-400)",
          alignItems: "flex-start",
        }}
      >
        {/* Section list */}
        <Card>
          <div className="card-header">
            <h2 className="card-title" style={{ fontSize: "var(--text-body-md)" }}>
              섹션 ({sections.length})
            </h2>
            <IconButton icon="plus" />
          </div>
          <div style={{ padding: "var(--size-200)" }}>
            {sections.map((s, i) => (
              <div
                key={s.id}
                onClick={() => setActiveId(s.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--size-200)",
                  padding: "var(--size-300)",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  background: activeId === s.id ? "var(--sm-interactive-brand-subtle)" : "transparent",
                  marginBottom: 2,
                  transition: "background var(--motion-fast)",
                }}
              >
                <button
                  className="drag-handle"
                  style={{ color: "var(--sm-content-disabled)", cursor: "grab", display: "grid", placeItems: "center" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Icon name="drag" size={14} />
                </button>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "var(--radius-sm)",
                    background: s.enabled ? "var(--sm-interactive-brand-subtle)" : "var(--sm-background-muted)",
                    color: s.enabled ? "var(--sm-interactive-brand-default)" : "var(--sm-content-tertiary)",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name={s.icon} size={15} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "var(--text-label-md)",
                      fontWeight: 600,
                      color: s.enabled ? "var(--sm-content-primary)" : "var(--sm-content-tertiary)",
                    }}
                  >
                    {s.title}
                  </div>
                  <div style={{ fontSize: "var(--text-caption)", color: "var(--sm-content-tertiary)" }}>
                    {i + 1}번째 · {s.enabled ? "사용 중" : "꺼짐"}
                  </div>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <Toggle checked={s.enabled} onChange={() => toggleEnabled(s.id)} />
                </div>
              </div>
            ))}
          </div>
          <div className="card-footer" style={{ justifyContent: "center", alignItems: "center", padding: "var(--size-400) var(--size-400)" }}>
            <span className="text-tertiary" style={{ fontSize: "var(--text-caption)" }}>
              ↑↓ 드래그로 순서 변경
            </span>
          </div>
        </Card>

        {/* Editor */}
        <SectionEditor section={active} update={updateActive} products={products} onNav={onNav} />

        {/* Mobile-frame preview — 실제 사이트를 iframe 으로 표시 (라이브 100% 동일) */}
        <div style={{ position: "sticky", top: 100 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: "var(--text-label-md)", fontWeight: 600, color: "var(--sm-content-tertiary)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              모바일 미리보기 — 라이브
            </div>
            <button
              type="button"
              onClick={() => window.open(window.liveSiteUrl(site && site.id), "_blank")}
              style={{ fontSize: 12, color: "var(--sm-content-brand)", fontWeight: 600 }}
            >
              새 탭에서 열기 ↗
            </button>
          </div>
          <HomePreview siteId={site && site.id} />
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { HomeSectionsPage });
