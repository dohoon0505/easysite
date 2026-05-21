/* eslint-disable */
// P02/P03 — 상품 등록/수정
// Two-column layout: form on left, live preview on right

const ProductEditorPage = ({ productId, products, setProducts, onBack, siteId }) => {
  const existing = productId ? products.find((p) => p.id === productId) : null;
  const toast = useToast();

  const [form, setForm] = React.useState(() => ({
    name: existing?.name || "",
    category: existing?.category || "bouquet",
    price: existing?.price || "",
    description: existing?.description || "",
    sizes: existing?.sizes || ["M"],
    tags: existing?.tags || [],
    stock: existing?.stock || "주문제작",
    image: existing?.image || null,
    visible: existing?.visible ?? true,
  }));
  const [errors, setErrors] = React.useState({});
  const [tagInput, setTagInput] = React.useState("");
  const [dirty, setDirty] = React.useState(false);
  const [autoSavedAt, setAutoSavedAt] = React.useState(null);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  // 이미지 업로드 상태
  const [uploading, setUploading] = React.useState(false);
  const [uploadPct, setUploadPct] = React.useState(0);
  const fileInputRef = React.useRef(null);
  const cameraInputRef = React.useRef(null);

  // 신규 등록 중엔 productId 가 없으니 임시 ID 사용
  const uploadProductId = React.useMemo(
    () => existing?.id || `draft-${Math.random().toString(36).slice(2, 8)}`,
    [existing?.id]
  );

  const onPickFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = ""; // 같은 파일 재선택 가능
    if (!file) return;
    if (!siteId) {
      toast({ tone: "error", message: "사이트가 지정되지 않았습니다" });
      return;
    }
    if (!window.uploadProductImage) {
      toast({ tone: "error", message: "Firebase Storage 가 준비되지 않았습니다" });
      return;
    }
    setUploading(true);
    setUploadPct(0);
    try {
      const result = await window.uploadProductImage(
        siteId,
        uploadProductId,
        file,
        (pct) => setUploadPct(pct)
      );
      update("image", result.downloadUrl);
      toast({ tone: "success", message: `업로드 완료 — ${result.filename}` });
    } catch (err) {
      toast({ tone: "error", message: `업로드 실패: ${err.message || err}` });
    } finally {
      setUploading(false);
      setUploadPct(0);
    }
  };

  // simulate autosave when dirty
  React.useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(() => {
      setAutoSavedAt(new Date());
      setDirty(false);
    }, 1200);
    return () => clearTimeout(t);
  }, [dirty, form]);

  const update = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setDirty(true);
    if (errors[k]) setErrors((e) => ({ ...e, [k]: null }));
  };
  const toggleSize = (s) =>
    update("sizes", form.sizes.includes(s) ? form.sizes.filter((x) => x !== s) : [...form.sizes, s]);
  const addTag = () => {
    if (!tagInput.trim()) return;
    if (form.tags.includes(tagInput.trim())) return;
    update("tags", [...form.tags, tagInput.trim()]);
    setTagInput("");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "상품명을 입력해 주세요";
    if (!form.price || Number(form.price) <= 0) e.price = "가격은 1원 이상이어야 합니다";
    if (!form.description.trim()) e.description = "상품 설명을 입력해 주세요";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) {
      toast({ tone: "error", message: "입력값을 다시 확인해 주세요" });
      return;
    }
    const cat = CATEGORIES.find((c) => c.id === form.category);
    const updated = {
      id: existing?.id || `p_${Math.random().toString(36).slice(2, 6)}`,
      name: form.name,
      category: form.category,
      categoryName: cat?.name || "기타",
      price: Number(form.price),
      sizes: form.sizes,
      tags: form.tags,
      status: "draft",
      draft: true,
      visible: form.visible,
      image: form.image || flowerThumb("#f4c8d0", "#d36a8a"),
      updatedAt: "방금 전",
      stock: form.stock,
      description: form.description,
    };
    if (existing) {
      setProducts((ps) => ps.map((p) => (p.id === existing.id ? updated : p)));
    } else {
      setProducts((ps) => [updated, ...ps]);
    }
    toast({ tone: "success", message: `드래프트 저장 완료 — 발행 센터에서 발행하세요` });
    onBack();
  };

  const remove = () => {
    setProducts((ps) => ps.filter((p) => p.id !== existing.id));
    toast({ tone: "success", message: "상품을 삭제했습니다 — 드래프트 1건 추가" });
    setConfirmDelete(false);
    onBack();
  };

  return (
    <div className="page" style={{ paddingBottom: 100 }}>
      <div style={{ marginBottom: "var(--size-400)" }}>
        <button
          onClick={onBack}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "var(--sm-content-secondary)",
            fontSize: "var(--text-body-sm)",
            padding: "4px 0",
          }}
        >
          <Icon name="arrowLeft" size={14} /> 상품 목록으로
        </button>
      </div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {existing ? "상품 수정" : "새 상품 등록"}
          </h1>
          <div className="page-subtitle">
            {existing ? (
              <>
                {existing.id} · 마지막 수정 {existing.updatedAt}
              </>
            ) : (
              "사진 한 장 + 가격 + 설명이면 등록 완료입니다"
            )}
          </div>
        </div>
        <div className="page-actions">
          {autoSavedAt && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: "var(--text-caption)",
                color: "var(--sm-status-success)",
              }}
            >
              <Icon name="check" size={14} /> 자동 저장됨 · {autoSavedAt.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
          )}
          {dirty && !autoSavedAt && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: "var(--text-caption)",
                color: "var(--sm-content-tertiary)",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--sm-signal-highlight)",
                  animation: "fade-in 0.6s ease-in-out infinite alternate",
                }}
              />
              저장 중…
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: "var(--size-600)",
          alignItems: "flex-start",
        }}
      >
        {/* ── Form ── */}
        <div className="col" style={{ gap: "var(--size-500)" }}>
          {/* Basics */}
          <Card>
            <div className="card-header">
              <h2 className="card-title">기본 정보</h2>
            </div>
            <div className="card-body" style={{ display: "grid", gap: "var(--size-500)" }}>
              <Field label="상품명" required error={errors.name} helper="고객이 보는 이름. 28자 이내 권장.">
                <Input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="예: 봄의 인사 — 라넌큘러스 꽃다발"
                  aria-invalid={!!errors.name}
                />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--size-400)" }}>
                <Field label="카테고리" required>
                  <Select value={form.category} onChange={(e) => update("category", e.target.value)}>
                    {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="가격" required error={errors.price}>
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={form.price}
                    onChange={(e) => update("price", e.target.value)}
                    placeholder="58000"
                    suffix={<span style={{ fontSize: "var(--text-body-sm)" }}>원</span>}
                  />
                </Field>
              </div>
              <Field label="상품 설명" required error={errors.description}>
                <Textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="어떤 꽃이 들어있고, 누구에게 어울리는지 적어 주세요."
                  rows={4}
                />
              </Field>
            </div>
          </Card>

          {/* Image upload */}
          <Card>
            <div className="card-header">
              <h2 className="card-title">대표 사진</h2>
              <span className="text-tertiary" style={{ fontSize: "var(--text-caption)" }}>
                정사각형 권장 · 자동 리사이즈됨
              </span>
            </div>
            <div className="card-body">
              {form.image ? (
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "1 / 1",
                    maxWidth: 320,
                    background: form.image,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--sm-border-subtle)",
                  }}
                >
                  <button
                    onClick={() => update("image", null)}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: "rgba(0,0,0,0.7)",
                      color: "white",
                      borderRadius: "var(--radius-full)",
                      width: 28,
                      height: 28,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <Icon name="x" size={14} />
                  </button>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 8,
                      left: 8,
                      background: "rgba(255,255,255,0.95)",
                      padding: "4px 8px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "var(--text-caption)",
                      fontWeight: 500,
                      color: "var(--sm-status-success)",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Icon name="check" size={12} /> 리사이즈 완료 · 200/400/800px
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    border: "2px dashed var(--sm-border-default)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--size-700)",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "var(--size-300)",
                    background: "var(--sm-background-subtle)",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "var(--radius-md)",
                      background: "var(--sm-background-default)",
                      display: "grid",
                      placeItems: "center",
                      color: "var(--sm-content-tertiary)",
                    }}
                  >
                    <Icon name="image" size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>이미지를 끌어다 놓거나</div>
                    <div className="text-tertiary" style={{ fontSize: "var(--text-body-sm)" }}>
                      PNG · JPG · WebP — 최대 8MB
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "var(--size-200)", marginTop: "var(--size-200)" }}>
                    <Button
                      variant="secondary"
                      iconLeft="upload"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      disabled={uploading}
                    >
                      {uploading ? `업로드 중… ${uploadPct}%` : "파일 선택"}
                    </Button>
                    <Button
                      variant="outline"
                      iconLeft="camera"
                      onClick={() => cameraInputRef.current && cameraInputRef.current.click()}
                      disabled={uploading}
                    >
                      카메라 촬영
                    </Button>
                  </div>
                  {/* 숨김 파일 입력 — 실제 Firebase Storage 업로드 트리거 */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={onPickFile}
                    style={{ display: "none" }}
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={onPickFile}
                    style={{ display: "none" }}
                  />
                </div>
              )}
              {uploading && (
                <div style={{ marginTop: "var(--size-300)", height: 6, background: "var(--sm-background-muted)", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${uploadPct}%`,
                    background: "var(--sm-interactive-brand-default)",
                    transition: "width 0.2s ease",
                  }} />
                </div>
              )}
            </div>
          </Card>

          {/* Site-specific (flower) */}
          <Card>
            <div className="card-header">
              <div>
                <h2 className="card-title">꽃집 추가 정보</h2>
                <div className="card-subtitle">도화원플라워의 사이트 타입(flower)에만 노출되는 필드</div>
              </div>
              <Badge tone="brand">site-specific</Badge>
            </div>
            <div className="card-body" style={{ display: "grid", gap: "var(--size-500)" }}>
              <Field label="제공 사이즈" helper="고객이 선택할 수 있는 옵션">
                <div style={{ display: "flex", gap: "var(--size-200)" }}>
                  {["S", "M", "L", "XL"].map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSize(s)}
                      style={{
                        width: 60,
                        height: 44,
                        borderRadius: "var(--radius-md)",
                        border: `1px solid ${
                          form.sizes.includes(s)
                            ? "var(--sm-interactive-brand-default)"
                            : "var(--sm-border-default)"
                        }`,
                        background: form.sizes.includes(s)
                          ? "var(--sm-interactive-brand-subtle)"
                          : "var(--sm-background-default)",
                        color: form.sizes.includes(s)
                          ? "var(--sm-interactive-brand-default)"
                          : "var(--sm-content-secondary)",
                        fontWeight: 600,
                        fontSize: "var(--text-body-md)",
                        transition: "all var(--motion-fast)",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="태그" helper="검색·필터에 사용됩니다. Enter로 추가.">
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--size-150)",
                    padding: "var(--size-200) var(--size-300)",
                    border: "1px solid var(--sm-border-default)",
                    borderRadius: "var(--radius-md)",
                    background: "var(--sm-background-default)",
                    minHeight: 44,
                    alignItems: "center",
                  }}
                >
                  {form.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "2px 4px 2px 10px",
                        background: "var(--sm-interactive-brand-subtle)",
                        color: "var(--sm-interactive-brand-default)",
                        borderRadius: "var(--radius-full)",
                        fontSize: "var(--text-caption)",
                        fontWeight: 600,
                      }}
                    >
                      {t}
                      <button
                        onClick={() => update("tags", form.tags.filter((x) => x !== t))}
                        style={{
                          width: 18,
                          height: 18,
                          display: "grid",
                          placeItems: "center",
                          borderRadius: "50%",
                          color: "var(--sm-interactive-brand-default)",
                        }}
                      >
                        <Icon name="x" size={11} />
                      </button>
                    </span>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      } else if (e.key === "Backspace" && !tagInput && form.tags.length) {
                        update("tags", form.tags.slice(0, -1));
                      }
                    }}
                    placeholder={form.tags.length ? "" : "예: 봄, 프로포즈, 베스트"}
                    style={{
                      flex: 1,
                      minWidth: 120,
                      border: 0,
                      background: "transparent",
                      outline: "none",
                      fontSize: "var(--text-body-md)",
                    }}
                  />
                </div>
              </Field>
              <Field label="재고 상태">
                <div style={{ display: "flex", gap: "var(--size-200)" }}>
                  {["주문제작", "재고있음", "품절"].map((s) => (
                    <button
                      key={s}
                      onClick={() => update("stock", s)}
                      className={`chip ${form.stock === s ? "selected" : ""}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </Card>

          {/* Danger zone */}
          {existing && (
            <Card style={{ borderColor: "var(--sm-status-error-subtle)" }}>
              <div className="card-header" style={{ borderBottomColor: "var(--sm-status-error-subtle)" }}>
                <div>
                  <h2 className="card-title" style={{ color: "var(--sm-status-error)" }}>
                    삭제
                  </h2>
                  <div className="card-subtitle">삭제는 발행 후에야 사이트에 반영됩니다.</div>
                </div>
                <Button variant="danger" iconLeft="trash" onClick={() => setConfirmDelete(true)}>
                  상품 삭제
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* ── Live preview ── */}
        <div style={{ position: "sticky", top: 100, display: "flex", flexDirection: "column", gap: "var(--size-400)" }}>
          <div style={{ fontSize: "var(--text-label-md)", fontWeight: 600, color: "var(--sm-content-tertiary)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            사이트 미리보기
          </div>
          <ProductPreview form={form} />
          <Card>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--size-300)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "var(--text-label-md)", fontWeight: 600 }}>사이트 노출</div>
                  <div className="text-tertiary" style={{ fontSize: "var(--text-caption)" }}>
                    꺼두면 발행되어도 사이트에 안 보입니다
                  </div>
                </div>
                <Toggle checked={form.visible} onChange={(v) => update("visible", v)} />
              </div>
              <div className="divider" />
              <Button variant="primary" iconLeft="save" full onClick={save}>
                {existing ? "변경사항 저장" : "상품 등록"}
              </Button>
              <Button variant="outline" full onClick={onBack}>
                취소
              </Button>
              <div className="text-tertiary" style={{ fontSize: "var(--text-caption)", textAlign: "center" }}>
                저장 시 드래프트로 저장 → 발행 센터에서 발행
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="이 상품을 삭제할까요?"
        desc={`'${existing?.name}'을(를) 삭제합니다. 발행 후 사이트에서도 사라집니다.`}
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              취소
            </Button>
            <Button variant="danger" iconLeft="trash" onClick={remove}>
              삭제
            </Button>
          </>
        }
      />
    </div>
  );
};

const ProductPreview = ({ form }) => (
  <div
    style={{
      background: "var(--sm-surface-raised)",
      border: "1px solid var(--sm-border-subtle)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        background: "var(--sm-background-subtle)",
        padding: "8px 12px",
        fontSize: "var(--text-caption)",
        color: "var(--sm-content-tertiary)",
        display: "flex",
        alignItems: "center",
        gap: 8,
        borderBottom: "1px solid var(--sm-border-subtle)",
      }}
    >
      <span style={{ display: "flex", gap: 4 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffbd2e" }} />
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c93f" }} />
      </span>
      <span>dohwawon.kr/products/{form.name || "…"}</span>
    </div>
    <div
      style={{
        aspectRatio: "1 / 1",
        background: form.image || "var(--sm-background-muted)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {!form.image && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            color: "var(--sm-content-tertiary)",
            fontSize: "var(--text-body-sm)",
            background: "repeating-linear-gradient(45deg, transparent 0 12px, rgba(0,0,0,0.02) 12px 13px)",
          }}
        >
          대표 사진을 추가하면 여기에 보여요
        </div>
      )}
    </div>
    <div style={{ padding: "var(--size-400)" }}>
      <div style={{ fontSize: "var(--text-caption)", color: "var(--sm-content-tertiary)", marginBottom: 4 }}>
        {CATEGORIES.find((c) => c.id === form.category)?.name || ""}
      </div>
      <div
        style={{
          fontSize: "var(--text-heading-sm)",
          fontWeight: 700,
          letterSpacing: "-0.015em",
          marginBottom: 8,
          minHeight: 28,
          color: form.name ? "var(--sm-content-primary)" : "var(--sm-content-disabled)",
        }}
      >
        {form.name || "상품명을 입력해 주세요"}
      </div>
      <div
        className="mono"
        style={{
          fontSize: "var(--text-heading-md)",
          fontWeight: 700,
          color: form.price ? "var(--sm-content-primary)" : "var(--sm-content-disabled)",
        }}
      >
        {form.price ? `${Number(form.price).toLocaleString()}원` : "0원"}
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: "var(--text-body-sm)",
          color: "var(--sm-content-secondary)",
          lineHeight: 1.55,
          minHeight: 60,
          textWrap: "pretty",
        }}
      >
        {form.description || (
          <span style={{ color: "var(--sm-content-disabled)" }}>설명을 입력하면 여기 보여요…</span>
        )}
      </div>
      {form.sizes.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
          {form.sizes.map((s) => (
            <span
              key={s}
              style={{
                width: 36,
                height: 36,
                display: "grid",
                placeItems: "center",
                border: "1px solid var(--sm-border-default)",
                borderRadius: "var(--radius-sm)",
                fontSize: "var(--text-label-md)",
                fontWeight: 600,
              }}
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
);

Object.assign(window, { ProductEditorPage });
