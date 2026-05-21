/* eslint-disable */
// 홈 섹션 편집기.
// 섹션 타입:
//   · hero    — 히어로 + 매장 소개 + 지도 + 안내 배너를 묶은 단일 섹션
//   · slider  — 상품 슬라이더 1개 (타이틀 + 상품 ID 목록). N 개 공존 가능.
//   · faq     — FAQ 노출 섹션 (타이틀 + FAQ ID 목록). 항목은 '질문/답변' 페이지에서 관리.

// 상품 image 필드는 raw URL · repoPath · url(...) 셋 중 어느 형태든 올 수 있으므로
// background-image 로 안전하게 변환한다.
const toBgImage = (src) => {
  if (!src) return undefined;
  if (typeof src !== "string") return undefined;
  if (src.startsWith("url(")) return src;
  if (src.startsWith("linear-gradient") || src.startsWith("radial-gradient")) return src;
  return `url("${src}")`;
};

const SectionEditor = ({ section, update, products, onNav, siteId }) => {
  if (!section) return null;

  const subtitleByType = {
    hero: "이미지·매장 소개·지도·안내 배너를 한 번에 편집합니다",
    slider: "추천 슬라이더의 제목과 상품 목록을 선택합니다",
    faq: "FAQ 영역의 제목과 노출 항목을 선택합니다",
  };

  return (
    <Card>
      <div className="card-header">
        <div>
          <h2 className="card-title">{section.title}</h2>
          <div className="card-subtitle">{subtitleByType[section.type] || ""}</div>
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
        {section.type === "hero" && <HeroFullEditor data={section.data} update={update} />}
        {section.type === "slider" && <SliderEditor data={section.data} update={update} products={products} />}
        {section.type === "faq" && <FaqSectionEditor data={section.data} update={update} siteId={siteId} />}
      </div>
    </Card>
  );
};

// ── HeroFullEditor — 히어로 + 매장 소개 + 지도 + 안내 배너 ──────────────
const HeroFullEditor = ({ data, update }) => (
  <>
    <Field label="히어로 이미지" helper="홈페이지 최상단의 큰 이미지 (가로형 권장)">
      <ImageSlot
        cssValue={data.image}
        downloadUrl={data.imageUrl}
        labelFallback="hero.jpg"
      />
    </Field>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "var(--size-400)" }}>
      <Field label="지역" helper="예: 대구광역시 | 달서구">
        <Input
          value={data.region || ""}
          onChange={(e) => update({ region: e.target.value })}
          placeholder="대구광역시 | 달서구"
        />
      </Field>
      <Field label="매장명">
        <Input
          value={data.storeName || data.title || ""}
          onChange={(e) => update({ storeName: e.target.value, title: e.target.value })}
          placeholder="도화원플라워"
        />
      </Field>
    </div>

    <Field label="매장 소개" helper="3~5문장 권장 — 운영자 본인의 목소리로 적어 주세요">
      <Textarea
        value={data.storeDesc || data.body || ""}
        onChange={(e) => update({ storeDesc: e.target.value, body: e.target.value })}
        rows={5}
        placeholder="평범한 일상도 꽃 한 송이가 더해지면 특별한 순간이 됩니다…"
      />
    </Field>

    <div className="divider" />

    <Field label="지도 이미지" helper="매장 위치 지도 스크린샷">
      <ImageSlot
        cssValue={data.mapImage}
        downloadUrl={data.mapImageUrl}
        labelFallback="map.png"
      />
    </Field>

    <Field label="네이버 지도 검색어" helper="'네이버 지도' 버튼을 눌렀을 때 검색되는 주소">
      <Input
        value={data.mapAddress || ""}
        onChange={(e) => update({ mapAddress: e.target.value })}
        placeholder="대구 달서구 당산로 99"
      />
    </Field>

    <Field label="주소" helper="상세 주소 (지도 아래 표시)">
      <Input
        value={data.address || ""}
        onChange={(e) => update({ address: e.target.value })}
        placeholder="대구 달서구 당산로 99 1층 도화원플라워"
      />
    </Field>

    <Field label="영업 시간" helper="예: 11:00 ~ 19:00 · 매주 일요일 휴무">
      <Input
        value={data.hours || ""}
        onChange={(e) => update({ hours: e.target.value })}
        placeholder="11:00 ~ 19:00 · 매주 일요일 휴무"
      />
    </Field>

    <div className="divider" />

    <Field label="안내 배너" helper="홈 화면에 한 줄로 보여지는 안내 문구">
      <Textarea
        value={data.bannerText || ""}
        onChange={(e) => update({ bannerText: e.target.value })}
        rows={2}
        placeholder="예약요청 탭을 통해 간편히 예약을 요청해보세요!"
      />
    </Field>
  </>
);

