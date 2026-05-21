/* eslint-disable */
// Mobile home sections page — list with toggle + tap-to-edit (bottom sheet)

const MobileHomeSectionsPage = ({ sections, setSections, products, onBack }) => {
  const [editing, setEditing] = React.useState(null);
  const toast = useToast();

  const editingSection = editing && sections.find((s) => s.id === editing);

  const toggleEnabled = (id) => {
    setSections((all) => all.map((s) => (s.id === id ? { ...s, enabled: !s.enabled, draft: true } : s)));
  };

  const updateActive = (patch) => {
    setSections((all) =>
      all.map((s) => (s.id === editing ? { ...s, data: { ...s.data, ...patch }, draft: true } : s))
    );
  };

  return (
    <>
      <MobileAppBar
        back={onBack}
        title="홈 섹션 편집"
        actions={<IconButton icon="eye" />}
      />
      <div className="m-scroll">
        <div style={{ padding: "var(--size-400) var(--size-400) var(--size-300)" }}>
          <div style={{ fontSize: 13, color: "var(--sm-content-tertiary)", lineHeight: 1.6, textWrap: "pretty" }}>
            도화원플라워 홈페이지 첫 화면. 섹션을 켜고/끄거나 위/아래로 옮기고, 탭하면 편집할 수 있어요.
          </div>
        </div>

        <div style={{ background: "var(--sm-background-default)" }}>
          {sections.map((s, i) => (
            <div
              key={s.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--size-300)",
                padding: "var(--size-400)",
                borderBottom: "1px solid var(--sm-border-subtle)",
                opacity: s.enabled ? 1 : 0.55,
              }}
              onClick={() => setEditing(s.id)}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 1, color: "var(--sm-content-disabled)" }}>
                <Icon name="chevronUp" size={14} />
                <Icon name="chevronDown" size={14} />
              </div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-sm)",
                  background: s.enabled ? "var(--sm-interactive-brand-subtle)" : "var(--sm-background-muted)",
                  color: s.enabled ? "var(--sm-interactive-brand-default)" : "var(--sm-content-tertiary)",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name={s.icon} size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                  {s.title}
                  {s.draft && <Badge tone="warning" dot>드래프트</Badge>}
                </div>
                <div style={{ fontSize: 12, color: "var(--sm-content-tertiary)", marginTop: 2 }}>
                  {i + 1}번째 · {summarize(s)}
                </div>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <Toggle checked={s.enabled} onChange={() => toggleEnabled(s.id)} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "var(--size-400)" }}>
          <Button variant="outline" full iconLeft="plus">새 섹션 추가</Button>
        </div>
      </div>

      {/* Editor bottom sheet */}
      <BottomSheet
        open={!!editingSection}
        onClose={() => setEditing(null)}
        title={editingSection?.title || ""}
        footer={
          <Button
            variant="primary"
            full
            iconLeft="save"
            onClick={() => {
              setEditing(null);
              toast({ tone: "success", message: "드래프트로 저장됨" });
            }}
          >
            저장
          </Button>
        }
      >
        {editingSection && (
          <div style={{ paddingBottom: 24, display: "grid", gap: "var(--size-400)" }}>
            <MobileSectionEditor section={editingSection} update={updateActive} products={products} />
          </div>
        )}
      </BottomSheet>
    </>
  );
};

const summarize = (s) => {
  if (!s.enabled) return "꺼짐";
  switch (s.type) {
    case "hero":
      return s.data.headline;
    case "greeting":
      return s.data.title;
    case "featured":
      return `${s.data.pickedIds.length}개 상품 추천`;
    case "info":
      return s.data.address;
    case "notice":
      return s.data.body?.slice(0, 30);
    default:
      return "—";
  }
};

