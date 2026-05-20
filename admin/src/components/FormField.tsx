/**
 * FormField — Spec: desgin_system/components/form-field.schema.json
 * Label + Control + Help/Error 텍스트의 컨테이너. RHF 통합 패턴.
 */
import type { ReactNode } from "react";

export interface FormFieldProps {
  label: string;
  required?: boolean;
  helpText?: string;
  errorText?: string;
  htmlFor?: string;
  children: ReactNode;
}

export function FormField({
  label,
  required = false,
  helpText,
  errorText,
  htmlFor,
  children,
}: FormFieldProps) {
  return (
    <div className="ff">
      <label className="ff-label" htmlFor={htmlFor}>
        {label}
        {required && <span className="ff-required" aria-hidden>*</span>}
      </label>
      {children}
      {errorText ? (
        <span role="alert" className="ff-error">{errorText}</span>
      ) : helpText ? (
        <span className="ff-help">{helpText}</span>
      ) : null}
    </div>
  );
}