// 이미지 슬롯 — 현재 업로드된 이미지 표시(교체 버튼은 추후 연결)
const ImageSlot = ({ cssValue, downloadUrl, labelFallback }) => {
  const filename = downloadUrl
    ? decodeURIComponent(downloadUrl.split("/").pop().split("?")[0]).split("/").pop()
    : labelFallback;
  return (
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
          background: cssValue || "var(--sm-background-muted)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 6, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: "var(--text-label-md)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {filename || labelFallback}
        </div>
        <div className="text-tertiary" style={{ fontSize: "var(--text-caption)" }}>
          {downloadUrl ? "라이브 사이트에 표시 중" : "이미지가 아직 업로드되지 않았어요"}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, justifyContent: "center" }}>
        <Button variant="outline" size="sm" iconLeft="upload">교체</Button>
      </div>
    </div>
  );
};

// ── SliderEditor — 슬라이더 제목 + 상품 선택 ────────────────────
const SliderEditor = ({ data, update, products }) => {
  const pickedIds = Array.isArray(data.pickedIds) ? data.pickedIds : [];
  const [pickerOpen, setPickerOpen] = React.useState(false);

  const togglePick = (productId) => {
    const next = pickedIds.includes(productId)
      ? pickedIds.filter((x) => x !== productId)
      : [...pickedIds, productId];
    update({ pickedIds: next });
  };

  const movePick = (productId, dir) => {
    const idx = pickedIds.indexOf(productId);
    if (idx < 0) return;
    const j = idx + dir;
    if (j < 0 || j >= pickedIds.length) return;
    const next = [...pickedIds];
    [next[idx], next[j]] = [next[j], next[idx]];
    update({ pickedIds: next });
  };

  return (
    <>
      <Field label="슬라이더 제목" required helper="홈 화면에 큰 글씨로 표시됩니다">
        <Input
          value={data.title || ""}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="풍성한 꽃다발 추천"
        />
      </Field>
      <Field label="부제목 (선택)" helper="제목 옆에 작게 표시되는 보조 문구">
        <Input
          value={data.subtitle || ""}
          onChange={(e) => update({ subtitle: e.target.value })}
          placeholder="시즌 추천"
        />
      </Field>

      <Field label={`선택된 상품 (${pickedIds.length}개)`} helper="홈에 노출할 상품을 선택합니다. 좌측 ↑↓ 화살표로 순서 변경.">
        {pickedIds.length === 0 ? (
          <div
            style={{
              padding: "var(--size-500)",
              border: "1px dashed var(--sm-border-default)",
              borderRadius: "var(--radius-md)",
              background: "var(--sm-background-subtle)",
              textAlign: "center",
              color: "var(--sm-content-tertiary)",
              fontSize: 13,
            }}
          >
            아직 선택된 상품이 없습니다.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {pickedIds.map((pid, idx) => {
              const p = products.find((x) => x.id === pid);
              if (!p) {
                return (
                  <div
                    key={pid}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--size-300)",
                      padding: "var(--size-300)",
                      border: "1px solid var(--sm-status-warning-subtle)",
                      borderRadius: "var(--radius-md)",
                      background: "var(--sm-status-warning-subtle)",
                      color: "var(--sm-status-warning)",
                      fontSize: 12,
                    }}
                  >
                    <Icon name="alert" size={14} />
                    <span style={{ flex: 1 }}>삭제된 상품 ({pid})</span>
                    <IconButton icon="x" onClick={() => togglePick(pid)} />
                  </div>
                );
              }
              return (
                <div
                  key={pid}
                  className="drag-item"
                  style={{ background: "var(--sm-background-default)" }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <button onClick={() => movePick(pid, -1)} disabled={idx === 0} style={{ color: idx === 0 ? "var(--sm-content-disabled)" : "var(--sm-content-tertiary)", padding: 2 }}>
                      <Icon name="chevronUp" size={12} />
                    </button>
                    <button onClick={() => movePick(pid, +1)} disabled={idx === pickedIds.length - 1} style={{ color: idx === pickedIds.length - 1 ? "var(--sm-content-disabled)" : "var(--sm-content-tertiary)", padding: 2 }}>
                      <Icon name="chevronDown" size={12} />
                    </button>
                  </div>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "var(--radius-sm)",
                      backgroundImage: toBgImage(p.image),
                      backgroundColor: "var(--sm-background-muted)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "var(--text-label-md)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--sm-content-tertiary)" }}>
                      {p.categoryName || p.category} · {(p.price || 0).toLocaleString()}원
                    </div>
                  </div>
                  <IconButton icon="x" onClick={() => togglePick(pid)} />
                </div>
              );
            })}
          </div>
        )}
        <Button variant="outline" size="sm" iconLeft="plus" onClick={() => setPickerOpen(true)} style={{ marginTop: 8 }}>
          상품 선택
        </Button>
      </Field>

      <ProductPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        products={products}
        pickedIds={pickedIds}
        onToggle={togglePick}
      />
    </>
  );
};

