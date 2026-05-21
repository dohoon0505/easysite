/* eslint-disable */
// Editor + preview for H01 home sections

const SectionEditor = ({ section, update, products, onNav }) => {
  if (!section) return null;

  return (
    <Card>
      <div className="card-header">
        <div>
          <h2 className="card-title">{section.title}</h2>
          <div className="card-subtitle">홈페이지 {section.type} 섹션의 내용을 편집합니다</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {!section.enabled && <Badge tone="neutral" dot>꺼져 있음</Badge>}
          <Button variant="outline" size="sm" iconLeft="eye">미리보기 열기</Button>
          <Button variant="primary" size="sm" iconLeft="rocket" onClick={() => onNav && onNav("publish")}>
            발행 센터로
          </Button>
        </div>
      </div>
      <div className="card-body" style={{ display: "grid", gap: "var(--size-500)" }}>
        {section.type === "hero" && <HeroEditor data={section.data} update={update} />}
        {section.type === "greeting" && <GreetingEditor data={section.data} update={update} />}
        {section.type === "featured" && <FeaturedEditor data={section.data} update={update} products={products} />}
        {section.type === "info" && <InfoEditor data={section.data} update={update} />}
        {section.type === "notice" && <NoticeEditor data={section.data} update={update} />}
      </div>
    </Card>
  );
};

const HeroEditor = ({ data, update }) => (
  <>
    <Field label="헤드라인" required helper="홈페이지에 가장 크게 보여지는 한 줄">
      <Input value={data.headline} onChange={(e) => update({ headline: e.target.value })} />
    </Field>
    <Field label="서브카피" helper="헤드라인 아래 한 두 줄">
      <Textarea value={data.subhead} onChange={(e) => update({ subhead: e.target.value })} rows={3} />
    </Field>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--size-400)" }}>
      <Field label="주요 버튼 텍스트">
        <Input value={data.ctaPrimary} onChange={(e) => update({ ctaPrimary: e.target.value })} />
      </Field>
      <Field label="보조 버튼 텍스트">
        <Input value={data.ctaSecondary} onChange={(e) => update({ ctaSecondary: e.target.value })} />
      </Field>
    </div>
    <Field label="배경 이미지">
      <div
        style={{
          display: "flex",
          gap: "var(--size-300)",
          padding: "var(--size-300)",
          border: "1px solid var(--sm-border-default)",
          borderRadius: "var(--radius-md)",
          background: "var(--sm-background-subtle)",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "var(--radius-sm)",
            background: data.image,
            backgroundSize: "cover",
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
          <div style={{ fontWeight: 600, fontSize: "var(--text-label-md)" }}>hero-spring-2026.jpg</div>
          <div className="text-tertiary" style={{ fontSize: "var(--text-caption)" }}>
            1920 × 1080 · 248KB
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, justifyContent: "center" }}>
          <Button variant="outline" size="sm" iconLeft="upload">교체</Button>
          <Button variant="ghost" size="sm" iconLeft="image">갤러리</Button>
        </div>
      </div>
    </Field>
  </>
);

const GreetingEditor = ({ data, update }) => (
  <>
    <Field label="제목">
      <Input value={data.title} onChange={(e) => update({ title: e.target.value })} />
    </Field>
    <Field label="본문" helper="3~5문장 권장. 운영자 본인의 목소리로 쓰세요.">
      <Textarea value={data.body} onChange={(e) => update({ body: e.target.value })} rows={6} />
    </Field>
  </>
);

const FeaturedEditor = ({ data, update, products }) => (
  <>
    <Field label="제목">
      <Input value={data.title} onChange={(e) => update({ title: e.target.value })} />
    </Field>
    <Field label="추천 상품 (최대 3개)" helper="상품을 끌어다 놓거나 클릭으로 선택">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--size-300)" }}>
        {data.pickedIds.map((id, idx) => {
          const p = products.find((x) => x.id === id);
          if (!p) return null;
          return (
            <div
              key={id}
              style={{
                border: "1px solid var(--sm-border-default)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  aspectRatio: "1 / 1",
                  background: p.image,
                  backgroundSize: "cover",
                }}
              />
              <div style={{ padding: "var(--size-200) var(--size-300)" }}>
                <div style={{ fontSize: "var(--text-caption)", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.name}
                </div>
                <div style={{ fontSize: "var(--text-caption)", color: "var(--sm-content-tertiary)" }} className="mono">
                  {p.price.toLocaleString()}원
                </div>
              </div>
              <button
                onClick={() => update({ pickedIds: data.pickedIds.filter((x) => x !== id) })}
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  background: "rgba(0,0,0,0.6)",
                  color: "white",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Icon name="x" size={11} />
              </button>
              <div
                style={{
                  position: "absolute",
                  top: 4,
                  left: 4,
                  background: "white",
                  borderRadius: "50%",
                  width: 22,
                  height: 22,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--sm-content-primary)",
                }}
              >
                {idx + 1}
              </div>
            </div>
          );
        })}
        {data.pickedIds.length < 3 && (
          <button
            style={{
              aspectRatio: "1 / 1.2",
              border: "2px dashed var(--sm-border-default)",
              borderRadius: "var(--radius-md)",
              background: "var(--sm-background-subtle)",
              color: "var(--sm-content-tertiary)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontSize: "var(--text-caption)",
            }}
          >
            <Icon name="plus" size={20} /> 상품 추가
          </button>
        )}
      </div>
    </Field>
  </>
);

const InfoEditor = ({ data, update }) => (
  <>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--size-400)" }}>
      <Field label="주소">
        <Input value={data.address} onChange={(e) => update({ address: e.target.value })} />
      </Field>
      <Field label="전화">
        <Input value={data.phone} onChange={(e) => update({ phone: e.target.value })} inputMode="tel" />
      </Field>
    </div>
    <Field label="영업 시간">
      <Input value={data.hours} onChange={(e) => update({ hours: e.target.value })} />
    </Field>
    <Field label="인스타그램">
      <Input value={data.instagram} onChange={(e) => update({ instagram: e.target.value })} prefix={<span style={{ color: "var(--sm-content-tertiary)" }}>@</span>} />
    </Field>
  </>
);

const NoticeEditor = ({ data, update }) => (
  <Field label="공지 내용" helper="짧게 한 문장으로 — 너무 길면 표시되지 않습니다.">
    <Textarea value={data.body} onChange={(e) => update({ body: e.target.value })} rows={3} />
  </Field>
);

Object.assign(window, { SectionEditor });
