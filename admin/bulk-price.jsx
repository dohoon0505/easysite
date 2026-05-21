/* eslint-disable */
// Bulk price adjustment sheet — the novel mobile pattern for seasonal flower-shop owners.
// Select N products → choose %change or fixed → live preview → apply (creates drafts).

const BulkPriceSheet = ({ open, onClose, products, setProducts, categories }) => {
  const [step, setStep] = React.useState(1); // 1: pick, 2: adjust, 3: preview
  const [picked, setPicked] = React.useState([]);
  const [mode, setMode] = React.useState("percent"); // 'percent' | 'fixed' | 'round'
  const [percent, setPercent] = React.useState(10);
  const [fixed, setFixed] = React.useState(1000);
  const [rounding, setRounding] = React.useState(1000);
  const toast = useToast();

  React.useEffect(() => {
    if (open) {
      setStep(1);
      setPicked([]);
      setPercent(10);
      setFixed(1000);
    }
  }, [open]);

  const togglePick = (id) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const computeNew = (orig) => {
    let n = orig;
    if (mode === "percent") n = orig + (orig * percent) / 100;
    if (mode === "fixed") n = orig + fixed;
    if (mode === "round") n = Math.round(orig / rounding) * rounding;
    return Math.max(0, Math.round(n / 100) * 100);
  };

  const apply = () => {
    setProducts((ps) =>
      ps.map((p) => {
        if (!picked.includes(p.id)) return p;
        return { ...p, price: computeNew(p.price), draft: true, status: "draft", updatedAt: "방금 전" };
      })
    );
    toast({
      tone: "success",
      message: `${picked.length}개 상품 가격을 조정했습니다 — 발행해야 반영됩니다`,
    });
    onClose();
  };

  if (!open) return null;

  const pickedProducts = products.filter((p) => picked.includes(p.id));
  const totalOrig = pickedProducts.reduce((s, p) => s + p.price, 0);
  const totalNew = pickedProducts.reduce((s, p) => s + computeNew(p.price), 0);

  return (
    <>
      <div className="bottom-sheet-backdrop" onClick={onClose} />
      <div className="bottom-sheet" style={{ maxHeight: "92%" }}>
        <div className="sheet-handle" />
        <div className="sheet-header">
          <h2 className="sheet-title">시즌 가격 일괄 조정</h2>
          <IconButton icon="x" onClick={onClose} />
        </div>

        {/* Stepper */}
        <div style={{ display: "flex", gap: 4, padding: "0 var(--size-500)" }}>
          {["상품 선택", "조정 방식", "확인"].map((label, i) => {
            const idx = i + 1;
            return (
              <div
                key={idx}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: "var(--radius-full)",
                  background: step >= idx ? "var(--sm-interactive-brand-default)" : "var(--sm-background-muted)",
                  transition: "background var(--motion-base)",
                }}
              />
            );
          })}
        </div>

        <div className="sheet-body" style={{ paddingTop: 16 }}>
          {step === 1 && (
            <>
              <div style={{ fontSize: 14, color: "var(--sm-content-secondary)", marginBottom: 12, textWrap: "pretty" }}>
                어버이날·시즌 인상 등 가격 변경할 상품들을 골라요. 카테고리 단위로 한번에 선택할 수도 있어요.
              </div>
              {/* Category quick-pick */}
              <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                {categories.filter((c) => c.id !== "all").map((c) => {
                  const inCat = products.filter((p) => p.category === c.id).map((p) => p.id);
                  const allPicked = inCat.length > 0 && inCat.every((id) => picked.includes(id));
                  return (
                    <button
                      key={c.id}
                      onClick={() =>
                        setPicked((p) =>
                          allPicked ? p.filter((id) => !inCat.includes(id)) : [...new Set([...p, ...inCat])]
                        )
                      }
                      className={`chip ${allPicked ? "selected" : ""}`}
                    >
                      {c.name} +{inCat.length}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                {products.map((p) => {
                  const on = picked.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => togglePick(p.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: 8,
                        background: on ? "var(--sm-interactive-brand-subtle)" : "transparent",
                        border: `1px solid ${on ? "var(--sm-interactive-brand-default)" : "var(--sm-border-subtle)"}`,
                        borderRadius: "var(--radius-md)",
                        textAlign: "left",
                      }}
                    >
                      <Checkbox checked={on} onChange={() => togglePick(p.id)} />
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "var(--radius-sm)",
                          background: p.image,
                          backgroundSize: "cover",
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--sm-content-tertiary)" }}>
                          {p.categoryName}
                        </div>
                      </div>
                      <div className="mono" style={{ fontWeight: 600, fontSize: 13 }}>
                        {p.price.toLocaleString()}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Mode picker */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
                {[
                  { id: "percent", label: "퍼센트", icon: "bolt" },
                  { id: "fixed", label: "정액", icon: "plus" },
                  { id: "round", label: "반올림", icon: "refresh" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    style={{
                      padding: "12px 8px",
                      borderRadius: "var(--radius-md)",
                      border: `1px solid ${mode === m.id ? "var(--sm-interactive-brand-default)" : "var(--sm-border-default)"}`,
                      background: mode === m.id ? "var(--sm-interactive-brand-subtle)" : "var(--sm-background-default)",
                      color: mode === m.id ? "var(--sm-interactive-brand-default)" : "var(--sm-content-secondary)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      alignItems: "center",
                    }}
                  >
                    <Icon name={m.icon} size={18} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{m.label}</span>
                  </button>
                ))}
              </div>

              {mode === "percent" && (
                <>
                  <div style={{ textAlign: "center", padding: "var(--size-500) 0" }}>
                    <div style={{ fontSize: 14, color: "var(--sm-content-tertiary)", marginBottom: 8 }}>
                      가격을 {percent >= 0 ? "올림" : "내림"}
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4 }}>
                      <button
                        onClick={() => setPercent((p) => Math.max(-50, p - 5))}
                        style={{ width: 44, height: 44, fontSize: 22, color: "var(--sm-content-tertiary)" }}
                      >
                        −
                      </button>
                      <span style={{ fontSize: 56, fontWeight: 700, letterSpacing: "-0.03em", minWidth: 120, textAlign: "center", color: percent > 0 ? "var(--sm-status-error)" : percent < 0 ? "var(--sm-status-success)" : "var(--sm-content-primary)" }} className="mono">
                        {percent > 0 ? "+" : ""}{percent}
                      </span>
                      <span style={{ fontSize: 28, fontWeight: 700, color: "var(--sm-content-tertiary)" }}>%</span>
                      <button
                        onClick={() => setPercent((p) => Math.min(100, p + 5))}
                        style={{ width: 44, height: 44, fontSize: 22, color: "var(--sm-content-tertiary)" }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="100"
                    value={percent}
                    onChange={(e) => setPercent(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--sm-interactive-brand-default)" }}
                  />
                  <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
                    {[-10, -5, 0, 5, 10, 20].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPercent(p)}
                        className={`chip ${percent === p ? "selected" : ""}`}
                      >
                        {p > 0 ? "+" : ""}{p}%
                      </button>
                    ))}
                  </div>
                </>
              )}

              {mode === "fixed" && (
                <div style={{ textAlign: "center", padding: "var(--size-500) 0" }}>
                  <div style={{ fontSize: 14, color: "var(--sm-content-tertiary)", marginBottom: 8 }}>
                    각 상품에 더할 금액
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 8 }}>
                    <span style={{ fontSize: 28, fontWeight: 700, color: "var(--sm-content-tertiary)" }}>+</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={fixed}
                      onChange={(e) => setFixed(Number(e.target.value))}
                      className="big-number-input"
                      style={{ maxWidth: 200 }}
                    />
                    <span style={{ fontSize: 22, fontWeight: 700, color: "var(--sm-content-tertiary)" }}>원</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 16 }}>
                    {[500, 1000, 2000, 5000, 10000].map((v) => (
                      <button
                        key={v}
                        onClick={() => setFixed(v)}
                        className={`chip ${fixed === v ? "selected" : ""}`}
                      >
                        +{v.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {mode === "round" && (
                <div style={{ textAlign: "center", padding: "var(--size-500) 0" }}>
                  <div style={{ fontSize: 14, color: "var(--sm-content-tertiary)", marginBottom: 8 }}>
                    {rounding.toLocaleString()}원 단위로 반올림
                  </div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    {[100, 500, 1000, 5000].map((r) => (
                      <button
                        key={r}
                        onClick={() => setRounding(r)}
                        className={`chip ${rounding === r ? "selected" : ""}`}
                      >
                        {r.toLocaleString()}원
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview list */}
              <div className="m-section-title" style={{ padding: 0, marginTop: 20 }}>
                미리보기 ({picked.length}개)
              </div>
              <div style={{ marginTop: 8, background: "var(--sm-background-subtle)", borderRadius: "var(--radius-md)", padding: "var(--size-300)", maxHeight: 220, overflowY: "auto" }}>
                {pickedProducts.map((p) => {
                  const np = computeNew(p.price);
                  const diff = np - p.price;
                  return (
                    <div
                      key={p.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 4px",
                        borderBottom: "1px solid var(--sm-border-subtle)",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0, fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {p.name}
                      </div>
                      <span className="mono" style={{ fontSize: 12, color: "var(--sm-content-tertiary)", textDecoration: "line-through" }}>
                        {p.price.toLocaleString()}
                      </span>
                      <Icon name="arrowRight" size={11} style={{ color: "var(--sm-content-tertiary)" }} />
                      <span className="mono" style={{ fontSize: 13, fontWeight: 700 }}>
                        {np.toLocaleString()}
                      </span>
                      <span
                        className="mono"
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: diff > 0 ? "var(--sm-status-error)" : diff < 0 ? "var(--sm-status-success)" : "var(--sm-content-tertiary)",
                          minWidth: 50,
                          textAlign: "right",
                        }}
                      >
                        {diff > 0 ? "+" : ""}{diff.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div
                style={{
                  background: "var(--sm-status-warning-subtle)",
                  border: "1px solid var(--sm-signal-highlight)",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--size-400)",
                  marginBottom: 16,
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Icon name="alert" size={18} style={{ color: "var(--sm-signal-highlight)", flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>마지막 확인</div>
                    <div style={{ fontSize: 13, color: "var(--sm-content-secondary)", lineHeight: 1.55 }}>
                      <b>{picked.length}개 상품</b>의 가격을 변경합니다. 드래프트로 저장되며, 발행 센터에서 발행해야 사이트에 반영됩니다.
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gap: 12, fontSize: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sm-content-tertiary)" }}>변경 대상</span>
                  <span style={{ fontWeight: 600 }}>{picked.length}개 상품</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sm-content-tertiary)" }}>조정 방식</span>
                  <span style={{ fontWeight: 600 }}>
                    {mode === "percent" && `${percent > 0 ? "+" : ""}${percent}%`}
                    {mode === "fixed" && `+${fixed.toLocaleString()}원`}
                    {mode === "round" && `${rounding.toLocaleString()}원 단위 반올림`}
                  </span>
                </div>
                <div className="divider" />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sm-content-tertiary)" }}>이전 합계</span>
                  <span className="mono">{totalOrig.toLocaleString()}원</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sm-content-tertiary)" }}>변경 후 합계</span>
                  <span className="mono" style={{ fontWeight: 700 }}>{totalNew.toLocaleString()}원</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--sm-content-tertiary)" }}>차이</span>
                  <span
                    className="mono"
                    style={{
                      fontWeight: 700,
                      color: totalNew - totalOrig > 0 ? "var(--sm-status-error)" : "var(--sm-status-success)",
                    }}
                  >
                    {totalNew - totalOrig > 0 ? "+" : ""}{(totalNew - totalOrig).toLocaleString()}원
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="sheet-footer">
          {step > 1 && (
            <Button variant="outline" full onClick={() => setStep(step - 1)}>
              이전
            </Button>
          )}
          {step < 3 && (
            <Button
              variant="primary"
              full
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && picked.length === 0}
            >
              {step === 1 ? `${picked.length}개 선택 — 다음` : "확인"}
            </Button>
          )}
          {step === 3 && (
            <Button variant="primary" full iconLeft="check" onClick={apply}>
              가격 조정 적용
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

Object.assign(window, { BulkPriceSheet });
