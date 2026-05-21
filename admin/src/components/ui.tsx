/**
 * UI primitives — Icon, Button, IconButton, Field, Input, Textarea, Select,
 * Toggle, Checkbox, Badge, Chip, Card, Modal, ToastProvider, useToast.
 *
 * Design spec: docs/design_handoff.md (designer-delivered redesign).
 * Styles live in ./components.css and ../styles/app.css (sidebar/topbar/page).
 */
import "./components.css";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type SVGProps,
  type TextareaHTMLAttributes,
} from "react";

// ─────────────────────────────────────────────────────────────
// Icon — vector set used across the admin
// ─────────────────────────────────────────────────────────────
const ICON_PATHS: Record<string, ReactNode> = {
  home: <><path d="M3 10.5L12 3l9 7.5" /><path d="M5 9.5V20a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V9.5" /></>,
  box: <><path d="M3 7l9-4 9 4-9 4-9-4z" /><path d="M3 7v10l9 4 9-4V7" /><path d="M12 11v10" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  layers: <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 12 12 17 22 12" /><polyline points="2 17 12 22 22 17" /></>,
  rocket: <><path d="M9 11l-3 1 1-3 8-8 5 5-8 8-3-3z" /><path d="M14.5 3.5l6 6" /><path d="M7 14l-3 3-1 4 4-1 3-3" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H3a2 2 0 110-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H9a1.6 1.6 0 001-1.5V3a2 2 0 114 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1H21a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1z" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" /></>,
  users: <><circle cx="9" cy="8" r="4" /><path d="M2 21a7 7 0 0114 0" /><path d="M16 4a4 4 0 010 8" /><path d="M22 21a6 6 0 00-6-6" /></>,
  search: <><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  minus: <><line x1="5" y1="12" x2="19" y2="12" /></>,
  check: <><polyline points="4 12 10 18 20 6" /></>,
  x: <><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></>,
  chevronDown: <><polyline points="6 9 12 15 18 9" /></>,
  chevronRight: <><polyline points="9 6 15 12 9 18" /></>,
  chevronLeft: <><polyline points="15 6 9 12 15 18" /></>,
  chevronUp: <><polyline points="6 15 12 9 18 15" /></>,
  arrowRight: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></>,
  arrowLeft: <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="11 6 5 12 11 18" /></>,
  edit: <><path d="M4 20h4l11-11-4-4L4 16v4z" /><path d="M14 5l4 4" /></>,
  trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" /></>,
  copy: <><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M16 3H5a2 2 0 00-2 2v11" /></>,
  eye: <><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <><path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a18.6 18.6 0 014.22-5.06" /><path d="M9.9 4.24A10.9 10.9 0 0112 4c7 0 11 7 11 7a18.5 18.5 0 01-2.16 3.19" /><path d="M14.12 14.12a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>,
  upload: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>,
  camera: <><path d="M3 7h3l2-3h8l2 3h3a1 1 0 011 1v11a1 1 0 01-1 1H3a1 1 0 01-1-1V8a1 1 0 011-1z" /><circle cx="12" cy="13" r="4" /></>,
  drag: <><circle cx="9" cy="6" r="1" /><circle cx="15" cy="6" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="9" cy="18" r="1" /><circle cx="15" cy="18" r="1" /></>,
  more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  filter: <><polyline points="22 3 2 3 10 12.5 10 19 14 21 14 12.5 22 3" /></>,
  sort: <><polyline points="3 6 7 2 11 6" /><line x1="7" y1="2" x2="7" y2="14" /><polyline points="13 14 17 18 21 14" /><line x1="17" y1="6" x2="17" y2="18" /></>,
  info: <><circle cx="12" cy="12" r="9" /><line x1="12" y1="11" x2="12" y2="16" /><circle cx="12" cy="8" r="0.5" fill="currentColor" stroke="none" /></>,
  alert: <><path d="M12 2L2 20h20L12 2z" /><line x1="12" y1="9" x2="12" y2="14" /><circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="none" /></>,
  bell: <><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M10 21a2 2 0 004 0" /></>,
  star: <><polygon points="12 2 15 9 22 9.5 17 14.5 18.5 21.5 12 18 5.5 21.5 7 14.5 2 9.5 9 9 12 2" /></>,
  git: <><circle cx="6" cy="6" r="2.5" /><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="12" r="2.5" /><path d="M6 8.5v7" /><path d="M15.5 12a6 6 0 01-9.5 0" /></>,
  play: <><polygon points="6 4 20 12 6 20 6 4" /></>,
  pause: <><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></>,
  refresh: <><polyline points="23 4 23 10 17 10" /><path d="M20.5 15a9 9 0 11-2.1-9.4L23 10" /></>,
  list: <><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.5" y2="6" /><line x1="3" y1="12" x2="3.5" y2="12" /><line x1="3" y1="18" x2="3.5" y2="18" /></>,
  tag: <><path d="M20 12l-9 9a1.4 1.4 0 01-2 0L2 14V3h11l7 7a1.4 1.4 0 010 2z" /><circle cx="7" cy="7" r="1.5" /></>,
  link: <><path d="M10 14a4 4 0 005.66 0l3.34-3.34a4 4 0 00-5.66-5.66L11.5 6.5" /><path d="M14 10a4 4 0 00-5.66 0L5 13.34a4 4 0 005.66 5.66l1.84-1.84" /></>,
  save: <><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="6.34" y2="6.34" /><line x1="17.66" y1="17.66" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="6.34" y2="17.66" /><line x1="17.66" y1="6.34" x2="19.07" y2="4.93" /></>,
  moon: <><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" /></>,
  monitor: <><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>,
  phone: <><rect x="6" y="2" width="12" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></>,
  logout: <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
  sparkle: <><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" /></>,
};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: string;
  size?: number;
}

