/**
 * 사용자 관리 (슈퍼 전용).
 * Firestore `users` 컬렉션을 실시간으로 보여주고, 각 사용자에 setSiteClaim 부여.
 * M2 는 최소 UI — uid · email · role · siteId 카드 리스트.
 */
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import { Button, Card, FormField, TextField } from "@/components";
import { db } from "@/lib/firebase";
import { callSetSiteClaim } from "@/lib/functions";
import { toast } from "@/state/toastStore";
import { useAuth } from "@/state/authStore";
import type { User, UserRole } from "@/types";

interface UserRow extends User {}

export function UsersAdmin() {
  const currentUser = useAuth((s) => s.user);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setUsers(snap.docs.map((d) => d.data() as UserRow));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const summary = useMemo(() => {
    const byRole = { super: 0, owner: 0, editor: 0 };
    for (const u of users) byRole[u.role] = (byRole[u.role] ?? 0) + 1;
    return byRole;
  }, [users]);

  return (
    <main style={{ padding: "24px 16px", maxWidth: 960, margin: "0 auto" }}>
      <header style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link to="/">
            <Button variant="ghost" size="sm">← 대시보드</Button>
          </Link>
          <h1 style={{ font: "var(--text-heading-md)" }}>사용자 관리</h1>
        </div>
        <p
          style={{
            font: "var(--text-body-sm)",
            color: "var(--sm-content-secondary)",
            marginTop: 8,
          }}
        >
          전체 {users.length}명 · super {summary.super} · owner {summary.owner} · editor{" "}
          {summary.editor}
        </p>
      </header>

      {loading && <Card density="default">불러오는 중…</Card>}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {users.map((u) => (
          <UserRowCard
            key={u.uid}
            user={u}
            isSelf={u.uid === currentUser?.uid}
          />
        ))}
      </div>
    </main>
  );
}

function UserRowCard({ user, isSelf }: { user: UserRow; isSelf: boolean }) {
  const [editing, setEditing] = useState(false);
  const [role, setRole] = useState<UserRole>(user.role);
  const [siteId, setSiteId] = useState<string>(user.siteId ?? "");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (role !== "super" && !siteId.trim()) {
      toast.warning("editor/owner 는 siteId 가 필수입니다.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await callSetSiteClaim({
        uid: user.uid,
        siteId: role === "super" ? null : siteId.trim(),
        role,
      });
      toast.success(
        `${user.email} 에게 ${res.data.claims.role}${
          res.data.claims.siteId ? `/${res.data.claims.siteId}` : ""
        } 부여 완료`
      );
      setEditing(false);
    } catch (e) {
      toast.danger(
        (e as { message?: string })?.message ?? "claim 부여에 실패했습니다."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card density="default">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ font: "var(--text-body-md)", fontWeight: 600 }}>
            {user.email ?? user.uid}
            {isSelf && (
              <span
                style={{
                  marginLeft: 8,
                  font: "var(--text-caption)",
                  color: "var(--sm-content-tertiary)",
                }}
              >
                (본인)
              </span>
            )}
          </div>
          <div
            style={{
              font: "var(--text-caption)",
              color: "var(--sm-content-tertiary)",
              marginTop: 4,
            }}
          >
            uid <code>{user.uid}</code> · role <code>{user.role}</code>
            {user.siteId && (
              <>
                {" "}
                · siteId <code>{user.siteId}</code>
              </>
            )}
          </div>
        </div>
        {!editing && !isSelf && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditing(true)}
          >
            권한 변경
          </Button>
        )}
      </div>

      {editing && (
        <form
          onSubmit={onSubmit}
          style={{
            marginTop: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <FormField label="role" required>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="tf-input"
            >
              <option value="editor">editor</option>
              <option value="owner">owner</option>
              <option value="super">super</option>
            </select>
          </FormField>
          {role !== "super" && (
            <FormField
              label="siteId"
              required
              helpText="예: dohwawon, bell_cake, PARKHAD, flower_example, greenlight_art"
            >
              <TextField
                value={siteId}
                onChange={(e) => setSiteId(e.target.value)}
                placeholder="dohwawon"
              />
            </FormField>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <Button type="submit" variant="primary" size="md" loading={submitting}>
              저장
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => {
                setEditing(false);
                setRole(user.role);
                setSiteId(user.siteId ?? "");
              }}
            >
              취소
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
