/* eslint-disable */
// A01 — 계정 설정

const AccountPage = () => {
  const [name, setName] = React.useState("박소연");
  const [email] = React.useState("park@dohwawon.kr");
  const [resetSent, setResetSent] = React.useState(false);
  const [notif, setNotif] = React.useState({
    publishSuccess: true,
    publishFailed: true,
    weeklyDigest: false,
    invitation: true,
  });
  const [theme, setTheme] = React.useState("system");
  const [language, setLanguage] = React.useState("ko");
  const toast = useToast();

  const sendReset = () => {
    setResetSent(true);
    toast({ tone: "info", message: `${email}로 비밀번호 재설정 메일을 보냈습니다` });
  };

  const saveProfile = () => {
    toast({ tone: "success", message: "프로필을 저장했습니다" });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">계정 설정</h1>
          <div className="page-subtitle">표시 이름·비밀번호·알림을 관리합니다</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "var(--size-600)", alignItems: "flex-start" }}>
        {/* Sub-nav */}
        <nav style={{ position: "sticky", top: 100, display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { id: "profile", label: "프로필" },
            { id: "security", label: "보안" },
            { id: "notif", label: "알림" },
            { id: "pref", label: "환경 설정" },
            { id: "danger", label: "위험 영역" },
          ].map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              style={{
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                fontSize: 14,
                color: "var(--sm-content-secondary)",
                fontWeight: 500,
              }}
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--size-500)" }}>
          {/* Profile */}
          <Card id="profile">
            <div className="card-header">
              <h2 className="card-title">프로필</h2>
            </div>
            <div className="card-body">
              <div style={{ display: "flex", gap: "var(--size-500)", marginBottom: "var(--size-500)" }}>
                <div className="avatar" style={{ width: 80, height: 80, fontSize: 32, background: "linear-gradient(135deg, #f4c8d0, #d36a8a)" }}>
                  박
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{name}</div>
                  <div style={{ fontSize: 13, color: "var(--sm-content-tertiary)" }}>
                    오너 · 도화원플라워에서 12회 발행 · 가입 2024년 3월
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <Badge tone="brand" dot>오너</Badge>
                    <Badge tone="success" dot>활성</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" iconLeft="camera">사진 변경</Button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--size-400)" }}>
                <Field label="표시 이름" helper="발행 이력에 표시됩니다">
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </Field>
                <Field label="이메일" helper="이메일 변경은 슈퍼 어드민에게 요청">
                  <Input value={email} disabled />
                </Field>
              </div>
              <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
                <Button variant="primary" iconLeft="save" onClick={saveProfile}>변경사항 저장</Button>
              </div>
            </div>
          </Card>

          {/* Security */}
          <Card id="security">
            <div className="card-header">
              <h2 className="card-title">보안</h2>
            </div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--size-400)" }}>
              <SettingRow
                icon="settings"
                title="비밀번호"
                desc="마지막 변경 8주 전 · 12자 이상 권장"
                action={
                  resetSent ? (
                    <Badge tone="success" dot>메일 전송됨</Badge>
                  ) : (
                    <Button variant="outline" size="sm" onClick={sendReset}>재설정 메일 보내기</Button>
                  )
                }
              />
              <SettingRow
                icon="phone"
                title="2단계 인증"
                desc="휴대폰 OTP로 추가 보안"
                action={<Badge tone="neutral">설정되지 않음</Badge>}
                cta={<Button variant="outline" size="sm">설정</Button>}
              />
              <SettingRow
                icon="monitor"
                title="로그인 세션"
                desc="현재 2개 기기에서 로그인 중 (macOS · iPhone)"
                cta={<Button variant="ghost" size="sm">전체 로그아웃</Button>}
              />
            </div>
          </Card>

          {/* Notifications */}
          <Card id="notif">
            <div className="card-header">
              <h2 className="card-title">알림</h2>
              <span className="text-tertiary" style={{ fontSize: 12 }}>이메일 · 푸시</span>
            </div>
            <div>
              {[
                { k: "publishSuccess", title: "발행 성공 알림", desc: "GitHub Pages 배포가 완료될 때마다" },
                { k: "publishFailed", title: "발행 실패 알림", desc: "발행 도중 오류가 발생했을 때" },
                { k: "weeklyDigest", title: "주간 요약 메일", desc: "매주 월요일, 지난 7일의 변경 사항 요약" },
                { k: "invitation", title: "초대·권한 변경", desc: "다른 사이트의 오너가 초대했을 때" },
              ].map((n) => (
                <div
                  key={n.k}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--size-400)",
                    padding: "var(--size-400) var(--size-600)",
                    borderTop: "1px solid var(--sm-border-subtle)",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "var(--text-body-md)", marginBottom: 2 }}>{n.title}</div>
                    <div style={{ fontSize: "var(--text-caption)", color: "var(--sm-content-tertiary)" }}>{n.desc}</div>
                  </div>
                  <Toggle checked={notif[n.k]} onChange={(v) => {
                    setNotif({ ...notif, [n.k]: v });
                    toast({ tone: v ? "success" : "info", message: `${n.title} 알림을 ${v ? "켰" : "껐"}습니다` });
                  }} />
                </div>
              ))}
            </div>
          </Card>

          {/* Preferences */}
          <Card id="pref">
            <div className="card-header">
              <h2 className="card-title">환경 설정</h2>
            </div>
            <div className="card-body" style={{ display: "grid", gap: "var(--size-500)" }}>
              <Field label="테마">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {[
                    { id: "light", label: "라이트", icon: "sun" },
                    { id: "dark", label: "다크", icon: "moon" },
                    { id: "system", label: "시스템 따름", icon: "monitor" },
                  ].map((th) => (
                    <button
                      key={th.id}
                      onClick={() => setTheme(th.id)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                        padding: "var(--size-400)",
                        border: `1px solid ${theme === th.id ? "var(--sm-interactive-brand-default)" : "var(--sm-border-default)"}`,
                        background: theme === th.id ? "var(--sm-interactive-brand-subtle)" : "var(--sm-background-default)",
                        color: theme === th.id ? "var(--sm-interactive-brand-default)" : "var(--sm-content-secondary)",
                        borderRadius: "var(--radius-md)",
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      <Icon name={th.icon} size={20} />
                      {th.label}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="언어">
                <Select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ maxWidth: 240 }}>
                  <option value="ko">한국어</option>
                  <option value="en" disabled>English (준비 중)</option>
                </Select>
              </Field>
              <Field label="기본 사이트" helper="로그인 시 자동으로 선택되는 사이트">
                <Select defaultValue="dohwawon" style={{ maxWidth: 320 }}>
                  {SITES.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </Select>
              </Field>
            </div>
          </Card>

          {/* Danger */}
          <Card id="danger" style={{ borderColor: "var(--sm-status-error-subtle)" }}>
            <div className="card-header" style={{ borderBottomColor: "var(--sm-status-error-subtle)" }}>
              <h2 className="card-title" style={{ color: "var(--sm-status-error)" }}>위험 영역</h2>
            </div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--size-400)" }}>
              <SettingRow
                icon="upload"
                title="내 데이터 내보내기"
                desc="모든 활동·발행 이력을 JSON으로 다운로드"
                cta={<Button variant="outline" size="sm" iconLeft="upload">내보내기</Button>}
              />
              <SettingRow
                icon="trash"
                title="계정 삭제 요청"
                desc="슈퍼 어드민에게 삭제 요청을 보냅니다. 발행 이력은 무명 처리되어 보존됩니다."
                cta={<Button variant="danger" size="sm" iconLeft="trash">삭제 요청</Button>}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const SettingRow = ({ icon, title, desc, action, cta }) => (
  <div style={{ display: "flex", gap: "var(--size-400)", alignItems: "center" }}>
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "var(--radius-md)",
        background: "var(--sm-background-muted)",
        color: "var(--sm-content-secondary)",
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
      }}
    >
      <Icon name={icon} size={18} />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 600, marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 13, color: "var(--sm-content-tertiary)" }}>{desc}</div>
    </div>
    {action}
    {cta}
  </div>
);

Object.assign(window, { AccountPage });
