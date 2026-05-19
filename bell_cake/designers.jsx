/* eslint-disable */
// 벨케이크 — 디자이너 라인업

const DESIGNERS = [
  {
    id: "park",
    name: "박재현",
    enName: "PARK JAE HYUN",
    role: "대표 디자이너",
    rank: "DIRECTOR",
    years: 12,
    specialty: ["트렌드 펌", "남성 커트", "두피 케어"],
    bio: "원장 박재현. 12년간 남성 헤어만 다뤄온 정통파. 손님의 라이프스타일을 먼저 묻습니다.",
    initial: "P",
  },
  {
    id: "kim",
    name: "김민호",
    enName: "KIM MIN HO",
    role: "헤드 디자이너",
    rank: "HEAD",
    years: 8,
    specialty: ["댄디 컷", "히든 컬러"],
    bio: "단정한 정장 스타일과 트렌디 컷 사이의 균형감이 강점. 직장인 단골이 많아요.",
    initial: "M",
  },
  {
    id: "lee",
    name: "이지훈",
    enName: "LEE JI HOON",
    role: "시니어 디자이너",
    rank: "SENIOR",
    years: 5,
    specialty: ["크롭 컷", "트렌드 펌"],
    bio: "20~30대 트렌드를 빠르게 캐치합니다. 변신하고 싶을 때 추천.",
    initial: "J",
  },
  {
    id: "jung",
    name: "정태우",
    enName: "JUNG TAE WOO",
    role: "스타일리스트",
    rank: "STYLIST",
    years: 3,
    specialty: ["베이직 컷", "케어"],
    bio: "꼼꼼하고 차분한 응대. 첫 방문이라면 부담 없이 만날 수 있는 디자이너.",
    initial: "T",
  },
];

window.DESIGNERS = DESIGNERS;

// 여름철 테토 스타일 — 시즌 큐레이션
const FEATURED_STYLES = [
  { id: "f1", name: "댄디 펌",     price: 120000, time: 120, desc: "윗볼륨 + 끝을 살린 C컬. 정돈된 댄디 스타일의 완성.",     tag: "여름 1위",  img: "img/style_1.jpg", categoryId: "perm", categoryName: "펌" },
  { id: "f2", name: "투블럭 컷",   price: 38000,  time: 45,  desc: "사이드를 짧게, 윗머리는 풍성하게. 가장 인기 있는 남성 스타일.", tag: "베스트",    img: "img/style_2.jpg", categoryId: "cut",  categoryName: "커트" },
  { id: "f3", name: "리프 컷",     price: 42000,  time: 55,  desc: "잎사귀처럼 흐르는 결. 부드럽고 트렌디한 분위기.",         tag: "트렌드",    img: "img/style_3.jpg", categoryId: "cut",  categoryName: "커트" },
  { id: "f4", name: "댄디 컷",     price: 35000,  time: 40,  desc: "단정하고 정직한 인상의 베이직 컷. 어떤 자리에도 무난해요.",  tag: "데일리",    img: "img/style_4.jpg", categoryId: "cut",  categoryName: "커트" },
  { id: "f5", name: "크롭 컷",     price: 40000,  time: 50,  desc: "와일드하면서도 정돈된 느낌. 두상을 살리고 싶다면.",       tag: "강한 인상", img: "img/style_5.jpg", categoryId: "cut",  categoryName: "커트" },
];

