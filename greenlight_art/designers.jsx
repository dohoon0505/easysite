/* eslint-disable */
// 풀빛그림아이 미술학원 — 홈 슬라이더용 작품 큐레이션

// 베스트 작품 / 우리 아이 그림 / 입시 작품 / 굿즈 4개 슬라이더
const GALLERY_BEST = [
  { id: "gb1", name: "포카리스웨트 정물", age: "초6", img: "img/work_1.jpg", desc: "마카+색연필로 표현한 정물 일러스트. 색감과 빛 표현이 돋보이는 작품." },
  { id: "gb2", name: "큐브 소묘",         age: "초5", img: "img/work_2.jpg", desc: "기초 소묘 입시 과제. 명암 단계와 면 처리를 익혀요." },
  { id: "gb3", name: "츄파춥스 일러스트", age: "중1", img: "img/work_3.jpg", desc: "마카로 표현한 츄파춥스. 화면 구성과 색감 대비 연습." },
  { id: "gb4", name: "과일 정물 마카",    age: "초6", img: "img/work_6.jpg", desc: "다양한 과일을 마카로 표현. 입체감과 텍스처 묘사를 연습해요." },
];

const GALLERY_KIDS = [
  { id: "gk1", name: "아이클레이 만들기",     age: "초2", img: "img/work_8.jpg", desc: "친구들과 함께 만든 클레이 디저트. 협동 작업의 즐거움." },
  { id: "gk2", name: "돌멩이 캐릭터",         age: "초3", img: "img/work_5.jpg", desc: "돌멩이 위에 그린 귀여운 캐릭터들. 입체와 회화의 만남." },
  { id: "gk3", name: "포카리스웨트 정물",     age: "초6", img: "img/work_1.jpg", desc: "마카+색연필로 표현한 음료 일러스트." },
  { id: "gk4", name: "츄파춥스 마카 작업",    age: "중1", img: "img/work_3.jpg", desc: "익숙한 캔디를 마카로 새롭게 표현." },
];

const GALLERY_EXAM = [
  { id: "ge1", name: "기초 큐브 소묘",        age: "중2", img: "img/work_2.jpg", desc: "예중·예고 입시 기초. 면과 명암을 정확히 잡는 훈련." },
  { id: "ge2", name: "과일 정물 마카",        age: "고1", img: "img/work_6.jpg", desc: "대학 입시 발상의 전환. 익숙한 소재를 새롭게 보기." },
  { id: "ge3", name: "포카리스웨트 묘사",     age: "고2", img: "img/work_1.jpg", desc: "재질감을 살린 정물 묘사. 빛과 그림자의 미묘함을 잡아요." },
];

const GALLERY_GOODS = [
  { id: "gg1", name: "아이패드 드로잉 굿즈",  age: "성인", img: "img/work_7.jpg", desc: "본인이 그린 그림으로 폰케이스·에코백을 제작했어요." },
  { id: "gg2", name: "아크릴 미러 작품",      age: "초5",  img: "img/work_5.jpg", desc: "아크릴 위에 페인팅한 미러 작품 시리즈." },
  { id: "gg3", name: "돌멩이 굿즈",           age: "초3",  img: "img/work_5.jpg", desc: "돌멩이를 활용한 입체 캐릭터 작업." },
];

window.GALLERY_BEST  = GALLERY_BEST;
window.GALLERY_KIDS  = GALLERY_KIDS;
window.GALLERY_EXAM  = GALLERY_EXAM;
window.GALLERY_GOODS = GALLERY_GOODS;
