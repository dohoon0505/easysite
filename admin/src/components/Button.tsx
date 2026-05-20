/**
 * Button — Spec: desgin_system/components/button.schema.json
 * Tokens: --sm-interactive-brand-default, --sm-content-onBrand, --radius-md
 * M2 phase 에서는 5개 variant (primary, secondary, outline, ghost, danger) 만 구현.
 * 나머지 (tonal, dark) + modifiers (pill, icon, fab) 는 M3 에서 추가.
 */
import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  children?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled,
  children,
  className,
  type,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type ?? "button"}
      className={clsx(
        "btn",
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth && "btn-full",
        className
      )}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      {...rest}
    >
      {children}
    </button>
  );
}
