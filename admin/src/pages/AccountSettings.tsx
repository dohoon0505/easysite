/**
 * AccountSettings — 본인 계정 관리.
 *  - 표시 이름 변경
 *  - 비밀번호 재설정 메일 전송
 *  - 현재 claim 확인
 */
import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { Badge, Button, Card, FormField, TextField } from "@/components";
import { resetPassword } from "@/lib/auth";
import { auth as fbAuth } from "@/lib/firebase";
import { useAuth } from "@/state/authStore";
import { toast } from "@/state/toastStore";

export function AccountSettings() {
  const user = useAuth((s) => s.user);
  const claims = useAuth((s) => s.claims);

  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [savingName, setSavingName] = useState(false);
  const [resetting, setResetting] = useState(false);

  if (!user) {
    return <Card>로그인 정보가 없습니다.</Card>;
  }

  const onSaveName = async () => {
    if (!fbAuth.currentUser) return;
    setSavingName(true);
    try {
      await updateProfile(fbAuth.currentUser, { displayName });
      toast.success("표시 이름이 변경되었습니다.");
    } catch (e) {
      toast.danger((e as Error).message);
    } finally {
      setSavingName(false);
    }
  };

  const onReset = async () => {
    if (!user.email) {
      toast.warning("이메일이 없는 계정입니다.");
      return;
    }
    setResetting(true);
    try {
      await resetPassword(user.email);
      toast.success(`${user.email} 로 비밀번호 재설정 메일을 보냈습니다.`);
    } catch (e) {
      toast.danger((e as Error).message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <header>
        <h1 style={{ font: "var(--text-heading-md)" }}>계정 설정</h1>
      </header>

      <Card density="default">
        <h2 style={{ font: "var(--text-heading-sm)", marginBottom: 12 }}>계정 정보</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, font: "var(--text-body-md)" }}>
          <div>
            <span style={{ color: "var(--sm-content-secondary)" }}>이메일: </span>
            <strong>{user.email}</strong>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ color: "var(--sm-content-secondary)" }}>역할: </span>
            <Badge tone={claims?.role === "super" ? "brand" : "info"}>{claims?.role}</Badge>
            {claims?.siteId && (
              <>
                <span style={{ color: "var(--sm-content-secondary)" }}>· 사이트:</span>
                <code>{claims.siteId}</code>
              </>
            )}
          </div>
          <div>
            <span style={{ color: "var(--sm-content-secondary)" }}>UID: </span>
            <code style={{ font: "var(--text-caption)", color: "var(--sm-content-tertiary)" }}>
              {user.uid}
            </code>
          </div>
        </div>
      </Card>

      <Card density="default">
        <h2 style={{ font: "var(--text-heading-sm)", marginBottom: 12 }}>표시 이름</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <FormField label="표시 이름">
            <TextField
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="홍길동"
            />
          </FormField>
          <Button
            variant="primary"
            size="md"
            loading={savingName}
            onClick={() => void onSaveName()}
          >
            저장
          </Button>
        </div>
      </Card>

      <Card density="default">
        <h2 style={{ font: "var(--text-heading-sm)", marginBottom: 12 }}>비밀번호</h2>
        <p style={{ font: "var(--text-body-sm)", color: "var(--sm-content-secondary)", marginBottom: 12 }}>
          비밀번호 재설정 링크가 가입 이메일로 발송됩니다.
        </p>
        <Button
          variant="outline"
          size="md"
          loading={resetting}
          onClick={() => void onReset()}
        >
          재설정 메일 전송
        </Button>
      </Card>
    </div>
  );
}
