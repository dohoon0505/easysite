/* eslint-disable */
// PARKHAD — 디자이너 라인업

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
  { id: "f1", name: "댄디 펌",     price: 120000, time: 120, desc: "해당 디자인은 두상이 비교적 크고 얼굴형이 둥근 경우 추천드립니다. 커트+옆다운펌+윗볼륨 C컬 조합으로 얼굴은 작아보이게, 멋있으면서도 깔끔한 댄디 스타일을 완성합니다.",     tag: "여름 1위",  img: "img/style_1.jpg", categoryId: "perm", categoryName: "펌" },
  { id: "f2", name: "투블럭 컷",   price: 38000,  time: 45,  desc: "해당 디자인은 윗머리에 볼륨을 살리고 싶거나 가장 인기 있는 남성 스타일을 원하시는 분께 추천드립니다. 사이드 투블럭+윗머리 레이어 컷 조합으로 옆선은 시원하게, 윗머리는 풍성하게 연출해 멋스럽고 트렌디한 인상을 만듭니다.", tag: "베스트",    img: "img/style_2.jpg", categoryId: "cut",  categoryName: "커트" },
  { id: "f3", name: "리프 컷",     price: 42000,  time: 55,  desc: "해당 디자인은 부드럽고 트렌디한 분위기를 원하시는 분께 추천드립니다. 잎사귀처럼 흐르는 결을 살린 커트+가벼운 텍스처 작업으로 자연스러운 움직임과 세련된 무드, 가벼운 인상을 동시에 만듭니다.",         tag: "트렌드",    img: "img/style_3.jpg", categoryId: "cut",  categoryName: "커트" },
  { id: "f4", name: "댄디 컷",     price: 35000,  time: 40,  desc: "해당 디자인은 단정하고 정직한 인상을 원하시는 분께 추천드립니다. 베이직 커트+옆선·뒷선 정리 작업으로 옆머리와 뒷머리를 깔끔하게 다듬어, 면접·미팅·소개팅 어디서나 잘 어울리는 무난하고 신뢰감 있는 스타일을 완성합니다.",  tag: "데일리",    img: "img/style_4.jpg", categoryId: "cut",  categoryName: "커트" },
  { id: "f5", name: "크롭 컷",     price: 40000,  time: 50,  desc: "해당 디자인은 두상이 예쁘고 와일드하면서도 정돈된 분위기를 원하시는 분께 추천드립니다. 크롭컷+사이드 정리 작업으로 두상 라인을 살려, 짧지만 정돈된 느낌과 강한 인상을 동시에 연출합니다.",       tag: "강한 인상", img: "img/style_5.jpg", categoryId: "cut",  categoryName: "커트" },
];

// 비즈니스 — 정장·면접·미팅에 어울리는 단정한 스타일
const BUSINESS_STYLES = [
  { id: "b1", name: "댄디 컷",      price: 35000,  time: 40,  desc: "해당 디자인은 단정하고 정직한 인상을 원하시는 분께 추천드립니다. 베이직 커트+옆선·뒷선 정리 작업으로 옆머리와 뒷머리를 깔끔하게 다듬어, 면접·미팅·소개팅 어디서나 잘 어울리는 무난하고 신뢰감 있는 스타일을 완성합니다.", img: "img/style_4.jpg", categoryId: "cut",  categoryName: "커트" },
  { id: "b2", name: "클래식 사이드", price: 38000,  time: 45,  desc: "해당 디자인은 비즈니스 캐주얼이 잘 어울리는 단정한 스타일을 원하시는 분께 추천드립니다. 옆가르마+차분한 라인 커트로 회사·외부 미팅에 어울리는 깔끔하고 신뢰감 있는 첫인상을 완성합니다.", img: "img/style_8.png", categoryId: "cut",  categoryName: "커트" },
  { id: "b3", name: "가르마 펌",    price: 110000, time: 110, desc: "해당 디자인은 가르마 방향이 잘 잡히지 않거나 정돈이 어려운 분께 추천드립니다. 가르마펌+옆다운펌 조합으로 머리 방향을 깔끔하게 잡아, 면접·중요한 자리에서도 단정한 첫인상을 만듭니다.", img: "img/style_7.png", categoryId: "perm", categoryName: "펌" },
  { id: "b4", name: "블랙 컬러",    price: 70000,  time: 80,  desc: "해당 디자인은 면접·중요한 자리·전문직 이미지가 필요한 분께 추천드립니다. 정통 블랙 컬러+트리트먼트 케어 작업으로 깊고 단단한 인상을 만들면서, 모발 손상은 최소화하여 자연스러운 광택을 살립니다.", img: "img/style_2.jpg", categoryId: "color", categoryName: "염색" },
  { id: "b5", name: "내추럴 브라운", price: 85000,  time: 90,  desc: "해당 디자인은 분위기 전환은 원하지만 과하지 않은 변화를 찾으시는 분께 추천드립니다. 은은한 브라운 톤+영양 케어 조합으로 인상을 부드럽게 만들어, 데일리에 잘 어울리는 자연스러운 컬러를 완성합니다.", img: "img/style_1.jpg", categoryId: "color", categoryName: "염색" },
];

