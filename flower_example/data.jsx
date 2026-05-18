/* eslint-disable */
// Product catalogue — mirrors the source items.html exactly.
// 5 categories × 3 sections × 2 products = 30 items, "기능 유지".

const CATEGORIES = [
  {
    id: "tab1",
    name: "개업화분",
    blurb: "개업·이전하는 지인에게",
    banner: "img/banner_tab1.png",
    photo: "img/cat_tab1.png",
    icon: "leaf",
    accent: "#16A34A",
    accentBg: "#DCFCE7",
  },
  {
    id: "tab2",
    name: "꽃바구니",
    blurb: "기념일·생일·특별한 날에",
    banner: "img/banner_tab2.png",
    photo: "img/cat_tab2.png",
    icon: "basket",
    accent: "#D946A6",
    accentBg: "#FDE7F4",
  },
  {
    id: "tab3",
    name: "동서양란",
    blurb: "이·취임식·승진 축하 자리에",
    banner: "img/banner_tab3.png",
    photo: "img/cat_tab3.png",
    icon: "orchid",
    accent: "var(--p-indigo-500)",
    accentBg: "var(--p-indigo-50)",
  },
  {
    id: "tab4",
    name: "축하화환",
    blurb: "개업식·결혼식·행사장에",
    banner: "img/banner_tab4.png",
    photo: "img/tab4_grand1.jpg",
    icon: "wreath",
    accent: "var(--p-amber-500)",
    accentBg: "#FEF3D1",
  },
  {
    id: "tab5",
    name: "근조화환",
    blurb: "장례식장·애도현장으로",
    banner: "img/banner_tab5.png",
    photo: "img/tab5_grand1.jpg",
    icon: "memorial",
    accent: "var(--p-neutral-70)",
    accentBg: "var(--p-neutral-20)",
  },
];

