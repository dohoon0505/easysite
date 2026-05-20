/**
 * TextField — Spec: desgin_system/components/text-field.schema.json
 * 단일 행 텍스트 입력. RHF 의 register() 와 spread 호환.
 */
import clsx from "clsx";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ error, className, type, ...rest }, ref) {
    return (
      <input
        ref={ref}
        type={type ?? "text"}
        className={clsx(
          "tf-input",
          error && "tf-input--error",
          className
        )}
        aria-invalid={error || undefined}
        {...rest}
      />
    );
  }
);
