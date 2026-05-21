/* eslint-disable */
// S02 — 사이트 관리 (super admin)

const SITE_META = {
  dohwawon: { type: "꽃집", products: 8, users: 2, lastPub: "2일 전", traffic: "1.2k" },
  bell_cake: { type: "케이크 전문점", products: 14, users: 1, lastPub: "5일 전", traffic: "840" },
  PARKHAD: { type: "헤어샵", products: 22, users: 2, lastPub: "1일 전", traffic: "2.1k" },
  flower_example: { type: "플라워 샘플", products: 4, users: 1, lastPub: "2주 전", traffic: "—" },
  greenlight_art: { type: "미술학원", products: 12, users: 1, lastPub: "1주 전", traffic: "560" },
};

const SitesManagePage = () => {
  const [addOpen, setAddOpen] = React.useState(false);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">사이트 관리</h1>
          <div className="page-subtitle">
            5개 사이트 운영 중 · 자동 발행 활성
          </div>
        </div>
        <div className="page-actions">
          <Button variant="outline" iconLeft="refresh">연결 상태 확인</Button>
          <Button variant="primary" iconLeft="plus" onClick={() => setAddOpen(true)}>
            사이트 추가
          </Button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--size-400)" }}>
        {SITES.map((s) => {
          const meta = SITE_META[s.id] || {};
          return (
            <div className="card" key={s.id}>
              <div style={{ aspectRatio: "5 / 2", background: s.gradient, position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, padding: "var(--size-400)", display: "flex", flexDirection: "column", justifyContent: "space-between", color: "white" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Badge tone="neutral" style={{ background: "rgba(0,0,0,0.25)", color: "white", backdropFilter: "blur(8px)" }}>
                      {meta.type}
                    </Badge>
                    <span
                      style={{
                        background: "rgba(0,0,0,0.3)",
                        padding: "4px 8px",
                        borderRadius: "var(--radius-full)",
                        fontSize: 11,
                        backdropFilter: "blur(8px)",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5fff8e", boxShadow: "0 0 8px #5fff8e" }} />
                      라이브
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.015em" }}>{s.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>{s.domain}</div>
                  </div>
                </div>
              </div>
              <div style={{ padding: "var(--size-400)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: "var(--size-400)" }}>
                  <SiteStat icon="box" value={meta.products} label="상품" />
                  <SiteStat icon="users" value={meta.users} label="운영자" />
                  <SiteStat icon="eye" value={meta.traffic} label="이번 주" />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--size-300) 0", borderTop: "1px solid var(--sm-border-subtle)", fontSize: 12, color: "var(--sm-content-tertiary)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="link" size={12} /> {s.id}
                  </span>
                  <span>{meta.lastPub} 발행</span>
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  <Button variant="outline" size="sm" full iconLeft="settings">설정</Button>
                  <Button variant="outline" size="sm" full iconLeft="link">방문</Button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add new card */}
        <button
          onClick={() => setAddOpen(true)}
          style={{
            border: "2px dashed var(--sm-border-default)",
            borderRadius: "var(--radius-lg)",
            background: "transparent",
            minHeight: 280,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            color: "var(--sm-content-secondary)",
            cursor: "pointer",
            padding: 24,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "var(--sm-background-subtle)",
              display: "grid",
              placeItems: "center",
              color: "var(--sm-interactive-brand-default)",
            }}
          >
            <Icon name="plus" size={24} />
          </div>
          <div style={{ fontWeight: 600 }}>새 사이트 추가</div>
          <div style={{ fontSize: 12, color: "var(--sm-content-tertiary)", textAlign: "center", maxWidth: 220 }}>
            siteId · 운영자를 정하면 같은 어드민에서 관리할 수 있어요
          </div>
        </button>
      </div>

      <AddSiteModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
};

const SiteStat = ({ icon, value, label }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-start" }}>
    <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--sm-content-tertiary)", fontSize: 11 }}>
      <Icon name={icon} size={12} /> {label}
    </span>
    <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.015em" }} className="mono">
      {value}
    </span>
  </div>
);

const AddSiteModal = ({ open, onClose }) => {
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState({
    name: "",
    siteId: "",
    type: "flower",
    domain: "",
    repo: "",
  });
  const toast = useToast();

  React.useEffect(() => {
    if (open) {
      setStep(1);
      setForm({ name: "", siteId: "", type: "flower", domain: "", repo: "" });
    }
  }, [open]);

  const submit = () => {
    onClose();
    toast({ tone: "success", message: `'${form.name}' 사이트가 추가되었습니다 — 배포 채널 연결 중` });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="새 사이트 추가"
      desc={step === 1 ? "기본 정보를 입력하세요." : step === 2 ? "배포 채널을 연결하세요." : "확인 후 활성화합니다."}
      size="md"
      footer={
        <>
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>이전</Button>
          ) : (
            <Button variant="outline" onClick={onClose}>취소</Button>
          )}
          {step < 3 ? (
            <Button variant="primary" onClick={() => setStep(step + 1)} disabled={!form.name || !form.siteId}>
              다음
            </Button>
          ) : (
            <Button variant="primary" iconLeft="check" onClick={submit}>
              사이트 추가
            </Button>
          )}
        </>
      }
    >
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: "var(--radius-full)",
              background: step >= i ? "var(--sm-interactive-brand-default)" : "var(--sm-background-muted)",
              transition: "background var(--motion-base)",
            }}
          />
        ))}
      </div>

      {step === 1 && (
        <div style={{ display: "grid", gap: "var(--size-400)" }}>
          <Field label="사이트 이름" required helper="고객에게 보이는 이름 (예: 도화원플라워)">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="도화원플라워" />
          </Field>
          <Field label="siteId" required helper="영문 소문자·하이픈. URL과 DB key에 사용됩니다.">
            <Input
              value={form.siteId}
              onChange={(e) => setForm({ ...form, siteId: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
              placeholder="dohwawon"
              prefix={<span style={{ color: "var(--sm-content-tertiary)", fontSize: 13 }}>id:</span>}
            />
          </Field>
          <Field label="사이트 타입" helper="유형에 따라 노출되는 추가 필드가 달라집니다">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
              {[
                { id: "flower", label: "꽃집", icon: "flower" },
                { id: "cake", label: "케이크/베이커리", icon: "star" },
                { id: "hair", label: "헤어샵", icon: "sparkle" },
                { id: "academy", label: "학원/교실", icon: "book" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setForm({ ...form, type: t.id })}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "var(--size-300)",
                    borderRadius: "var(--radius-md)",
                    border: `1px solid ${form.type === t.id ? "var(--sm-interactive-brand-default)" : "var(--sm-border-default)"}`,
                    background: form.type === t.id ? "var(--sm-interactive-brand-subtle)" : "transparent",
                    color: form.type === t.id ? "var(--sm-interactive-brand-default)" : "var(--sm-content-secondary)",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  <Icon name={t.icon} size={16} />
                  {t.label}
                </button>
              ))}
            </div>
          </Field>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: "grid", gap: "var(--size-400)" }}>
          <div
            style={{
              padding: "var(--size-400)",
              background: "var(--sm-status-info-subtle)",
              border: "1px solid var(--sm-status-info)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <Icon name="link" size={18} style={{ color: "var(--sm-status-info)", flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 13, color: "var(--sm-content-secondary)", lineHeight: 1.55 }}>
              사이트 코드 저장소를 연결합니다. 발행 시 자동으로 사이트가 갱신됩니다.
            </div>
          </div>
          <Field label="저장소 식별자" required helper="발행 대상 저장소 (관리자만 보임)">
            <Input
              value={form.repo}
              onChange={(e) => setForm({ ...form, repo: e.target.value })}
              placeholder="easysite/dohwawon"
              prefix={<Icon name="link" size={16} />}
            />
          </Field>
          <Field label="배포 도메인" helper="비워두면 기본 도메인이 사용됩니다">
            <Input
              value={form.domain}
              onChange={(e) => setForm({ ...form, domain: e.target.value })}
              placeholder="dohwawon.kr"
              prefix={<span style={{ color: "var(--sm-content-tertiary)", fontSize: 13 }}>https://</span>}
            />
          </Field>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: "grid", gap: 12, fontSize: 14 }}>
          <Row k="사이트 이름" v={form.name} />
          <Row k="siteId" v={form.siteId} />
          <Row k="타입" v={form.type} />
          <Row k="저장소" v={form.repo || "(미설정)"} />
          <Row k="도메인" v={form.domain || `${form.siteId}.easysite.app`} />
          <div className="divider" style={{ margin: "8px 0" }} />
          <div
            style={{
              padding: "var(--size-400)",
              background: "var(--sm-background-subtle)",
              borderRadius: "var(--radius-md)",
              fontSize: 13,
              color: "var(--sm-content-secondary)",
              lineHeight: 1.55,
            }}
          >
            추가 시 새 사이트는 <b>비활성</b> 상태로 만들어지고, 운영자를 한 명 이상 부여한 후 자동 활성화됩니다. 초기 콘텐츠는 운영자가 등록합니다.
          </div>
        </div>
      )}
    </Modal>
  );
};

const Row = ({ k, v }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span style={{ color: "var(--sm-content-tertiary)" }}>{k}</span>
    <span className="mono" style={{ fontWeight: 600 }}>{v}</span>
  </div>
);

Object.assign(window, { SitesManagePage });
