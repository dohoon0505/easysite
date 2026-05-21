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
    { name: "코랄 로즈 꽃다발 (S)", price: 55000, desc: "소형 · 코랄톤 장미 믹스", img: "img/bouquet-s-coral.jpg", categoryName: "베스트" },
    { name: "파스텔 꽃바구니 (M)", price: 65000, desc: "중형 · 파스텔톤 믹스 플라워", img: "img/basket-m-pastel.jpg", categoryName: "베스트" },
    { name: "럭셔리 용돈박스", price: 80000, desc: "프리미엄 장미 + 용돈봉투", img: "img/moneybox-luxury.jpg", categoryName: "베스트" },
    { name: "핑크 로즈 꽃다발 (XL)", price: 120000, desc: "대형 · 핑크 장미 100송이", img: "img/bouquet-xl-pink.jpg", categoryName: "베스트" },
    { name: "카네이션 아크릴백", price: 45000, desc: "아크릴백 · 카네이션 어레인지먼트", img: "img/acrylic-carnation.jpg", categoryName: "베스트" }
  ],
  bouquet: [
    { name: "카네이션 꽃다발 (S)", price: 35000, desc: "소형 · 감사의 마음을 담은 카네이션", img: "img/bouquet-s-carnation.jpg", categoryName: "꽃다발" },
    { name: "코랄 로즈 꽃다발 (S)", price: 55000, desc: "소형 · 코랄톤 장미 믹스", img: "img/bouquet-s-coral.jpg", categoryName: "꽃다발" },
    { name: "핑크 로즈 꽃다발 (S)", price: 40000, desc: "소형 · 사랑스러운 핑크 장미", img: "img/bouquet-s-pink-rose.jpg", categoryName: "꽃다발" },
    { name: "비비드 꽃다발 (S)", price: 45000, desc: "소형 · 화사한 비비드 컬러 믹스", img: "img/bouquet-s-vivid.jpg", categoryName: "꽃다발" },
    { name: "로즈 꽃다발 (M)", price: 70000, desc: "중형 · 아모르겐 장미 어레인지먼트", img: "img/bouquet-m-rose.jpg", categoryName: "꽃다발" },
    { name: "코랄 꽃다발 (XL)", price: 110000, desc: "대형 · 코랄톤 장미 대형 꽃다발", img: "img/bouquet-xl-coral.jpg", categoryName: "꽃다발" },
    { name: "핑크 로즈 꽃다발 (XL)", price: 120000, desc: "대형 · 핑크 장미 100송이", img: "img/bouquet-xl-pink.jpg", categoryName: "꽃다발" },
    { name: "아모르겐 꽃다발 (L)", price: 90000, desc: "대형 · 아모르겐 장미 프리미엄", img: "img/bouquet-l-amorgen.jpg", categoryName: "꽃다발" }
  ],
  basket: [
    { name: "파스텔 꽃바구니 (M)", price: 65000, desc: "중형 · 파스텔톤 믹스 플라워", img: "img/basket-m-pastel.jpg", categoryName: "꽃바구니" },
    { name: "핑크 꽃바구니 (L)", price: 85000, desc: "대형 · 핑크톤 장미 꽃바구니", img: "img/basket-l-pink.jpg", categoryName: "꽃바구니" },
    { name: "옐로우 꽃바구니 (L)", price: 85000, desc: "대형 · 화사한 옐로우톤 꽃바구니", img: "img/basket-l-yellow.jpg", categoryName: "꽃바구니" },
    { name: "프리미엄 꽃바구니 (XL)", price: 130000, desc: "특대형 · 풍성한 프리미엄 꽃바구니", img: "img/basket-xl.jpg", categoryName: "꽃바구니" }
  ],
  moneybox: [
    { name: "브라이트 용돈박스", price: 60000, desc: "화사한 컬러 플라워 + 용돈봉투", img: "img/moneybox-bright.jpg", categoryName: "용돈박스" },
    { name: "럭셔리 용돈박스", price: 80000, desc: "프리미엄 장미 + 용돈봉투", img: "img/moneybox-luxury.jpg", categoryName: "용돈박스" },
    { name: "아크릴 용돈박스", price: 70000, desc: "아크릴 케이스 + 플라워 + 용돈봉투", img: "img/moneybox-acrylic.jpg", categoryName: "용돈박스" }
  ],
  acrylic: [
    { name: "카네이션 아크릴백", price: 45000, desc: "아크릴백 · 카네이션 어레인지먼트", img: "img/acrylic-carnation.jpg", categoryName: "아크릴백" },
    { name: "블루 아크릴백", price: 50000, desc: "아크릴백 · 블루톤 플라워 어레인지먼트", img: "img/acrylic-blue.jpg", categoryName: "아크릴백" },
    { name: "엘레강스 아크릴백", price: 55000, desc: "아크릴백 · 고급스러운 파스텔톤", img: "img/acrylic-elegant.jpg", categoryName: "아크릴백" },
    { name: "디즈니 아크릴백", price: 55000, desc: "아크릴백 · 디즈니 캐릭터 포인트", img: "img/acrylic-disney.jpg", categoryName: "아크릴백" }
  ],
  bridal: [

  ]
