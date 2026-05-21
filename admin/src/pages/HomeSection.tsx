import { StubPage } from "./_StubPage";

export function HomeSection() {
  return (
    <StubPage
      title="홈 섹션 편집"
      subtitle="사이트 첫 화면의 히어로·인사말·CTA·매장 정보·공지를 관리합니다."
      icon="home"
      note="디자이너 인계된 page-home.jsx (3-컬럼: 섹션 리스트 + 편집기 + 모바일 미리보기) 를 Firestore homeSection 컬렉션과 연결하는 작업이 다음 단계입니다."
    />
  );
}
