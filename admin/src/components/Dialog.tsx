/**
 * Dialog — Spec: desgin_system/components/dialog.schema.json
 * 데스크톱용 중앙 정렬 모달. 네이티브 <dialog> 사용.
 *
 * 모바일에서는 ResponsiveModal 로 BottomSheet 로 자동 전환됨.
 */
import clsx from "clsx";
import { useEffect, useRef, type ReactNode } from "react";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  tone?: "neutral" | "destructive";
  /** ESC·바깥 클릭 닫기 비활성. confirm 같이 강제 응답 케이스. */
  forceModal?: boolean;
}

export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  tone = "neutral",
  forceModal = false,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onCancel = (e: Event) => {
      if (forceModal) {
        e.preventDefault();
        return;
      }
      onClose();
    };
    const onClick = (e: MouseEvent) => {
      if (forceModal) return;
      // 백드롭 클릭 = el 자신을 클릭한 경우 (이벤트 target == dialog)
      if (e.target === el) onClose();
    };
    el.addEventListener("cancel", onCancel);
    el.addEventListener("click", onClick);
    return () => {
      el.removeEventListener("cancel", onCancel);
      el.removeEventListener("click", onClick);
    };
  }, [forceModal, onClose]);

  return (
    <dialog
      ref={ref}
      className={clsx("dialog", `dialog-${size}`, tone === "destructive" && "dialog-destructive")}
      aria-labelledby={title ? "dialog-title" : undefined}
    >
      <div className="dialog-inner" onClick={(e) => e.stopPropagation()}>
        {title && (
          <h2 id="dialog-title" className="dialog-title">
            {title}
          </h2>
        )}
        <div className="dialog-body">{children}</div>
        {footer && <div className="dialog-footer">{footer}</div>}
      </div>
    </dialog>
  );
}
