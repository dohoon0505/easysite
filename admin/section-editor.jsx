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

const SectionEditor = ({ section, update, products, galleryWorks, onNav, siteId, site }) => {
  if (!section) return null;

  const subtitleByType = {
    hero: "이미지·매장 소개·지도·안내 배너를 한 번에 편집합니다",
    slider: "추천 슬라이더의 제목과 항목 목록을 선택합니다",
    faq: "FAQ 영역의 제목과 노출 항목을 선택합니다",
    dev: "교육영역의 활동 카드들을 편집합니다",
    mosaic: "콜라주 갤러리의 8개 이미지를 편집합니다",
    award: "수상 섹션의 이미지와 배지 텍스트를 편집합니다",
    philosophy: "교훈/인용 영역의 문구를 편집합니다",
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
        {section.type === "hero" && <HeroFullEditor data={section.data} update={update} siteId={siteId} />}
        {section.type === "slider" && <SliderEditor data={section.data} update={update} products={products} galleryWorks={galleryWorks} site={site} />}
        {section.type === "faq" && <FaqSectionEditor data={section.data} update={update} siteId={siteId} />}
        {section.type === "dev" && <DevSectionEditor data={section.data} update={update} />}
        {section.type === "mosaic" && <MosaicSectionEditor data={section.data} update={update} siteId={siteId} section={section} />}
        {section.type === "award" && <AwardSectionEditor data={section.data} update={update} siteId={siteId} />}
        {section.type === "philosophy" && <PhilosophySectionEditor data={section.data} update={update} />}
      </div>
    </Card>
  );
};

