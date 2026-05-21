/* eslint-disable */
// S03 — 변경 이력 / 감사 로그 with diff viewer

const AUDIT_ENTRIES = [
  {
    id: "a_032",
    when: "방금 전",
    fullDate: "2026-05-21 14:22:08",
    actor: { name: "박소연", avatar: "박", color: "linear-gradient(135deg, #f4c8d0, #d36a8a)" },
    site: "dohwawon",
    action: "product.update",
    actionLabel: "상품 수정",
    target: "봄의 인사 — 라넌큘러스 꽃다발",
    targetId: "p_001",
    diff: {
      price: { before: 56000, after: 58000 },
      tags: { before: ["봄", "선물"], after: ["봄", "베스트", "선물"] },
    },
    state: "drafted",
  },
  {
    id: "a_031",
    when: "1시간 전",
    fullDate: "2026-05-21 13:08:14",
    actor: { name: "박소연", avatar: "박", color: "linear-gradient(135deg, #f4c8d0, #d36a8a)" },
    site: "dohwawon",
    action: "bulk.price",
    actionLabel: "일괄 가격 조정",
    target: "꽃다발 카테고리 5개 상품",
    diff: {
      mode: { before: "—", after: "+10%" },
      count: { before: "—", after: "5개" },
      total: { before: "264,000원", after: "290,400원" },
    },
    state: "drafted",
  },
  {
    id: "a_030",
    when: "2시간 전",
    fullDate: "2026-05-21 12:14:55",
    actor: { name: "박소연", avatar: "박", color: "linear-gradient(135deg, #f4c8d0, #d36a8a)" },
    site: "dohwawon",
    action: "home.edit",
    actionLabel: "홈 섹션 수정",
    target: "히어로 섹션 헤드라인",
    diff: {
      headline: { before: "봄, 한 다발씩 천천히", after: "오늘의 봄, 한 다발" },
    },
    state: "drafted",
  },
  {
    id: "a_029",
    when: "5월 19일 09:42",
    fullDate: "2026-05-19 09:42:00",
    actor: { name: "박소연", avatar: "박", color: "linear-gradient(135deg, #f4c8d0, #d36a8a)" },
    site: "dohwawon",
    action: "publish.success",
    actionLabel: "발행 성공",
    target: "어버이날 카네이션 꽃바구니 가격 인상",
    items: { products: 6, home: 1 },
    state: "published",
  },
  {
    id: "a_028",
    when: "5월 17일 21:08",
    fullDate: "2026-05-17 21:08:33",
    actor: { name: "박소연", avatar: "박", color: "linear-gradient(135deg, #f4c8d0, #d36a8a)" },
    site: "dohwawon",
    action: "product.create",
    actionLabel: "상품 등록",
    target: "튤립 꽃다발 — 무지개 믹스",
    targetId: "p_006",
    state: "published",
  },
  {
    id: "a_027",
    when: "5월 15일 14:21",
    fullDate: "2026-05-15 14:21:09",
    actor: { name: "Cris", avatar: "C", color: "linear-gradient(135deg, #1f2a52, #0d1226)" },
    site: "*",
    action: "user.invite",
    actionLabel: "사용자 초대",
    target: "jisoo@dohwawon.kr (에디터)",
    state: "info",
  },
  {
    id: "a_026",
    when: "5월 12일 18:21",
    fullDate: "2026-05-12 18:21:55",
    actor: { name: "박소연", avatar: "박", color: "linear-gradient(135deg, #f4c8d0, #d36a8a)" },
    site: "dohwawon",
    action: "publish.failed",
    actionLabel: "발행 실패",
    target: "어머니날 배너 임시 게재",
    error: "GitHub 토큰 만료 — 슈퍼 어드민에게 갱신 요청",
    state: "failed",
  },
  {
    id: "a_025",
    when: "5월 11일 11:30",
    fullDate: "2026-05-11 11:30:11",
    actor: { name: "박정훈", avatar: "박", color: "linear-gradient(135deg, #c9cad0, #1a1d24)" },
    site: "parkhad",
    action: "product.delete",
    actionLabel: "상품 삭제",
    target: "여름 시즌 한정 트리트먼트",
    state: "published",
  },
  {
    id: "a_024",
    when: "5월 10일 09:14",
    fullDate: "2026-05-10 09:14:02",
    actor: { name: "박소연", avatar: "박", color: "linear-gradient(135deg, #f4c8d0, #d36a8a)" },
    site: "dohwawon",
    action: "category.create",
    actionLabel: "카테고리 추가",
    target: "봄",
    state: "published",
  },
];

