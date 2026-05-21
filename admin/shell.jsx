/* eslint-disable */
// App shell — sidebar + topbar + routing

const ROUTES = [
  {
    group: "사이트 운영",
    items: [
      { id: "home", label: "홈 섹션 편집", icon: "home", page: "home" },
      { id: "products", label: "상품", icon: "box", page: "products", count: 8 },
      { id: "categories", label: "카테고리", icon: "tag", page: "categories", count: 5 },
      { id: "publish", label: "발행 센터", icon: "rocket", page: "publish", badge: 2 },
    ],
  },
  {
    group: "내 계정",
    items: [
      { id: "account", label: "계정 설정", icon: "user", page: "account" },
      { id: "audit", label: "변경 이력", icon: "clock", page: "audit" },
    ],
  },
  {
    group: "슈퍼",
    items: [
      { id: "users", label: "사용자 관리", icon: "users", page: "users" },
      { id: "sites", label: "사이트 관리", icon: "grid", page: "sites" },
    ],
  },
];

const AppContext = React.createContext(null);
const useApp = () => React.useContext(AppContext);

const Sidebar = ({ route, onNav, site, onSwitchSite, draftCount }) => (
  <aside className="sidebar" aria-label="네비게이션">
    <div className="brand">
      <div className="brand-mark">e</div>
      <div>
        <div className="brand-name">easysite</div>
        <div className="brand-sub">admin console</div>
      </div>
    </div>

    <div className="site-switcher" onClick={onSwitchSite} role="button" tabIndex={0}>
      <div className="site-thumb" style={{ background: site.gradient }} />
      <div className="site-meta">
        <div className="site-name">{site.name}</div>
        <div className="site-status">
          <span className="live-dot" />
          {site.domain}
        </div>
      </div>
      <Icon name="chevronDown" size={16} />
    </div>

    {ROUTES.map((group) => (
      <div className="nav-group" key={group.group}>
        <div className="nav-label">{group.group}</div>
        {group.items.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${route === item.page ? "active" : ""}`}
            onClick={() => onNav(item.page)}
            role="button"
            tabIndex={0}
          >
            <Icon name={item.icon} className="nav-icon" />
            <span>{item.label}</span>
            {item.id === "publish" && draftCount > 0 && (
              <span className="nav-count" style={{ background: "var(--sm-status-warning-subtle)", color: "var(--sm-status-warning)" }}>
                {draftCount}
              </span>
            )}
            {item.count !== undefined && item.id !== "publish" && (
              <span className="nav-count">{item.count}</span>
            )}
          </div>
        ))}
      </div>
    ))}

    <div className="sidebar-footer">
      <div className="avatar">박</div>
      <div className="user-info">
        <div className="user-name">박소연</div>
        <div className="user-role">오너 · 도화원플라워</div>
      </div>
      <IconButton icon="settings" />
    </div>
  </aside>
);

const Topbar = ({ crumbs = [], actions, site }) => (
  <header className="topbar">
    {site && (
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: site.gradient,
        }}
      />
    )}
    <div className="crumbs">
      {site && (
        <span
          className="site-chip"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "3px 10px 3px 4px",
            background: "var(--sm-background-subtle)",
            border: "1px solid var(--sm-border-subtle)",
            borderRadius: "var(--radius-full)",
            marginRight: "var(--size-300)",
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <span style={{ width: 18, height: 18, borderRadius: "50%", background: site.gradient, flexShrink: 0 }} />
          {site.name}
        </span>
      )}
      {crumbs.map((c, i) => (
        <React.Fragment key={i}>
          {i > 0 && <Icon name="chevronRight" size={12} className="crumb-sep" />}
          <span
            className={i === crumbs.length - 1 ? "crumb-current" : ""}
            style={{ whiteSpace: "nowrap" }}
          >
            {c}
          </span>
        </React.Fragment>
      ))}
    </div>
    <div className="topbar-actions">
      <div style={{ position: "relative", width: 280 }}>
        <Input
          prefix="search"
          placeholder="상품·카테고리 검색…"
          style={{ width: "100%" }}
        />
        <span className="kbd" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}>
          ⌘K
        </span>
      </div>
      <IconButton icon="bell" bordered />
      {actions}
    </div>
  </header>
);

// Site switcher modal
const SiteSwitcherModal = ({ open, onClose, sites, currentId, onSelect }) => (
  <Modal open={open} onClose={onClose} title="사이트 전환" desc="관리할 사이트를 선택하세요" size="md">
    <div style={{ display: "grid", gap: "var(--size-200)" }}>
      {sites.map((s) => (
        <button
          key={s.id}
          onClick={() => {
            onSelect(s.id);
            onClose();
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--size-400)",
            padding: "var(--size-400)",
            background: s.id === currentId ? "var(--sm-interactive-brand-subtle)" : "transparent",
            border: `1px solid ${s.id === currentId ? "var(--sm-interactive-brand-default)" : "var(--sm-border-subtle)"}`,
            borderRadius: "var(--radius-md)",
            textAlign: "left",
            cursor: "pointer",
            width: "100%",
            transition: "background var(--motion-fast)",
          }}
        >
          <div
            className="site-thumb"
            style={{ background: s.gradient, width: 44, height: 44, borderRadius: "var(--radius-md)" }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: "var(--text-body-md)" }}>{s.name}</div>
            <div style={{ fontSize: "var(--text-caption)", color: "var(--sm-content-tertiary)", marginTop: 2 }}>
              {s.domain} · {s.operator}
            </div>
          </div>
          {s.id === currentId && <Icon name="check" size={18} style={{ color: "var(--sm-interactive-brand-default)" }} />}
        </button>
      ))}
    </div>
  </Modal>
);

Object.assign(window, { Sidebar, Topbar, SiteSwitcherModal, ROUTES, AppContext, useApp });
