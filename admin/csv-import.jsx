/* eslint-disable */
// CSV import wizard — 3 step flow with column mapping + dry-run preview

const SAMPLE_CSV_HEADERS = ["product_name", "category_id", "price_krw", "stock_status", "tags", "image_url"];
const SAMPLE_CSV_ROWS = [
  ["오리엔탈 백합 꽃다발", "bouquet", "65000", "주문제작", "백합,선물", "https://..."],
  ["미스티 블루 부케", "bouquet", "52000", "주문제작", "블루,봄", "https://..."],
  ["에버그린 화환", "wreath", "85000", "주문제작", "축하,개업", "https://..."],
  ["로맨틱 핑크 박스", "basket", "78000", "주문제작", "발렌타인,로맨스", "https://..."],
  ["가든 미니 화분", "potted", "28000", "재고있음", "미니,인테리어", "https://..."],
  ["사쿠라 부케 - 한정판", "bouquet", "95000", "품절", "벚꽃,한정", "https://..."],
  ["수국 단일 부케", "bouquet", "44000", "주문제작", "수국,여름", "https://..."],
  ["블링블링 미니 부케", "bouquet", "32000", "재고있음", "미니,선물", "https://..."],
];

const TARGET_FIELDS = [
  { id: "name", label: "상품명", required: true },
  { id: "category", label: "카테고리 ID", required: true },
  { id: "price", label: "가격 (원)", required: true },
  { id: "stock", label: "재고 상태", required: false },
  { id: "tags", label: "태그", required: false },
  { id: "image", label: "이미지 URL", required: false },
  { id: "skip", label: "(가져오지 않음)", required: false },
];