const SECTIONS = {
  tab1: [
    {
      kicker: "다른 사람들이 평균적으로",
      title: "많이 구매하는 개업화분",
      tag: "베스트상품",
      items: [
        { name: "행복을 가져다주는 해피트리", price: 110000, img: "img/tab1_item1_img1.png", imgLg: "img/tab1_item1_img2.jpg" },
        { name: "행복을 빌어주는 뱅갈나무", price: 120000, img: "img/tab1_item2_img1.png", imgLg: "img/tab1_item2_img2.jpg" },
      ],
    },
    {
      kicker: "비교적 저렴한 가격대,",
      title: "가볍게 선물하기 좋은 개업화분",
      tag: "경제적인 선택",
      items: [
        { name: "행복을 빌어주는 고무나무", price: 87000, img: "img/tab1_item3_img1.png", imgLg: "img/tab1_item3_img2.jpg" },
        { name: "키우기가 쉬운 스파트필름", price: 79000, img: "img/tab1_item4_img1.png", imgLg: "img/tab1_item4_img2.jpg" },
      ],
    },
    {
      kicker: "남들과 비슷한 것이 싫다면,",
      title: "독보적이고 특별한 개업화분",
      tag: "프리미엄",
      items: [
        { name: "튼튼하고 오래사는 떡갈나무", price: 120000, img: "img/tab1_item5_img1.png", imgLg: "img/tab1_item5_img2.jpg" },
        { name: "색상이 인상적인 크로톤", price: 110000, img: "img/tab1_item6_img1.png", imgLg: "img/tab1_item6_img2.jpg" },
      ],
    },
  ],
  tab2: [
    {
      kicker: "다른 사람들이 평균적으로",
      title: "많이 구매하는 꽃바구니",
      tag: "베스트상품",
      items: [
        { name: "파스텔톤 혼합 꽃바구니", price: 78000, img: "img/tab2_item1_img1.png", imgLg: "img/tab2_item1_img2.jpg" },
        { name: "연핑크톤 장미 꽃바구니", price: 86000, img: "img/tab2_item2_img1.png", imgLg: "img/tab2_item2_img2.jpg" },
      ],
    },
    {
      kicker: "비교적 저렴한 가격대,",
      title: "가볍게 선물하기 좋은 꽃바구니",
      tag: "경제적인 선택",
      items: [
        { name: "연보라톤 혼합 꽃바구니", price: 65000, img: "img/tab2_item3_img1.png", imgLg: "img/tab2_item3_img2.jpg" },
        { name: "화사한 빨강화이트 꽃바구니", price: 60000, img: "img/tab2_item4_img1.png", imgLg: "img/tab2_item4_img2.jpg" },
      ],
    },
    {
      kicker: "특별한 사람에게 보내는 것이라면,",
      title: "독보적이고 특별한 꽃바구니",
      tag: "프리미엄",
      items: [
        { name: "빨간장미 한가득 꽃바구니", price: 110000, img: "img/tab2_item5_img1.png", imgLg: "img/tab2_item5_img2.jpg" },
        { name: "핑크장미 한가득 꽃바구니", price: 110000, img: "img/tab2_item6_img1.png", imgLg: "img/tab2_item6_img2.jpg" },
      ],
    },
  ],
  tab3: [
    {
      kicker: "다른 사람들이 평균적으로",
      title: "많이 구매하는 승진취임 화분",
      tag: "베스트상품",
      items: [
        { name: "고급스러운 청자 황룡금", price: 96000, img: "img/tab3_item1_img1.png", imgLg: "img/tab3_item1_img2.jpg" },
        { name: "잎새가 아름다운 철골소심", price: 65000, img: "img/tab3_item2_img1.png", imgLg: "img/tab3_item2_img2.jpg" },
      ],
    },
    {
      kicker: "종류 별 색상이 포인트,",
      title: "아름다운 색을 띄는 서양란 화분",
      tag: "COLOR",
      items: [
        { name: "강렬한 인상의 진핑크 호접란", price: 88000, img: "img/tab3_item3_img1.png", imgLg: "img/tab3_item3_img2.jpg" },
        { name: "따듯한 인상의 연핑크 호접란", price: 130000, img: "img/tab3_item4_img1.png", imgLg: "img/tab3_item4_img2.jpg" },
      ],
    },
    {
      kicker: "평범하지 않은 상품을 찾으신다면,",
      title: "독특함을 자랑하는 동·서양란 화분",
      tag: "프리미엄",
      items: [
        { name: "넓은 잎이 특징인 산천보세", price: 65000, img: "img/tab3_item5_img1.png", imgLg: "img/tab3_item5_img2.jpg" },
        { name: "특색있는 노란색의 호접란", price: 120000, img: "img/tab3_item6_img1.png", imgLg: "img/tab3_item6_img2.jpg" },
      ],
    },
  ],
  tab4: [
    {
      kicker: "예의상 보내야 하는 관계라면,",
      title: "무난하게 보내기 좋은 기본 축하화환",
      tag: "경제적인 선택",
      items: [
        { name: "기본형 축하화환 (1)", price: 60000, img: "img/tab4_basic1.png", imgLg: "img/tab4_basic1.png" },
        { name: "기본형 축하화환 (2)", price: 60000, img: "img/tab4_basic2.jpg", imgLg: "img/tab4_basic2.jpg" },
      ],
    },
    {
      kicker: "조금 신경써야 하는 관계라면,",
      title: "장식이 추가되고 꽃이 풍성한 고급 축하화환",
      tag: "프리미엄",
      items: [
        { name: "고급형 축하화환 (1)", price: 80000, img: "img/tab4_premium1.jpg", imgLg: "img/tab4_premium1.jpg" },
        { name: "고급형 축하화환 (2)", price: 80000, img: "img/tab4_premium2.jpg", imgLg: "img/tab4_premium2.jpg" },
      ],
    },
    {
      kicker: "많이 애틋하고 소중한 사람이라면,",
      title: "독보적으로 풍성한 특대 축하화환",
      tag: "차이가 확실한",
      items: [
        { name: "특대형 축하화환 (1)", price: 93000, img: "img/tab4_grand1.jpg", imgLg: "img/tab4_grand1.jpg" },
        { name: "특대형 축하화환 (2)", price: 93000, img: "img/tab4_grand2.jpg", imgLg: "img/tab4_grand2.jpg" },
      ],
    },
  ],
  tab5: [
    {
      kicker: "예의상 보내야 하는 관계라면,",
      title: "무난하게 보내기 좋은 기본 근조화환",
      tag: "경제적인 선택",
      items: [
        { name: "기본형 근조화환 (1)", price: 60000, img: "img/tab5_basic1.jpg", imgLg: "img/tab5_basic1.jpg" },
        { name: "기본형 근조화환 (2)", price: 60000, img: "img/tab5_basic2.png", imgLg: "img/tab5_basic2.png" },
      ],
    },
    {
      kicker: "조금 신경써야 하는 관계라면,",
      title: "장식이 추가되고 꽃이 풍성한 고급 근조화환",
      tag: "프리미엄",
      items: [
        { name: "고급형 근조화환 (1)", price: 80000, img: "img/tab5_premium1.jpg", imgLg: "img/tab5_premium1.jpg" },
        { name: "고급형 근조화환 (2)", price: 80000, img: "img/tab5_premium2.jpg", imgLg: "img/tab5_premium2.jpg" },
      ],
    },
    {
      kicker: "많이 애틋하고 소중한 사람이라면,",
      title: "독보적으로 풍성한 특대 & 4단 근조화환",
      tag: "차이가 확실한",
      items: [
        { name: "특대형 근조화환", price: 100000, img: "img/tab5_grand1.jpg", imgLg: "img/tab5_grand1.jpg" },
        { name: "4단형 근조화환", price: 120000, img: "img/tab5_grand2_4dan.png", imgLg: "img/tab5_grand2_4dan.png" },
      ],
    },
  ],
};

Object.assign(window, { CATEGORIES, SECTIONS });
