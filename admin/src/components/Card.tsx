/**
 * Card — Spec: desgin_system/components/card.schema.json
 * 가장 단순한 컨테이너. 라디우스 + 보더 + 패딩.
 */
import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  density?: "tight" | "default" | "loose";
  children?: ReactNode;
}

export function Card({
  density = "default",
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={clsx(
        "card",
        density === "tight" && "card-tight",
        density === "loose" && "card-loose",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
