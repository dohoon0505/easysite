/* eslint-disable */
// L01 — 로그인 화면. Split layout: brand panel + form. Responsive.

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [resetMode, setResetMode] = React.useState(false);
  const [resetSent, setResetSent] = React.useState(false);
  const toast = useToast();

  const submit = async (e) => {
    e?.preventDefault();
    setError(null);
    if (!email.includes("@")) {
      setError("이메일 형식이 올바르지 않아요");
      return;
    }
    // 비밀번호 재설정 메일 발송 모드
    if (resetMode) {
      setLoading(true);
      try {
        await window.sendPasswordResetEmail(email);
        setResetSent(true);
      } catch (err) {
        setError(mapAuthError(err));
      } finally {
        setLoading(false);
      }
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다");
      return;
    }
    // 실제 로그인
    setLoading(true);
    try {
      const user = await window.signInWithEmail(email, password);
      const greet = user?.displayName ? `${user.displayName}님` : `${email}`;
      toast({ tone: "success", message: `로그인 완료 — 어서 오세요, ${greet}` });
      // onLogin() 호출은 onAuthStateChanged 가 자동으로 처리하므로 생략 가능하지만,
      // 디자인 흐름 호환을 위해 함께 호출.
      onLogin && onLogin();
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // Firebase Auth 에러 → 사용자용 한국어 메시지
  const mapAuthError = (err) => {
    const code = (err && err.code) || "";
    switch (code) {
      case "auth/invalid-email":
        return "이메일 형식이 올바르지 않아요";
      case "auth/user-disabled":
        return "비활성화된 계정입니다 — 슈퍼 어드민에게 문의해 주세요";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "이메일 또는 비밀번호가 일치하지 않습니다 — 다시 확인해 주세요";
      case "auth/too-many-requests":
        return "잠시 후 다시 시도해 주세요";
      case "auth/network-request-failed":
        return "네트워크 연결을 확인해 주세요";
      default:
        return (err && err.message) || "로그인 중 오류가 발생했어요";
    }
  };

  const fillDemo = () => {
    setEmail("park@dohwawon.kr");
    setPassword("springflower");
    setError(null);
  };

  return (
    <div className="login-shell">
      {/* Left — brand panel */}
      <div className="login-brand">
        <div className="login-brand-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="brand-mark" style={{ width: 40, height: 40, background: "white", color: "var(--sm-interactive-brand-default)" }}>e</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>easysite</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>admin console</div>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 24, padding: "var(--size-700) 0" }}>
            <div className="login-headline">
              꽃집 사장님도, 케이크 디자이너도<br />
              <span style={{ opacity: 0.7 }}>코드 없이 사이트를 운영합니다.</span>
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.85, maxWidth: 440 }}>
              상품 등록 · 가격 변경 · 홈 화면 편집 — 한 번의 발행으로 1~3분 안에 사이트에 반영됩니다.
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 16, opacity: 0.9 }}>
              <LoginStat n="5" label="운영 중인 사이트" />
              <LoginStat n="120+" label="누적 발행 횟수" />
              <LoginStat n="2.3분" label="평균 반영 시간" />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, opacity: 0.6 }}>
            <span>v0.5.2 · PWA</span>
            <span>도움이 필요하시면 ehgns335@naver.com</span>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="login-form-side">
        <div className="login-form-card">
          <h1 className="login-title">
            {resetMode ? (resetSent ? "메일을 보내드렸어요" : "비밀번호 재설정") : "다시 오신 것을 환영해요"}
          </h1>
          <div className="login-sub">
            {resetMode
              ? (resetSent ? "받은 메일의 링크를 눌러 새 비밀번호를 설정해 주세요." : "가입하신 이메일을 입력하면 재설정 링크를 보내드립니다.")
              : "이메일과 비밀번호로 로그인하세요."}
          </div>

          {resetSent ? (
            <div style={{ marginTop: 32, padding: "var(--size-500)", background: "var(--sm-status-success-subtle)", borderRadius: "var(--radius-md)", display: "flex", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--sm-status-success)", color: "white", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Icon name="check" size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: "var(--sm-status-success)", marginBottom: 4 }}>
                  {email}로 발송 완료
                </div>
                <div style={{ fontSize: 13, color: "var(--sm-content-secondary)" }}>
                  5분 이내 도착합니다. 메일이 보이지 않으면 스팸함을 확인해 주세요.
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="login-form">
              <Field label="이메일" error={error && !email.includes("@") ? error : null}>
                <Input
                  type="email"
                  placeholder="park@dohwawon.kr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  prefix={<Icon name="user" size={16} />}
                  inputMode="email"
                  autoComplete="email"
                  autoFocus
                />
              </Field>
              {!resetMode && (
                <Field
                  label="비밀번호"
                  error={error && email.includes("@") ? error : null}
                >
                  <Input
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    suffix={
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        style={{ pointerEvents: "auto", color: "var(--sm-content-tertiary)", display: "grid", placeItems: "center" }}
                      >
                        <Icon name={showPw ? "eyeOff" : "eye"} size={16} />
                      </button>
                    }
                  />
                </Field>
              )}

              {!resetMode && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: -4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Checkbox checked={true} />
                    <span style={{ fontSize: 13, color: "var(--sm-content-secondary)" }}>30일간 로그인 유지</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setResetMode(true); setError(null); }}
                    style={{ fontSize: 13, color: "var(--sm-content-brand)", fontWeight: 600 }}
                  >
                    비밀번호 잊으셨나요?
                  </button>
                </div>
              )}

              <Button variant="primary" size="lg" full type="submit" disabled={loading}>
                {loading ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <Spinner /> {resetMode ? "보내는 중…" : "로그인 중…"}
                  </span>
                ) : (
                  resetMode ? "재설정 메일 보내기" : "로그인"
                )}
              </Button>

              {resetMode && (
                <Button type="button" variant="ghost" full onClick={() => { setResetMode(false); setError(null); }}>
                  ← 로그인으로 돌아가기
                </Button>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const LoginStat = ({ n, label }) => (
  <div>
    <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1, color: "white" }} className="mono">
      {n}
    </div>
    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{label}</div>
  </div>
);

const Spinner = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: "spin 0.8s linear infinite" }}>
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
    <path d="M14 8a6 6 0 00-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

Object.assign(window, { LoginPage });
