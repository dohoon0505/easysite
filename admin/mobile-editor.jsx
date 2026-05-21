/* eslint-disable */
// Mobile product editor (P02/P03 mobile) — camera-first flow, big numerics

const MobileEditorPage = ({ productId, products, setProducts, onBack }) => {
  const existing = productId ? products.find((p) => p.id === productId) : null;
  const toast = useToast();

  const [form, setForm] = React.useState(() => ({
    name: existing?.name || "",
    category: existing?.category || "bouquet",
    price: existing?.price || 0,
    description: existing?.description || "",
    sizes: existing?.sizes || ["M"],
    tags: existing?.tags || [],
    stock: existing?.stock || "주문제작",
    image: existing?.image || null,
    visible: existing?.visible ?? true,
  }));

  const [categorySheet, setCategorySheet] = React.useState(false);
  const [imageSheet, setImageSheet] = React.useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleSize = (s) =>
    update("sizes", form.sizes.includes(s) ? form.sizes.filter((x) => x !== s) : [...form.sizes, s]);

  const save = () => {
    if (!form.name.trim()) {
      toast({ tone: "error", message: "상품명을 입력해 주세요" });
      return;
    }
    if (!form.price) {
      toast({ tone: "error", message: "가격을 입력해 주세요" });
      return;
    }
    const cat = CATEGORIES.find((c) => c.id === form.category);
    const updated = {
      id: existing?.id || `p_${Math.random().toString(36).slice(2, 6)}`,
      ...form,
      categoryName: cat?.name || "기타",
      price: Number(form.price),
      status: "draft",
      draft: true,
      image: form.image || flowerThumb("#f4c8d0", "#d36a8a"),
      updatedAt: "방금 전",
    };
    if (existing) {
      setProducts((ps) => ps.map((p) => (p.id === existing.id ? updated : p)));
    } else {
      setProducts((ps) => [updated, ...ps]);
    }
    toast({ tone: "success", message: "드래프트 저장 완료" });
    onBack();
  };

  return (
    <>
      <MobileAppBar
        back={onBack}
        title={existing ? "상품 수정" : "새 상품"}
        actions={<Button variant="ghost" size="sm" onClick={save}>저장</Button>}
      />
      <div className="m-scroll">
        {/* Image hero */}
        <button
          onClick={() => setImageSheet(true)}
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            background: form.image || "var(--sm-background-muted)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            border: 0,
            padding: 0,
          }}
        >
          {!form.image && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                color: "var(--sm-content-secondary)",
                background:
                  "repeating-linear-gradient(45deg, transparent 0 16px, rgba(0,0,0,0.025) 16px 17px)",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "white",
                  display: "grid",
                  placeItems: "center",
                  boxShadow: "var(--shadow-md)",
                  color: "var(--sm-interactive-brand-default)",
                }}
              >
                <Icon name="camera" size={26} />
              </div>
              <div style={{ fontWeight: 600 }}>사진 촬영 또는 선택</div>
              <div style={{ fontSize: 13, color: "var(--sm-content-tertiary)" }}>
                정사각형이 가장 예뻐요
              </div>
            </div>
          )}
          {form.image && (
            <div
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "rgba(0,0,0,0.6)",
                color: "white",
                padding: "6px 12px",
                borderRadius: "var(--radius-full)",
                fontSize: 12,
                fontWeight: 600,
                display: "flex",
                gap: 6,
                alignItems: "center",
                backdropFilter: "blur(8px)",
              }}
            >
              <Icon name="camera" size={14} /> 사진 변경
            </div>
          )}
        </button>

        {/* Big price */}
        <div style={{ background: "var(--sm-background-default)", padding: "var(--size-700) var(--size-500)", textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "var(--sm-content-tertiary)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
            판매 가격
          </div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6 }}>
            <input
              type="number"
              inputMode="numeric"
              value={form.price || ""}
              onChange={(e) => update("price", Number(e.target.value))}
              placeholder="0"
              className="big-number-input"
              style={{ maxWidth: 220 }}
            />
            <span style={{ fontSize: 24, fontWeight: 700, color: "var(--sm-content-tertiary)" }}>원</span>
          </div>
          {/* Quick price helpers */}
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
            {[+1000, +5000, -1000, "1만원대로", "5만원대로"].map((adj) => (
              <button
                key={adj}
                onClick={() => {
                  if (typeof adj === "number") update("price", Math.max(0, (form.price || 0) + adj));
                  else if (adj === "1만원대로") update("price", 19000);
                  else if (adj === "5만원대로") update("price", 59000);
                }}
                style={{
                  background: "var(--sm-background-muted)",
                  color: "var(--sm-content-secondary)",
                  padding: "6px 12px",
                  borderRadius: "var(--radius-full)",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {typeof adj === "number" ? (adj > 0 ? `+${adj.toLocaleString()}` : adj.toLocaleString()) : adj}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="m-section">
          <Field label="상품명">
            <Input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="예: 봄의 인사 — 라넌큘러스 꽃다발"
            />
          </Field>

          <Field label="카테고리">
            <button
              onClick={() => setCategorySheet(true)}
              style={{
                width: "100%",
                padding: "var(--size-300) var(--size-400)",
                background: "var(--sm-background-default)",
                border: "1px solid var(--sm-border-default)",
                borderRadius: "var(--radius-md)",
                textAlign: "left",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 15,
              }}
            >
              {CATEGORIES.find((c) => c.id === form.category)?.name}
              <Icon name="chevronDown" size={16} style={{ color: "var(--sm-content-tertiary)" }} />
            </button>
          </Field>

          <Field label="설명">
            <Textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="어떤 꽃이 들어있는지, 어울리는 자리…"
              rows={3}
            />
          </Field>
        </div>

        {/* Sizes / tags */}
        <div className="m-section">
          <Field label="제공 사이즈">
            <div style={{ display: "flex", gap: 8 }}>
              {["S", "M", "L", "XL"].map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSize(s)}
                  style={{
                    flex: 1,
                    height: 48,
                    borderRadius: "var(--radius-md)",
                    border: `1px solid ${form.sizes.includes(s) ? "var(--sm-interactive-brand-default)" : "var(--sm-border-default)"}`,
                    background: form.sizes.includes(s) ? "var(--sm-interactive-brand-subtle)" : "var(--sm-background-default)",
                    color: form.sizes.includes(s) ? "var(--sm-interactive-brand-default)" : "var(--sm-content-secondary)",
                    fontWeight: 700,
                    fontSize: 17,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>

          <Field label="재고">
            <div style={{ display: "flex", gap: 8 }}>
              {["주문제작", "재고있음", "품절"].map((s) => (
                <button
                  key={s}
                  onClick={() => update("stock", s)}
                  style={{
                    flex: 1,
                    padding: "var(--size-300)",
                    borderRadius: "var(--radius-md)",
                    border: `1px solid ${form.stock === s ? "var(--sm-interactive-brand-default)" : "var(--sm-border-default)"}`,
                    background: form.stock === s ? "var(--sm-interactive-brand-subtle)" : "var(--sm-background-default)",
                    color: form.stock === s ? "var(--sm-interactive-brand-default)" : "var(--sm-content-secondary)",
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>

          <Field label="사이트에 노출">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "var(--size-200) 0" }}>
              <div style={{ fontSize: 13, color: "var(--sm-content-tertiary)", textWrap: "pretty", maxWidth: 240 }}>
                꺼두면 발행되어도 사이트에 안 보입니다
              </div>
              <Toggle checked={form.visible} onChange={(v) => update("visible", v)} />
            </div>
          </Field>
        </div>

        <div style={{ height: 24 }} />
      </div>

      <div className="m-cta-bar">
        <Button variant="outline" full onClick={onBack}>취소</Button>
        <Button variant="primary" full iconLeft="save" onClick={save}>
          저장
        </Button>
      </div>

      {/* Category sheet */}
      <BottomSheet
        open={categorySheet}
        onClose={() => setCategorySheet(false)}
        title="카테고리"
      >
        <div style={{ paddingBottom: 24 }}>
          {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
            <button
              key={c.id}
              onClick={() => {
                update("category", c.id);
                setCategorySheet(false);
              }}
              style={{
                width: "100%",
                padding: "var(--size-400) 0",
                textAlign: "left",
                borderBottom: "1px solid var(--sm-border-subtle)",
                fontSize: 16,
                fontWeight: form.category === c.id ? 600 : 400,
                color: form.category === c.id ? "var(--sm-interactive-brand-default)" : "var(--sm-content-primary)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{c.name}</span>
              {form.category === c.id && <Icon name="check" size={20} />}
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Image source sheet */}
      <BottomSheet
        open={imageSheet}
        onClose={() => setImageSheet(false)}
        title="사진 추가"
      >
        <div style={{ display: "grid", gap: 8, paddingBottom: 24 }}>
          <SheetAction
            icon="camera"
            label="카메라로 촬영"
            desc="지금 바로 꽃 사진을 찍어요"
            onClick={() => {
              update("image", flowerThumb("#fbd5e2", "#e87fa3"));
              setImageSheet(false);
            }}
            primary
          />
          <SheetAction
            icon="image"
            label="앨범에서 선택"
            desc="갤러리에서 사진을 골라요"
            onClick={() => {
              update("image", flowerThumb("#f4c8d0", "#d36a8a"));
              setImageSheet(false);
            }}
          />
          <SheetAction
            icon="layers"
            label="기존 이미지에서"
            desc="이미 업로드한 사진을 재사용"
            onClick={() => {
              update("image", flowerThumb("#dde6c5", "#8fb178"));
              setImageSheet(false);
            }}
          />
        </div>
      </BottomSheet>
    </>
  );
};

const SheetAction = ({ icon, label, desc, onClick, primary }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--size-400)",
      padding: "var(--size-400)",
      background: primary ? "var(--sm-interactive-brand-default)" : "var(--sm-background-subtle)",
      color: primary ? "white" : "var(--sm-content-primary)",
      borderRadius: "var(--radius-md)",
      textAlign: "left",
    }}
  >
    <Icon name={icon} size={22} />
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 600, fontSize: 15 }}>{label}</div>
      <div style={{ fontSize: 12, opacity: 0.75 }}>{desc}</div>
    </div>
    <Icon name="chevronRight" size={16} />
  </button>
);

Object.assign(window, { MobileEditorPage });
