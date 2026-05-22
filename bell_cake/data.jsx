/* eslint-disable */
// 벨케이크 — 교육과정 카탈로그 (자동 생성: publishToGitHub)
const COURSE_CATEGORIES = [
  { id: "best", name: "베스트", blurb: "인기 많은 베스트 케이크", sub: "Best Pick" },
  { id: "signature", name: "시그니처", blurb: "벨케이크만의 특별한 디자인", sub: "SIGNATURE" },
  { id: "dosirak", name: "도시락", blurb: "귀여운 미니 도시락케이크", sub: "LUNCHBOX" },
  { id: "size-1", name: "1호", blurb: "1호 케이크 (16cm, 3~5인)", sub: "SIZE 1" },
  { id: "size-2", name: "2호", blurb: "2호 케이크 (18cm, 6~8인)", sub: "SIZE 2" },
  { id: "size-3", name: "3호", blurb: "3호 케이크 (21cm, 7~10인)", sub: "SIZE 3" },
  { id: "double", name: "2단", blurb: "특별한 날을 위한 2단 케이크", sub: "Double Size" }
];
const COURSES = {
  best: [
    { productId: "best-1", id: "best-1", name: "장미케이크", desc: "1호 · 바닐라 쌀시트 + 블루베리잼", img: "img/장미케이크.jpeg" },
    { productId: "best-2", id: "best-2", name: "기본 레터링", desc: "도시락 · 초코 쌀시트 + 초코크림", img: "img/기본 레터링.jpg" },
    { productId: "best-3", id: "best-3", name: "카네이션케이크", desc: "3호 · 바닐라 쌀시트 + 레몬커스터드", img: "img/카네이션케이크.jpg" },
    { productId: "best-4", id: "best-4", name: "생신케이크", desc: "1호 · 바닐라 쌀시트 + 우유크림", img: "img/생신케이크.jpg" },
    { productId: "best-5", id: "best-5", name: "로또케이크", desc: "2호 · 바닐라 쌀시트 + 레몬커스터드", img: "img/로또케이크.jpg" }
  ],
  signature: [
    { productId: "signature-1", id: "signature-1", name: "골드바 케이크", desc: "3호 · 바닐라 쌀시트 + 레몬커스터드", img: "img/골드바 케이크.jpeg" },
    { productId: "signature-2", id: "signature-2", name: "대형사각케이크", desc: "3호 · 바닐라 쌀시트 + 블루베리잼", img: "img/대형사각케이크.jpeg" },
    { productId: "signature-3", id: "signature-3", name: "티아라케이크", desc: "1호 · 초코 쌀시트 + 오레오쿠키 + 오레오크림", img: "img/티아라케이크.jpeg" },
    { productId: "signature-4", id: "signature-4", name: "수국케이크", desc: "1호 · 바닐라 쌀시트 + 레몬커스터드", img: "img/수국케이크.jpeg" },
    { productId: "signature-5", id: "signature-5", name: "꽃잎케이크", desc: "1호 · 바닐라 쌀시트 + 우유크림", img: "img/꽃잎케이크.jpg" }
  ],
  dosirak: [
    { productId: "dosirak-1", id: "dosirak-1", name: "삼성라이온즈", desc: "도시락 · 바닐라 쌀시트 + 레몬커스터드", img: "img/삼성라이온즈.jpg" },
    { productId: "dosirak-2", id: "dosirak-2", name: "기본 레터링", desc: "도시락 · 초코 쌀시트 + 초코크림", img: "img/기본 레터링.jpg" },
    { productId: "dosirak-3", id: "dosirak-3", name: "핑크 레터링", desc: "도시락 · 바닐라 쌀시트 + 우유크림", img: "img/핑크 레터링.jpg" }
  ],
  "size-1": [
    { productId: "size-1-1", id: "size-1-1", name: "꽃잎케이크", desc: "1호 · 바닐라 쌀시트 + 우유크림", img: "img/꽃잎케이크.jpg" },
    { productId: "size-1-2", id: "size-1-2", name: "장미케이크", desc: "1호 · 바닐라 쌀시트 + 블루베리잼", img: "img/장미케이크.jpeg" },
    { productId: "size-1-3", id: "size-1-3", name: "수국케이크", desc: "1호 · 바닐라 쌀시트 + 레몬커스터드", img: "img/수국케이크.jpeg" },
    { productId: "size-1-4", id: "size-1-4", name: "티아라케이크", desc: "1호 · 초코 쌀시트 + 오레오쿠키 + 오레오크림", img: "img/티아라케이크.jpeg" },
    { productId: "size-1-5", id: "size-1-5", name: "생신케이크", desc: "1호 · 바닐라 쌀시트 + 우유크림", img: "img/생신케이크.jpg" }
  ],
  "size-2": [
    { productId: "size-2-1", id: "size-2-1", name: "퇴직케이크", desc: "2호 · 바닐라 쌀시트 + 레몬커스터드", img: "img/퇴직케이크.jpg" },
    { productId: "size-2-2", id: "size-2-2", name: "로또케이크", desc: "2호 · 바닐라 쌀시트 + 레몬커스터드", img: "img/로또케이크.jpg" }
  ],
  "size-3": [
    { productId: "size-3-1", id: "size-3-1", name: "카네이션케이크", desc: "3호 · 바닐라 쌀시트 + 레몬커스터드", img: "img/카네이션케이크.jpg" },
    { productId: "size-3-2", id: "size-3-2", name: "대형사각케이크", desc: "3호 · 바닐라 쌀시트 + 블루베리잼", img: "img/대형사각케이크.jpeg" },
    { productId: "size-3-3", id: "size-3-3", name: "골드바 케이크", desc: "3호 · 바닐라 쌀시트 + 레몬커스터드", img: "img/골드바 케이크.jpeg" }
  ],
  double: [

  ]
,
};
const TECH_CATEGORIES = [
];
const HOME_SECTIONS = [
  { id: "hero", type: "hero", title: "히어로", icon: "image", data: { bannerText: "예약요청 탭을 통해 간편히 예약을 요청해보세요!", image: "img/hero.jpg", region: "대구광역시 | 수성구", body: "No 밀가루, No 식물성크림. 100% 국내산 쌀가루로 만든 쌀케이크, 동물성 생크림케이크 전문점 벨케이크입니다:)\n\n1인운영매장이라, 전화를 못받을 수 있으니 부재시 카카오톡채널로 연락주세요^^", storeName: "벨케이크", mapAddress: "대구 수성구 범어로20길 68", mapImage: "img/map.png", address: "대구 수성구 범어로20길 68 1층 왼쪽상가", storeDesc: "No 밀가루, No 식물성크림. 100% 국내산 쌀가루로 만든 쌀케이크, 동물성 생크림케이크 전문점 벨케이크입니다:)\n\n1인운영매장이라, 전화를 못받을 수 있으니 부재시 카카오톡채널로 연락주세요^^", hours: "11:00 ~ 19:00 · 매주 일요일 휴무" } },
  { id: "slider_1", type: "slider", title: "상품 슬라이더 (1)", icon: "star", data: { subtitle: "", title: "귀여운 도시락케이크", pickedIds: ["dosirak-1", "dosirak-2", "dosirak-3"] } },
  { id: "slider_2", type: "slider", title: "상품 슬라이더 (2)", icon: "star", data: { title: "이달의 베스트 케이크", pickedIds: ["dosirak-2", "size-1-2", "size-3-1", "size-2-2", "size-1-4"] } },
  { id: "slider_3", type: "slider", title: "상품 슬라이더 (3)", icon: "star", data: { title: "여심저격 베스트 디자인", pickedIds: ["size-1-1", "size-1-2", "size-1-3", "size-1-4"] } },
  { id: "slider_4", type: "slider", title: "상품 슬라이더 (4)", icon: "star", data: { title: "부모님 베스트픽 디자인", pickedIds: ["size-2-1", "size-1-5", "size-3-1", "size-3-2", "size-2-2", "size-3-3"] } },
  { id: "faq", type: "faq", title: "FAQ", icon: "help", data: { title: "주문 전 자주하는 질문", pickedIds: ["faq-order-1", "faq-order-2", "faq-order-3", "faq-design-1", "faq-order-4", "faq-order-5"] } }
];
const FAQS = [
  { id: "faq-order-1", cat: "order", q: "주문은 얼마 전에 해야 하나요?", a: "레터링케이크는 최소 3일 전 주문을 권장드려요. 주말·공휴일에는 주문이 몰리기 때문에 5~7일 전 미리 예약해 주시면 원하는 날짜에 확실하게 받으실 수 있습니다." },
  { id: "faq-order-2", cat: "order", q: "당일 주문도 가능한가요?", a: "당일 주문은 재고와 일정 상황에 따라 제한적으로 가능합니다. 카카오톡으로 먼저 문의해 주시면 가능 여부를 빠르게 안내드려요." },
  { id: "faq-order-3", cat: "order", q: "예약 변경이나 취소는 어떻게 하나요?", a: "수령일 기준 2일 전까지 변경·취소가 가능합니다. 케이크 제작이 시작된 이후(수령 전일~당일)에는 변경·취소가 어려우니 일정이 바뀌시면 미리 연락 부탁드려요." },
  { id: "faq-order-4", cat: "order", q: "운영 시간이 어떻게 되나요?", a: "매일 11:00 ~ 19:00 운영하며, 매주 일요일은 정기 휴무입니다. 수령은 운영 시간 내에만 가능하니 참고해 주세요." },
  { id: "faq-order-5", cat: "order", q: "케이크 사이즈는 어떤 걸 고르면 좋을까요?", a: "미니(1호, 지름 약 10cm)는 1~2인, 1호(지름 약 15cm)는 3~4인, 2호(지름 약 18cm)는 5~7인, 3호(지름 약 21cm)는 8~10인에 적합해요. 인원에 맞춰 추천드릴게요." },
  { id: "faq-design-1", cat: "design", q: "레터링 문구는 자유롭게 넣을 수 있나요?", a: "네, 생일 축하·기념일·프러포즈·감사 인사 등 원하시는 문구를 자유롭게 넣으실 수 있어요. 한글·영문 모두 가능하며, 글자 수가 많으면 레이아웃을 조정해 드립니다." },
  { id: "faq-design-2", cat: "design", q: "사진이나 참고 이미지를 보내도 되나요?", a: "물론이죠! 원하시는 디자인 레퍼런스를 카카오톡이나 예약 시 메모로 보내주시면 최대한 반영해서 제작해 드려요. 색상·분위기만 전달해 주셔도 괜찮습니다." },
  { id: "faq-design-3", cat: "design", q: "케이크 위에 토퍼나 꽃 장식도 가능한가요?", a: "가능합니다. 생화 토퍼, 초콜릿 토퍼, 캔들 등 다양한 데코 옵션이 있어요. 생화의 경우 계절에 따라 사용 가능한 꽃이 달라질 수 있으니 사전에 문의해 주세요." },
  { id: "faq-design-4", cat: "design", q: "알레르기가 있는데 재료 변경이 되나요?", a: "기본 케이크 시트·크림 외에 견과류·과일 등 토핑 변경은 가능합니다. 알레르기 정보를 주문 시 꼭 알려주시면 안전하게 제작해 드릴게요." },
  { id: "faq-pickup-1", cat: "pickup", q: "픽업은 어떻게 진행되나요?", a: "예약하신 날짜와 시간에 매장에 방문하시면 됩니다. 케이크는 전용 박스에 포장되어 있으며, 아이스팩과 보냉백을 함께 드려요." },
  { id: "faq-pickup-2", cat: "pickup", q: "배송도 가능한가요?", a: "서울·수도권 지역은 퀵배송이 가능합니다. 배송비는 거리에 따라 별도 안내드리며, 케이크 안전을 위해 오토바이 퀵이 아닌 차량 퀵으로만 진행해요." },
  { id: "faq-pickup-3", cat: "pickup", q: "케이크를 오래 보관할 수 있나요?", a: "생크림 케이크는 냉장 보관 시 수령일 포함 2~3일 내 드시는 것을 권장합니다. 여름철에는 이동 시간이 30분 이상이면 아이스박스 사용을 추천드려요." },
  { id: "faq-payment-1", cat: "payment", q: "결제는 어떻게 진행되나요?", a: "주문 확정 시 계좌이체 또는 카카오페이로 선결제해 주시면 됩니다. 매장 픽업 시 카드·현금·간편결제도 가능해요." },
  { id: "faq-payment-2", cat: "payment", q: "세금계산서·현금영수증 발행이 가능한가요?", a: "모두 가능합니다. 결제 시 사업자등록번호 또는 휴대전화 번호를 알려주시면 발행해 드려요." },
  { id: "faq-payment-3", cat: "payment", q: "환불 정책이 어떻게 되나요?", a: "수령일 2일 전까지 취소 시 전액 환불됩니다. 전일 취소는 50% 환불, 당일 취소 및 노쇼는 환불이 어렵습니다. 제품 하자 시에는 수령 당일 사진과 함께 연락주시면 재제작 또는 전액 환불 처리해 드려요." }
];
const FAQ_CATEGORIES = [];
const GALLERY_WORKS = [];
Object.assign(window, { COURSE_CATEGORIES, COURSES, TECH_CATEGORIES, HOME_SECTIONS, FAQS, FAQ_CATEGORIES, GALLERY_WORKS });
const SITE_INFO = { phone: "", kakaoChannel: "https://pf.kakao.com/_txnxncb", ogTitle: "쌀케이크 전문점 벨케이크", ogDescription: "No 밀가루, No 식물성크림. 100% 국내산 쌀가루로 만든 쌀케이크, 동물성 생크림케이크 전문점 벨케이크입니다:) 1인운영매장이라, 전화를 못받을 수 있으니 부재시 카카오톡채널로 연락주세요^^", ogImage: "https://easysite.kr/bell_cake/img/hero.jpg" };
Object.assign(window, { SITE_INFO });