const ProductPickerModal = ({ open, onClose, products, pickedIds, onToggle }) => {
  const [query, setQuery] = React.useState("");
  React.useEffect(() => { if (open) setQuery(""); }, [open]);

  const filtered = (products || []).filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (p.name || "").toLowerCase().includes(q) ||
           (p.categoryName || p.category || "").toLowerCase().includes(q);
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="상품 선택"
      desc="홈 슬라이더에 노출할 상품을 골라 주세요. 다시 클릭하면 해제됩니다."
      size="md"
      footer={<Button variant="primary" onClick={onClose}>완료</Button>}
    >
      <div style={{ marginBottom: 12 }}>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="상품명·카테고리로 검색"
          prefix={<Icon name="search" size={16} />}
          autoFocus
        />
      </div>
      <div style={{ maxHeight: 420, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
        {filtered.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 24, color: "var(--sm-content-tertiary)", fontSize: 13 }}>
            조건에 맞는 상품이 없어요.
          </div>
        ) : filtered.map((p) => {
          const picked = pickedIds.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onToggle(p.id)}
              style={{
                display: "flex",
                gap: 10,
                padding: 10,
                border: `1px solid ${picked ? "var(--sm-interactive-brand-default)" : "var(--sm-border-default)"}`,
                background: picked ? "var(--sm-interactive-brand-subtle)" : "var(--sm-background-default)",
                borderRadius: "var(--radius-md)",
                textAlign: "left",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-sm)",
                  backgroundImage: toBgImage(p.image),
                  backgroundColor: "var(--sm-background-muted)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.name}
                </div>
                <div style={{ fontSize: 11, color: "var(--sm-content-tertiary)" }}>
                  {p.categoryName || p.category} · {(p.price || 0).toLocaleString()}원
                </div>
              </div>
              {picked && <Icon name="check" size={16} style={{ color: "var(--sm-interactive-brand-default)", flexShrink: 0 }} />}
            </button>
          );
        })}
      </div>
    </Modal>
  );
};

