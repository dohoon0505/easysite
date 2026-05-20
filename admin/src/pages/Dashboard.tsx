/**
 * Dashboard — 사이트 요약 + 최근 발행/감사 로그 (M3).
 * M3 는 기본 정보 표시. 상세 차트는 M6 이후.
 */
import { Link } from "react-router-dom";
import { Badge, Button, Card, EmptyState } from "@/components";
import { PackageIcon } from "@/components/icons";
import { useSubscribed } from "@/hooks/useFirestoreCollection";
import { useAuth, useIsSuper } from "@/state/authStore";
import { subscribePublishes } from "@/lib/firestore/publish";
import { subscribeAuditLogs } from "@/lib/firestore/auditLogs";
import type { AuditLog, Publish } from "@/types";

export function Dashboard() {
  const claims = useAuth((s) => s.claims);
  const user = useAuth((s) => s.user);
  const isSuper = useIsSuper();
  const siteId = claims?.siteId;

  const publishes = useSubscribed<Publish[]>(
    (onNext, onErr) =>
      siteId ? subscribePublishes(siteId, 5, onNext, onErr) : () => {},
    [siteId]
  );
  const auditLogs = useSubscribed<AuditLog[]>(
    (onNext, onErr) =>
      siteId ? subscribeAuditLogs(siteId, 10, onNext, onErr) : () => {},
    [siteId]
  );

  if (!siteId && !isSuper) {
    return (
      <EmptyState
        title="사이트가 지정되지 않았습니다"
        description="슈퍼 어드민에게 권한 부여를 요청하세요."
      />
    );
  }

  if (isSuper && !siteId) {
    return (
      <Card density="default">
        <h2 style={{ font: "var(--text-heading-sm)", marginBottom: 12 }}>슈퍼 어드민</h2>
        <p style={{ font: "var(--text-body-md)", color: "var(--sm-content-secondary)", marginBottom: 16 }}>
          현재 활성 사이트가 없습니다. 사이트별 작업은 좌측 메뉴에서 해당 페이지를 선택하세요.
        </p>
        <Link to="/super/users">
          <Button variant="outline" size="md">사용자 관리</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card density="default">
        <h1 style={{ font: "var(--text-heading-md)", marginBottom: 4 }}>{siteId}</h1>
        <p style={{ font: "var(--text-body-sm)", color: "var(--sm-content-secondary)" }}>
          {user?.email} · {claims?.role}
        </p>
      </Card>

      <Card density="default">
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ font: "var(--text-heading-sm)" }}>최근 발행</h2>
          <Link to="/publish">
            <Button variant="ghost" size="sm">발행 센터 →</Button>
          </Link>
        </header>
        {publishes.loading && <p style={{ color: "var(--sm-content-tertiary)" }}>불러오는 중…</p>}
        {publishes.data && publishes.data.length === 0 && (
          <p style={{ font: "var(--text-body-sm)", color: "var(--sm-content-tertiary)" }}>
            아직 발행 이력이 없습니다.
          </p>
        )}
        {publishes.data && publishes.data.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {publishes.data.map((p) => (
              <li key={p.publishId} style={{ font: "var(--text-body-sm)", color: "var(--sm-content-secondary)" }}>
                <code>{p.commitSha.slice(0, 7)}</code>{" "}
                · {p.counts.products}개 상품 · {p.publishedBy}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card density="default">
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ font: "var(--text-heading-sm)" }}>빠른 작업</h2>
        </header>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link to="/products/new">
            <Button variant="primary" size="md">
              <PackageIcon size={16} />
              상품 추가
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" size="md">상품 목록</Button>
          </Link>
          <Link to="/categories">
            <Button variant="outline" size="md">카테고리 관리</Button>
          </Link>
        </div>
      </Card>

      <Card density="default">
        <header style={{ marginBottom: 12 }}>
          <h2 style={{ font: "var(--text-heading-sm)" }}>최근 변경 내역</h2>
        </header>
        {auditLogs.loading && <p style={{ color: "var(--sm-content-tertiary)" }}>불러오는 중…</p>}
        {auditLogs.data && auditLogs.data.length === 0 && (
          <p style={{ font: "var(--text-body-sm)", color: "var(--sm-content-tertiary)" }}>
            아직 변경 내역이 없습니다.
          </p>
        )}
        {auditLogs.data && auditLogs.data.length > 0 && (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            {auditLogs.data.map((log) => (
              <li
                key={log.logId}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  font: "var(--text-body-sm)",
                  color: "var(--sm-content-secondary)",
                }}
              >
                <Badge tone={log.action === "delete" ? "danger" : log.action === "create" ? "success" : "info"}>
                  {log.action}
                </Badge>
                <code style={{ fontSize: 12 }}>{log.collection}</code>
                <span style={{ color: "var(--sm-content-tertiary)" }}>{log.docPath.split("/").pop()}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
