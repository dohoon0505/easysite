/**
 * Badge — Spec: desgin_system/components/badge.schema.json
 * 상태·태그·카운트 표시. variant 로 톤 선택.
 */
import clsx from "clsx";
import type { ReactNode } from "react";

export type BadgeTone =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info";

export interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}

export function Badge({ tone = "neutral", children, className }: BadgeProps) {
  return (
    <span className={clsx("badge", `badge-${tone}`, className)}>
      {children}
    </span>
  );
}