// ── HeroFullEditor — 히어로 + 매장 소개 + 지도 + 안내 배너 ──────────────
const HeroFullEditor = ({ data, update, siteId }) => (
  <>
    <Field label="히어로 이미지" helper="홈페이지 최상단의 큰 이미지 (가로형 권장)">
      <ImageSlot
        cssValue={data.image}
        downloadUrl={data.imageUrl}
        labelFallback="hero.jpg"
        onReplace={async (file, onPct) => {
          const r = await window.uploadSectionImage(siteId, "hero", "image", file, onPct);
          update({ image: `url("${r.downloadUrl}")`, imageUrl: r.downloadUrl, imageStoragePath: r.storagePath });
        }}
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
        onReplace={async (file, onPct) => {
          const r = await window.uploadSectionImage(siteId, "hero", "mapImage", file, onPct);
          update({ mapImage: `url("${r.downloadUrl}")`, mapImageUrl: r.downloadUrl, mapImageStoragePath: r.storagePath });
        }}
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

const ImageSlot = ({ cssValue, downloadUrl, labelFallback, onReplace }) => {
  const [uploading, setUploading] = React.useState(false);
  const [pct, setPct] = React.useState(0);
  const fileRef = React.useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file || !onReplace) return;
    setUploading(true);
    setPct(0);
    try {
      await onReplace(file, (p) => setPct(p));
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
      setPct(0);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

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
          {uploading ? `업로드 중… ${pct}%` : (downloadUrl ? "라이브 사이트에 표시 중" : "이미지가 아직 업로드되지 않았어요")}
        </div>
        {uploading && (
          <div style={{ height: 4, borderRadius: 2, background: "var(--sm-border-default)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: pct + "%", background: "var(--sm-interactive-brand-default)", transition: "width 200ms" }} />
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, justifyContent: "center" }}>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
        <Button
          variant="outline"
          size="sm"
          iconLeft="upload"
          onClick={() => fileRef.current && fileRef.current.click()}
          disabled={uploading || !onReplace}
        >
          {uploading ? `${pct}%` : "교체"}
        </Button>
      </div>
    </div>
  );
};

// ── SliderEditor — 슬라이더 제목 + 상품/작품 선택 ────────────────────
const SliderEditor = ({ data, update, products, galleryWorks, site }) => {
  // typeC 사이트(미술학원 등)는 galleryWorks 가 비어있어도 작품 모드로 표시
  const useGallery = site && site.type === "academy";
  const items = useGallery ? (galleryWorks || []) : (products || []);
  const itemLabel = useGallery ? "작품" : "상품";
  const [seeding, setSeeding] = React.useState(false);

  const seedDefaults = async () => {
    if (!site || !site.id) return;
    if (!confirm(`${site.name} 의 갤러리 작품 컬렉션에 기본 4개 작품을 시드하시겠습니까?\n(이미 있는 작품과 같은 ID 면 덮어씁니다.)`)) return;
    try {
      setSeeding(true);
      const count = await window.seedGalleryWorks(site.id);
      alert(`${count}개 작품을 시드했습니다.`);
    } catch (e) {
      alert("시드 실패: " + (e && e.message));
    } finally {
      setSeeding(false);
    }
  };

  const pickedIds = Array.isArray(data.pickedIds) ? data.pickedIds : [];
  const [pickerOpen, setPickerOpen] = React.useState(false);

  const togglePick = (itemId) => {
    const next = pickedIds.includes(itemId)
      ? pickedIds.filter((x) => x !== itemId)
      : [...pickedIds, itemId];
    update({ pickedIds: next });
  };

  const movePick = (itemId, dir) => {
    const idx = pickedIds.indexOf(itemId);
    if (idx < 0) return;
    const j = idx + dir;
    if (j < 0 || j >= pickedIds.length) return;
    const next = [...pickedIds];
    [next[idx], next[j]] = [next[j], next[idx]];
    update({ pickedIds: next });
  };

  const itemSub = (p) => useGallery
    ? [p.age, p.duration && `${p.duration} 수업`].filter(Boolean).join(" · ")
    : `${p.categoryName || p.category} · ${(p.price || 0).toLocaleString()}원`;

  return (
    <>
      <Field label="슬라이더 제목" required helper="홈 화면에 큰 글씨로 표시됩니다">
        <Input
          value={data.title || ""}
          onChange={(e) => update({ title: e.target.value })}
          placeholder={useGallery ? "아이들 작품 둘러보기" : "풍성한 꽃다발 추천"}
        />
      </Field>
      <Field label="부제목 (선택)" helper="제목 옆에 작게 표시되는 보조 문구">
        <Input
          value={data.subtitle || ""}
          onChange={(e) => update({ subtitle: e.target.value })}
          placeholder={useGallery ? "아이들이 완성한 작품들을 소개해요" : "시즌 추천"}
        />
      </Field>

      <Field label={`선택된 ${itemLabel} (${pickedIds.length}개)`} helper={`홈에 노출할 ${itemLabel}을 선택합니다. 좌측 ↑↓ 화살표로 순서 변경.`}>
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
            아직 선택된 {itemLabel}이 없습니다.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {pickedIds.map((pid, idx) => {
              const p = items.find((x) => x.id === pid);
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
                    <span style={{ flex: 1 }}>삭제된 {itemLabel} ({pid})</span>
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
                      backgroundImage: toBgImage(p.image || p.img),
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
                      {itemSub(p)}
                    </div>
                  </div>
                  <IconButton icon="x" onClick={() => togglePick(pid)} />
                </div>
              );
            })}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          <Button variant="outline" size="sm" iconLeft="plus" onClick={() => setPickerOpen(true)}>
            {itemLabel} 선택
          </Button>
          {useGallery && items.length === 0 && (
            <Button variant="outline" size="sm" iconLeft="rocket" onClick={seedDefaults} disabled={seeding}>
              {seeding ? "시드 중…" : "기본 작품 4개 시드"}
            </Button>
          )}
        </div>
      </Field>

      <ProductPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        products={items}
        pickedIds={pickedIds}
        onToggle={togglePick}
        itemLabel={itemLabel}
        useGallery={useGallery}
      />
    </>
  );
};

const ProductPickerModal = ({ open, onClose, products, pickedIds, onToggle, itemLabel, useGallery }) => {
  const label = itemLabel || "상품";
  const [query, setQuery] = React.useState("");
  React.useEffect(() => { if (open) setQuery(""); }, [open]);

  const filtered = (products || []).filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (p.name || "").toLowerCase().includes(q) ||
           (p.categoryName || p.category || "").toLowerCase().includes(q) ||
           (p.age || "").toLowerCase().includes(q) ||
           (p.desc || "").toLowerCase().includes(q);
  });

  const subText = (p) => useGallery
    ? [p.age, p.duration && `${p.duration} 수업`].filter(Boolean).join(" · ")
    : `${p.categoryName || p.category} · ${(p.price || 0).toLocaleString()}원`;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${label} 선택`}
      desc={`홈 슬라이더에 노출할 ${label}을 골라 주세요. 다시 클릭하면 해제됩니다.`}
      size="md"
      footer={<Button variant="primary" onClick={onClose}>완료</Button>}
    >
      <div style={{ marginBottom: 12 }}>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={useGallery ? "작품명·연령으로 검색" : "상품명·카테고리로 검색"}
          prefix={<Icon name="search" size={16} />}
          autoFocus
        />
      </div>
      <div style={{ maxHeight: 420, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
        {filtered.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 24, color: "var(--sm-content-tertiary)", fontSize: 13 }}>
            조건에 맞는 {label}이 없어요.
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
                  backgroundImage: toBgImage(p.image || p.img),
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
                  {subText(p)}
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

// ── DevSectionEditor — 교육영역 (활동 카드 N개) ──────────────────
const DEV_COLORS = ["teal", "blue", "pink", "yellow", "orange", "purple"];
const DEV_DEFAULT_ITEMS = [
  { id: "ipad",   activity: "아이패드 드로잉", tags: ["디지털 리터러시", "창의력"],  desc: "아이패드로 새로운 도구를 익히며, 표현의 경계를 넓혀갑니다.", color: "teal" },
  { id: "draw",   activity: "기초 드로잉",   tags: ["관찰력", "집중력"],           desc: "선 하나하나를 쌓아가며 손과 눈의 협응력이 자라요.", color: "blue" },
  { id: "water",  activity: "수채화",         tags: ["색채 감각", "감성 표현"],     desc: "물과 물감이 번지는 순간, 아이의 감수성이 함께 피어납니다.", color: "pink" },
  { id: "sketch", activity: "소묘",           tags: ["공간 지각력", "정밀함"],      desc: "명암과 형태를 잡으며 사물을 입체로 이해하는 힘을 키워요.", color: "yellow" },
  { id: "pencil", activity: "색연필화",       tags: ["색감", "섬세함"],             desc: "색을 겹치고 쌓으며 나만의 색 조합을 찾아가는 과정이에요.", color: "orange" },
  { id: "pen",    activity: "펜화",           tags: ["집중력", "표현력"],           desc: "지울 수 없는 선 위에서 과감하게 표현하는 자신감이 생겨요.", color: "purple" },
];

const DevSectionEditor = ({ data, update }) => {
  const items = Array.isArray(data.items) && data.items.length > 0 ? data.items : DEV_DEFAULT_ITEMS;
  const updateItem = (idx, patch) => {
    const next = items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
    update({ items: next });
  };
  const addItem = () => {
    const next = [...items, { id: `card_${Date.now().toString(36)}`, activity: "새 활동", tags: ["태그"], desc: "설명을 입력하세요.", color: DEV_COLORS[items.length % DEV_COLORS.length] }];
    update({ items: next });
  };
  const removeItem = (idx) => {
    if (!confirm("이 활동 카드를 삭제할까요?")) return;
    update({ items: items.filter((_, i) => i !== idx) });
  };
  const moveItem = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[idx], next[j]] = [next[j], next[idx]];
    update({ items: next });
  };

  return (
    <>
      <Field label="섹션 제목" required helper="예: 미술이 아이의 인지를 키웁니다">
        <Input value={data.title || ""} onChange={(e) => update({ title: e.target.value })} placeholder="미술이 아이의 인지를 키웁니다" />
      </Field>
      <Field label="부제목 (선택)">
        <Input value={data.sub || ""} onChange={(e) => update({ sub: e.target.value })} placeholder="손을 움직이고, 관찰하고, 표현하는 과정에서 두뇌가 가장 활발하게 자랍니다." />
      </Field>
      <Field label={`활동 카드 (${items.length}개)`} helper="홈 화면 교육영역에 그리드로 표시됩니다.">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((it, idx) => (
            <div key={it.id || idx} style={{ padding: "var(--size-300)", border: "1px solid var(--sm-border-default)", borderRadius: "var(--radius-md)", background: "var(--sm-background-default)", display: "grid", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, fontWeight: 600, fontSize: 13 }}>{idx + 1}. {it.activity}</div>
                <button onClick={() => moveItem(idx, -1)} disabled={idx === 0} style={{ color: idx === 0 ? "var(--sm-content-disabled)" : "var(--sm-content-tertiary)", padding: 4 }}><Icon name="chevronUp" size={14} /></button>
                <button onClick={() => moveItem(idx, +1)} disabled={idx === items.length - 1} style={{ color: idx === items.length - 1 ? "var(--sm-content-disabled)" : "var(--sm-content-tertiary)", padding: 4 }}><Icon name="chevronDown" size={14} /></button>
                <IconButton icon="x" onClick={() => removeItem(idx)} />
              </div>
              <Input value={it.activity || ""} onChange={(e) => updateItem(idx, { activity: e.target.value })} placeholder="활동명" />
              <Input value={(it.tags || []).join(", ")} onChange={(e) => updateItem(idx, { tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} placeholder="태그 (콤마 구분)" />
              <Textarea value={it.desc || ""} onChange={(e) => updateItem(idx, { desc: e.target.value })} rows={2} placeholder="활동 설명" />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "var(--sm-content-tertiary)" }}>색상:</span>
                {DEV_COLORS.map((c) => (
                  <button key={c} onClick={() => updateItem(idx, { color: c })}
                    style={{
                      width: 22, height: 22, borderRadius: "50%",
                      background: it.color === c ? "var(--sm-interactive-brand-default)" : "var(--sm-background-muted)",
                      color: it.color === c ? "white" : "var(--sm-content-secondary)",
                      fontSize: 10, border: "none", cursor: "pointer",
                    }}>
                    {c[0].toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" iconLeft="plus" onClick={addItem} style={{ marginTop: 8 }}>활동 카드 추가</Button>
      </Field>
    </>
  );
};

// ── MosaicSectionEditor — 콜라주 갤러리 (이미지 N개) ──────────────
const MOSAIC_DEFAULT_IMAGES = ["img/work_1.jpg", "img/work_2.jpg", "img/work_3.jpg", "img/work_4.jpg", "img/work_5.jpg", "img/work_6.jpg", "img/work_7.jpg", "img/work_8.jpg"];

const MosaicSectionEditor = ({ data, update, siteId, section }) => {
  const images = Array.isArray(data.images) && data.images.length > 0 ? data.images : MOSAIC_DEFAULT_IMAGES.map((src) => ({ url: src }));
  const sectionId = section && section.id ? section.id : "mosaic";

  const updateAt = (idx, patch) => {
    const next = images.map((im, i) => (i === idx ? { ...im, ...patch } : im));
    update({ images: next });
  };
  const removeAt = (idx) => {
    update({ images: images.filter((_, i) => i !== idx) });
  };
  const moveAt = (idx, dir) => {
    const j = idx + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[idx], next[j]] = [next[j], next[idx]];
    update({ images: next });
  };

  return (
    <>
      <Field label="섹션 제목" required>
        <Input value={data.title || ""} onChange={(e) => update({ title: e.target.value })} placeholder="매일의 작업, 매일의 성장" />
      </Field>
      <Field label="부제목 (선택)">
        <Input value={data.sub || ""} onChange={(e) => update({ sub: e.target.value })} placeholder="학원의 매일을 담았어요." />
      </Field>
      <Field label={`이미지 (${images.length}개)`} helper="홈 화면 콜라주 그리드에 표시됩니다.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {images.map((im, idx) => (
            <div key={idx} style={{ display: "grid", gap: 6 }}>
              <ImageSlot
                cssValue={im.url ? (im.url.startsWith("url(") ? im.url : `url("${im.url}")`) : null}
                downloadUrl={im.downloadUrl || im.url}
                labelFallback={`이미지 ${idx + 1}`}
                onReplace={async (file, onPct) => {
                  if (!siteId) { alert("siteId 가 없습니다"); return; }
                  const res = await window.uploadSectionImage(siteId, sectionId, `mosaic-${idx}`, file, onPct);
                  updateAt(idx, { url: res.downloadUrl, downloadUrl: res.downloadUrl, storagePath: res.storagePath });
                }}
              />
              <div style={{ display: "flex", gap: 4, justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "var(--sm-content-tertiary)", fontWeight: 600 }}>#{idx + 1}</span>
                <div style={{ display: "flex", gap: 2 }}>
                  <button onClick={() => moveAt(idx, -1)} disabled={idx === 0} style={{ color: idx === 0 ? "var(--sm-content-disabled)" : "var(--sm-content-tertiary)", padding: 2 }}><Icon name="chevronUp" size={12} /></button>
                  <button onClick={() => moveAt(idx, +1)} disabled={idx === images.length - 1} style={{ color: idx === images.length - 1 ? "var(--sm-content-disabled)" : "var(--sm-content-tertiary)", padding: 2 }}><Icon name="chevronDown" size={12} /></button>
                  <IconButton icon="x" onClick={() => removeAt(idx)} />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => update({ images: [...images, { url: "" }] })}
            style={{ aspectRatio: "1/1", border: "2px dashed var(--sm-border-default)", borderRadius: "var(--radius-sm)", background: "var(--sm-background-subtle)", color: "var(--sm-content-tertiary)", display: "grid", placeItems: "center", cursor: "pointer" }}
          >
            <Icon name="plus" size={20} />
          </button>
        </div>
      </Field>
    </>
  );
};

// ── AwardSectionEditor — 수상 섹션 (단일 이미지 + 배지) ──────────
const AwardSectionEditor = ({ data, update, siteId }) => {
  const badges = Array.isArray(data.badges) && data.badges.length > 0 ? data.badges : ["입선·수상 다수 배출", "전국·지역 미술대회 참가"];
  const updateBadge = (idx, val) => {
    const next = badges.map((b, i) => (i === idx ? val : b));
    update({ badges: next });
  };
  return (
    <>
      <Field label="섹션 제목" required>
        <Input value={data.title || ""} onChange={(e) => update({ title: e.target.value })} placeholder="공모전·대회 수상까지!" />
      </Field>
      <Field label="부제목 (선택)">
        <Input value={data.sub || ""} onChange={(e) => update({ sub: e.target.value })} placeholder="아이가 노력에 대한 보상을 얻을 수 있도록" />
      </Field>
      <Field label="대표 이미지" helper="수상 결과/장면 이미지">
        <ImageSlot
          cssValue={data.image}
          downloadUrl={data.imageUrl}
          labelFallback="award.jpg"
          onReplace={async (file, onPct) => {
            if (!siteId) { alert("siteId 가 없습니다"); return; }
            const res = await window.uploadSectionImage(siteId, "award", "image", file, onPct);
            update({ image: `url("${res.downloadUrl}")`, imageUrl: res.downloadUrl, imageStoragePath: res.storagePath });
          }}
        />
      </Field>
      <Field label={`배지 (${badges.length}개)`} helper="이미지 아래 표시되는 텍스트 칩">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {badges.map((b, idx) => (
            <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Input value={b} onChange={(e) => updateBadge(idx, e.target.value)} placeholder="배지 텍스트" />
              <IconButton icon="x" onClick={() => update({ badges: badges.filter((_, i) => i !== idx) })} />
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" iconLeft="plus" onClick={() => update({ badges: [...badges, ""] })} style={{ marginTop: 8 }}>배지 추가</Button>
      </Field>
    </>
  );
};

// ── PhilosophySectionEditor — 교훈/인용 ──────────────────
const PhilosophySectionEditor = ({ data, update }) => (
  <>
    <Field label="인용 본문" required helper="여러 줄 입력 가능. 줄바꿈은 그대로 표시됩니다.">
      <Textarea
        value={data.text || ""}
        onChange={(e) => update({ text: e.target.value })}
        rows={5}
        placeholder="탄탄한 표현력은 기본, 스스로 세상을 관찰하고 도화지에 담아내는 즐거움까지."
      />
    </Field>
    <Field label="강조 단어 (선택)" helper="본문 마지막에 강조 표시할 단어">
      <Input value={data.emphasis || ""} onChange={(e) => update({ emphasis: e.target.value })} placeholder="풀빛그림아이" />
    </Field>
    <Field label="서명" helper="인용 끝에 표시됩니다.">
      <Input value={data.sign || ""} onChange={(e) => update({ sign: e.target.value })} placeholder="— 풀빛그림아이 미술학원" />
    </Field>
  </>
);

Object.assign(window, { SectionEditor });
