/* eslint-disable */
// Shared UI primitives + icon set for easysite admin

const Icon = ({ name, size = 18, ...rest }) => {
  const s = size;
  const stroke = "currentColor";
  const sw = 1.6;
  const paths = {
    home: <><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V9.5"/></>,
    box: <><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    layers: <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/></>,
    rocket: <><path d="M9 11l-3 1 1-3 8-8 5 5-8 8-3-3z"/><path d="M14.5 3.5l6 6"/><path d="M7 14l-3 3-1 4 4-1 3-3"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H3a2 2 0 110-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H9a1.6 1.6 0 001-1.5V3a2 2 0 114 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1H21a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1z"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></>,
    users: <><circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0114 0"/><path d="M16 4a4 4 0 010 8"/><path d="M22 21a6 6 0 00-6-6"/></>,
    search: <><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    minus: <><line x1="5" y1="12" x2="19" y2="12"/></>,
    check: <><polyline points="4 12 10 18 20 6"/></>,
    x: <><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></>,
    chevronDown: <><polyline points="6 9 12 15 18 9"/></>,
    chevronRight: <><polyline points="9 6 15 12 9 18"/></>,
    chevronLeft: <><polyline points="15 6 9 12 15 18"/></>,
    chevronUp: <><polyline points="6 15 12 9 18 15"/></>,
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></>,
    arrowLeft: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="11 6 5 12 11 18"/></>,
    edit: <><path d="M4 20h4l11-11-4-4L4 16v4z"/><path d="M14 5l4 4"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>,
    copy: <><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 3H5a2 2 0 00-2 2v11"/></>,
    eye: <><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></>,
    eyeOff: <><path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a18.6 18.6 0 014.22-5.06"/><path d="M9.9 4.24A10.9 10.9 0 0112 4c7 0 11 7 11 7a18.5 18.5 0 01-2.16 3.19"/><path d="M14.12 14.12a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>,
    upload: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
    camera: <><path d="M3 7h3l2-3h8l2 3h3a1 1 0 011 1v11a1 1 0 01-1 1H3a1 1 0 01-1-1V8a1 1 0 011-1z"/><circle cx="12" cy="13" r="4"/></>,
    drag: <><circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/></>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    filter: <><polyline points="22 3 2 3 10 12.5 10 19 14 21 14 12.5 22 3"/></>,
    sort: <><polyline points="3 6 7 2 11 6"/><line x1="7" y1="2" x2="7" y2="14"/><polyline points="13 14 17 18 21 14"/><line x1="17" y1="6" x2="17" y2="18"/></>,
    info: <><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="8" r="0.5" fill="currentColor" stroke="none"/></>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 115 0c0 1.5-2.5 1.5-2.5 3.5"/><circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="none"/></>,
    alert: <><path d="M12 2L2 20h20L12 2z"/><line x1="12" y1="9" x2="12" y2="14"/><circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="none"/></>,
    bell: <><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M10 21a2 2 0 004 0"/></>,
    star: <><polygon points="12 2 15 9 22 9.5 17 14.5 18.5 21.5 12 18 5.5 21.5 7 14.5 2 9.5 9 9 12 2"/></>,
    git: <><circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="12" r="2.5"/><path d="M6 8.5v7"/><path d="M15.5 12a6 6 0 01-9.5 0"/></>,
    play: <><polygon points="6 4 20 12 6 20 6 4"/></>,
    pause: <><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></>,
    refresh: <><polyline points="23 4 23 10 17 10"/><path d="M20.5 15a9 9 0 11-2.1-9.4L23 10"/></>,
    list: <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.5" y2="6"/><line x1="3" y1="12" x2="3.5" y2="12"/><line x1="3" y1="18" x2="3.5" y2="18"/></>,
    tag: <><path d="M20 12l-9 9a1.4 1.4 0 01-2 0L2 14V3h11l7 7a1.4 1.4 0 010 2z"/><circle cx="7" cy="7" r="1.5"/></>,
    flower: <><circle cx="12" cy="12" r="2.5"/><path d="M12 9.5C12 6 9.5 4 7 5.5S5.5 10 9 11.5"/><path d="M12 14.5c0 3.5 2.5 5.5 5 4s1.5-4.5-2-5.5"/><path d="M9.5 12c-3 0-5 2.5-3.5 5s5 1.5 5.5-2"/><path d="M14.5 12c3 0 5-2.5 3.5-5s-5-1.5-5.5 2"/></>,
    sparkle: <><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z"/></>,
    link: <><path d="M10 14a4 4 0 005.66 0l3.34-3.34a4 4 0 00-5.66-5.66L11.5 6.5"/><path d="M14 10a4 4 0 00-5.66 0L5 13.34a4 4 0 005.66 5.66l1.84-1.84"/></>,
    save: <><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>,
    palette: <><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2a10 10 0 100 20c5 0 5-3 2.5-5s-1-5 2.5-5h2A8 8 0 0012 2z"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/></>,
    moon: <><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></>,
    monitor: <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,
    phone: <><rect x="6" y="2" width="12" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>,
    logo: <><path d="M12 2L4 7v10l8 5 8-5V7l-8-5z"/><path d="M12 2v10l8 5"/><path d="M4 7l8 5"/></>,
    bolt: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    book: <><path d="M4 4.5A2.5 2.5 0 016.5 2H20v15H6.5a2.5 2.5 0 000 5H20"/><line x1="20" y1="17" x2="20" y2="22"/></>,
  };
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {paths[name] || null}
    </svg>
  );
};

