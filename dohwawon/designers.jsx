/* eslint-disable */
// 도화원플라워 — 디자이너 라인업

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

// 가벼운 꽃다발 추천
const FEATURED_STYLES = [
  { id: "f1", name: "카네이션 꽃다발",  price: 35000, desc: "S 사이즈 · 사랑과 감사를 전하는 카네이션 꽃다발", img: "img/bouquet-s-carnation.jpg", categoryName: "꽃다발" },
  { id: "f2", name: "코랄톤 꽃다발",    price: 40000, desc: "S 사이즈 · 따뜻한 코랄 컬러의 꽃다발",           img: "img/bouquet-s-coral.jpg",     categoryName: "꽃다발" },
  { id: "f3", name: "핑크장미 꽃다발",  price: 45000, desc: "S 사이즈 · 사랑스러운 핑크 장미 꽃다발",         img: "img/bouquet-s-pink-rose.jpg", categoryName: "꽃다발" },
  { id: "f4", name: "강렬한 꽃다발",    price: 46000, desc: "S 사이즈 · 강렬한 색감의 인상적인 꽃다발",       img: "img/bouquet-s-vivid.jpg",     categoryName: "꽃다발" },
];

// 풍성한 꽃다발 추천
const BUSINESS_STYLES = [
  { id: "b1", name: "장미 꽃다발",       price: 50000,  desc: "M 사이즈 · 풍성한 장미로 완성한 꽃다발",        img: "img/bouquet-m-rose.jpg",    categoryName: "꽃다발" },
  { id: "b2", name: "아모르젠 꽃다발",   price: 100000, desc: "L 사이즈 · 고급스러운 대형 꽃다발",             img: "img/bouquet-l-amorgen.jpg", categoryName: "꽃다발" },
  { id: "b3", name: "초대형 코랄꽃다발", price: 150000, desc: "XL 사이즈 · 코랄톤의 초대형 프리미엄 꽃다발",  img: "img/bouquet-xl-coral.jpg",  categoryName: "꽃다발" },
  { id: "b4", name: "초대형 핑크꽃다발", price: 150000, desc: "XL 사이즈 · 핑크톤의 초대형 프리미엄 꽃다발",  img: "img/bouquet-xl-pink.jpg",   categoryName: "꽃다발" },
];

// 특별한 날, 꽃바구니 선물!
const MZ_STYLES = [
  { id: "m1", name: "파스텔톤 꽃바구니", price: 70000,  desc: "M 사이즈 · 파스텔 컬러의 부드러운 꽃바구니",   img: "img/basket-m-pastel.jpg", categoryName: "꽃바구니" },
  { id: "m2", name: "옐로우 꽃바구니",   price: 100000, desc: "L 사이즈 · 화사한 옐로우톤 꽃바구니",          img: "img/basket-l-yellow.jpg", categoryName: "꽃바구니" },
  { id: "m3", name: "핑크톤 꽃바구니",   price: 100000, desc: "L 사이즈 · 사랑스러운 핑크톤 꽃바구니",        img: "img/basket-l-pink.jpg",   categoryName: "꽃바구니" },
  { id: "m4", name: "초대형 꽃바구니",   price: 130000, desc: "XL 사이즈 · 풍성하고 화려한 초대형 꽃바구니",  img: "img/basket-xl.jpg",       categoryName: "꽃바구니" },
];

// 아름다운 효도, 용돈박스
const STARTER_STYLES = [
  { id: "st1", name: "화사한 용돈박스",  price: 65000, desc: "화사한 꽃과 함께 마음을 전하는 용돈박스", img: "img/moneybox-bright.jpg",  categoryName: "용돈박스" },
  { id: "st2", name: "아크릴 용돈박스",  price: 65000, desc: "투명 아크릴 케이스에 담긴 용돈박스",      img: "img/moneybox-acrylic.jpg", categoryName: "용돈박스" },
  { id: "st3", name: "럭셔리 용돈박스",  price: 80000, desc: "고급스러운 디자인의 프리미엄 용돈박스",   img: "img/moneybox-luxury.jpg",  categoryName: "용돈박스" },
];

// 특색있는 아크릴백
const ACRYLIC_STYLES = [
  { id: "a1", name: "블루톤 아크릴백",   price: 65000, desc: "시원한 블루톤의 아크릴백 꽃다발",         img: "img/acrylic-blue.jpg",      categoryName: "아크릴백" },
  { id: "a2", name: "카네이션 아크릴백", price: 75000, desc: "카네이션으로 채운 감사의 아크릴백",       img: "img/acrylic-carnation.jpg", categoryName: "아크릴백" },
  { id: "a3", name: "품위있는 아크릴백", price: 78000, desc: "품위있고 우아한 디자인의 아크릴백",       img: "img/acrylic-elegant.jpg",   categoryName: "아크릴백" },
  { id: "a4", name: "디즈니톤 아크릴백", price: 85000, desc: "동화 같은 디즈니톤 컬러의 아크릴백",     img: "img/acrylic-disney.jpg",    categoryName: "아크릴백" },
];

window.FEATURED_STYLES = FEATURED_STYLES;
window.BUSINESS_STYLES = BUSINESS_STYLES;
window.MZ_STYLES = MZ_STYLES;
window.STARTER_STYLES = STARTER_STYLES;
window.ACRYLIC_STYLES = ACRYLIC_STYLES;
