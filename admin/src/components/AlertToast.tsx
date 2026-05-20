/**
 * AlertToast — Spec: desgin_system/components/alert-toast.schema.json
 * 전역 toast container. toastStore 를 구독하여 자동 표시.
 */
import clsx from "clsx";
import { useToasts } from "@/state/toastStore";

export function ToastContainer() {
  const toasts = useToasts((s) => s.toasts);
  const dismiss = useToasts((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="알림">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={clsx("toast", `toast-${t.tone}`)}
          role={t.tone === "danger" || t.tone === "warning" ? "alert" : "status"}
        >
          <div className="toast-message">{t.message}</div>
          <button
            type="button"
            className="toast-close"
            aria-label="닫기"
            onClick={() => dismiss(t.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
