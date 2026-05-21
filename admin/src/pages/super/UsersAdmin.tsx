import { StubPage } from "../_StubPage";

export function UsersAdmin() {
  return (
    <StubPage
      title="사용자 관리"
      subtitle="역할(super/owner/editor) · 사이트(siteId) claim 부여."
      icon="users"
      note="기존 setSiteClaim callable + users 컬렉션 onSnapshot 로직을 새 디자인으로 포팅 예정."
    />
  );
}