// MZ 트렌드 — 20~30대 핫한 스타일
const MZ_STYLES = [
  { id: "m1", name: "크롭 컷",     price: 40000,  time: 50,  desc: "해당 디자인은 두상이 예쁘고 와일드하면서도 정돈된 분위기를 원하시는 분께 추천드립니다. 크롭컷+사이드 정리 작업으로 두상 라인을 살려, 짧지만 정돈된 느낌과 강한 인상을 동시에 연출합니다.", img: "img/style_5.jpg", categoryId: "cut",  categoryName: "커트" },
  { id: "m2", name: "쉐도우 펌",   price: 130000, time: 130, desc: "해당 디자인은 자연스러운 볼륨과 입체감을 원하시는 분께 추천드립니다. 은은한 C컬+볼륨펌+커트 조합으로 무겁지 않게 윤곽을 살려, 과하지 않으면서도 멋있는 분위기를 완성합니다.", img: "img/style_9.png", categoryId: "perm", categoryName: "펌" },
  { id: "m3", name: "스왈로우 펌", price: 140000, time: 130, desc: "해당 디자인은 옆머리까지 자연스럽게 흐르는 빈티지 무드를 원하시는 분께 추천드립니다. 스왈로우펌+커트 조합으로 윗머리부터 옆머리까지 부드러운 컬을 만들어, 클래식하면서도 트렌디한 분위기를 연출합니다.", img: "img/style_3.jpg", categoryId: "perm", categoryName: "펌" },
  { id: "m4", name: "글램 펌",     price: 150000, time: 140, desc: "해당 디자인은 굵은 컬로 강한 인상과 시원한 볼륨을 원하시는 분께 추천드립니다. 글램펌+레이어 커트 조합으로 풍성한 컬과 입체감을 살려 화려하고 자신감 있는 무드를 만듭니다.",    img: "img/style_10.png", categoryId: "perm", categoryName: "펌" },
  { id: "m5", name: "다크 애쉬",   price: 95000,  time: 100, desc: "해당 디자인은 도시적이고 시크한 무드를 원하시는 분께 추천드립니다. 차분한 회갈색 톤+다크 매니큐어 조합으로 깊이감을 살려, 차분하면서도 트렌디한 분위기를 만듭니다.", img: "img/style_6.png", categoryId: "color", categoryName: "염색" },
];

// 첫 방문 — 부담 없는 시작
const STARTER_STYLES = [
  { id: "s1", name: "댄디 컷",       price: 35000, time: 40, desc: "해당 디자인은 단정하고 정직한 인상을 원하시는 분께 추천드립니다. 베이직 커트+옆선·뒷선 정리 작업으로 옆머리와 뒷머리를 깔끔하게 다듬어, 면접·미팅·소개팅 어디서나 잘 어울리는 무난하고 신뢰감 있는 스타일을 완성합니다.", img: "img/style_4.jpg", categoryId: "cut",  categoryName: "커트" },
  { id: "s2", name: "투블럭 컷",     price: 38000, time: 45, desc: "해당 디자인은 윗머리에 볼륨을 살리고 싶거나 가장 인기 있는 남성 스타일을 원하시는 분께 추천드립니다. 사이드 투블럭+윗머리 레이어 컷 조합으로 옆선은 시원하게, 윗머리는 풍성하게 연출해 멋스럽고 트렌디한 인상을 만듭니다.", img: "img/style_2.jpg", categoryId: "cut",  categoryName: "커트" },
  { id: "s3", name: "다운 펌",       price: 90000, time: 100, desc: "해당 디자인은 뜨는 머리·뻗치는 옆머리로 매일 아침 스타일링이 어려운 분께 추천드립니다. 옆다운펌+윗머리 정돈 작업으로 머리를 차분하게 잡아줘 손질 시간을 크게 줄이고, 단정한 인상을 매일 유지할 수 있습니다.", img: "img/style_7.png", categoryId: "perm", categoryName: "펌" },
  { id: "s4", name: "두피 클리닉",   price: 50000, time: 50, desc: "해당 디자인은 두피 트러블·가려움·민감성이 있거나 시술 전 두피를 정돈하고 싶으신 분께 추천드립니다. 두피 진단+딥 클렌징+마사지 작업으로 두피 상태를 리셋해, 다른 시술 전 베이스를 잡아주는 케어입니다.", img: "img/style_8.png", categoryId: "care", categoryName: "케어" },
  { id: "s5", name: "모발 트리트먼트", price: 45000, time: 40, desc: "해당 디자인은 모발이 푸석하고 윤기가 부족하거나 손상모로 고민이신 분께 추천드립니다. 영양 트리트먼트+큐티클 케어 작업으로 모발에 수분과 영양을 채워, 부드러운 결과 자연스러운 광택을 회복시켜 드립니다.", img: "img/style_4.jpg", categoryId: "care", categoryName: "케어" },
];

window.FEATURED_STYLES = FEATURED_STYLES;
window.BUSINESS_STYLES = BUSINESS_STYLES;
window.MZ_STYLES = MZ_STYLES;
window.STARTER_STYLES = STARTER_STYLES;
