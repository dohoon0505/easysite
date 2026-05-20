/**
 * Chip — Spec: desgin_system/components/chip.schema.json
 * 카테고리 필터·태그 표시·다중 선택용.
 */
import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  children: ReactNode;
}

export function Chip({
  selected = false,
  removable = false,
  onRemove,
  className,
  children,
  ...rest
}: ChipProps) {
  return (
    <button
      type="button"
      className={clsx("chip", selected && "chip--selected", className)}
      aria-pressed={selected || undefined}
      {...rest}
    >
      <span>{children}</span>
      {removable && (
        <span
          className="chip-x"
          aria-label="제거"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
        >
          ✕
        </span>
      )}
    </button>
  );
}
