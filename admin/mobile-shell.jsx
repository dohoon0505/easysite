/* eslint-disable */
// Mobile shell — phone frame + tab bar + bottom sheet primitives

const MobileFrame = ({ children }) => (
  <div className="mobile-mode">
    <div className="mobile-frame">
      <div className="mobile-side-label">박소연 · iPhone 15 Pro</div>
      <div className="mobile-screen">
        <div className="mobile-statusbar">
          <span>9:41</span>
          <span className="icons">
            <svg width="16" height="11" viewBox="0 0 18 12" fill="currentColor">
              <rect x="0" y="6" width="3" height="6" rx="0.5"/><rect x="5" y="3.5" width="3" height="8.5" rx="0.5"/><rect x="10" y="1" width="3" height="11" rx="0.5"/><rect x="15" y="-1" width="3" height="13" rx="0.5"/>
            </svg>
            <svg width="18" height="11" viewBox="0 0 24 16" fill="currentColor">
              <path d="M1 5.5l1.5-1.4a13.2 13.2 0 0118.9 0L23 5.5"/>
            </svg>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
              <svg width="24" height="11" viewBox="0 0 30 14" fill="none" stroke="currentColor">
                <rect x="0.5" y="0.5" width="26" height="13" rx="3.5"/>
                <rect x="2.5" y="2.5" width="22" height="9" rx="2" fill="currentColor"/>
                <rect x="27.5" y="4" width="2" height="6" rx="1" fill="currentColor"/>
              </svg>
            </span>
          </span>
        </div>
        {children}
      </div>
    </div>
  </div>
);

const MobileAppBar = ({ title, back, actions, sub }) => (
  <header className="m-appbar">
    {back && (
      <button
        onClick={back}
        style={{
          width: 36,
          height: 36,
          display: "grid",
          placeItems: "center",
          color: "var(--sm-content-primary)",
        }}
      >
        <Icon name="chevronLeft" size={22} />
      </button>
    )}
    <div style={{ minWidth: 0, padding: !back ? "0 var(--size-200)" : 0 }}>
      <div className="m-appbar-title">{title}</div>
      {sub && (
        <div style={{ fontSize: "var(--text-caption)", color: "var(--sm-content-tertiary)", marginTop: -2 }}>
          {sub}
        </div>
      )}
    </div>
    {actions && <div className="m-appbar-actions">{actions}</div>}
  </header>
);

const MobileTabBar = ({ route, onNav, draftCount }) => {
  const tabs = [
    { id: "m-home", label: "홈", icon: "home" },
    { id: "m-products", label: "상품", icon: "box" },
    { id: "m-publish", label: "발행", icon: "rocket", badge: draftCount > 0 ? draftCount : null },
    { id: "m-more", label: "더보기", icon: "more" },
  ];
  return (
    <nav className="m-tabbar">
      {tabs.map((t) => (
        <button key={t.id} className={`m-tab ${route === t.id ? "active" : ""}`} onClick={() => onNav(t.id)}>
          {t.badge && <span className="tab-dot" />}
          <Icon name={t.icon} size={20} />
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
};

const BottomSheet = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  return (
    <>
      <div className="bottom-sheet-backdrop" onClick={onClose} />
      <div className="bottom-sheet" role="dialog" aria-modal="true">
        <div className="sheet-handle" />
        {title && (
          <div className="sheet-header">
            <h2 className="sheet-title">{title}</h2>
            <IconButton icon="x" onClick={onClose} />
          </div>
        )}
        <div className="sheet-body">{children}</div>
        {footer && <div className="sheet-footer">{footer}</div>}
      </div>
    </>
  );
};

Object.assign(window, { MobileFrame, MobileAppBar, MobileTabBar, BottomSheet });