// ── Button ───────────────────────────────────────────────────────────────
const Button = ({
  variant = "primary",
  size = "md",
  full = false,
  iconLeft,
  iconRight,
  children,
  className = "",
  ...rest
}) => {
  const cls = [
    "btn",
    `btn-${variant}`,
    size !== "md" && `btn-${size}`,
    full && "btn-full",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={cls} {...rest}>
      {iconLeft ? <Icon name={iconLeft} size={16} className="icon" /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} size={16} className="icon" /> : null}
    </button>
  );
};

const IconButton = ({ icon, bordered, size = 18, className = "", ...rest }) => (
  <button className={`icon-btn ${bordered ? "bordered" : ""} ${className}`} {...rest}>
    <Icon name={icon} size={size} />
  </button>
);

// ── Field ────────────────────────────────────────────────────────────────
const Field = ({ label, required, helper, error, children }) => (
  <div className="field">
    {label && (
      <label className="field-label">
        {label}
        {required && <span className="field-required" aria-hidden>*</span>}
      </label>
    )}
    {children}
    {error ? (
      <div className="field-error" role="alert">
        <Icon name="alert" size={14} /> {error}
      </div>
    ) : helper ? (
      <div className="field-helper">{helper}</div>
    ) : null}
  </div>
);

const Input = React.forwardRef(({ prefix, suffix, ...rest }, ref) => {
  if (prefix || suffix) {
    return (
      <div className={`input-with-${prefix ? "prefix" : "suffix"}`}>
        {prefix && (
          <span className="input-affix input-prefix">
            {typeof prefix === "string" ? <Icon name={prefix} size={16} /> : prefix}
          </span>
        )}
        <input ref={ref} className="input" {...rest} />
        {suffix && (
          <span className="input-affix input-suffix">
            {typeof suffix === "string" ? <Icon name={suffix} size={16} /> : suffix}
          </span>
        )}
      </div>
    );
  }
  return <input ref={ref} className="input" {...rest} />;
});

const Textarea = (props) => <textarea className="textarea" {...props} />;
const Select = ({ children, ...rest }) => (
  <select className="select" {...rest}>
    {children}
  </select>
);

// ── Toggle / Checkbox ────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, label, ...rest }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "var(--size-300)" }}>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className="toggle"
      onClick={() => onChange?.(!checked)}
      {...rest}
    />
    {label && (
      <span style={{ fontSize: "var(--text-body-md)", color: "var(--sm-content-primary)" }}>
        {label}
      </span>
    )}
  </div>
);

const Checkbox = ({ checked, onChange, ...rest }) => {
  const state = checked === "mixed" ? "mixed" : checked ? "true" : "false";
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={state}
      className="checkbox"
      onClick={() => onChange?.(!checked)}
      {...rest}
    >
      {checked === "mixed" ? (
        <svg viewBox="0 0 12 12" fill="none">
          <line x1="3" y1="6" x2="9" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 12 12" fill="none">
          <polyline
            points="2 6 5 9 10 3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      )}
    </button>
  );
};

// ── Badge / Chip ─────────────────────────────────────────────────────────
const Badge = ({ tone = "neutral", dot, children, ...rest }) => (
  <span className={`badge badge-${tone}`} {...rest}>
    {dot && <span className="badge-dot" />}
    {children}
  </span>
);

const Chip = ({ selected, count, onClick, children }) => (
  <button className={`chip ${selected ? "selected" : ""}`} onClick={onClick}>
    {children}
    {count !== undefined && <span className="chip-count">{count}</span>}
  </button>
);

// ── Card ─────────────────────────────────────────────────────────────────
const Card = ({ children, className = "", ...rest }) => (
  <div className={`card ${className}`} {...rest}>
    {children}
  </div>
);

// ── Toast ────────────────────────────────────────────────────────────────
const ToastContext = React.createContext(null);
const useToast = () => React.useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([]);
  const dismiss = React.useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);
  const add = React.useCallback((toast) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, ...toast }]);
    setTimeout(() => dismiss(id), toast.duration || 4200);
  }, [dismiss]);

  const TONE_LABEL = {
    success: "성공",
    error: "실패",
    warning: "주의",
    info: "안내",
  };
  const TONE_ICON = {
    success: "check",
    error: "x",
    warning: "alert",
    info: "info",
  };

  return (
    <ToastContext.Provider value={add}>
      {children}
      <div className="toast-region" aria-live="polite">
        {toasts.map((t) => {
          const tone = t.tone || "info";
          return (
            <div
              key={t.id}
              className={`toast ${tone}`}
              role={tone === "error" || tone === "warning" ? "alert" : "status"}
            >
              <span className="toast-icon">
                <Icon name={TONE_ICON[tone]} size={14} />
              </span>
              <div className="toast-body">
                <div className="toast-tone-label">{TONE_LABEL[tone]}</div>
                {t.message}
              </div>
              <button className="toast-close" onClick={() => dismiss(t.id)} aria-label="닫기">
                <Icon name="x" size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

// ── Modal ────────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, desc, size = "sm", children, footer }) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {(title || desc) && (
          <div className="modal-header">
            {title && (
              <h2 className="modal-title" id="modal-title">
                {title}
              </h2>
            )}
            {desc && <div className="modal-desc">{desc}</div>}
          </div>
        )}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

Object.assign(window, {
  Icon,
  Button,
  IconButton,
  Field,
  Input,
  Textarea,
  Select,
  Toggle,
  Checkbox,
  Badge,
  Chip,
  Card,
  ToastProvider,
  useToast,
  Modal,
});
