/**
 * Login 페이지 — 새 디자인 (Card 가운데 정렬, navy accent).
 */
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button, Card, Field, Input, useToast } from "@/components";
import { signIn, resetPassword } from "@/lib/auth";

const schema = z.object({
  email: z.string().email("이메일 형식이 아닙니다."),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
});
type FormValues = z.infer<typeof schema>;

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [resetting, setResetting] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      await signIn(values.email, values.password);
      const from = (location.state as { from?: string } | null)?.from ?? "/";
      navigate(from, { replace: true });
    } catch (e) {
      toast({ tone: "error", message: mapAuthError(e) });
    } finally {
      setSubmitting(false);
    }
  }

  async function onReset() {
    const email = getValues("email");
    if (!email) {
      toast({ tone: "error", message: "이메일을 먼저 입력해 주세요." });
      return;
    }
    setResetting(true);
    try {
      await resetPassword(email);
      toast({ tone: "success", message: `${email} 로 비밀번호 재설정 메일을 보냈습니다.` });
    } catch (e) {
      toast({ tone: "error", message: mapAuthError(e) });
    } finally {
      setResetting(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "var(--size-500)",
        background: "var(--sm-background-subtle)",
      }}
    >
      <Card style={{ width: "100%", maxWidth: 420 }}>
        <div className="card-body">
          <div
            className="brand-mark"
            style={{
              width: 48,
              height: 48,
              fontSize: 22,
              marginBottom: "var(--size-400)",
            }}
          >
            e
          </div>
          <h1
            style={{
              font: "var(--text-heading-md)",
              fontWeight: 700,
              marginBottom: "var(--size-150)",
              letterSpacing: "-0.02em",
            }}
          >
            easysite 어드민
          </h1>
          <p
            style={{
              font: "var(--text-body-sm)",
              color: "var(--sm-content-secondary)",
              marginBottom: "var(--size-600)",
            }}
          >
            운영자 계정으로 로그인하세요.
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column", gap: "var(--size-400)" }}
          >
            <Field label="이메일" required error={errors.email?.message}>
              <Input
                type="email"
                autoComplete="username"
                inputMode="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
            </Field>

            <Field label="비밀번호" required error={errors.password?.message}>
              <Input
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
            </Field>

            <Button type="submit" variant="primary" size="lg" full loading={submitting}>
              {submitting ? "로그인 중…" : "로그인"}
            </Button>
            <Button type="button" variant="ghost" full onClick={onReset} loading={resetting}>
              비밀번호 재설정 메일 보내기
            </Button>
          </form>
        </div>
      </Card>
    </main>
  );
}

function mapAuthError(e: unknown): string {
  const code = (e as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/invalid-email":
      return "이메일 형식이 올바르지 않습니다.";
    case "auth/user-disabled":
      return "비활성화된 계정입니다. 슈퍼 어드민에게 문의하세요.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "이메일 또는 비밀번호가 일치하지 않습니다.";
    case "auth/too-many-requests":
      return "잠시 후 다시 시도해 주세요.";
    default:
      return (e as Error)?.message ?? "로그인 중 오류가 발생했습니다.";
  }
}
