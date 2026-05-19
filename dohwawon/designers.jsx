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

// 귀여운 도시락케이크
const FEATURED_STYLES = [
  { id: "f1", name: "삼성라이온즈", price: 17000, sizeId: "type-dosirak", flavorId: "vanilla-lemon",     desc: "도시락 · 바닐라 쌀시트 + 레몬커스터드",            img: "img/삼성라이온즈.jpg",  categoryName: "케이크" },
  { id: "f2", name: "기본 레터링",  price: 20000, sizeId: "type-dosirak", flavorId: "choco-choco",       desc: "도시락 · 초코 쌀시트 + 초코크림",                  img: "img/기본 레터링.jpg",   categoryName: "케이크" },
  { id: "f3", name: "핑크 레터링",  price: 17000, sizeId: "type-dosirak", flavorId: "vanilla-milk",      desc: "도시락 · 바닐라 쌀시트 + 우유크림",                img: "img/핑크 레터링.jpg",   categoryName: "케이크" },
];

// 이달의 베스트 케이크 — 전체 13개 중 랜덤 큐레이션
const BUSINESS_STYLES = [
  { id: "b1", name: "장미케이크",     price: 43000, sizeId: "type-1",      flavorId: "vanilla-blueberry", desc: "1호 · 바닐라 쌀시트 + 블루베리잼",              img: "img/장미케이크.jpeg",      categoryName: "케이크" },
  { id: "b2", name: "기본 레터링",    price: 20000, sizeId: "type-dosirak", flavorId: "choco-choco",       desc: "도시락 · 초코 쌀시트 + 초코크림",               img: "img/기본 레터링.jpg",      categoryName: "케이크" },
  { id: "b3", name: "카네이션케이크", price: 66000, sizeId: "type-3",      flavorId: "vanilla-lemon",     desc: "3호 · 바닐라 쌀시트 + 레몬커스터드",             img: "img/카네이션케이크.jpg",   categoryName: "케이크" },
  { id: "b4", name: "로또케이크",     price: 56000, sizeId: "type-2",      flavorId: "vanilla-lemon",     desc: "2호 · 바닐라 쌀시트 + 레몬커스터드",             img: "img/로또케이크.jpg",       categoryName: "케이크" },
  { id: "b5", name: "티아라케이크",   price: 50000, sizeId: "type-1",      flavorId: "choco-oreo",        desc: "1호 · 초코 쌀시트 + 오레오쿠키 + 오레오크림",   img: "img/티아라케이크.jpeg",    categoryName: "케이크" },
];

// 여심저격 베스트 디자인
const MZ_STYLES = [
  { id: "m1", name: "꽃잎케이크",   price: 40000, sizeId: "type-1", flavorId: "vanilla-milk",      desc: "1호 · 바닐라 쌀시트 + 우유크림",                img: "img/꽃잎케이크.jpg",   categoryName: "케이크" },
  { id: "m2", name: "장미케이크",   price: 43000, sizeId: "type-1", flavorId: "vanilla-blueberry", desc: "1호 · 바닐라 쌀시트 + 블루베리잼",              img: "img/장미케이크.jpeg",  categoryName: "케이크" },
  { id: "m3", name: "수국케이크",   price: 40000, sizeId: "type-1", flavorId: "vanilla-lemon",     desc: "1호 · 바닐라 쌀시트 + 레몬커스터드",            img: "img/수국케이크.jpeg",  categoryName: "케이크" },
  { id: "m4", name: "티아라케이크", price: 50000, sizeId: "type-1", flavorId: "choco-oreo",        desc: "1호 · 초코 쌀시트 + 오레오쿠키 + 오레오크림",   img: "img/티아라케이크.jpeg", categoryName: "케이크" },
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
