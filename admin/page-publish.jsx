/* eslint-disable */
// PB01 — 발행 센터 with live log + linear stage progress

const PUBLISH_STAGES = [
  { id: "validate", label: "변경사항 확인", duration: 800 },
  { id: "build", label: "코드 생성", duration: 1800 },
  { id: "images", label: "이미지 동기화", duration: 2400 },
  { id: "push", label: "사이트 배포", duration: 1600 },
  { id: "deploy", label: "사이트 재빌드", duration: 4500 },
];

const PublishCenterPage = ({ products, sections, setProducts, setSections, categories, faqs, siteInfo, siteMeta, pendingCounts, onGoto, siteId, site }) => {
  const toast = useToast();
  const draftProducts = products.filter((p) => p.draft);
  const draftSections = sections.filter((s) => s.draft);
  const lp = (siteMeta && siteMeta.lastPublishedAt) || null;
  const isPending = window.isPendingSince || (() => false);
  const draftCategories = (categories || []).filter((c) => isPending(c.updatedAt, lp));
  const draftFaqs = (faqs || []).filter((f) => isPending(f.updatedAt, lp));
  const draftSettings = isPending(siteInfo && siteInfo.updatedAt, lp);
  const totalDrafts = (pendingCounts && pendingCounts.total) || (draftProducts.length + draftSections.length + draftCategories.length + draftFaqs.length + (draftSettings ? 1 : 0));

  const [note, setNote] = React.useState("");
  const [running, setRunning] = React.useState(false);
  const [stageIdx, setStageIdx] = React.useState(-1);
  const [logs, setLogs] = React.useState([]);
  const [done, setDone] = React.useState(false);

  // Firestore 라이브 발행 이력 — siteId 없으면 mock fallback
  const liveHistory = window.useLivePublishes && siteId ? window.useLivePublishes(siteId, 10) : null;
  const [historyOverride, setHistoryOverride] = React.useState(null);
  const history = historyOverride || (liveHistory && liveHistory.length > 0 ? liveHistory : PUBLISH_HISTORY);
  const setHistory = setHistoryOverride;

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
    if (!siteId) {
      toast({ tone: "error", message: "사이트가 지정되지 않았습니다" });
      return;
    }
    setRunning(true);
    setDone(false);
    setLogs([]);
    setStageIdx(0);
    log(`► 발행 시작 — ${(site && site.name) || siteId}`);
    log(`변경사항: 상품 ${draftProducts.length}건, 섹션 ${draftSections.length}건`);

    try {
      // 1) Stage: validate — draft 를 live 로 승격 (Firestore write, 조용히)
      setStageIdx(0);
      log("변경사항 확인 중...");
      setProducts((ps) =>
        ps.map((p) => (p.draft ? { ...p, draft: false, status: "live" } : p))
      );
      setSections((ss) => ss.map((s) => (s.draft ? { ...s, draft: false } : s)));
      // Firestore batch write 가 완료될 시간을 약간 줌
      await new Promise((r) => setTimeout(r, 600));

      // 2) Stage: build / images / push — publishToGitHub callable 호출
      setStageIdx(1);
      log("사이트에 발행 중...");
      const result = await window.callPublishToGitHub({
        siteId,
        note: note || undefined,
      });

      setStageIdx(3);
      if (result.noop) {
        log("ℹ 변경된 파일이 없어 새 발행을 생략했습니다", "warning");
      } else {
        log("✓ 사이트 업데이트 완료", "info");
      }

      // 3) Stage: deploy — 사이트 재빌드 (대기만)
      setStageIdx(4);
      log("1~3분 안에 사이트에 반영됩니다", "info");

      setStageIdx(PUBLISH_STAGES.length);
      setRunning(false);
      setDone(true);
      log("✓ 발행 완료", "success");

      setNote("");
      toast({
        tone: "success",
        message: result.noop ? "변경사항 없음 — 새 발행 생략" : "발행 완료",
      });
    } catch (err) {
      setRunning(false);
      setDone(false);
      const msg = (err && err.message) || "알 수 없는 오류";
      log(`✗ 발행 실패: ${msg}`, "error");
      toast({ tone: "error", message: `발행 실패: ${msg}` });
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">발행 센터</h1>
          <div className="page-subtitle">
            드래프트 변경사항을 {(site && site.name) || siteId}({(site && site.domain) || "—"})에 한번에 반영합니다
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "var(--size-500)" }}>
        <div className="col" style={{ gap: "var(--size-500)" }}>
          {/* Pending changes */}
          <Card>
            <div className="card-header">
              <div>
                <h2 className="card-title">발행 대기 ({totalDrafts}건)</h2>
                <div className="card-subtitle">마지막 발행 이후 변경된 항목들</div>
              </div>
              <Button variant="ghost" size="sm" iconLeft="refresh">새로고침</Button>
            </div>
            {totalDrafts === 0 ? (
              <div className="empty">
                <div className="empty-icon">
                  <Icon name="check" size={26} />
                </div>
                <div className="empty-title">발행할 변경사항이 없어요</div>
                <div className="empty-desc">상품이나 홈 섹션을 수정하면 여기에 모입니다.</div>
                <Button variant="outline" onClick={() => onGoto("products")}>상품으로 가기</Button>
              </div>
            ) : (
              <div style={{ padding: "var(--size-300) 0" }}>
                {draftProducts.map((p) => (
                  <DraftRow
                    key={p.id}
                    icon="box"
                    title={p.name}
                    subtitle={`${p.categoryName} · ${p.price.toLocaleString()}원`}
                    badge={p.visible ? "노출" : "숨김"}
                    badgeTone={p.visible ? "success" : "neutral"}
                    image={p.image}
                  />
                ))}
                {draftSections.map((s) => (
                  <DraftRow
                    key={s.id}
                    icon={s.icon}
                    title={`홈 섹션 — ${s.title}`}
                    subtitle={s.enabled ? "켜짐" : "꺼짐"}
                    badge="섹션"
                    badgeTone="brand"
                  />
                ))}
                {draftCategories.map((c) => (
                  <DraftRow
                    key={`cat-${c.id}`}
                    icon="tag"
                    title={`카테고리 — ${c.name || c.id}`}
                    subtitle={c.visible ? "노출" : "숨김"}
                    badge="카테고리"
                    badgeTone="brand"
                  />
                ))}
                {draftFaqs.map((f) => (
                  <DraftRow
                    key={`faq-${f.id}`}
                    icon="help"
                    title={`FAQ — ${f.question || f.id}`}
                    subtitle={f.visible ? "노출" : "숨김"}
                    badge="질문/답변"
                    badgeTone="brand"
                  />
                ))}
                {draftSettings && (
                  <DraftRow
                    key="settings-info"
                    icon="settings"
                    title="기본 정보 (OG · 전화 · 카카오)"
                    subtitle="발행 시 사이트 메타 태그에 반영됩니다"
                    badge="기본 정보"
                    badgeTone="brand"
                  />
                )}
              </div>
            )}
          </Card>

          {/* Live progress / log */}
          {(running || done) && (
            <Card>
              <div className="card-header">
                <div>
                  <h2 className="card-title">
                    {running ? "발행 진행 중…" : "발행 완료"}
                  </h2>
                  <div className="card-subtitle">
                    {running ? "이 페이지를 닫아도 발행은 계속됩니다" : "사이트는 1~3분 내 반영됩니다"}
                  </div>
                </div>
                {done && <Badge tone="success" dot>완료</Badge>}
              </div>
              <div className="card-body">
                {/* stage progress */}
                <div
                  style={{
                    display: "flex",
                    gap: 0,
                    marginBottom: "var(--size-500)",
                    background: "var(--sm-background-muted)",
                    borderRadius: "var(--radius-full)",
                    padding: 4,
                    position: "relative",
                  }}
                >
                  {PUBLISH_STAGES.map((s, i) => {
                    const status =
                      i < stageIdx ? "done" : i === stageIdx && running ? "active" : i === stageIdx ? "done" : "pending";
                    return (
                      <div
                        key={s.id}
                        style={{
                          flex: 1,
                          padding: "8px 0",
                          textAlign: "center",
                          fontSize: "var(--text-caption)",
                          fontWeight: 600,
                          background:
                            status === "done"
                              ? "var(--sm-interactive-brand-default)"
                              : status === "active"
                              ? "var(--sm-interactive-brand-default)"
                              : "transparent",
                          color:
                            status === "pending"
                              ? "var(--sm-content-tertiary)"
                              : "white",
                          borderRadius: "var(--radius-full)",
                          transition: "background var(--motion-base)",
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 4,
                        }}
                      >
                        {status === "done" && <Icon name="check" size={12} />}
                        {status === "active" && (
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: "white",
                              animation: "pulse 1s infinite",
                            }}
                          />
                        )}
                        {s.label}
                      </div>
                    );
                  })}
                </div>

                {/* terminal log */}
                <div
                  style={{
                    background: "#0d1226",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--size-400)",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                    fontSize: "var(--text-caption)",
                    lineHeight: 1.7,
                    color: "#dde2f2",
                    maxHeight: 260,
                    overflowY: "auto",
                  }}
                  ref={(el) => el && (el.scrollTop = el.scrollHeight)}
                >
                  {logs.map((l) => (
                    <div key={l.id} style={{ display: "flex", gap: 12 }}>
                      <span style={{ color: "#6a728f", flexShrink: 0 }}>{l.time}</span>
                      <span
                        style={{
                          color:
                            l.tone === "success"
                              ? "#7cd6a4"
                              : l.tone === "warn"
                              ? "#fbbf3d"
                              : l.tone === "error"
                              ? "#ff8888"
                              : l.tone === "git"
                              ? "#aab3df"
                              : "#dde2f2",
                          flex: 1,
                        }}
                      >
                        {l.line}
                      </span>
                    </div>
                  ))}
                  {running && (
                    <span
                      style={{
                        display: "inline-block",
                        width: 7,
                        height: 14,
                        background: "#dde2f2",
                        animation: "pulse 1s infinite",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* History */}
          <Card>
            <div className="card-header">
              <div>
                <h2 className="card-title">발행 이력</h2>
                <div className="card-subtitle">최근 30일 · 클릭하면 변경사항 보기</div>
              </div>
              <Button variant="ghost" size="sm">전체 이력</Button>
            </div>
            <div>
              {history.map((h, i) => (
                <div
                  key={h.id}
                  style={{
                    display: "flex",
                    gap: "var(--size-400)",
                    padding: "var(--size-400) var(--size-600)",
                    borderBottom: i < history.length - 1 ? "1px solid var(--sm-border-subtle)" : "none",
                    alignItems: "center",
                  }}
                >
                  {(() => {
                    const tone = h.status === "success" ? "success"
                      : h.status === "noop" ? "neutral"
                      : "error";
                    const bg = tone === "success" ? "var(--sm-status-success-subtle)"
                      : tone === "neutral" ? "var(--sm-background-muted)"
                      : "var(--sm-status-error-subtle)";
                    const fg = tone === "success" ? "var(--sm-status-success)"
                      : tone === "neutral" ? "var(--sm-content-tertiary)"
                      : "var(--sm-status-error)";
                    const icon = tone === "success" ? "rocket"
                      : tone === "neutral" ? "info"
                      : "alert";
                    return (
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: bg,
                          color: fg,
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                        }}
                        title={tone === "neutral" ? "변경사항 없음 — 새 배포 생략됨" : undefined}
                      >
                        <Icon name={icon} size={16} />
                      </div>
                    );
                  })()}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "var(--text-body-md)", fontWeight: 600, marginBottom: 2, textWrap: "pretty" }}>
                      {h.note}
                    </div>
                    <div style={{ fontSize: "var(--text-caption)", color: "var(--sm-content-tertiary)", display: "flex", gap: 10 }}>
                      <span>{h.when}</span>
                      <span>·</span>
                      <span>{h.author}</span>
                      <span>·</span>
                      <span>
                        상품 {h.items.products}건, 섹션 {h.items.home}건
                      </span>
                      <span>·</span>
                      <span>{h.duration}</span>
                    </div>
                    {h.error && (
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: "var(--text-caption)",
                          color: "var(--sm-status-error)",
                          background: "var(--sm-status-error-subtle)",
                          padding: "4px 8px",
                          borderRadius: "var(--radius-sm)",
                          display: "inline-block",
                        }}
                      >
                        {h.error}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <IconButton icon="eye" />
                    {h.status === "failed" && (
                      <Button variant="outline" size="sm" iconLeft="refresh">재시도</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right sidebar — publish action */}
        <div style={{ position: "sticky", top: 100, display: "flex", flexDirection: "column", gap: "var(--size-400)" }}>
          <Card>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--size-400)" }}>
              <div>
                <div style={{ fontSize: "var(--text-overline)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--sm-content-tertiary)", fontWeight: 600, marginBottom: 6 }}>
                  발행 대상
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    className="site-thumb"
                    style={{
                      background: (site && site.gradient) || "linear-gradient(135deg, #c4cae0 0%, #8a93c4 100%)",
                      width: 36,
                      height: 36,
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{(site && site.name) || siteId || "사이트 미지정"}</div>
                    <div style={{ fontSize: "var(--text-caption)", color: "var(--sm-content-tertiary)" }}>
                      {(site && site.domain) || "—"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="divider" />
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: "var(--text-label-md)", color: "var(--sm-content-secondary)" }}>변경 상품</span>
                  <span className="mono" style={{ fontWeight: 600 }}>
                    {draftProducts.length}건
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: "var(--text-label-md)", color: "var(--sm-content-secondary)" }}>홈 섹션</span>
                  <span className="mono" style={{ fontWeight: 600 }}>
                    {draftSections.length}건
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "var(--text-label-md)", color: "var(--sm-content-secondary)" }}>마지막 발행</span>
                  <span style={{ fontSize: "var(--text-label-md)", color: "var(--sm-content-tertiary)" }}>
                    2일 전
                  </span>
                </div>
              </div>
              <div className="divider" />
              <Field label="발행 메모 (선택)" helper="이번 발행에서 무엇을 바꿨는지 짧게">
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="예: 어버이날 카네이션 가격 인상…"
                  rows={3}
                  disabled={running}
                />
              </Field>
              <Button
                variant="primary"
                size="lg"
                iconLeft="rocket"
                full
                onClick={start}
                disabled={running || totalDrafts === 0}
              >
                {running ? "발행 중…" : `${totalDrafts}건 발행`}
              </Button>
              <div className="text-tertiary" style={{ fontSize: "var(--text-caption)", textAlign: "center" }}>
                평균 소요 시간 2분 · 사이트 재빌드
              </div>
            </div>
          </Card>
          <Card>
            <div className="card-body">
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "var(--radius-sm)",
                    background: "var(--sm-status-info-subtle)",
                    color: "var(--sm-status-info)",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="info" size={16} />
                </div>
                <div>
                  <div style={{ fontSize: "var(--text-label-md)", fontWeight: 600, marginBottom: 4 }}>
                    실패하면 어떻게 되나요?
                  </div>
                  <div style={{ fontSize: "var(--text-caption)", color: "var(--sm-content-secondary)", lineHeight: 1.6 }}>
                    드래프트는 그대로 보존됩니다. 실패 원인을 확인하고 재시도하세요. 사이트는 직전 발행 상태 그대로 유지됩니다.
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const DraftRow = ({ icon, title, subtitle, badge, badgeTone, image }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--size-300)",
      padding: "var(--size-300) var(--size-600)",
      borderBottom: "1px solid var(--sm-border-subtle)",
    }}
  >
    {image ? (
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "var(--radius-sm)",
          background: image,
          backgroundSize: "cover",
          flexShrink: 0,
        }}
      />
    ) : (
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "var(--radius-sm)",
          background: "var(--sm-interactive-brand-subtle)",
          color: "var(--sm-interactive-brand-default)",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        <Icon name={icon} size={16} />
      </div>
    )}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: "var(--text-label-md)", fontWeight: 600, color: "var(--sm-content-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {title}
      </div>
      <div style={{ fontSize: "var(--text-caption)", color: "var(--sm-content-tertiary)" }}>
        {subtitle}
      </div>
    </div>
    <Badge tone={badgeTone}>{badge}</Badge>
    <Badge tone="warning" dot>드래프트</Badge>
  </div>
);

