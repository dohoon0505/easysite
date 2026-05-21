/* eslint-disable */
// S01 — 사용자 관리 (super admin only)
// List of all users with role + site claims, invite flow, role change

const SAMPLE_USERS = [
  {
    id: "u_001",
    name: "박소연",
    email: "park@dohwawon.kr",
    role: "owner",
    sites: ["dohwawon"],
    status: "active",
    lastSeen: "방금 전",
    avatar: "박",
    avatarColor: "linear-gradient(135deg, #f4c8d0, #d36a8a)",
    publishCount: 12,
  },
  {
    id: "u_002",
    name: "이지은",
    email: "lee@bellcake.kr",
    role: "owner",
    sites: ["bell-cake"],
    status: "active",
    lastSeen: "2시간 전",
    avatar: "이",
    avatarColor: "linear-gradient(135deg, #f0e3c2, #c9a567)",
    publishCount: 8,
  },
  {
    id: "u_003",
    name: "박정훈",
    email: "junghoon@parkhad.com",
    role: "owner",
    sites: ["parkhad"],
    status: "active",
    lastSeen: "어제",
    avatar: "박",
    avatarColor: "linear-gradient(135deg, #c9cad0, #1a1d24)",
    publishCount: 23,
  },
  {
    id: "u_004",
    name: "김지수",
    email: "jisoo@dohwawon.kr",
    role: "editor",
    sites: ["dohwawon"],
    status: "invited",
    lastSeen: "—",
    avatar: "김",
    avatarColor: "linear-gradient(135deg, #c8d8f4, #6a8ed3)",
    publishCount: 0,
  },
  {
    id: "u_005",
    name: "김선생",
    email: "teacher@greenlightart.kr",
    role: "owner",
    sites: ["greenlight-art"],
    status: "active",
    lastSeen: "3일 전",
    avatar: "선",
    avatarColor: "linear-gradient(135deg, #ffd4a8, #b58be8)",
    publishCount: 4,
  },
  {
    id: "u_006",
    name: "Cris (이도훈)",
    email: "ehgns335@naver.com",
    role: "super",
    sites: ["*"],
    status: "active",
    lastSeen: "방금 전",
    avatar: "C",
    avatarColor: "linear-gradient(135deg, #1f2a52, #0d1226)",
    publishCount: 156,
  },
  {
    id: "u_007",
    name: "정민호",
    email: "minho@parkhad.com",
    role: "editor",
    sites: ["parkhad"],
    status: "suspended",
    lastSeen: "2주 전",
    avatar: "정",
    avatarColor: "linear-gradient(135deg, #d4d4d8, #71717a)",
    publishCount: 2,
  },
];

const ROLE_LABELS = {
  super: { label: "슈퍼 어드민", tone: "brand", desc: "모든 사이트 · 사용자 관리" },
  owner: { label: "오너", tone: "info", desc: "할당된 사이트의 모든 권한" },
  editor: { label: "에디터", tone: "neutral", desc: "상품·콘텐츠 편집 (발행 X)" },
};

const STATUS_LABELS = {
  active: { label: "활성", tone: "success" },
  invited: { label: "초대됨", tone: "warning" },
  suspended: { label: "정지", tone: "danger" },
};