,
};
const HOME_SECTIONS = [
  { id: "hero", type: "hero", title: "히어로", icon: "image", data: { storeDesc: "평범한 일상도 꽃 한 송이가 더해지면 특별한 순간이 됩니다.\n\n계절을 듬뿍 머금은 다채로운 꽃들로, 당신의 오늘을 가장 아름답게 피워내겠습니다.", image: "url(\"https://firebasestorage.googleapis.com/v0/b/easysite-5a560.firebasestorage.app/o/sites%2Fdohwawon%2Fhome%2Fhero.jpg?alt=media&token=b10fd1c2-d665-4a50-a4ec-973068eca20f\")", hours: "11:00 ~ 19:00 · 매주 일요일 휴무", address: "대구 달서구 당산로 99 1층 도화원플라워", mapImage: "url(\"https://firebasestorage.googleapis.com/v0/b/easysite-5a560.firebasestorage.app/o/sites%2Fdohwawon%2Fhome%2Fmap.png?alt=media&token=46baf348-9706-4dc1-81d7-828b4a7905cd\")", imageStoragePath: "sites/dohwawon/home/hero.jpg", mapImageStoragePath: "sites/dohwawon/home/map.png", mapImageUrl: "https://firebasestorage.googleapis.com/v0/b/easysite-5a560.firebasestorage.app/o/sites%2Fdohwawon%2Fhome%2Fmap.png?alt=media&token=46baf348-9706-4dc1-81d7-828b4a7905cd", imageUrl: "https://firebasestorage.googleapis.com/v0/b/easysite-5a560.firebasestorage.app/o/sites%2Fdohwawon%2Fhome%2Fhero.jpg?alt=media&token=b10fd1c2-d665-4a50-a4ec-973068eca20f", bannerText: "예약요청 탭을 통해 간편히 예약을 요청해보세요!", storeName: "도화원플라워", region: "대구광역시 | 달서구", mapAddress: "대구 달서구 당산로 99" } },
  { id: "slider_1", type: "slider", title: "상품 슬라이더 (1)", icon: "star", data: { pickedIds: [], title: "풍성한 꽃다발 추천" } },
  { id: "slider_2", type: "slider", title: "상품 슬라이더 (2)", icon: "star", data: { pickedIds: [], title: "특별한 날, 꽃바구니 선물!" } },
  { id: "slider_3", type: "slider", title: "상품 슬라이더 (3)", icon: "star", data: { subtitle: "333", title: "아름다운 효도, 용돈박스", pickedIds: [] } },
  { id: "slider_4", type: "slider", title: "상품 슬라이더 (4)", icon: "star", data: { pickedIds: [], title: "특색있는 아크릴백" } },
  { id: "faq", type: "faq", title: "FAQ", icon: "help", data: { pickedIds: [], title: "주문 전 자주하는 질문" } }
];
Object.assign(window, { HAIR_CATEGORIES, HAIR_STYLES, HOME_SECTIONS });