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

// 실제 사이트의 hero 는 이미지만 표시 (text overlay / CTA 버튼 없음).
// 그래서 어드민 편집기도 이미지 하나만 노출한다.
const HeroEditor = ({ data, update }) => {
  const imageUrl = data.imageUrl || null;
  const filename = imageUrl ? imageUrl.split("/").pop().split("?")[0].split("%2F").pop() : "hero.jpg";
  return (
    <Field label="히어로 이미지" helper="홈페이지 최상단에 보여지는 큰 이미지 (가로형 권장)">
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
            width: 96,
            height: 96,
            borderRadius: "var(--radius-sm)",
            background: data.image,
            backgroundSize: "cover",
            backgroundPosition: "center",
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 6, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: "var(--text-label-md)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {filename}
          </div>
          <div className="text-tertiary" style={{ fontSize: "var(--text-caption)" }}>
            {imageUrl ? "라이브 사이트에 표시 중" : "이미지가 아직 업로드되지 않았어요"}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, justifyContent: "center" }}>
          <Button variant="outline" size="sm" iconLeft="upload">교체</Button>
        </div>
      </div>
    </Field>
  );
};

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

// 실제 사이트는 매장 정보 영역에 주소와 영업 시간만 노출 (전화·인스타 없음).
const InfoEditor = ({ data, update }) => (
  <>
    <Field label="주소" helper="네이버 지도 검색에도 사용됩니다">
      <Input value={data.address || ""} onChange={(e) => update({ address: e.target.value })} />
    </Field>
    <Field label="영업 시간" helper="예: 11:00 ~ 19:00 · 매주 일요일 휴무">
      <Input value={data.hours || ""} onChange={(e) => update({ hours: e.target.value })} />
    </Field>
  </>
);

const NoticeEditor = ({ data, update }) => (
  <Field label="공지 내용" helper="짧게 한 문장으로 — 너무 길면 표시되지 않습니다.">
    <Textarea value={data.body} onChange={(e) => update({ body: e.target.value })} rows={3} />
  </Field>
);

Object.assign(window, { SectionEditor });
