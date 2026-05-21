/* eslint-disable */
// 도화원플라워 — 상품 카탈로그 (자동 생성: publishToGitHub)
const HAIR_CATEGORIES = [
  { id: "best", name: "베스트", blurb: "도화원의 베스트 상품", sub: "BEST PICK" },
  { id: "bouquet", name: "꽃다발", blurb: "마음을 전하는 꽃다발", sub: "BOUQUET" },
  { id: "basket", name: "꽃바구니", blurb: "풍성하고 화사한 꽃바구니", sub: "BASKET" },
  { id: "moneybox", name: "용돈박스", blurb: "특별한 마음을! 용돈박스", sub: "MONEY BOX" },
  { id: "acrylic", name: "아크릴백", blurb: "세련된 아크릴백 플라워", sub: "ACRYLIC" },
  { id: "bridal", name: "부케", blurb: "아름다운 날을 위한 부케", sub: "BRIDAL" }
];
const HAIR_STYLES = {
  best: [
    { productId: "best-1", id: "best-1", name: "코랄 로즈 꽃다발 (S)", price: 55000, desc: "소형 · 코랄톤 장미 믹스", img: "img/bouquet-s-coral.jpg", categoryName: "베스트" },
    { productId: "best-2", id: "best-2", name: "파스텔 꽃바구니 (M)", price: 65000, desc: "중형 · 파스텔톤 믹스 플라워", img: "img/basket-m-pastel.jpg", categoryName: "베스트" },
    { productId: "best-3", id: "best-3", name: "럭셔리 용돈박스", price: 80000, desc: "프리미엄 장미 + 용돈봉투", img: "img/moneybox-luxury.jpg", categoryName: "베스트" },
    { productId: "best-4", id: "best-4", name: "핑크 로즈 꽃다발 (XL)", price: 120000, desc: "대형 · 핑크 장미 100송이", img: "img/bouquet-xl-pink.jpg", categoryName: "베스트" },
    { productId: "best-5", id: "best-5", name: "카네이션 아크릴백", price: 45000, desc: "아크릴백 · 카네이션 어레인지먼트", img: "img/acrylic-carnation.jpg", categoryName: "베스트" }
  ],
  bouquet: [
    { productId: "bouquet-1", id: "bouquet-1", name: "카네이션 꽃다발 (S)", price: 35000, desc: "소형 · 감사의 마음을 담은 카네이션", img: "img/bouquet-s-carnation.jpg", categoryName: "꽃다발" },
    { productId: "bouquet-2", id: "bouquet-2", name: "코랄 로즈 꽃다발 (S)", price: 55000, desc: "소형 · 코랄톤 장미 믹스", img: "img/bouquet-s-coral.jpg", categoryName: "꽃다발" },
    { productId: "bouquet-3", id: "bouquet-3", name: "핑크 로즈 꽃다발 (S)", price: 40000, desc: "소형 · 사랑스러운 핑크 장미", img: "img/bouquet-s-pink-rose.jpg", categoryName: "꽃다발" },
    { productId: "bouquet-4", id: "bouquet-4", name: "비비드 꽃다발 (S)", price: 45000, desc: "소형 · 화사한 비비드 컬러 믹스", img: "img/bouquet-s-vivid.jpg", categoryName: "꽃다발" },
    { productId: "bouquet-5", id: "bouquet-5", name: "로즈 꽃다발 (M)", price: 70000, desc: "중형 · 아모르겐 장미 어레인지먼트", img: "img/bouquet-m-rose.jpg", categoryName: "꽃다발" },
    { productId: "bouquet-6", id: "bouquet-6", name: "코랄 꽃다발 (XL)", price: 110000, desc: "대형 · 코랄톤 장미 대형 꽃다발", img: "img/bouquet-xl-coral.jpg", categoryName: "꽃다발" },
    { productId: "bouquet-7", id: "bouquet-7", name: "핑크 로즈 꽃다발 (XL)", price: 120000, desc: "대형 · 핑크 장미 100송이", img: "img/bouquet-xl-pink.jpg", categoryName: "꽃다발" },
    { productId: "bouquet-8", id: "bouquet-8", name: "아모르겐 꽃다발 (L)", price: 90000, desc: "대형 · 아모르겐 장미 프리미엄", img: "img/bouquet-l-amorgen.jpg", categoryName: "꽃다발" }
  ],
  basket: [
    { productId: "basket-1", id: "basket-1", name: "파스텔 꽃바구니 (M)", price: 65000, desc: "중형 · 파스텔톤 믹스 플라워", img: "img/basket-m-pastel.jpg", categoryName: "꽃바구니" },
    { productId: "basket-2", id: "basket-2", name: "핑크 꽃바구니 (L)", price: 85000, desc: "대형 · 핑크톤 장미 꽃바구니", img: "img/basket-l-pink.jpg", categoryName: "꽃바구니" },
    { productId: "basket-3", id: "basket-3", name: "옐로우 꽃바구니 (L)", price: 85000, desc: "대형 · 화사한 옐로우톤 꽃바구니", img: "img/basket-l-yellow.jpg", categoryName: "꽃바구니" },
    { productId: "basket-4", id: "basket-4", name: "프리미엄 꽃바구니 (XL)", price: 130000, desc: "특대형 · 풍성한 프리미엄 꽃바구니", img: "img/basket-xl.jpg", categoryName: "꽃바구니" }
  ],
  moneybox: [
    { productId: "moneybox-1", id: "moneybox-1", name: "브라이트 용돈박스", price: 60000, desc: "화사한 컬러 플라워 + 용돈봉투", img: "img/moneybox-bright.jpg", categoryName: "용돈박스" },
    { productId: "moneybox-2", id: "moneybox-2", name: "럭셔리 용돈박스", price: 80000, desc: "프리미엄 장미 + 용돈봉투", img: "img/moneybox-luxury.jpg", categoryName: "용돈박스" },
    { productId: "moneybox-3", id: "moneybox-3", name: "아크릴 용돈박스", price: 70000, desc: "아크릴 케이스 + 플라워 + 용돈봉투", img: "img/moneybox-acrylic.jpg", categoryName: "용돈박스" }
  ],
  acrylic: [
    { productId: "acrylic-1", id: "acrylic-1", name: "카네이션 아크릴백", price: 45000, desc: "아크릴백 · 카네이션 어레인지먼트", img: "img/acrylic-carnation.jpg", categoryName: "아크릴백" },
    { productId: "acrylic-2", id: "acrylic-2", name: "블루 아크릴백", price: 50000, desc: "아크릴백 · 블루톤 플라워 어레인지먼트", img: "img/acrylic-blue.jpg", categoryName: "아크릴백" },
    { productId: "acrylic-3", id: "acrylic-3", name: "엘레강스 아크릴백", price: 55000, desc: "아크릴백 · 고급스러운 파스텔톤", img: "img/acrylic-elegant.jpg", categoryName: "아크릴백" },
    { productId: "acrylic-4", id: "acrylic-4", name: "디즈니 아크릴백", price: 55000, desc: "아크릴백 · 디즈니 캐릭터 포인트", img: "img/acrylic-disney.jpg", categoryName: "아크릴백" }
  ],
  bridal: [

  ]
,
};
const HOME_SECTIONS = [
  { id: "hero", type: "hero", title: "히어로", icon: "image", data: { mapAddress: "대구 달서구 당산로 99", region: "대구광역시 | 달서구", mapImage: "img/map.png", bannerText: "예약요청 탭을 통해 간편히 예약을 요청해보세요!", body: "평범한 일상도 꽃 한 송이가 더해지면 특별한 순간이 됩니다. (테스트)\n\n계절을 듬뿍 머금은 다채로운 꽃들로, 당신의 오늘을 가장 아름답게 피워내겠습니다.", image: "img/hero.jpg", address: "대구 달서구 당산로 99 1층 도화원플라워", storeDesc: "평범한 일상도 꽃 한 송이가 더해지면 특별한 순간이 됩니다. (테스트)\n\n계절을 듬뿍 머금은 다채로운 꽃들로, 당신의 오늘을 가장 아름답게 피워내겠습니다.", storeName: "도화원플라워", hours: "11:00 ~ 19:00 · 매주 일요일 휴무" } },
  { id: "slider_1", type: "slider", title: "상품 슬라이더 (1)", icon: "star", data: { pickedIds: [], title: "풍성한 꽃다발 추천" } },
  { id: "slider_2", type: "slider", title: "상품 슬라이더 (2)", icon: "star", data: { pickedIds: [], title: "특별한 날, 꽃바구니 선물!" } },
  { id: "slider_3", type: "slider", title: "상품 슬라이더 (3)", icon: "star", data: { subtitle: "333", title: "아름다운 효도, 용돈박스", pickedIds: [] } },
  { id: "slider_4", type: "slider", title: "상품 슬라이더 (4)", icon: "star", data: { pickedIds: [], title: "특색있는 아크릴백" } },
  { id: "faq", type: "faq", title: "FAQ", icon: "help", data: { title: "주문 전 자주하는 질문", pickedIds: ["faq-order-1", "faq-order-2", "faq-order-3", "faq-order-4", "faq-order-5", "faq-flower-1"] } }
];
const FAQS = [
  { id: "faq-order-1", cat: "order", q: "꽃다발·꽃바구니는 얼마 전에 주문해야 하나요?", a: "특정 꽃이나 색감, 디자인을 원하시면 최소 2~3일 전 예약 부탁드려요. 당일 주문은 샵에 준비된 꽃으로 제작해 드립니다. 기념일이 몰리는 시즌(발렌타인데이·어버이날·졸업식 등)에는 더 여유 있게 예약해 주시면 좋아요." },
  { id: "faq-order-2", cat: "order", q: "당일 주문·당일 수령이 가능한가요?", a: "당일 주문도 가능합니다. 다만 샵에 준비된 꽃으로 제작되며, 특정 꽃이나 색감 지정은 어려울 수 있어요. 카카오톡이나 전화로 먼저 문의해 주시면 가능 여부를 빠르게 안내드려요." },
  { id: "faq-order-3", cat: "order", q: "예약 변경이나 취소는 어떻게 하나요?", a: "수령일 기준 하루 전까지 변경·취소가 가능합니다. 꽃 수급이 시작된 이후(수령 당일)에는 변경·취소가 어려우니 일정이 바뀌시면 미리 연락 부탁드려요." },
  { id: "faq-order-4", cat: "order", q: "운영 시간이 어떻게 되나요?", a: "매일 11:00 ~ 19:00 운영하며, 매주 일요일은 정기 휴무입니다. 매장 방문 및 수령은 운영 시간 내에만 가능하니 참고해 주세요." },
  { id: "faq-order-5", cat: "order", q: "예산에 맞춰 꽃다발을 만들어 줄 수 있나요?", a: "네, 원하시는 예산을 말씀해 주시면 그에 맞춰 최적의 꽃다발을 구성해 드려요. 3만 원대부터 다양한 가격대로 준비 가능합니다." },
  { id: "faq-flower-1", cat: "flower", q: "원하는 꽃 종류를 지정할 수 있나요?", a: "네, 원하시는 꽃을 지정하실 수 있어요. 다만 계절과 시장 상황에 따라 100% 똑같이 제작은 어렵습니다. 색감과 분위기는 최대한 비슷하게 제작해 드리니 이 점 숙지 후 예약해 주세요. 특정 꽃을 원하시면 최소 2~3일 전 예약 부탁드려요." },
  { id: "faq-flower-2", cat: "flower", q: "사진이나 참고 이미지를 보내도 되나요?", a: "물론이죠! 원하시는 스타일이나 레퍼런스 이미지를 카카오톡으로 보내주시면 색감과 분위기를 최대한 비슷하게 제작해 드려요. 다만 계절과 시장 상황에 따라 100% 동일한 제작은 어려운 점 참고 부탁드립니다." },
  { id: "faq-flower-3", cat: "flower", q: "꽃다발 외에 어떤 상품이 있나요?", a: "꽃다발 외에도 꽃바구니, 화병 꽃꽂이, 드라이플라워 부케, 화환, 경조사 화분, 프리저브드 플라워 등 다양한 상품을 준비하고 있어요." },
  { id: "faq-flower-4", cat: "flower", q: "꽃에 메시지 카드를 함께 넣을 수 있나요?", a: "네, 모든 상품에 무료 메시지 카드를 함께 넣어드려요. 주문 시 원하시는 문구를 알려주시면 손글씨 또는 인쇄 카드로 준비해 드립니다." },
  { id: "faq-pickup-1", cat: "pickup", q: "매장 픽업은 어떻게 진행되나요?", a: "예약하신 날짜와 시간에 매장에 방문하시면 됩니다. 꽃은 신선도 유지를 위해 물주머니와 포장재로 꼼꼼하게 포장해 드려요." },
  { id: "faq-pickup-2", cat: "pickup", q: "배송도 가능한가요?", a: "서울·수도권 지역은 직접 배송이 가능합니다. 배송비는 거리에 따라 별도 안내드리며, 꽃의 신선도와 안전을 위해 차량으로 직접 배송해요." },
  { id: "faq-pickup-3", cat: "pickup", q: "꽃을 오래 보관하려면 어떻게 해야 하나요?", a: "생화는 직사광선을 피해 서늘한 곳에 두시고, 하루에 한 번 물을 갈아주시면 5~7일 정도 싱싱하게 유지돼요. 줄기 끝을 사선으로 잘라주시면 수분 흡수에 도움이 됩니다." },
  { id: "faq-payment-1", cat: "payment", q: "결제는 어떻게 진행되나요?", a: "매장에서 카드·현금·간편결제 모두 가능합니다. 사전 예약 시에는 계좌이체 또는 카카오페이로 선결제해 주시면 돼요." },
  { id: "faq-payment-2", cat: "payment", q: "세금계산서·현금영수증 발행이 가능한가요?", a: "모두 가능합니다. 결제 시 사업자등록번호 또는 휴대전화 번호를 알려주시면 발행해 드려요." },
  { id: "faq-payment-3", cat: "payment", q: "환불 정책이 어떻게 되나요?", a: "수령일 하루 전까지 취소 시 전액 환불됩니다. 당일 취소 및 노쇼는 환불이 어렵습니다. 배송된 꽃에 하자가 있을 경우 수령 당일 사진과 함께 연락주시면 재발송 또는 전액 환불 처리해 드려요." }
];
const FAQ_CATEGORIES = [];
Object.assign(window, { HAIR_CATEGORIES, HAIR_STYLES, HOME_SECTIONS, FAQS, FAQ_CATEGORIES });