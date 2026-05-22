/* eslint-disable */
// PARKHAD — 상품 카탈로그 (자동 생성: publishToGitHub)
const HAIR_CATEGORIES = [
  { id: "cut", name: "커트", blurb: "정돈된 인상의 시작", sub: "커트 디자인 둘러보기", icon: "scissors" },
  { id: "perm", name: "펌", blurb: "볼륨감으로 인상을 잡다", sub: "펌 디자인 둘러보기", icon: "perm" },
  { id: "color", name: "염색", blurb: "분위기를 바꾸는 한 끗", sub: "염색 디자인 둘러보기", icon: "color" },
  { id: "care", name: "케어", blurb: "두피부터, 모발까지", sub: "케어 디자인 둘러보기", icon: "care" }
];
const HAIR_STYLES = {
  cut: [
    { productId: "cut-1", id: "cut-1", name: "댄디 컷", price: 35000, desc: "단정하고 정직한 인상의 베이직 컷. 어떤 자리에도 무난해요.", time: 40, tag: "BASIC", img: "img/style_4.jpg", categoryName: "커트" },
    { productId: "cut-2", id: "cut-2", name: "투블럭 컷", price: 38000, desc: "사이드를 짧게, 윗머리는 풍성하게. 가장 인기 있는 남성 스타일.", time: 45, tag: "BEST", img: "img/style_2.jpg", categoryName: "커트" },
    { productId: "cut-3", id: "cut-3", name: "크롭 컷", price: 40000, desc: "와일드하면서도 정돈된 느낌. 두상을 살리고 싶다면.", time: 50, tag: "TREND", img: "img/style_5.jpg", categoryName: "커트" },
    { productId: "cut-4", id: "cut-4", name: "시저스 컷", price: 45000, desc: "가위만으로 완성하는 자연스러운 결. 스타일링이 편해요.", time: 60, tag: "PREMIUM", img: "img/style_6.png", categoryName: "커트" },
    { productId: "cut-5", id: "cut-5", name: "리프 컷", price: 42000, desc: "잎사귀처럼 흐르는 결. 부드럽고 트렌디한 분위기.", time: 55, tag: "TREND", img: "img/style_3.jpg", categoryName: "커트" },
    { productId: "cut-6", id: "cut-6", name: "클래식 사이드", price: 38000, desc: "옆가르마 + 차분한 라인. 비즈니스 캐주얼에 잘 어울려요.", time: 45, tag: "BASIC", img: "img/style_8.png", categoryName: "커트" }
  ],
  perm: [
    { productId: "perm-1", id: "perm-1", name: "다운 펌", price: 90000, desc: "뜨는 머리를 잡아주는 가장 기본적인 펌. 매일 아침이 편해져요.", time: 100, tag: "BASIC", img: "img/style_7.png", categoryName: "펌" },
    { productId: "perm-2", id: "perm-2", name: "가르마 펌", price: 110000, desc: "방향을 잡아주는 깔끔한 가르마. 첫인상에서 단정함을 만듭니다.", time: 110, tag: "BEST", img: "img/style_8.png", categoryName: "펌" },
    { productId: "perm-3", id: "perm-3", name: "쉐도우 펌", price: 130000, desc: "은은한 C컬로 자연스러운 입체감. 과하지 않게 멋있게.", time: 130, tag: "TREND", img: "img/style_9.png", categoryName: "펌" },
    { productId: "perm-4", id: "perm-4", name: "댄디 펌", price: 120000, desc: "윗볼륨 + 끝을 살린 C컬. 정돈된 댄디 스타일의 완성.", time: 120, tag: "BEST", img: "img/style_1.jpg", categoryName: "펌" },
    { productId: "perm-5", id: "perm-5", name: "글램 펌", price: 150000, desc: "굵은 컬로 시원한 볼륨감. 인상을 강렬하게.", time: 140, tag: "PREMIUM", img: "img/style_10.png", categoryName: "펌" },
    { productId: "perm-6", id: "perm-6", name: "스왈로우 펌", price: 140000, desc: "옆머리까지 자연스럽게 흐르는 컬. 빈티지한 무드.", time: 130, tag: "TREND", img: "img/style_3.jpg", categoryName: "펌" }
  ],
  color: [
    { productId: "color-1", id: "color-1", name: "블랙 컬러", price: 70000, desc: "묵직하고 단단한 인상의 정통 블랙. 면접·중요한 자리에.", time: 80, tag: "BASIC", img: "img/style_2.jpg", categoryName: "염색" },
    { productId: "color-2", id: "color-2", name: "내추럴 브라운", price: 85000, desc: "은은한 갈색으로 분위기 전환. 자연스럽게 인상을 부드럽게.", time: 90, tag: "BEST", img: "img/style_4.jpg", categoryName: "염색" },
    { productId: "color-3", id: "color-3", name: "다크 애쉬", price: 95000, desc: "차분한 회갈색. 시크한 도시 무드.", time: 100, tag: "TREND", img: "img/style_1.jpg", categoryName: "염색" },
    { productId: "color-4", id: "color-4", name: "히든 하이라이트", price: 130000, desc: "안쪽에 포인트 색을 넣어 입체감을 더해요.", time: 120, tag: "PREMIUM", img: "img/style_9.png", categoryName: "염색" },
    { productId: "color-5", id: "color-5", name: "그레이 톤다운", price: 120000, desc: "탈색 없이 만드는 무드 있는 그레이. 깊이감을 살려요.", time: 110, tag: "TREND", img: "img/style_6.png", categoryName: "염색" },
    { productId: "color-6", id: "color-6", name: "투톤 컬러", price: 150000, desc: "윗머리와 사이드의 톤을 분리해 입체감 강조.", time: 130, tag: "PREMIUM", img: "img/style_10.png", categoryName: "염색" }
  ],
  care: [
    { productId: "care-1", id: "care-1", name: "두피 클리닉", price: 50000, desc: "두피 진단 + 클렌징 + 마사지. 시술 후 시작하기 좋아요.", time: 50, tag: "BASIC", img: "img/style_8.png", categoryName: "케어" },
    { productId: "care-2", id: "care-2", name: "모발 트리트먼트", price: 45000, desc: "푸석한 모발에 영양을 채워줍니다.", time: 40, tag: "BASIC", img: "img/style_4.jpg", categoryName: "케어" },
    { productId: "care-3", id: "care-3", name: "프리미엄 두피케어", price: 80000, desc: "딥 클렌징 + 스케일링 + 영양. 두피 컨디션 리셋.", time: 70, tag: "PREMIUM", img: "img/style_7.png", categoryName: "케어" },
    { productId: "care-4", id: "care-4", name: "탈모 케어", price: 90000, desc: "탈모 진행 단계를 진단하고 케어 루틴을 설계합니다.", time: 80, tag: "PREMIUM", img: "img/style_5.jpg", categoryName: "케어" },
    { productId: "care-5", id: "care-5", name: "흰머리 케어", price: 60000, desc: "흰머리 부분 컬러 + 두피 케어를 한 번에.", time: 60, tag: "BEST", img: "img/style_2.jpg", categoryName: "케어" }
  ]
,
};
const HOME_SECTIONS = [
  { id: "hero", type: "hero", title: "히어로", icon: "image", data: { address: "대구 달서구 와룡로 132 2층 PARKHAD 박하디", region: "대구광역시 | 달서구", storeDesc: "남자들에게 미용실은 '가기 귀찮은 곳'인 경우가 많죠. 고객님 한 분 한 분께 편안한 환경과 유쾌한 경험을 제공하여, '다음 만남이 기다려지는 곳'이 될 수 있도록 하겠습니다.", image: "img/hero.jpg", bannerText: "전화 또는 네이버 예약으로 간편예약이 가능해요!", storeName: "PARKHAD", hours: "10:00 ~ 20:00 · 매주 목요일 휴무", mapImage: "img/map.png", mapAddress: "대구 달서구 와룡로 132 박하디" } },
  { id: "slider_1", type: "slider", title: "상품 슬라이더 (1)", icon: "star", data: { title: "교동 감성 스타일링", subtitle: "시즌 추천", pickedIds: ["perm-6", "perm-4", "cut-2", "cut-1", "cut-3"] } },
  { id: "slider_2", type: "slider", title: "상품 슬라이더 (2)", icon: "star", data: { title: "면접·미팅을 준비한다면", pickedIds: ["cut-1", "perm-2", "perm-1", "cut-2", "perm-4"], subtitle: "단정하고 깔끔하게" } },
  { id: "slider_3", type: "slider", title: "상품 슬라이더 (3)", icon: "star", data: { pickedIds: ["perm-3", "cut-3", "perm-6", "perm-5", "cut-4"], subtitle: "MZ 스타일", title: "요즘 20대 스타일링" } },
  { id: "slider_4", type: "slider", title: "상품 슬라이더 (4)", icon: "star", data: { subtitle: "30대 이상 추천", title: "젊어보이는 마법을", pickedIds: ["cut-1", "cut-2", "perm-1", "perm-2", "perm-1"] } },
  { id: "faq", type: "faq", title: "FAQ", icon: "help", data: { pickedIds: ["faq-booking-2", "faq-booking-1", "faq-booking-4", "faq-booking-3", "faq-service-1", "faq-service-2"], title: "주문 전 자주하는 질문" } }
];
const FAQS = [
  { id: "faq-booking-1", cat: "booking", q: "예약은 어떻게 진행되나요?", a: "원하시는 시술과 디자이너, 날짜·시간을 선택하시고 '예약하기' 버튼을 누르시면 문자로 예약 요청이 전송됩니다. 담당자가 확인 후 5분 이내에 확정 문자를 다시 보내드려요." },
  { id: "faq-booking-2", cat: "booking", q: "당일 예약도 가능한가요?", a: "가능합니다. 다만 인기 시간대(평일 18시 이후, 주말)는 미리 예약이 차 있을 수 있어요. 당일 가능 여부는 전화로 빠르게 확인 가능합니다." },
  { id: "faq-booking-3", cat: "booking", q: "예약 변경이나 취소는 어떻게 하나요?", a: "예약 시간 24시간 전까지는 자유롭게 변경·취소가 가능합니다. 2시간 이내 노쇼·취소가 반복되는 경우 다음 예약이 제한될 수 있어요." },
  { id: "faq-booking-4", cat: "booking", q: "운영 시간이 어떻게 되나요?", a: "매일 10:00 ~ 20:00 운영, 매주 목요일은 휴무입니다. 마감 1시간 전에는 예약이 마감되니 참고해 주세요." },
  { id: "faq-service-1", cat: "service", q: "처음 방문하는데 어떤 시술이 좋을까요?", a: "첫 방문이라면 디자이너에게 상담을 받아보시는 것을 권해드려요. 머리 길이·두상·라이프스타일을 먼저 보고 잘 어울리는 스타일을 제안합니다." },
  { id: "faq-service-2", cat: "service", q: "사진을 보여드려도 되나요?", a: "물론입니다. 원하는 스타일 레퍼런스 사진을 미리 보여주시면 더 정확한 결과를 만들 수 있어요. 예약 시 메모에 남겨주셔도 좋아요." },
  { id: "faq-service-3", cat: "service", q: "시술 시간은 얼마나 걸리나요?", a: "커트 약 40~60분, 펌 100~140분, 염색 80~130분, 케어 40~80분 정도 소요됩니다. 두께·길이에 따라 다소 차이가 있어요." },
  { id: "faq-service-4", cat: "service", q: "탈모가 있는데 시술이 가능한가요?", a: "두피 상태 진단 후 가능한 시술 범위를 안내해 드립니다. 탈모 케어 전용 프로그램도 운영하고 있으니 편하게 상담받아 주세요." },
  { id: "faq-designer-1", cat: "designer", q: "디자이너 지정 예약이 가능한가요?", a: "가능합니다. 예약 시 원하는 디자이너를 직접 선택하시면 돼요. 디자이너별로 가격과 운영 일정이 다를 수 있습니다." },
  { id: "faq-designer-2", cat: "designer", q: "디자이너를 어떻게 고르면 좋을까요?", a: "원장님은 정통 남성 커트와 펌에 강하고, 헤드 디자이너 김민호는 비즈니스·댄디 스타일, 이지훈은 20~30대 트렌드, 정태우는 첫 방문에 부담 없는 차분한 응대가 강점이에요." },
  { id: "faq-designer-3", cat: "designer", q: "디자이너에 따라 가격이 다른가요?", a: "직급(스타일리스트 / 시니어 / 헤드 / 디렉터)에 따라 시술 가격이 일부 다릅니다. 정확한 금액은 예약 페이지의 시술 선택 시 확인하실 수 있어요." },
  { id: "faq-payment-1", cat: "payment", q: "결제는 어떻게 진행되나요?", a: "시술 완료 후 매장에서 카드·현금·간편결제로 결제하실 수 있습니다. 예약금이나 사전 결제는 없습니다." },
  { id: "faq-payment-2", cat: "payment", q: "세금계산서·현금영수증 발행이 가능한가요?", a: "모두 가능합니다. 결제 시 사업자등록번호 또는 휴대전화 번호를 알려주세요." },
  { id: "faq-payment-3", cat: "payment", q: "환불 정책이 어떻게 되나요?", a: "시술의 특성상 시술 완료 후 환불은 어렵습니다. 시술 결과에 만족하지 못하셨다면 48시간 이내 재시술(부분 보정)을 무료로 진행해 드려요." }
];
const FAQ_CATEGORIES = [];
Object.assign(window, { HAIR_CATEGORIES, HAIR_STYLES, HOME_SECTIONS, FAQS, FAQ_CATEGORIES });
const SITE_INFO = { phone: "", kakaoChannel: "", ogTitle: "박하디, 프리미엄 남성 커트", ogDescription: "대구 달서구 남성 전용 헤어샵 — 편안한 환경, 유쾌한 경험.", ogImage: "https://easysite.kr/PARKHAD/img/hero.jpg" };
Object.assign(window, { SITE_INFO });
