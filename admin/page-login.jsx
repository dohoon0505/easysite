/* eslint-disable */
// L01 — 로그인 화면. Centered two-card layout (VidPro-style) + 마우스 추적 + 3D 틸트.
// Firebase Auth 연결: signInWithEmailAndPassword / sendPasswordResetEmail.

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [resetMode, setResetMode] = React.useState(false);
  const [resetSent, setResetSent] = React.useState(false);
  const shellRef = React.useRef(null);
  const cardRef = React.useRef(null);
  const visualRef = React.useRef(null);
  const toast = useToast();

  // 마우스 추적 스포트라이트 + 카드 패럴랙스 틸트
  React.useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let raf = null;
    const onMove = (e) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = shell.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * 100;
        const my = ((e.clientY - rect.top) / rect.height) * 100;
        shell.style.setProperty("--mx", `${mx}%`);
        shell.style.setProperty("--my", `${my}%`);

        if (cardRef.current) {
          const cr = cardRef.current.getBoundingClientRect();
          const cx = (e.clientX - (cr.left + cr.width / 2)) / cr.width;
          const cy = (e.clientY - (cr.top + cr.height / 2)) / cr.height;
          // 매우 미세한 3D 틸트 — 최대 ±2°
          cardRef.current.style.setProperty("--ry", `${cx * 2}deg`);
          cardRef.current.style.setProperty("--rx", `${-cy * 1.4}deg`);
        }
      });
    };
    const onLeave = () => {
      if (cardRef.current) {
        cardRef.current.style.setProperty("--rx", "0deg");
        cardRef.current.style.setProperty("--ry", "0deg");
      }
    };
    shell.addEventListener("mousemove", onMove);
    shell.addEventListener("mouseleave", onLeave);
    return () => {
      shell.removeEventListener("mousemove", onMove);
      shell.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // "로그인 유지" 토글 → Firebase Auth persistence 적용
  // (체크: local 영속 / 미체크: session 영속)
  React.useEffect(() => {
    if (!window.fbAuth || !window.firebase) return;
    try {
      const persistence = remember
        ? window.firebase.auth.Auth.Persistence.LOCAL
        : window.firebase.auth.Auth.Persistence.SESSION;
      window.fbAuth.setPersistence(persistence).catch((e) => console.error("setPersistence", e));
    } catch (_) { /* 일부 환경에서는 persistence API 가 없을 수 있음 */ }
  }, [remember]);

  // Firebase Auth 에러 코드 → 한국어 메시지
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
        return "이메일 또는 비밀번호가 일치하지 않습니다";
      case "auth/too-many-requests":
        return "잠시 후 다시 시도해 주세요";
      case "auth/network-request-failed":
        return "네트워크 연결을 확인해 주세요";
      default:
        return (err && err.message) || "로그인 중 오류가 발생했어요";
    }
  };

  const submit = async (e) => {
    e?.preventDefault();
    setError(null);
    if (!email.includes("@")) {
      setError("이메일 형식이 올바르지 않아요");
      return;
    }
    // 비밀번호 재설정
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
      onLogin && onLogin();
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell" ref={shellRef}>
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />
      <div className="login-card" ref={cardRef}>
        {/* ── 좌측 비주얼 ── */}
        <div className="login-visual" ref={visualRef}>
          <div className="login-visual-top">
            <div className="login-logo">
              <span className="login-logo-name">No Code Branding WebSite</span>
            </div>
          </div>

          <div className="login-visual-bottom">
            <h2 className="login-headline">
              코드 없이 운영하는<br />
              브랜딩 홈페이지
            </h2>
            <p className="login-subhead">
              고객을 이탈시키는 양산형 사이트는 이제 그만, 우리 브랜드에 딱 맞는 디자인의
              사이트로 브랜딩을 구축하고 잠재고객 전환율을 증폭시켜보세요!
            </p>
            <div className="login-pager">
              <span className="active" />
              <span />
              <span />
            </div>
          </div>
        </div>

        {/* ── 우측 폼 ── */}
        <div className="login-form-side">
          <div className="login-form-deco">
            <Icon name="bolt" size={11} />
            SSL 인증서 적용
          </div>
          {resetSent ? (
            <>
              <h1 className="login-title">메일을 보내드렸어요</h1>
              <div className="login-sub">받은 메일의 링크를 눌러 새 비밀번호를 설정해 주세요.</div>
              <div
                style={{
                  padding: "16px",
                  background: "var(--sm-status-success-subtle)",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "var(--sm-status-success)",
                    color: "white",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name="check" size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--sm-status-success)", fontSize: 14, marginBottom: 2 }}>
                    {email}로 발송 완료
                  </div>
                  <div style={{ fontSize: 12, color: "var(--sm-content-secondary)" }}>
                    5분 이내 도착합니다. 스팸함도 확인해 주세요.
                  </div>
                </div>
              </div>
              <button
                className="login-submit"
                onClick={() => { setResetMode(false); setResetSent(false); }}
              >
                로그인으로 돌아가기
              </button>
            </>
          ) : (
            <>
              <h1 className="login-title">
                {resetMode ? "비밀번호 재설정" : "Welcome Back!"}
              </h1>
              <div className="login-sub">
                {resetMode
                  ? "가입하신 이메일로 재설정 링크를 보내드립니다."
                  : "운영자 계정으로 로그인하세요."}
              </div>

              <form onSubmit={submit} className="login-form">
                <Field label="이메일" error={error && !email.includes("@") ? error : null}>
                  <Input
                    type="email"
                    placeholder="admin@naver.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    inputMode="email"
                    autoComplete="email"
                    autoFocus
                  />
                </Field>

                {!resetMode && (
                  <Field label="비밀번호" error={error && email.includes("@") ? error : null}>
                    <Input
                      type={showPw ? "text" : "password"}
                      placeholder="비밀번호를 입력하세요"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      suffix={
                        <button
                          type="button"
                          aria-label="비밀번호 표시 토글"
                          aria-pressed={showPw}
                          onClick={() => setShowPw((v) => !v)}
                          style={{
                            pointerEvents: "auto",
                            color: "var(--sm-content-tertiary)",
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <Icon name={showPw ? "eyeOff" : "eye"} size={16} />
                        </button>
                      }
                    />
                  </Field>
                )}

                {!resetMode && (
                  <div className="login-options">
                    <label className="login-remember">
                      <Checkbox checked={remember} onChange={setRemember} />
                      로그인 유지
                    </label>
                    <button
                      type="button"
                      className="login-forgot"
                      onClick={() => { setResetMode(true); setError(null); }}
                    >
                      비밀번호를 잊으셨나요?
                    </button>
                  </div>
                )}

                <button type="submit" className="login-submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner />
                      {resetMode ? "보내는 중…" : "로그인 중…"}
                    </>
                  ) : (
                    resetMode ? "재설정 메일 보내기" : "로그인"
                  )}
                </button>

                {resetMode && (
                  <button
                    type="button"
                    onClick={() => { setResetMode(false); setError(null); }}
                    style={{
                      background: "transparent",
                      color: "var(--sm-content-secondary)",
                      fontSize: 13,
                      fontWeight: 500,
                      padding: "8px 0",
                    }}
                  >
                    ← 로그인으로 돌아가기
                  </button>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Spinner = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: "spin 0.8s linear infinite" }}>
    <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
    <path d="M14 8a6 6 0 00-6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

Object.assign(window, { LoginPage });