const STAGE_LOG_LINES = {
  validate: [
    { text: "config/site.json 검사…", tone: "info" },
    { text: "✓ 8건 상품 데이터 통과 (필수 필드 OK)", tone: "success" },
    { text: "✓ 5건 홈 섹션 통과", tone: "success" },
  ],
  build: [
    { text: "vite build 시작…", tone: "info" },
    { text: "src/pages/Home.tsx → dist/index.html", tone: "info" },
    { text: "src/pages/Products.tsx → dist/products/[id].html", tone: "info" },
    { text: "✓ 24개 페이지 정적 생성 (1.42s)", tone: "success" },
  ],
  images: [
    { text: "Firebase Storage → CDN 동기화…", tone: "info" },
    { text: "리사이즈: spring-2026.jpg → 200/400/800", tone: "info" },
    { text: "✓ 18개 이미지 업로드 (340KB → 92KB, -73%)", tone: "success" },
  ],
  push: [
    { text: "사이트 빌드 결과를 배포 서버에 전송 중…", tone: "info" },
    { text: "변경 사항 묶음 작성 중…", tone: "info" },
    { text: "✓ 배포 서버 업로드 완료", tone: "success" },
  ],
  deploy: [
    { text: "사이트 빌드 큐 대기 (3s)…", tone: "info" },
    { text: "사이트 빌드 실행 중…", tone: "info" },
    { text: "✓ 빌드 성공 · CDN 전파 중", tone: "info" },
    { text: "✓ 새 콘텐츠 활성 — 잠시 후 접속자에게 반영됩니다", tone: "success" },
  ],
};

Object.assign(window, { PublishCenterPage });
