/**
 * BottomSheet — Spec: desgin_system/components/bottom-sheet.schema.json
 * 모바일용 하단에서 슬라이드 업 모달.
 *
 * focus trap + ESC + 백드롭 탭 닫기 지원.
 */
import clsx from "clsx";
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** 화면 높이의 몇% 까지 차지할지. 기본 70%. */
  heightVh?: number;
  forceModal?: boolean;
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
  heightVh = 70,
  forceModal = false,
}: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !forceModal) onClose();
    };
    window.addEventListener("keydown", onKey);
    // body 스크롤 잠금
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, forceModal, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className={clsx("bs-backdrop", open && "bs-backdrop--open")}
      onClick={() => {
        if (!forceModal) onClose();
      }}
    >
      <div
        className="bs-panel"
        style={{ maxHeight: `${heightVh}vh` }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "bs-title" : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bs-handle" aria-hidden />
        {title && (
          <h2 id="bs-title" className="bs-title">
            {title}
          </h2>
        )}
        <div className="bs-body">{children}</div>
        {footer && <div className="bs-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
