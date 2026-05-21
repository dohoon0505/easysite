import { StubPage } from "./_StubPage";

export function ProductEdit() {
  return (
    <StubPage
      title="상품 편집"
      subtitle="기본 정보 · 이미지 업로드 · 사이트 타입별 추가 필드."
      icon="edit"
      note="page-editor.jsx 디자인을 Firestore upsertProduct() + Storage uploadProductImage() 와 연결 예정."
    />
  );
}