const UsersManagePage = () => {
  const [users, setUsers] = React.useState(SAMPLE_USERS);
  const [query, setQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("all");
  const [selected, setSelected] = React.useState(null);
  const [inviteOpen, setInviteOpen] = React.useState(false);

  const filtered = users.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (query && !u.name.includes(query) && !u.email.includes(query)) return false;
    return true;
  });

  const counts = {
    all: users.length,
    super: users.filter((u) => u.role === "super").length,
    owner: users.filter((u) => u.role === "owner").length,
    editor: users.filter((u) => u.role === "editor").length,
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">사용자 관리</h1>
          <div className="page-subtitle">
            전체 {users.length}명 · 활성 {users.filter((u) => u.status === "active").length}명 ·
            초대 대기 {users.filter((u) => u.status === "invited").length}명
          </div>
        </div>
        <div className="page-actions">
          <Button variant="outline" iconLeft="upload">CSV 가져오기</Button>
          <Button variant="primary" iconLeft="plus" onClick={() => setInviteOpen(true)}>
            사용자 초대
          </Button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "var(--size-300)",
          marginBottom: "var(--size-500)",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ width: 320 }}>
          <Input
            prefix="search"
            placeholder="이름·이메일·도메인"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { id: "all", label: "전체" },
            { id: "super", label: "슈퍼 어드민" },
            { id: "owner", label: "오너" },
            { id: "editor", label: "에디터" },
          ].map((f) => (
            <Chip
              key={f.id}
              selected={roleFilter === f.id}
              count={counts[f.id]}
              onClick={() => setRoleFilter(f.id)}
            >
              {f.label}
            </Chip>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: "var(--size-500)", alignItems: "flex-start" }}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>사용자</th>
                <th>역할</th>
                <th>사이트 권한</th>
                <th>상태</th>
                <th>마지막 활동</th>
                <th style={{ textAlign: "right" }}>발행 수</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  className={selected?.id === u.id ? "selected" : ""}
                  onClick={() => setSelected(u)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="avatar" style={{ background: u.avatarColor }}>{u.avatar}</div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                        <div style={{ fontSize: 13, color: "var(--sm-content-tertiary)" }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge tone={ROLE_LABELS[u.role].tone} dot>
                      {ROLE_LABELS[u.role].label}
                    </Badge>
                  </td>
                  <td>
                    {u.sites[0] === "*" ? (
                      <span style={{ fontSize: 13, color: "var(--sm-content-secondary)" }}>
                        <Badge tone="brand">전체 사이트</Badge>
                      </span>
                    ) : (
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {u.sites.map((sId) => {
                          const s = SITES.find((x) => x.id === sId);
                          return s ? (
                            <span
                              key={sId}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "2px 8px 2px 4px",
                                background: "var(--sm-background-muted)",
                                borderRadius: "var(--radius-full)",
                                fontSize: 12,
                                fontWeight: 500,
                              }}
                            >
                              <span
                                style={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: "50%",
                                  background: s.gradient,
                                }}
                              />
                              {s.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </td>
                  <td>
                    <Badge tone={STATUS_LABELS[u.status].tone} dot>
                      {STATUS_LABELS[u.status].label}
                    </Badge>
                  </td>
                  <td style={{ color: "var(--sm-content-tertiary)", fontSize: 13 }}>{u.lastSeen}</td>
                  <td className="mono" style={{ textAlign: "right", fontWeight: 600 }}>{u.publishCount}</td>
                  <td>
                    <IconButton icon="more" onClick={(e) => e.stopPropagation()} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <UserDetail user={selected} onClose={() => setSelected(null)} onUpdate={(u) => {
            setUsers((us) => us.map((x) => (x.id === u.id ? u : x)));
            setSelected(u);
          }} />
        )}
      </div>

      <InviteUserModal open={inviteOpen} onClose={() => setInviteOpen(false)} onCreate={(u) => {
        setUsers((us) => [u, ...us]);
        setInviteOpen(false);
      }} />
    </div>
  );
};

const UserDetail = ({ user, onClose, onUpdate }) => {
  const toast = useToast();
  const changeRole = (role) => {
    onUpdate({ ...user, role });
    toast({ tone: "success", message: `${user.name}의 역할을 '${ROLE_LABELS[role].label}'로 변경했습니다` });
  };
  const toggleSite = (sId) => {
    const next = user.sites.includes(sId)
      ? user.sites.filter((x) => x !== sId)
      : [...user.sites, sId];
    onUpdate({ ...user, sites: next });
  };

  return (
    <div style={{ position: "sticky", top: 100, display: "flex", flexDirection: "column", gap: "var(--size-400)" }}>
      <Card>
        <div style={{ padding: "var(--size-500)", textAlign: "center" }}>
          <div className="avatar" style={{ background: user.avatarColor, width: 64, height: 64, fontSize: 24, margin: "0 auto var(--size-300)" }}>
            {user.avatar}
          </div>
          <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.015em" }}>{user.name}</div>
          <div style={{ color: "var(--sm-content-tertiary)", fontSize: 13 }}>{user.email}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
            <Badge tone={ROLE_LABELS[user.role].tone} dot>{ROLE_LABELS[user.role].label}</Badge>
            <Badge tone={STATUS_LABELS[user.status].tone} dot>{STATUS_LABELS[user.status].label}</Badge>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
            <Button variant="secondary" size="sm" iconLeft="bell">알림 보내기</Button>
            <Button variant="outline" size="sm" iconLeft="x" onClick={onClose}>닫기</Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="card-header">
          <h3 className="card-title" style={{ fontSize: 15 }}>역할 변경</h3>
        </div>
        <div className="card-body" style={{ display: "grid", gap: 6 }}>
          {Object.entries(ROLE_LABELS).map(([id, r]) => (
            <button
              key={id}
              onClick={() => changeRole(id)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "var(--size-300)",
                borderRadius: "var(--radius-sm)",
                border: `1px solid ${user.role === id ? "var(--sm-interactive-brand-default)" : "var(--sm-border-subtle)"}`,
                background: user.role === id ? "var(--sm-interactive-brand-subtle)" : "transparent",
                textAlign: "left",
                width: "100%",
              }}
            >
              <Badge tone={r.tone} dot>{r.label}</Badge>
              <div style={{ flex: 1, fontSize: 12, color: "var(--sm-content-secondary)", lineHeight: 1.5 }}>
                {r.desc}
              </div>
              {user.role === id && <Icon name="check" size={14} style={{ color: "var(--sm-interactive-brand-default)" }} />}
            </button>
          ))}
        </div>
      </Card>

      {user.role !== "super" && (
        <Card>
          <div className="card-header">
            <h3 className="card-title" style={{ fontSize: 15 }}>사이트 권한</h3>
            <span className="text-tertiary" style={{ fontSize: 12 }}>{user.sites.length}/{SITES.length}</span>
          </div>
          <div className="card-body" style={{ display: "grid", gap: 4 }}>
            {SITES.map((s) => {
              const on = user.sites.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSite(s.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "var(--size-200) var(--size-300)",
                    borderRadius: "var(--radius-sm)",
                    background: "transparent",
                  }}
                >
                  <Checkbox checked={on} onChange={() => toggleSite(s.id)} />
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "var(--radius-xs)",
                      background: s.gradient,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 500, flex: 1, textAlign: "left" }}>{s.name}</span>
                  {on && <span className="badge badge-success">활성</span>}
                </button>
              );
            })}
          </div>
        </Card>
      )}

      <Card>
        <div className="card-header">
          <h3 className="card-title" style={{ fontSize: 15 }}>위험 영역</h3>
        </div>
        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {user.status === "active" ? (
            <Button variant="outline" iconLeft="eyeOff" full>계정 일시 정지</Button>
          ) : (
            <Button variant="outline" iconLeft="check" full>계정 활성화</Button>
          )}
          <Button variant="ghost" iconLeft="refresh" full>비밀번호 재설정 메일 보내기</Button>
          <Button variant="danger" iconLeft="trash" full>계정 삭제</Button>
        </div>
      </Card>
    </div>
  );
};

