/* eslint-disable */
// 별케이크 — 케이크 카탈로그
// 4개 카테고리 × 카테고리별 5-6개 스타일.

const HAIR_CATEGORIES = [
  {
    id: "cut",
    name: "커트",
    blurb: "정돈된 인상의 시작",
    sub: "CUT",
    icon: "scissors",
  },
  {
    id: "perm",
    name: "펌",
    blurb: "볼륨감으로 인상을 잡다",
    sub: "PERM",
    icon: "perm",
  },
  {
    id: "color",
    name: "염색",
    blurb: "분위기를 바꾸는 한 끗",
    sub: "COLOR",
    icon: "color",
  },
  {
    id: "care",
    name: "케어",
    blurb: "두피부터, 모발까지",
    sub: "CARE",
    icon: "care",
  },
];

const HAIR_STYLES = {
  cut: [
    { name: "댄디 컷",        price: 35000, time: 40, desc: "단정하고 정직한 인상의 베이직 컷. 어떤 자리에도 무난해요.", tag: "BASIC",   img: "img/style_4.jpg" },
    { name: "투블럭 컷",      price: 38000, time: 45, desc: "사이드를 짧게, 윗머리는 풍성하게. 가장 인기 있는 남성 스타일.", tag: "BEST",    img: "img/style_2.jpg" },
    { name: "크롭 컷",        price: 40000, time: 50, desc: "와일드하면서도 정돈된 느낌. 두상을 살리고 싶다면.",     tag: "TREND",   img: "img/style_5.jpg" },
    { name: "시저스 컷",      price: 45000, time: 60, desc: "가위만으로 완성하는 자연스러운 결. 스타일링이 편해요.",   tag: "PREMIUM", img: "img/style_6.png" },
    { name: "리프 컷",        price: 42000, time: 55, desc: "잎사귀처럼 흐르는 결. 부드럽고 트렌디한 분위기.",       tag: "TREND",   img: "img/style_3.jpg" },
    { name: "클래식 사이드",  price: 38000, time: 45, desc: "옆가르마 + 차분한 라인. 비즈니스 캐주얼에 잘 어울려요.", tag: "BASIC",   img: "img/style_8.png" },
  ],
  perm: [
    { name: "다운 펌",         price: 90000,  time: 100, desc: "뜨는 머리를 잡아주는 가장 기본적인 펌. 매일 아침이 편해져요.", tag: "BASIC",   img: "img/style_7.png" },
    { name: "가르마 펌",       price: 110000, time: 110, desc: "방향을 잡아주는 깔끔한 가르마. 첫인상에서 단정함을 만듭니다.", tag: "BEST",    img: "img/style_8.png" },
    { name: "쉐도우 펌",       price: 130000, time: 130, desc: "은은한 C컬로 자연스러운 입체감. 과하지 않게 멋있게.",       tag: "TREND",   img: "img/style_9.png" },
    { name: "댄디 펌",         price: 120000, time: 120, desc: "윗볼륨 + 끝을 살린 C컬. 정돈된 댄디 스타일의 완성.",         tag: "BEST",    img: "img/style_1.jpg" },
    { name: "글램 펌",         price: 150000, time: 140, desc: "굵은 컬로 시원한 볼륨감. 인상을 강렬하게.",                tag: "PREMIUM", img: "img/style_10.png" },
    { name: "스왈로우 펌",     price: 140000, time: 130, desc: "옆머리까지 자연스럽게 흐르는 컬. 빈티지한 무드.",          tag: "TREND",   img: "img/style_3.jpg" },
  ],
  color: [
    { name: "블랙 컬러",        price: 70000,  time: 80,  desc: "묵직하고 단단한 인상의 정통 블랙. 면접·중요한 자리에.",  tag: "BASIC",   img: "img/style_2.jpg" },
    { name: "내추럴 브라운",    price: 85000,  time: 90,  desc: "은은한 갈색으로 분위기 전환. 자연스럽게 인상을 부드럽게.", tag: "BEST",    img: "img/style_4.jpg" },
    { name: "다크 애쉬",        price: 95000,  time: 100, desc: "차분한 회갈색. 시크한 도시 무드.",                       tag: "TREND",   img: "img/style_1.jpg" },
    { name: "히든 하이라이트",  price: 130000, time: 120, desc: "안쪽에 포인트 색을 넣어 입체감을 더해요.",             tag: "PREMIUM", img: "img/style_9.png" },
    { name: "그레이 톤다운",    price: 120000, time: 110, desc: "탈색 없이 만드는 무드 있는 그레이. 깊이감을 살려요.",   tag: "TREND",   img: "img/style_6.png" },
    { name: "투톤 컬러",        price: 150000, time: 130, desc: "윗머리와 사이드의 톤을 분리해 입체감 강조.",            tag: "PREMIUM", img: "img/style_10.png" },
  ],
  care: [
    { name: "두피 클리닉",       price: 50000, time: 50, desc: "두피 진단 + 클렌징 + 마사지. 시술 후 시작하기 좋아요.",    tag: "BASIC",   img: "img/style_8.png" },
    { name: "모발 트리트먼트",   price: 45000, time: 40, desc: "푸석한 모발에 영양을 채워줍니다.",                       tag: "BASIC",   img: "img/style_4.jpg" },
    { name: "프리미엄 두피케어", price: 80000, time: 70, desc: "딥 클렌징 + 스케일링 + 영양. 두피 컨디션 리셋.",         tag: "PREMIUM", img: "img/style_7.png" },
    { name: "탈모 케어",         price: 90000, time: 80, desc: "탈모 진행 단계를 진단하고 케어 루틴을 설계합니다.",      tag: "PREMIUM", img: "img/style_5.jpg" },
    { name: "흰머리 케어",       price: 60000, time: 60, desc: "흰머리 부분 컬러 + 두피 케어를 한 번에.",                tag: "BEST",    img: "img/style_2.jpg" },
  ],
};

Object.assign(window, { HAIR_CATEGORIES, HAIR_STYLES });
