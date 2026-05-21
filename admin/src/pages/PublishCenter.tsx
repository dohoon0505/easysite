import { StubPage } from "./_StubPage";

export function PublishCenter() {
  return (
    <StubPage
      title="발행 센터"
      subtitle="드래프트/라이브 diff · 발행 메모 · GitHub 커밋 이력."
      icon="rocket"
      note="page-publish.jsx 디자인을 publishToGitHub callable + sites/{siteId}/publishes 컬렉션과 연결 예정."
    />
  );
}
