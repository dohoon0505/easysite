/**
 * Dashboard (M2 placeholder).
 * M3 에서 stat card · 최근 변경 내역 · 빠른 액션을 추가.
 */
import { Link } from "react-router-dom";
import { Button, Card } from "@/components";
import { signOut } from "@/lib/auth";
import { useAuth, useIsSuper } from "@/state/authStore";

export function Dashboard() {
  const user = useAuth((s) => s.user);
  const claims = useAuth((s) => s.claims);
  const isSuper = useIsSuper();

  return (
    <main style={{ padding: "24px 16px", maxWidth: 960, margin: "0 auto" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1 style={{ font: "var(--text-heading-md)" }}>대시보드</h1>
        <Button variant="ghost" size="sm" onClick={() => void signOut()}>
          로그아웃
        </Button>
      </header>

      <Card density="default" style={{ marginBottom: 16 }}>
        <p style={{ font: "var(--text-body-md)" }}>
          <strong>{user?.email}</strong> 로 로그인 중
        </p>
        <p
          style={{
            font: "var(--text-body-sm)",
            color: "var(--sm-content-secondary)",
            marginTop: 8,
          }}
        >
          역할: <code>{claims?.role}</code>
          {claims?.siteId && (
            <>
              {" "}
              · 사이트: <code>{claims.siteId}</code>
            </>
          )}
        </p>
      </Card>

      {isSuper && (
        <Card density="default">
          <h2 style={{ font: "var(--text-heading-sm)", marginBottom: 8 }}>
            슈퍼 어드민 기능
          </h2>
          <p
            style={{
              font: "var(--text-body-sm)",
              color: "var(--sm-content-secondary)",
              marginBottom: 16,
            }}
          >
            사용자에게 사이트 권한(siteId·role) 을 부여합니다.
          </p>
          <Link to="/super/users">
            <Button variant="outline" size="md">
              사용자 관리
            </Button>
          </Link>
        </Card>
      )}
    </main>
  );
}
