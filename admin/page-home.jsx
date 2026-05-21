/* eslint-disable */
// H01 — 홈 섹션 편집
// Left rail: list of sections (drag-reorder, toggle enable). Right: editor + preview.

const HomeSectionsPage = ({ sections, setSections, products, galleryWorks, onNav, site }) => {
  const [activeId, setActiveId] = React.useState(sections[0]?.id);
  const [addOpen, setAddOpen] = React.useState(false);
  // sections 가 비동기로 로드되면 초기 activeId 가 undefined 일 수 있다.
  // 사용자가 직접 고른 상태가 아니라면 첫 항목으로 자동 선택.
  React.useEffect(() => {
    if (sections.length > 0 && (!activeId || !sections.some((s) => s.id === activeId))) {
      setActiveId(sections[0].id);
    }
  }, [sections, activeId]);
  const active = sections.find((s) => s.id === activeId);
  const toast = useToast();

  // 상품 슬라이더 (1), (2)… 처럼 동적 라벨을 만들기 위해 슬라이더 순번 매핑.
  const sliderIdxById = React.useMemo(() => {
    const m = {};
    let n = 0;
    sections.forEach((s) => {
      if (s.type === "slider") {
        n += 1;
        m[s.id] = n;
      }
    });
    return m;
  }, [sections]);

  const isAcademy = site && site.type === "academy";
  const sliderLabel = isAcademy ? "작품 슬라이더" : "상품 슬라이더";
  const displayLabel = (s) => {
    if (s.type === "slider") return `${sliderLabel} (${sliderIdxById[s.id] || "?"})`;
    if (s.type === "hero") return "히어로";
    if (s.type === "faq") return "FAQ";
    if (s.type === "dev") return "교육영역";
    if (s.type === "mosaic") return "콜라주 갤러리";
    if (s.type === "award") return "수상 섹션";
    if (s.type === "philosophy") return "교훈/인용";
    return s.title || s.type;
  };

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

  const sectionTemplates = React.useMemo(() => {
    const base = [
      { type: "slider", icon: "star", label: isAcademy ? "작품 슬라이더" : "상품 슬라이더", desc: isAcademy ? "작품 가로 슬라이더" : "상품 추천 슬라이더", data: { title: "", subtitle: "", pickedIds: [] } },
      { type: "faq", icon: "help", label: "FAQ", desc: "자주 묻는 질문", data: { title: "자주 묻는 질문", pickedIds: [] } },
    ];
    if (isAcademy) {
      base.push(
        { type: "dev", icon: "book", label: "교육영역", desc: "활동 카드 그리드", data: { title: "미술이 아이의 <em>인지를 키웁니다</em>", sub: "", items: [] } },
        { type: "mosaic", icon: "image", label: "콜라주 갤러리", desc: "이미지 그리드", data: { title: "매일의 작업, 매일의 성장", sub: "", images: [] } },
        { type: "award", icon: "star", label: "수상 섹션", desc: "단일 이미지 + 배지", data: { title: "공모전·대회 수상까지!", sub: "", image: null, badges: [] } },
        { type: "philosophy", icon: "sparkle", label: "교훈/인용", desc: "인용 카드", data: { text: "", emphasis: "", sign: "" } }
      );
    }
    return base;
  }, [isAcademy]);

  const addSection = (template) => {
    const newId = `${template.type}_${Date.now().toString(36)}`;
    const newSec = {
      id: newId,
      type: template.type,
      icon: template.icon,
      title: template.label,
      enabled: true,
      draft: true,
      data: template.data,
    };
    setSections((all) => [...all, newSec]);
    setActiveId(newId);
    setAddOpen(false);
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
          gridTemplateColumns: "280px 1fr 506px",
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
            <IconButton icon="plus" onClick={() => setAddOpen(true)} />
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
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {displayLabel(s)}
                  </div>
                  <div style={{ fontSize: "var(--text-caption)", color: "var(--sm-content-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.type === "slider" || s.type === "faq" ? (s.data?.title || "—") : `${i + 1}번째 · ${s.enabled ? "사용 중" : "꺼짐"}`}
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
        <SectionEditor
          section={active ? { ...active, title: displayLabel(active) } : null}
          update={updateActive}
          products={products}
          galleryWorks={galleryWorks}
          onNav={onNav}
          siteId={site && site.id}
          site={site}
        />

        {/* Mobile-frame preview — 실제 사이트를 iframe 으로 표시 (라이브 100% 동일) */}
        <div style={{ position: "sticky", top: 100 }}>
          <HomePreview siteId={site && site.id} sections={sections} />
        </div>
      </div>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="섹션 추가"
        desc="추가할 섹션 유형을 선택하세요. 같은 유형을 여러 번 추가할 수 있어요."
        size="md"
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {sectionTemplates.map((t) => (
            <button
              key={t.type + t.label}
              type="button"
              onClick={() => addSection(t)}
              style={{
                display: "flex",
                gap: 10,
                padding: 14,
                border: "1px solid var(--sm-border-default)",
                background: "var(--sm-background-default)",
                borderRadius: "var(--radius-md)",
                textAlign: "left",
                alignItems: "flex-start",
                cursor: "pointer",
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", background: "var(--sm-interactive-brand-subtle)", color: "var(--sm-interactive-brand-default)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Icon name={t.icon} size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{t.label}</div>
                <div style={{ fontSize: 12, color: "var(--sm-content-tertiary)", marginTop: 2 }}>{t.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
};

Object.assign(window, { HomeSectionsPage });