const CsvImportModal = ({ open, onClose, onImport }) => {
  const [step, setStep] = React.useState(1);
  const [dragOver, setDragOver] = React.useState(false);
  const [fileName, setFileName] = React.useState(null);
  const [mapping, setMapping] = React.useState({});
  const [importing, setImporting] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [result, setResult] = React.useState(null);

  React.useEffect(() => {
    if (open) {
      setStep(1);
      setFileName(null);
      setMapping({});
      setImporting(false);
      setProgress(0);
      setResult(null);
    }
  }, [open]);

  const loadDemo = () => {
    setFileName("dohwawon-spring-2026.csv");
    // auto-detect mapping
    setMapping({
      product_name: "name",
      category_id: "category",
      price_krw: "price",
      stock_status: "stock",
      tags: "tags",
      image_url: "image",
    });
    setStep(2);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.name.endsWith(".csv")) {
      setFileName(f.name);
      loadDemo(); // simulate auto-detect
    }
  };

  const allMapped = TARGET_FIELDS.filter((f) => f.required).every((f) =>
    Object.values(mapping).includes(f.id)
  );

  const runImport = async () => {
    setImporting(true);
    setProgress(0);
    const total = SAMPLE_CSV_ROWS.length;
    for (let i = 0; i < total; i++) {
      await new Promise((r) => setTimeout(r, 220));
      setProgress(((i + 1) / total) * 100);
    }
    setImporting(false);
    setResult({ ok: 7, error: 1, total });
    setStep(4);
  };

  const stepLabels = ["파일 업로드", "컬럼 매핑", "확인 & 가져오기", "결과"];

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2 className="modal-title">CSV 가져오기</h2>
          <div className="modal-desc">엑셀·구글 스프레드시트에서 내려받은 CSV로 상품을 한번에 등록하세요</div>

          {/* Progress steps */}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            {stepLabels.map((label, i) => {
              const n = i + 1;
              const state = n < step ? "done" : n === step ? "active" : "pending";
              return (
                <div
                  key={n}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 10px",
                    background:
                      state === "done"
                        ? "var(--sm-interactive-brand-subtle)"
                        : state === "active"
                        ? "var(--sm-interactive-brand-default)"
                        : "var(--sm-background-muted)",
                    color:
                      state === "active"
                        ? "white"
                        : state === "done"
                        ? "var(--sm-interactive-brand-default)"
                        : "var(--sm-content-tertiary)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {state === "done" ? (
                    <Icon name="check" size={12} />
                  ) : (
                    <span style={{ width: 16, height: 16, borderRadius: "50%", background: state === "active" ? "rgba(255,255,255,0.25)" : "var(--sm-background-default)", display: "grid", placeItems: "center", fontSize: 10 }}>
                      {n}
                    </span>
                  )}
                  <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-body">
          {step === 1 && (
            <>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${dragOver ? "var(--sm-interactive-brand-default)" : "var(--sm-border-default)"}`,
                  background: dragOver ? "var(--sm-interactive-brand-subtle)" : "var(--sm-background-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--size-900) var(--size-500)",
                  textAlign: "center",
                  transition: "all var(--motion-fast)",
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "white",
                    boxShadow: "var(--shadow-md)",
                    display: "grid",
                    placeItems: "center",
                    margin: "0 auto var(--size-400)",
                    color: "var(--sm-interactive-brand-default)",
                  }}
                >
                  <Icon name="upload" size={28} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.015em", marginBottom: 4 }}>
                  CSV 파일을 끌어다 놓으세요
                </div>
                <div style={{ fontSize: 13, color: "var(--sm-content-tertiary)", marginBottom: 16 }}>
                  UTF-8 인코딩 · 최대 500행 · 컬럼 매핑은 다음 단계에서
                </div>
                <Button variant="primary" iconLeft="upload" onClick={loadDemo}>
                  파일 선택
                </Button>
              </div>

              <div style={{ marginTop: 20 }}>
                <div className="text-tertiary" style={{ fontSize: 12, marginBottom: 8 }}>
                  CSV 템플릿이 필요하신가요?
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button variant="outline" size="sm" iconLeft="upload">기본 템플릿 (.csv)</Button>
                  <Button variant="outline" size="sm" iconLeft="book">스프레드시트 가이드</Button>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{
                background: "var(--sm-status-success-subtle)",
                border: "1px solid var(--sm-status-success)",
                padding: "var(--size-300) var(--size-400)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 20,
              }}>
                <Icon name="check" size={18} style={{ color: "var(--sm-status-success)" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--sm-status-success)" }}>
                    {fileName} · 8행 인식됨
                  </div>
                  <div style={{ fontSize: 12, color: "var(--sm-content-secondary)" }}>
                    컬럼 6개를 자동 매핑했어요. 필요하면 수정하세요.
                  </div>
                </div>
                <Button variant="ghost" size="sm" iconLeft="x" onClick={() => setStep(1)}>다른 파일</Button>
              </div>

              <div style={{ fontSize: "var(--text-overline)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--sm-content-tertiary)", marginBottom: 8 }}>
                컬럼 매핑
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                {SAMPLE_CSV_HEADERS.map((h) => (
                  <div
                    key={h}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 24px 1fr",
                      gap: 12,
                      alignItems: "center",
                      padding: "var(--size-300) var(--size-400)",
                      background: "var(--sm-background-subtle)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <div>
                      <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{h}</div>
                      <div style={{ fontSize: 11, color: "var(--sm-content-tertiary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        예: {SAMPLE_CSV_ROWS[0][SAMPLE_CSV_HEADERS.indexOf(h)]}
                      </div>
                    </div>
                    <Icon name="arrowRight" size={14} style={{ color: "var(--sm-content-tertiary)", justifySelf: "center" }} />
                    <Select
                      value={mapping[h] || "skip"}
                      onChange={(e) => setMapping({ ...mapping, [h]: e.target.value })}
                    >
                      {TARGET_FIELDS.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.label}{f.required ? " *" : ""}
                        </option>
                      ))}
                    </Select>
                  </div>
                ))}
              </div>

              {!allMapped && (
                <div style={{
                  marginTop: 12,
                  padding: "var(--size-300) var(--size-400)",
                  background: "var(--sm-status-warning-subtle)",
                  borderRadius: "var(--radius-md)",
                  fontSize: 13,
                  color: "var(--sm-status-warning)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <Icon name="alert" size={14} /> 필수 필드(상품명·카테고리·가격)가 모두 매핑되어야 합니다
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>가져올 상품 미리보기</div>
                  <div style={{ fontSize: 13, color: "var(--sm-content-tertiary)" }}>
                    8행 · 모두 드래프트로 저장됩니다 (발행 별도)
                  </div>
                </div>
                <Badge tone="info" dot>드라이런 통과</Badge>
              </div>
              <div style={{ border: "1px solid var(--sm-border-subtle)", borderRadius: "var(--radius-md)", overflow: "hidden", maxHeight: 320, overflowY: "auto" }}>
                <table className="table" style={{ fontSize: 12 }}>
                  <thead>
                    <tr>
                      <th>상품명</th>
                      <th>카테고리</th>
                      <th style={{ textAlign: "right" }}>가격</th>
                      <th>재고</th>
                      <th>태그</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_CSV_ROWS.map((row, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{row[0]}</td>
                        <td><Badge tone="neutral">{row[1]}</Badge></td>
                        <td className="mono" style={{ textAlign: "right" }}>{Number(row[2]).toLocaleString()}원</td>
                        <td>
                          {row[3] === "품절" ? <Badge tone="danger">{row[3]}</Badge> : <span style={{ fontSize: 12 }}>{row[3]}</span>}
                        </td>
                        <td style={{ fontSize: 11, color: "var(--sm-content-tertiary)" }}>{row[4]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 16, padding: "var(--size-400)", background: "var(--sm-background-subtle)", borderRadius: "var(--radius-md)", display: "grid", gap: 6, fontSize: 13 }}>
                <Row k="가져올 상품 수" v="8개" />
                <Row k="중복 (이름 일치)" v="0개" />
                <Row k="검증 통과" v="8/8 행" />
                <Row k="이미지 다운로드" v="6개 URL → CDN 동기화 예정" />
              </div>

              {importing && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
                    <span>가져오는 중…</span>
                    <span className="mono">{Math.round(progress)}%</span>
                  </div>
                  <div style={{ height: 6, background: "var(--sm-background-muted)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${progress}%`, background: "var(--sm-interactive-brand-default)", transition: "width 0.2s" }} />
                  </div>
                </div>
              )}
            </>
          )}

          {step === 4 && result && (
            <div style={{ textAlign: "center", padding: "var(--size-600) 0" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "var(--sm-status-success-subtle)",
                  color: "var(--sm-status-success)",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto var(--size-400)",
                }}
              >
                <Icon name="check" size={36} />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.015em", marginBottom: 8 }}>
                {result.ok}개 상품을 드래프트로 저장했습니다
              </div>
              <div style={{ fontSize: 14, color: "var(--sm-content-secondary)", marginBottom: 24, textWrap: "pretty" }}>
                발행 센터에서 한번에 발행하면 사이트에 반영됩니다.
              </div>
              {result.error > 0 && (
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  background: "var(--sm-status-warning-subtle)",
                  borderRadius: "var(--radius-full)",
                  fontSize: 13,
                  color: "var(--sm-status-warning)",
                }}>
                  <Icon name="alert" size={14} />
                  {result.error}개 행은 가져오지 못했어요 (이미지 URL 깨짐)
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          {step === 1 && (
            <Button variant="outline" onClick={onClose}>닫기</Button>
          )}
          {step === 2 && (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>이전</Button>
              <Button variant="primary" disabled={!allMapped} onClick={() => setStep(3)}>다음 — 미리보기</Button>
            </>
          )}
          {step === 3 && (
            <>
              <Button variant="outline" onClick={() => setStep(2)} disabled={importing}>이전</Button>
              <Button
                variant="primary"
                iconLeft="upload"
                disabled={importing}
                onClick={runImport}
              >
                {importing ? "가져오는 중…" : "8개 상품 가져오기"}
              </Button>
            </>
          )}
          {step === 4 && (
            <>
              <Button variant="outline" onClick={onClose}>닫기</Button>
              <Button variant="primary" iconLeft="rocket" onClick={() => { onImport(); onClose(); }}>
                발행 센터로
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { CsvImportModal });
