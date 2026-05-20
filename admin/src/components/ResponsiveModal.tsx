/**
 * ResponsiveModal — 데스크톱은 Dialog, 모바일은 BottomSheet 로 자동 전환.
 *
 * 페이지 코드는 항상 ResponsiveModal 만 호출하면 됨.
 */
import type { ReactNode } from "react";
import { Dialog } from "./Dialog";
import { BottomSheet } from "./BottomSheet";
import { useIsMobile } from "@/hooks/useMediaQuery";

export interface ResponsiveModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Dialog 크기 (데스크톱). */
  size?: "sm" | "md" | "lg";
  tone?: "neutral" | "destructive";
  forceModal?: boolean;
}

export function ResponsiveModal(props: ResponsiveModalProps) {
  const isMobile = useIsMobile();
  return isMobile ? (
    <BottomSheet
      open={props.open}
      onClose={props.onClose}
      title={props.title}
      footer={props.footer}
      forceModal={props.forceModal}
    >
      {props.children}
    </BottomSheet>
  ) : (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      title={props.title}
      footer={props.footer}
      size={props.size}
      tone={props.tone}
      forceModal={props.forceModal}
    >
      {props.children}
    </Dialog>
  );
}