const MobileSectionEditor = ({ section, update, products }) => {
  if (section.type === "hero") {
    return (
      <>
        <Field label="헤드라인">
          <Input value={section.data.headline} onChange={(e) => update({ headline: e.target.value })} />
        </Field>
        <Field label="서브카피">
          <Textarea value={section.data.subhead} onChange={(e) => update({ subhead: e.target.value })} rows={3} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="주요 버튼">
            <Input value={section.data.ctaPrimary} onChange={(e) => update({ ctaPrimary: e.target.value })} />
          </Field>
          <Field label="보조 버튼">
            <Input value={section.data.ctaSecondary} onChange={(e) => update({ ctaSecondary: e.target.value })} />
          </Field>
        </div>
        <Field label="배경 이미지">
          <button
            style={{
              display: "flex",
              gap: 12,
              padding: 8,
              background: "var(--sm-background-subtle)",
              border: "1px solid var(--sm-border-subtle)",
              borderRadius: "var(--radius-md)",
              width: "100%",
              textAlign: "left",
            }}
          >
            <div
              style={{ width: 56, height: 56, borderRadius: "var(--radius-sm)", background: section.data.image, backgroundSize: "cover" }}
            />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>hero-spring-2026.jpg</div>
              <div style={{ fontSize: 12, color: "var(--sm-content-tertiary)" }}>탭 → 사진 교체</div>
            </div>
            <Icon name="camera" size={20} style={{ color: "var(--sm-content-tertiary)", alignSelf: "center" }} />
          </button>
        </Field>
      </>
    );
  }
  if (section.type === "greeting") {
    return (
      <>
        <Field label="제목">
          <Input value={section.data.title} onChange={(e) => update({ title: e.target.value })} />
        </Field>
        <Field label="본문" helper="3~5문장 권장">
          <Textarea value={section.data.body} onChange={(e) => update({ body: e.target.value })} rows={6} />
        </Field>
      </>
    );
  }
  if (section.type === "featured") {
    return (
      <>
        <Field label="제목">
          <Input value={section.data.title} onChange={(e) => update({ title: e.target.value })} />
        </Field>
        <Field label={`추천 상품 (${section.data.pickedIds.length}/3)`}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {section.data.pickedIds.map((id, idx) => {
              const p = products.find((x) => x.id === id);
              if (!p) return null;
              return (
                <div key={id} style={{ position: "relative", borderRadius: "var(--radius-sm)", overflow: "hidden", border: "1px solid var(--sm-border-subtle)" }}>
                  <div style={{ aspectRatio: "1 / 1", background: p.image, backgroundSize: "cover" }} />
                  <div style={{ padding: 6 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                  </div>
                  <button
                    onClick={() => update({ pickedIds: section.data.pickedIds.filter((x) => x !== id) })}
                    style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.6)", color: "white", borderRadius: "50%", width: 20, height: 20, display: "grid", placeItems: "center" }}
                  >
                    <Icon name="x" size={11} />
                  </button>
                  <div style={{ position: "absolute", top: 4, left: 4, background: "white", borderRadius: "50%", width: 18, height: 18, display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700 }}>
                    {idx + 1}
                  </div>
                </div>
              );
            })}
            {section.data.pickedIds.length < 3 && (
              <button
                style={{
                  aspectRatio: "1 / 1.2",
                  border: "2px dashed var(--sm-border-default)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--sm-background-subtle)",
                  color: "var(--sm-content-tertiary)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Icon name="plus" size={18} />
              </button>
            )}
          </div>
        </Field>
      </>
    );
  }
  if (section.type === "info") {
    return (
      <>
        <Field label="주소"><Input value={section.data.address} onChange={(e) => update({ address: e.target.value })} /></Field>
        <Field label="전화"><Input value={section.data.phone} onChange={(e) => update({ phone: e.target.value })} inputMode="tel" /></Field>
        <Field label="영업 시간"><Input value={section.data.hours} onChange={(e) => update({ hours: e.target.value })} /></Field>
        <Field label="인스타그램"><Input value={section.data.instagram} onChange={(e) => update({ instagram: e.target.value })} prefix={<span style={{ color: "var(--sm-content-tertiary)" }}>@</span>} /></Field>
      </>
    );
  }
  if (section.type === "notice") {
    return (
      <Field label="공지 내용" helper="짧게 한 문장으로">
        <Textarea value={section.data.body} onChange={(e) => update({ body: e.target.value })} rows={3} />
      </Field>
    );
  }
  return null;
};

Object.assign(window, { MobileHomeSectionsPage });