// ── FaqSectionEditor — FAQ 섹션 (제목 + FAQ 선택) ────────────────
const FaqSectionEditor = ({ data, update, siteId }) => {
  const [faqs] = (typeof useLiveFaqs === "function" ? useLiveFaqs(siteId) : [[]]);
  const pickedIds = Array.isArray(data.pickedIds) ? data.pickedIds : [];
  const [pickerOpen, setPickerOpen] = React.useState(false);

  const togglePick = (id) => {
    const next = pickedIds.includes(id)
      ? pickedIds.filter((x) => x !== id)
      : [...pickedIds, id];
    update({ pickedIds: next });
  };
  const movePick = (id, dir) => {
    const idx = pickedIds.indexOf(id);
    if (idx < 0) return;
    const j = idx + dir;
    if (j < 0 || j >= pickedIds.length) return;
    const next = [...pickedIds];
    [next[idx], next[j]] = [next[j], next[idx]];
    update({ pickedIds: next });
  };

  return (
    <>
      <Field label="섹션 제목" required>
        <Input
          value={data.title || ""}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="주문 전 자주하는 질문"
        />
      </Field>

      <Field label={`선택된 질문 (${pickedIds.length}개)`} helper="'질문/답변' 페이지에서 등록한 항목 중 골라 노출합니다.">
        {pickedIds.length === 0 ? (
          <div
            style={{
              padding: "var(--size-500)",
              border: "1px dashed var(--sm-border-default)",
              borderRadius: "var(--radius-md)",
              background: "var(--sm-background-subtle)",
              textAlign: "center",
              color: "var(--sm-content-tertiary)",
              fontSize: 13,
            }}
          >
            아직 선택된 질문이 없습니다.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {pickedIds.map((id, idx) => {
              const f = faqs.find((x) => x.id === id);
              if (!f) {
                return (
                  <div
                    key={id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: 10,
                      border: "1px solid var(--sm-status-warning-subtle)",
                      background: "var(--sm-status-warning-subtle)",
                      color: "var(--sm-status-warning)",
                      borderRadius: "var(--radius-md)",
                      fontSize: 12,
                    }}
                  >
                    <Icon name="alert" size={14} />
                    <span style={{ flex: 1 }}>삭제된 질문 ({id})</span>
                    <IconButton icon="x" onClick={() => togglePick(id)} />
                  </div>
                );
              }
              return (
                <div
                  key={id}
                  className="drag-item"
                  style={{ background: "var(--sm-background-default)" }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <button onClick={() => movePick(id, -1)} disabled={idx === 0} style={{ color: idx === 0 ? "var(--sm-content-disabled)" : "var(--sm-content-tertiary)", padding: 2 }}>
                      <Icon name="chevronUp" size={12} />
                    </button>
                    <button onClick={() => movePick(id, +1)} disabled={idx === pickedIds.length - 1} style={{ color: idx === pickedIds.length - 1 ? "var(--sm-content-disabled)" : "var(--sm-content-tertiary)", padding: 2 }}>
                      <Icon name="chevronDown" size={12} />
                    </button>
                  </div>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "var(--radius-sm)",
                      background: "var(--sm-interactive-brand-subtle)",
                      color: "var(--sm-interactive-brand-default)",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon name="help" size={14} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, fontWeight: 600, fontSize: "var(--text-label-md)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {f.question}
                  </div>
                  <IconButton icon="x" onClick={() => togglePick(id)} />
                </div>
              );
            })}
          </div>
        )}
        <Button variant="outline" size="sm" iconLeft="plus" onClick={() => setPickerOpen(true)} style={{ marginTop: 8 }}>
          질문 선택
        </Button>
      </Field>

      <FaqPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        faqs={faqs}
        pickedIds={pickedIds}
        onToggle={togglePick}
      />
    </>
  );
};

const FaqPickerModal = ({ open, onClose, faqs, pickedIds, onToggle }) => {
  const [query, setQuery] = React.useState("");
  React.useEffect(() => { if (open) setQuery(""); }, [open]);

  const filtered = (faqs || []).filter((f) => f.visible !== false).filter((f) => {
    if (!query.trim()) return true;
    return (f.question || "").toLowerCase().includes(query.toLowerCase());
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="질문 선택"
      desc="홈 화면 FAQ 영역에 노출할 질문을 골라 주세요."
      size="md"
      footer={<Button variant="primary" onClick={onClose}>완료</Button>}
    >
      <div style={{ marginBottom: 12 }}>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="질문 내용으로 검색"
          prefix={<Icon name="search" size={16} />}
          autoFocus
        />
      </div>
      {faqs.length === 0 && (
        <div style={{ padding: 16, background: "var(--sm-status-info-subtle)", color: "var(--sm-status-info)", borderRadius: "var(--radius-md)", fontSize: 13, marginBottom: 12 }}>
          등록된 질문이 없습니다. 좌측 사이드바 '질문/답변' 페이지에서 먼저 질문을 등록해 주세요.
        </div>
      )}
      <div style={{ maxHeight: 420, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.map((f) => {
          const picked = pickedIds.includes(f.id);
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onToggle(f.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: 12,
                border: `1px solid ${picked ? "var(--sm-interactive-brand-default)" : "var(--sm-border-default)"}`,
                background: picked ? "var(--sm-interactive-brand-subtle)" : "var(--sm-background-default)",
                borderRadius: "var(--radius-md)",
                textAlign: "left",
              }}
            >
              <div style={{ flex: 1, minWidth: 0, fontWeight: 600, fontSize: 13 }}>{f.question}</div>
              {picked && <Icon name="check" size={16} style={{ color: "var(--sm-interactive-brand-default)" }} />}
            </button>
          );
        })}
      </div>
    </Modal>
  );
};

Object.assign(window, { SectionEditor });