export function Icon({ name, size = 18, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {ICON_PATHS[name] ?? null}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Button
// ─────────────────────────────────────────────────────────────
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
type ButtonSize = "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  full?: boolean;
  iconLeft?: string;
  iconRight?: string;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  full = false,
  iconLeft,
  iconRight,
  loading = false,
  disabled,
  className = "",
  children,
  type,
  ...rest
}: ButtonProps) {
  const cls = ["btn", `btn-${variant}`, size !== "md" && `btn-${size}`, full && "btn-full", className]
    .filter(Boolean)
    .join(" ");
  return (
    <button
      type={type ?? "button"}
      className={cls}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {iconLeft && <Icon name={iconLeft} size={16} className="icon" />}
      {children}
      {iconRight && <Icon name={iconRight} size={16} className="icon" />}
    </button>
  );
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  bordered?: boolean;
  size?: number;
}

export function IconButton({ icon, bordered, size = 18, className = "", ...rest }: IconButtonProps) {
  return (
    <button className={`icon-btn ${bordered ? "bordered" : ""} ${className}`} {...rest}>
      <Icon name={icon} size={size} />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Field + Input + Textarea + Select
// ─────────────────────────────────────────────────────────────
export interface FieldProps {
  label?: ReactNode;
  required?: boolean;
  helper?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
}

export function Field({ label, required, helper, error, children }: FieldProps) {
  return (
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
}

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  prefix?: string | ReactNode;
  suffix?: string | ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { prefix, suffix, className, ...rest },
  ref
) {
  if (prefix || suffix) {
    return (
      <div className={`input-with-${prefix ? "prefix" : "suffix"}`}>
        {prefix && (
          <span className="input-affix input-prefix">
            {typeof prefix === "string" ? <Icon name={prefix} size={16} /> : prefix}
          </span>
        )}
        <input ref={ref} className={`input ${className ?? ""}`} {...rest} />
        {suffix && (
          <span className="input-affix input-suffix">
            {typeof suffix === "string" ? <Icon name={suffix} size={16} /> : suffix}
          </span>
        )}
      </div>
    );
  }
  return <input ref={ref} className={`input ${className ?? ""}`} {...rest} />;
});

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`textarea ${props.className ?? ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`select ${props.className ?? ""}`} />;
}

// ─────────────────────────────────────────────────────────────
// Toggle + Checkbox
// ─────────────────────────────────────────────────────────────
export interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: ReactNode;
  ariaLabel?: string;
}

export function Toggle({ checked, onChange, label, ariaLabel }: ToggleProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--size-300)" }}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        className="toggle"
        onClick={() => onChange(!checked)}
      />
      {label && (
        <span style={{ fontSize: "var(--text-body-md)", color: "var(--sm-content-primary)" }}>{label}</span>
      )}
    </div>
  );
}

export interface CheckboxProps {
  checked: boolean | "mixed";
  onChange: (next: boolean) => void;
  ariaLabel?: string;
}

export function Checkbox({ checked, onChange, ariaLabel }: CheckboxProps) {
  const state: "true" | "false" | "mixed" = checked === "mixed" ? "mixed" : checked ? "true" : "false";
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={state}
      aria-label={ariaLabel}
      className="checkbox"
      onClick={() => onChange(checked !== true)}
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
}

// ─────────────────────────────────────────────────────────────
// Badge + Chip
// ─────────────────────────────────────────────────────────────
export type BadgeTone = "neutral" | "brand" | "success" | "warning" | "danger" | "info";

export interface BadgeProps {
  tone?: BadgeTone;
  dot?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}

export function Badge({ tone = "neutral", dot, children, style }: BadgeProps) {
  return (
    <span className={`badge badge-${tone}`} style={style}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}

export interface ChipProps {
  selected?: boolean;
  count?: number;
  onClick?: () => void;
  children: ReactNode;
}

export function Chip({ selected, count, onClick, children }: ChipProps) {
  return (
    <button type="button" className={`chip ${selected ? "selected" : ""}`} onClick={onClick}>
      {children}
      {count !== undefined && <span className="chip-count">{count}</span>}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Card
// ─────────────────────────────────────────────────────────────
export interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Card({ children, className = "", style }: CardProps) {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Modal
// ─────────────────────────────────────────────────────────────
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  desc?: ReactNode;
  size?: "sm" | "md" | "lg";
  footer?: ReactNode;
  children: ReactNode;
}

export function Modal({ open, onClose, title, desc, size = "sm", footer, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
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
        aria-labelledby={title ? "modal-title" : undefined}
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
}

// ─────────────────────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────────────────────
export type ToastTone = "info" | "success" | "error";

export interface ToastEntry {
  id: string;
  tone?: ToastTone;
  message: ReactNode;
  duration?: number;
}

type ToastFn = (toast: Omit<ToastEntry, "id">) => void;

const ToastContext = createContext<ToastFn | null>(null);

export function useToast(): ToastFn {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast: ToastProvider 가 트리 상위에 없음");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const add = useCallback<ToastFn>((toast) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, ...toast }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), toast.duration ?? 3500);
  }, []);

  return (
    <ToastContext.Provider value={add}>
      {children}
      <div className="toast-region" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast ${t.tone ?? "info"}`}
            role={t.tone === "error" ? "alert" : "status"}
          >
            <span className="toast-icon">
              <Icon
                name={t.tone === "success" ? "check" : t.tone === "error" ? "alert" : "info"}
                size={14}
              />
            </span>
            <div className="toast-body">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
