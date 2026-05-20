/**
 * AuthBoundary — onIdTokenChanged 를 구독하여 authStore 를 갱신.
 * 미인증 사용자는 /login 으로 리다이렉트. 로딩 중엔 spinner.
 */
import { useEffect, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/state/authStore";
import type { AuthClaims, UserRole } from "@/types";

interface AuthBoundaryProps {
  /** "super" 이면 슈퍼 어드민만 통과. "any" 면 로그인만 확인. */
  requireRole?: "any" | "super";
  children: ReactNode;
}

export function AuthBoundary({
  requireRole = "any",
  children,
}: AuthBoundaryProps) {
  const status = useAuth((s) => s.status);
  const claims = useAuth((s) => s.claims);
  const location = useLocation();

  if (status === "loading") return <FullScreenSpinner />;

  if (status === "signedOut") {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requireRole === "super" && claims?.role !== "super") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

/** 앱 루트에 한 번 마운트되어 onIdTokenChanged 를 구독. */
export function AuthListener() {
  const setSession = useAuth((s) => s.setSession);
  const setSignedOut = useAuth((s) => s.setSignedOut);

  useEffect(() => {
    return onIdTokenChanged(auth, async (user) => {
      if (!user) {
        setSignedOut();
        return;
      }
      const tokenResult = await user.getIdTokenResult();
      const role = (tokenResult.claims.role as UserRole | undefined) ?? "editor";
      const siteId =
        role === "super"
          ? null
          : ((tokenResult.claims.siteId as string | undefined) ?? null);
      const claims: AuthClaims = { role, siteId };
      setSession({ user, claims });
    });
  }, [setSession, setSignedOut]);

  return null;
}

function FullScreenSpinner() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        color: "var(--sm-content-secondary)",
        font: "var(--text-body-md)",
      }}
    >
      불러오는 중…
    </div>
  );
}
