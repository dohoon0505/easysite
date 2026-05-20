/**
 * Skeleton — Spec: desgin_system/components/skeleton-loader.schema.json
 * 로딩 중 컨텐츠 placeholder. shimmer 애니메이션.
 */
import clsx from "clsx";
import type { CSSProperties } from "react";

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  rounded?: "sm" | "md" | "lg" | "full";
  className?: string;
}

export function Skeleton({
  width = "100%",
  height = 16,
  rounded = "md",
  className,
}: SkeletonProps) {
  const style: CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };
  return (
    <span
      className={clsx("skeleton", `skeleton-${rounded}`, className)}
      style={style}
      aria-hidden
    />
  );
}
