/* eslint-disable */
// Mobile publish (PB01 mobile) + Bulk price adjust sheet + More page

const MobilePublishPage = ({ products, sections, setProducts, setSections, onBack, site }) => {
  const draftP = products.filter((p) => p.draft);
  const draftS = sections.filter((s) => s.draft);
  const total = draftP.length + draftS.length;

  const [note, setNote] = React.useState("");
  const [running, setRunning] = React.useState(false);
  const [stageIdx, setStageIdx] = React.useState(-1);
  const [done, setDone] = React.useState(false);
  const [logs, setLogs] = React.useState([]);
  const toast = useToast();

  const log = (line, tone = "info") => {
    setLogs((l) => [
      ...l,
      {
        id: Math.random().toString(36).slice(2),
        time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
        line,
        tone,
      },
    ]);
  };

  const start = async () => {
    if (running) return;
    setRunning(true);
    setLogs([]);
    setDone(false);
    log("► 발행 시작 — " + site.name);
    log(`변경: 상품 ${draftP.length}건, 섹션 ${draftS.length}건`);
    for (let i = 0; i < PUBLISH_STAGES.length; i++) {
      setStageIdx(i);
      const stage = PUBLISH_STAGES[i];
      const lines = STAGE_LOG_LINES[stage.id] || [];
      const interval = stage.duration / Math.max(lines.length, 1);
      for (const line of lines) {
        await new Promise((r) => setTimeout(r, interval));
        log(line.text, line.tone);
      }
    }
    setStageIdx(PUBLISH_STAGES.length);
    setRunning(false);
    setDone(true);
    log("✓ 발행 완료", "success");
    setProducts((ps) => ps.map((p) => (p.draft ? { ...p, draft: false, status: "live" } : p)));
    setSections((ss) => ss.map((s) => (s.draft ? { ...s, draft: false } : s)));
    if (navigator.vibrate) navigator.vibrate(50);
  };

  if (running || done) {
    return (
      <>
        <MobileAppBar title={running ? "발행 중…" : "발행 완료"} back={done ? onBack : null} />
        <div className="m-scroll" style={{ padding: "var(--size-500)" }}>
          {/* Circular progress visualization */}
          <div style={{ textAlign: "center", padding: "var(--size-500) 0" }}>
            <div
              style={{
                width: 140,
                height: 140,
                margin: "0 auto",
                position: "relative",
              }}
            >
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <circle cx="50" cy="50" r="44" fill="none" stroke="var(--sm-background-muted)" strokeWidth="6" />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="var(--sm-interactive-brand-default)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="276.5"
                  strokeDashoffset={276.5 - (stageIdx + 1) / PUBLISH_STAGES.length * 276.5}
                  style={{ transition: "stroke-dashoffset var(--motion-base)" }}
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                <div style={{ textAlign: "center" }}>
                  {done ? (
                    <div style={{ color: "var(--sm-status-success)" }}>
                      <Icon name="check" size={36} />
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em" }} className="mono">
                        {Math.round(((stageIdx + 1) / PUBLISH_STAGES.length) * 100)}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--sm-content-tertiary)" }}>%</div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16, fontSize: 16, fontWeight: 600 }}>
              {done ? "사이트에 1~3분 내 반영됩니다" : PUBLISH_STAGES[stageIdx]?.label || ""}
            </div>
          </div>

          {/* Stage list */}
          <div style={{ background: "var(--sm-background-default)", borderRadius: "var(--radius-lg)", border: "1px solid var(--sm-border-subtle)", overflow: "hidden", marginBottom: 16 }}>
            {PUBLISH_STAGES.map((s, i) => {
              const status = i < stageIdx ? "done" : i === stageIdx ? (done ? "done" : "active") : "pending";
              return (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "var(--size-300) var(--size-400)",
                    borderBottom: i < PUBLISH_STAGES.length - 1 ? "1px solid var(--sm-border-subtle)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: status === "done" ? "var(--sm-status-success)" : status === "active" ? "var(--sm-interactive-brand-default)" : "var(--sm-background-muted)",
                      color: "white",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    {status === "done" ? (
                      <Icon name="check" size={14} />
                    ) : status === "active" ? (
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "white", animation: "pulse 1s infinite" }} />
                    ) : (
                      <span style={{ fontSize: 11, color: "var(--sm-content-tertiary)", fontWeight: 700 }}>
                        {i + 1}
                      </span>
                    )}
                  </div>
                  <span style={{ fontWeight: status === "active" ? 600 : 500, fontSize: 14 }}>{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* Compact log */}
          <details style={{ background: "#0d1226", borderRadius: "var(--radius-md)", padding: "var(--size-300) var(--size-400)", color: "#dde2f2" }}>
            <summary style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, cursor: "pointer", color: "#aab3df" }}>
              상세 로그 ({logs.length}줄)
            </summary>
            <div style={{ marginTop: 8, maxHeight: 160, overflowY: "auto", fontFamily: "ui-monospace, Menlo, monospace", fontSize: 11, lineHeight: 1.6 }}>
              {logs.map((l) => (
                <div key={l.id} style={{ display: "flex", gap: 8, color: l.tone === "success" ? "#7cd6a4" : l.tone === "git" ? "#aab3df" : "#dde2f2" }}>
                  <span style={{ color: "#6a728f" }}>{l.time}</span>
                  <span style={{ flex: 1, textWrap: "pretty" }}>{l.line}</span>
                </div>
              ))}
            </div>
          </details>

          {done && (
            <Button variant="outline" full onClick={onBack} style={{ marginTop: 24 }}>
              완료
            </Button>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <MobileAppBar title="발행 센터" back={onBack} sub={site.name} />
      <div className="m-scroll">
        {total === 0 ? (
          <div className="empty" style={{ padding: "var(--size-1000) var(--size-500)" }}>
            <div className="empty-icon"><Icon name="check" size={26} /></div>
            <div className="empty-title">발행할 변경사항이 없어요</div>
            <div className="empty-desc">상품·홈 섹션을 수정하면 여기에 모입니다</div>
          </div>
        ) : (
          <>
            <div style={{ padding: "var(--size-500) var(--size-400)" }}>
              <div style={{ fontSize: 13, color: "var(--sm-content-tertiary)", marginBottom: 8 }}>
                {site.domain}에 반영될 변경사항
              </div>
              <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em" }}>
                {total}건 변경
              </div>
              <div style={{ fontSize: 14, color: "var(--sm-content-secondary)", marginTop: 4 }}>
                상품 {draftP.length}건 · 홈 섹션 {draftS.length}건
              </div>
            </div>

            <div className="m-section-title">변경된 상품</div>
            <div style={{ background: "var(--sm-background-default)" }}>
              {draftP.map((p) => (
                <div key={p.id} className="m-product">
                  <div className="m-product-thumb" style={{ background: p.image, backgroundSize: "cover" }} />
                  <div className="m-product-body">
                    <div className="m-product-name">{p.name}</div>
                    <div className="m-product-meta">
                      {p.categoryName} · <span className="mono">{p.price.toLocaleString()}원</span>
                    </div>
                  </div>
                  <Badge tone="warning">드래프트</Badge>
                </div>
              ))}
            </div>

            {draftS.length > 0 && (
              <>
                <div className="m-section-title">변경된 홈 섹션</div>
                <div style={{ background: "var(--sm-background-default)" }}>
                  {draftS.map((s) => (
                    <div key={s.id} className="m-product">
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "var(--radius-md)",
                          background: "var(--sm-interactive-brand-subtle)",
                          color: "var(--sm-interactive-brand-default)",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <Icon name={s.icon} size={18} />
                      </div>
                      <div className="m-product-body">
                        <div className="m-product-name">홈 — {s.title}</div>
                        <div className="m-product-meta">{s.enabled ? "켜짐" : "꺼짐"}</div>
                      </div>
                      <Badge tone="warning">드래프트</Badge>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div style={{ padding: "var(--size-500) var(--size-400)" }}>
              <Field label="발행 메모 (선택)">
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="예: 어버이날 가격 인상…"
                  rows={3}
                />
              </Field>
            </div>
          </>
        )}
      </div>

      {total > 0 && (
        <div className="m-cta-bar">
          <Button variant="primary" full size="lg" iconLeft="rocket" onClick={start}>
            {total}건 발행
          </Button>
        </div>
      )}
    </>
  );
};

// ── More page ────────────────────────────────────────────────────────────
const MobileMorePage = ({ site, onSwitchSite, onSheet, onHomeSections, onLogout }) => {
  const session = typeof useAuthSession === "function" ? useAuthSession() : null;
  const user = session && session.user;
  const claims = session && session.claims;
  const displayName = (user && (user.displayName || (user.email ? user.email.split("@")[0] : ""))) || "운영자";
  const roleLabel = claims && claims.role === "super" ? "슈퍼"
    : claims && claims.role === "owner" ? "오너" : "에디터";
  const siteLabel = (site && site.name) || (claims && claims.siteId) || "사이트";
  return (
  <>
    <MobileAppBar title="더보기" />
    <div className="m-scroll">
      <div style={{ padding: "var(--size-500) var(--size-400)" }}>
        <button
          onClick={onSwitchSite}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--size-400)",
            padding: "var(--size-400)",
            background: "var(--sm-background-default)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--sm-border-subtle)",
            width: "100%",
            textAlign: "left",
          }}
        >
          <div className="site-thumb" style={{ background: site && site.gradient, width: 48, height: 48 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{site && site.name}</div>
            <div style={{ fontSize: 13, color: "var(--sm-content-tertiary)" }}>
              {site && site.domain} · 다른 사이트로 전환
            </div>
          </div>
          <Icon name="chevronRight" size={16} style={{ color: "var(--sm-content-tertiary)" }} />
        </button>
      </div>

      <div className="m-section-title">운영</div>
      <div style={{ background: "var(--sm-background-default)" }}>
        <MoreRow icon="home" label="홈 섹션 편집" desc="사이트 첫 화면 구성" onClick={onHomeSections} />
        <MoreRow icon="tag" label="카테고리 관리" desc="5개 카테고리 · 드래그 정렬" />
        <MoreRow icon="bolt" label="시즌 가격 일괄 조정" desc="여러 상품을 한번에" onClick={onSheet} />
        <MoreRow icon="clock" label="변경 이력" desc="누가 무엇을 언제" />
      </div>

      <div className="m-section-title">내 계정</div>
      <div style={{ background: "var(--sm-background-default)" }}>
        <MoreRow icon="user" label={displayName} desc={`${roleLabel} · ${siteLabel}`} />
        <MoreRow icon="settings" label="계정 설정" />
        <MoreRow icon="book" label="운영자 매뉴얼" />
      </div>

      <div style={{ padding: "var(--size-500) var(--size-400)" }}>
        <Button variant="ghost" full onClick={onLogout}>로그아웃</Button>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "var(--sm-content-tertiary)" }}>
          easysite admin v0.5.2 · PWA
        </div>
      </div>
    </div>
  </>
  );
};

const MoreRow = ({ icon, label, desc, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--size-300)",
      padding: "var(--size-400)",
      borderBottom: "1px solid var(--sm-border-subtle)",
      width: "100%",
      textAlign: "left",
      background: "transparent",
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "var(--radius-sm)",
        background: "var(--sm-background-muted)",
        color: "var(--sm-content-secondary)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <Icon name={icon} size={18} />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 15, fontWeight: 500 }}>{label}</div>
      {desc && <div style={{ fontSize: 12, color: "var(--sm-content-tertiary)" }}>{desc}</div>}
    </div>
    <Icon name="chevronRight" size={16} style={{ color: "var(--sm-content-tertiary)" }} />
  </button>
);

Object.assign(window, { MobilePublishPage, MobileMorePage });