const ACTION_META = {
  "product.update": { icon: "edit", tone: "info" },
  "product.create": { icon: "plus", tone: "success" },
  "product.delete": { icon: "trash", tone: "danger" },
  "bulk.price": { icon: "bolt", tone: "warning" },
  "home.edit": { icon: "home", tone: "info" },
  "category.create": { icon: "tag", tone: "success" },
  "publish.success": { icon: "rocket", tone: "success" },
  "publish.failed": { icon: "alert", tone: "danger" },
  "user.invite": { icon: "users", tone: "brand" },
};

const AuditPage = () => {
  const [siteFilter, setSiteFilter] = React.useState("all");
  const [actionFilter, setActionFilter] = React.useState("all");
  const [selected, setSelected] = React.useState(null);
  const [range, setRange] = React.useState("30d");

  const filtered = AUDIT_ENTRIES.filter((e) => {
    if (siteFilter !== "all" && e.site !== siteFilter && e.site !== "*") return false;
    if (actionFilter !== "all" && !e.action.startsWith(actionFilter)) return false;
    return true;
  });

  // Group by day
  const byDay = {};
  filtered.forEach((e) => {
    const day = e.fullDate.slice(0, 10);
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(e);
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">변경 이력</h1>
          <div className="page-subtitle">
            누가 무엇을 언제 바꿨는지 — 발행 전 드래프트도 모두 기록됩니다
          </div>
        </div>
        <div className="page-actions">
          <Button variant="outline" iconLeft="upload">CSV로 내보내기</Button>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--size-300)", marginBottom: "var(--size-500)" }}>
        <AuditStat label="총 활동" value={AUDIT_ENTRIES.length} icon="clock" />
        <AuditStat label="발행" value={AUDIT_ENTRIES.filter((e) => e.action.startsWith("publish")).length} icon="rocket" tone="brand" />
        <AuditStat label="실패" value={AUDIT_ENTRIES.filter((e) => e.state === "failed").length} icon="alert" tone="danger" />
        <AuditStat label="드래프트" value={AUDIT_ENTRIES.filter((e) => e.state === "drafted").length} icon="edit" tone="warning" />
      </div>

      {/* Filter row */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div className="tabs">
          {[
            { id: "all", label: "전체" },
            { id: "product", label: "상품" },
            { id: "home", label: "홈 섹션" },
            { id: "category", label: "카테고리" },
            { id: "publish", label: "발행" },
            { id: "user", label: "사용자" },
            { id: "bulk", label: "일괄 작업" },
          ].map((a) => (
            <button key={a.id} className={`tab ${actionFilter === a.id ? "active" : ""}`} onClick={() => setActionFilter(a.id)}>
              {a.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <Select value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)} style={{ width: 180 }}>
          <option value="all">모든 사이트</option>
          {SITES.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </Select>
        <Select value={range} onChange={(e) => setRange(e.target.value)} style={{ width: 140 }}>
          <option value="1d">오늘</option>
          <option value="7d">7일</option>
          <option value="30d">30일</option>
          <option value="all">전체</option>
        </Select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 420px" : "1fr", gap: "var(--size-500)", alignItems: "flex-start" }}>
        {/* Timeline */}
        <Card>
          <div style={{ padding: 0 }}>
            {Object.entries(byDay).map(([day, entries], gi) => (
              <div key={day}>
                <div
                  style={{
                    padding: "var(--size-400) var(--size-500) var(--size-200)",
                    fontSize: "var(--text-overline)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontWeight: 600,
                    color: "var(--sm-content-tertiary)",
                    borderTop: gi > 0 ? "1px solid var(--sm-border-subtle)" : "none",
                    background: "var(--sm-background-subtle)",
                  }}
                >
                  {formatDay(day)}
                </div>
                <div style={{ position: "relative" }}>
                  {/* timeline rail */}
                  <div
                    style={{
                      position: "absolute",
                      left: 40,
                      top: 0,
                      bottom: 0,
                      width: 1,
                      background: "var(--sm-border-subtle)",
                    }}
                  />
                  {entries.map((e) => (
                    <AuditRow key={e.id} entry={e} selected={selected?.id === e.id} onClick={() => setSelected(e)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {selected && (
          <AuditDetail entry={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </div>
  );
};

const formatDay = (iso) => {
  const date = new Date(iso);
  const today = new Date();
  const diff = Math.round((today - date) / 86400000);
  if (diff === 0) return "오늘";
  if (diff === 1) return "어제";
  return date.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });
};

const AuditRow = ({ entry, selected, onClick }) => {
  const meta = ACTION_META[entry.action] || { icon: "info", tone: "neutral" };
  const site = SITES.find((s) => s.id === entry.site);
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        gap: "var(--size-400)",
        padding: "var(--size-300) var(--size-500)",
        width: "100%",
        textAlign: "left",
        background: selected ? "var(--sm-interactive-brand-subtle)" : "transparent",
        borderBottom: "1px solid var(--sm-border-subtle)",
        position: "relative",
        transition: "background var(--motion-fast)",
        cursor: "pointer",
      }}
    >
      {/* Time gutter + dot */}
      <div style={{ width: 80, fontSize: "var(--text-caption)", color: "var(--sm-content-tertiary)", paddingTop: 4 }}>
        {entry.fullDate.slice(11, 16)}
      </div>
      <div style={{ position: "relative", marginLeft: -50, marginRight: 8, width: 24, display: "grid", placeItems: "center" }}>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "var(--sm-background-default)",
            border: `2px solid var(--sm-status-${meta.tone === "danger" ? "error" : meta.tone === "warning" ? "warning" : meta.tone === "success" ? "success" : meta.tone === "info" ? "info" : "brand"})`.replace("--sm-status-brand", "--sm-interactive-brand-default"),
            display: "grid",
            placeItems: "center",
            zIndex: 1,
          }}
        >
          <Icon
            name={meta.icon}
            size={11}
            style={{
              color:
                meta.tone === "danger" ? "var(--sm-status-error)" :
                meta.tone === "warning" ? "var(--sm-status-warning)" :
                meta.tone === "success" ? "var(--sm-status-success)" :
                meta.tone === "info" ? "var(--sm-status-info)" :
                "var(--sm-interactive-brand-default)",
            }}
          />
        </div>
      </div>
      <div className="avatar" style={{ width: 28, height: 28, fontSize: 11, background: entry.actor.color, flexShrink: 0 }}>
        {entry.actor.avatar}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <span style={{ fontWeight: 600, fontSize: "var(--text-body-md)" }}>{entry.actor.name}</span>
          <span style={{ color: "var(--sm-content-secondary)", fontSize: "var(--text-body-md)" }}>
            {entry.actionLabel}
          </span>
          {entry.state === "drafted" && <Badge tone="warning" dot>드래프트</Badge>}
          {entry.state === "failed" && <Badge tone="danger" dot>실패</Badge>}
        </div>
        <div style={{ fontSize: "var(--text-body-sm)", color: "var(--sm-content-secondary)", textWrap: "pretty" }}>
          <b>{entry.target}</b>
          {entry.error && <span style={{ color: "var(--sm-status-error)" }}> — {entry.error}</span>}
        </div>
      </div>
      {site && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--sm-content-tertiary)" }}>
          <span style={{ width: 14, height: 14, borderRadius: "50%", background: site.gradient, flexShrink: 0 }} />
          {site.name}
        </div>
      )}
      {entry.site === "*" && <Badge tone="brand">슈퍼</Badge>}
    </button>
  );
};

const AuditStat = ({ label, value, icon, tone }) => {
  const toneStyles = {
    brand: { bg: "var(--sm-interactive-brand-subtle)", color: "var(--sm-interactive-brand-default)" },
    danger: { bg: "var(--sm-status-error-subtle)", color: "var(--sm-status-error)" },
    warning: { bg: "var(--sm-status-warning-subtle)", color: "var(--sm-status-warning)" },
  };
  const t = toneStyles[tone];
  return (
    <div className="card" style={{ padding: "var(--size-400)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: "var(--text-label-md)", color: "var(--sm-content-secondary)", fontWeight: 600 }}>{label}</span>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "var(--radius-sm)",
            background: t?.bg || "var(--sm-background-muted)",
            color: t?.color || "var(--sm-content-tertiary)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Icon name={icon} size={14} />
        </div>
      </div>
      <div className="mono" style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>
        {value}
      </div>
    </div>
  );
};

const AuditDetail = ({ entry, onClose }) => {
  const meta = ACTION_META[entry.action] || { icon: "info", tone: "neutral" };
  return (
    <div style={{ position: "sticky", top: 100 }}>
      <Card>
        <div style={{ padding: "var(--size-500)", borderBottom: "1px solid var(--sm-border-subtle)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Badge tone={meta.tone === "danger" ? "danger" : meta.tone === "warning" ? "warning" : meta.tone === "success" ? "success" : meta.tone === "info" ? "info" : "brand"} dot>
              {entry.actionLabel}
            </Badge>
            <IconButton icon="x" onClick={onClose} />
          </div>
          <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.015em", marginBottom: 8, textWrap: "pretty" }}>
            {entry.target}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--sm-content-tertiary)" }}>
            <div className="avatar" style={{ width: 22, height: 22, fontSize: 10, background: entry.actor.color }}>
              {entry.actor.avatar}
            </div>
            <span>{entry.actor.name}</span>
            <span>·</span>
            <span className="mono">{entry.fullDate}</span>
          </div>
        </div>
        <div className="card-body">
          {entry.diff ? (
            <div>
              <div style={{ fontSize: "var(--text-overline)", fontWeight: 600, color: "var(--sm-content-tertiary)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
                변경 내역 (diff)
              </div>
              <div
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 12,
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--sm-border-subtle)",
                  overflow: "hidden",
                }}
              >
                {Object.entries(entry.diff).map(([key, val], i) => (
                  <div key={key} style={{ borderTop: i > 0 ? "1px solid var(--sm-border-subtle)" : "none" }}>
                    <div style={{ padding: "6px 12px", background: "var(--sm-background-subtle)", fontWeight: 600, color: "var(--sm-content-secondary)" }}>
                      {key}
                    </div>
                    <div style={{ padding: "8px 12px", background: "rgba(179, 38, 30, 0.06)", color: "var(--sm-status-error)", display: "flex", gap: 8 }}>
                      <span style={{ opacity: 0.6 }}>−</span>
                      <span style={{ flex: 1, textWrap: "pretty" }}>{JSON.stringify(val.before)}</span>
                    </div>
                    <div style={{ padding: "8px 12px", background: "rgba(21, 122, 71, 0.06)", color: "var(--sm-status-success)", display: "flex", gap: 8 }}>
                      <span style={{ opacity: 0.6 }}>+</span>
                      <span style={{ flex: 1, textWrap: "pretty" }}>{JSON.stringify(val.after)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : entry.error ? (
            <div style={{ padding: "var(--size-400)", background: "var(--sm-status-error-subtle)", borderRadius: "var(--radius-md)" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Icon name="alert" size={18} style={{ color: "var(--sm-status-error)", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 600, color: "var(--sm-status-error)", marginBottom: 4 }}>발행 실패</div>
                  <div style={{ fontSize: 13, color: "var(--sm-content-secondary)" }}>{entry.error}</div>
                </div>
              </div>
            </div>
          ) : entry.items ? (
            <div style={{ display: "grid", gap: 8 }}>
              <Row k="발행된 상품" v={`${entry.items.products}건`} />
              <Row k="홈 섹션" v={`${entry.items.home}건`} />
              <Row k="결과" v="모든 변경사항이 사이트에 반영됨" />
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "var(--sm-content-secondary)", lineHeight: 1.6 }}>
              이 작업은 즉시 적용되었습니다. 추가 세부 정보가 없습니다.
            </div>
          )}
        </div>
        <div className="card-footer" style={{ justifyContent: "space-between" }}>
          {entry.state === "failed" ? (
            <Button variant="outline" size="sm" iconLeft="refresh">재시도</Button>
          ) : (
            <Button variant="ghost" size="sm" iconLeft="refresh">롤백</Button>
          )}
          <Button variant="ghost" size="sm" iconLeft="copy">로그 ID 복사</Button>
        </div>
      </Card>
    </div>
  );
};

Object.assign(window, { AuditPage });