const InviteUserModal = ({ open, onClose, onCreate }) => {
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("editor");
  const [sites, setSites] = React.useState([]);
  const [step, setStep] = React.useState(1);
  const toast = useToast();

  React.useEffect(() => {
    if (open) {
      setStep(1);
      setEmail("");
      setRole("editor");
      setSites([]);
    }
  }, [open]);

  const submit = () => {
    const newUser = {
      id: `u_${Math.random().toString(36).slice(2, 6)}`,
      name: email.split("@")[0],
      email,
      role,
      sites: role === "super" ? ["*"] : sites,
      status: "invited",
      lastSeen: "—",
      avatar: email[0].toUpperCase(),
      avatarColor: "linear-gradient(135deg, #c4cae0, #8a93c4)",
      publishCount: 0,
    };
    onCreate(newUser);
    toast({ tone: "success", message: `${email}로 초대 메일을 보냈습니다` });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={step === 1 ? "사용자 초대" : "권한 설정"}
      desc={step === 1 ? "이메일로 초대 링크를 보냅니다. 첫 로그인 시 비밀번호를 직접 설정합니다." : "초대된 사용자에게 부여할 역할과 사이트 권한을 선택하세요."}
      size="md"
      footer={
        <>
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(1)}>이전</Button>
          ) : (
            <Button variant="outline" onClick={onClose}>취소</Button>
          )}
          {step === 1 ? (
            <Button variant="primary" disabled={!email.includes("@")} onClick={() => setStep(2)}>
              다음
            </Button>
          ) : (
            <Button
              variant="primary"
              iconLeft="check"
              disabled={role !== "super" && sites.length === 0}
              onClick={submit}
            >
              초대 메일 보내기
            </Button>
          )}
        </>
      }
    >
      {step === 1 ? (
        <Field label="이메일" required helper="가입하지 않은 이메일이어야 합니다">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="newuser@example.com"
            autoFocus
            prefix={<Icon name="user" size={16} />}
          />
        </Field>
      ) : (
        <div style={{ display: "grid", gap: "var(--size-400)" }}>
          <Field label="역할">
            <div style={{ display: "grid", gap: 6 }}>
              {Object.entries(ROLE_LABELS).map(([id, r]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRole(id)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "var(--size-300) var(--size-400)",
                    borderRadius: "var(--radius-md)",
                    border: `1px solid ${role === id ? "var(--sm-interactive-brand-default)" : "var(--sm-border-default)"}`,
                    background: role === id ? "var(--sm-interactive-brand-subtle)" : "transparent",
                    textAlign: "left",
                  }}
                >
                  <Badge tone={r.tone} dot>{r.label}</Badge>
                  <div style={{ flex: 1, fontSize: 13, color: "var(--sm-content-secondary)" }}>{r.desc}</div>
                </button>
              ))}
            </div>
          </Field>
          {role !== "super" && (
            <Field label="접근 가능한 사이트" required>
              <div style={{ display: "grid", gap: 4 }}>
                {SITES.map((s) => {
                  const on = sites.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() =>
                        setSites((prev) => (prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id]))
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "var(--size-200) var(--size-300)",
                        borderRadius: "var(--radius-sm)",
                        background: "transparent",
                      }}
                    >
                      <Checkbox checked={on} onChange={() => {}} />
                      <span
                        style={{ width: 24, height: 24, borderRadius: "var(--radius-xs)", background: s.gradient }}
                      />
                      <div style={{ flex: 1, textAlign: "left" }}>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: "var(--sm-content-tertiary)" }}>{s.domain}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Field>
          )}
        </div>
      )}
    </Modal>
  );
};

Object.assign(window, { UsersManagePage });