// 비즈니스 — 정장·면접·미팅에 어울리는 단정한 스타일
const BUSINESS_STYLES = [
  { id: "b1", name: "댄디 컷",      price: 35000,  time: 40,  desc: "단정하고 정직한 인상의 베이직 컷.", img: "img/style_4.jpg", categoryId: "cut",  categoryName: "커트" },
  { id: "b2", name: "클래식 사이드", price: 38000,  time: 45,  desc: "옆가르마 + 차분한 라인의 비즈니스 캐주얼.", img: "img/style_8.png", categoryId: "cut",  categoryName: "커트" },
  { id: "b3", name: "가르마 펌",    price: 110000, time: 110, desc: "방향을 잡아주는 깔끔한 가르마.", img: "img/style_7.png", categoryId: "perm", categoryName: "펌" },
  { id: "b4", name: "블랙 컬러",    price: 70000,  time: 80,  desc: "묵직하고 단단한 인상의 정통 블랙.", img: "img/style_2.jpg", categoryId: "color", categoryName: "염색" },
  { id: "b5", name: "내추럴 브라운", price: 85000,  time: 90,  desc: "자연스럽게 인상을 부드럽게.", img: "img/style_1.jpg", categoryId: "color", categoryName: "염색" },
];

// MZ 트렌드 — 20~30대 핫한 스타일
const MZ_STYLES = [
  { id: "m1", name: "크롭 컷",     price: 40000,  time: 50,  desc: "와일드하면서도 정돈된 느낌.", img: "img/style_5.jpg", categoryId: "cut",  categoryName: "커트" },
  { id: "m2", name: "쉐도우 펌",   price: 130000, time: 130, desc: "은은한 C컬로 자연스러운 입체감.", img: "img/style_9.png", categoryId: "perm", categoryName: "펌" },
  { id: "m3", name: "스왈로우 펌", price: 140000, time: 130, desc: "옆머리까지 흐르는 컬, 빈티지한 무드.", img: "img/style_3.jpg", categoryId: "perm", categoryName: "펌" },
  { id: "m4", name: "글램 펌",     price: 150000, time: 140, desc: "굵은 컬로 시원한 볼륨감.",    img: "img/style_10.png", categoryId: "perm", categoryName: "펌" },
  { id: "m5", name: "다크 애쉬",   price: 95000,  time: 100, desc: "차분한 회갈색, 시크한 도시 무드.", img: "img/style_6.png", categoryId: "color", categoryName: "염색" },
];

// 부모님 베스트픽 디자인
const STARTER_STYLES = [
  { id: "st1", name: "퇴직케이크",     price: 53000, sizeId: "type-2", flavorId: "vanilla-lemon",     desc: "2호 · 바닐라 쌀시트 + 레몬커스터드", img: "img/퇴직케이크.jpg",       categoryName: "케이크" },
  { id: "st2", name: "생신케이크",     price: 35000, sizeId: "type-1", flavorId: "vanilla-milk",      desc: "1호 · 바닐라 쌀시트 + 우유크림",     img: "img/생신케이크.jpg",       categoryName: "케이크" },
  { id: "st3", name: "카네이션케이크", price: 66000, sizeId: "type-3", flavorId: "vanilla-lemon",     desc: "3호 · 바닐라 쌀시트 + 레몬커스터드", img: "img/카네이션케이크.jpg",   categoryName: "케이크" },
  { id: "st4", name: "대형사각케이크", price: 65000, sizeId: "type-3", flavorId: "vanilla-blueberry", desc: "3호 · 바닐라 쌀시트 + 블루베리잼",   img: "img/대형사각케이크.jpeg",  categoryName: "케이크" },
  { id: "st5", name: "로또케이크",     price: 56000, sizeId: "type-2", flavorId: "vanilla-lemon",     desc: "2호 · 바닐라 쌀시트 + 레몬커스터드", img: "img/로또케이크.jpg",       categoryName: "케이크" },
  { id: "st6", name: "골드바 케이크",  price: 70000, sizeId: "type-3", flavorId: "vanilla-lemon",     desc: "3호 · 바닐라 쌀시트 + 레몬커스터드", img: "img/골드바 케이크.jpeg",   categoryName: "케이크" },
];

window.FEATURED_STYLES = FEATURED_STYLES;
window.BUSINESS_STYLES = BUSINESS_STYLES;
window.MZ_STYLES = MZ_STYLES;
window.STARTER_STYLES = STARTER_STYLES;
