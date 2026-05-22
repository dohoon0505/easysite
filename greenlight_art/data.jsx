/* eslint-disable */
// 풀빛그림아이 미술학원 — 교육과정 카탈로그 (자동 생성: publishToGitHub)
const COURSE_CATEGORIES = [
  { id: "kinder", name: "유아 미술", blurb: "아이의 손끝에 색을 더하는 시간", sub: "유아 미술", icon: "kinder" },
  { id: "elem", name: "초등 미술", blurb: "표현이 풍성해지는 황금기", sub: "초등 미술", icon: "elem" },
  { id: "exam", name: "중·고 입시", blurb: "재능을 진로로 잇는 본격 수업", sub: "중·고 입시", icon: "exam" },
  { id: "hobby", name: "취미·성인", blurb: "어른의 그림 한 장", sub: "취미·성인", icon: "hobby" },
  { id: "ipad", name: "아이패드 드로잉", blurb: "디지털로 만나는 새로운 표현", sub: "아이패드 드로잉", icon: "ipad" }
];
const COURSES = {
  kinder: [
    { productId: "kinder-1", id: "kinder-1", name: "5~7세 오감 표현반", age: "5~7세", per: 50, weekly: "주 1회", desc: "찰흙·물감·콜라주로 오감을 깨우는 첫 미술. 자유롭게 만지고 칠하며 표현력을 키워요.", tag: "BASIC", img: "img/work_4.jpg" },
    { productId: "kinder-2", id: "kinder-2", name: "6~8세 컬러 놀이반", age: "6~8세", per: 60, weekly: "주 1회", desc: "원색과 캐릭터로 색감 감각을 키우는 그림 놀이. 친구와 함께 협동 작업도 진행해요.", tag: "BEST", img: "img/work_8.jpg" },
    { productId: "kinder-3", id: "kinder-3", name: "7세 누리 통합반", age: "7세", per: 70, weekly: "주 2회", desc: "누리과정 연계 표현·관찰 수업. 초등 입학 전 미술 감각을 다져요.", tag: "PREMIUM", img: "img/work_3.jpg" }
  ],
  elem: [
    { productId: "elem-1", id: "elem-1", name: "초1~2 표현 기본반", age: "초1~2", per: 70, weekly: "주 1회", desc: "관찰화·상상화로 표현의 폭을 넓혀요. 색감과 구도의 기초를 잡아갑니다.", tag: "BASIC", img: "img/work_4.jpg" },
    { productId: "elem-2", id: "elem-2", name: "초3~4 종합 미술반", age: "초3~4", per: 80, weekly: "주 1~2회", desc: "수채화·아크릴·드로잉을 골고루. 재료별 표현법을 익히고 작품집을 만들어요.", tag: "BEST", img: "img/work_1.jpg" },
    { productId: "elem-3", id: "elem-3", name: "초5~6 마스터반", age: "초5~6", per: 90, weekly: "주 2회", desc: "스케일이 커진 본격 작품 제작. 공모전·전시 출품 작품도 함께 준비합니다.", tag: "PREMIUM", img: "img/work_5.jpg" }
  ],
  exam: [
    { productId: "exam-1", id: "exam-1", name: "예중·예고 입시반", age: "중1~3", per: 180, weekly: "주 3~5회", desc: "기초 소묘부터 상황표현, 정물 수채까지. 학교별 맞춤 커리큘럼으로 진행합니다.", tag: "GRAND", img: "img/work_2.jpg" },
    { productId: "exam-2", id: "exam-2", name: "대학 입시 기초반", age: "고1", per: 200, weekly: "주 3~5회", desc: "기초 데생·발상의 전환 훈련. 미대 진학을 위한 첫 단추.", tag: "PREMIUM", img: "img/work_2.jpg" },
    { productId: "exam-3", id: "exam-3", name: "대학 입시 실전반", age: "고2~3", per: 250, weekly: "주 5~6회", desc: "대학별 기출 분석 + 실기 대응 훈련. 매주 모의 평가로 실력을 점검해요.", tag: "GRAND", img: "img/work_2.jpg" }
  ],
  hobby: [
    { productId: "hobby-1", id: "hobby-1", name: "성인 취미 드로잉", age: "성인", per: 100, weekly: "자유 수강", desc: "퇴근 후·주말, 부담 없이 그리는 시간. 연필·펜·수채 중 원하는 재료로 진행해요.", tag: "BASIC", img: "img/work_1.jpg" },
    { productId: "hobby-2", id: "hobby-2", name: "주말 취미반", age: "성인", per: 110, weekly: "주 1회", desc: "토·일 한 주 1회 정기 수강. 작품집을 차곡차곡 쌓아가요.", tag: "BEST", img: "img/work_4.jpg" },
    { productId: "hobby-3", id: "hobby-3", name: "1:1 프라이빗 클래스", age: "전 연령", per: 200, weekly: "주 1회", desc: "원장님과의 1:1 맞춤 수업. 원하는 작품·주제로 깊이 있게 작업합니다.", tag: "PREMIUM", img: "img/work_5.jpg" }
  ],
  ipad: [
    { productId: "ipad-1", id: "ipad-1", name: "아이패드 드로잉 입문", age: "초3~성인", per: 120, weekly: "주 1회", desc: "프로크리에이트 기초 + 캐릭터 표현. 디지털 굿즈 제작까지 이어집니다.", tag: "BEST", img: "img/work_7.jpg" },
    { productId: "ipad-2", id: "ipad-2", name: "굿즈 제작반", age: "초5~성인", per: 150, weekly: "주 1회", desc: "스티커·폰케이스·에코백 등 나만의 굿즈를 디자인하고 직접 제작해요.", tag: "PREMIUM", img: "img/work_7.jpg" }
  ]
,
};
const TECH_CATEGORIES = [
  { id: "ipad", name: "아이패드 드로잉", hue: "pink", blurb: "디지털로 만나는 새로운 표현", learns: "프로크리에이트로 디지털 드로잉의 기초를 익히고, 굿즈 제작까지 이어집니다. 레이어·브러시·색 채우기 등 디지털 작업의 즐거움을 경험해요." },
  { id: "draw", name: "기초 드로잉", hue: "peach", blurb: "선과 형태를 익히는 첫 단계", learns: "마카와 색연필로 표현하는 기초 일러스트부터 정물 드로잉까지. 선의 굵기, 구도, 색감 대비를 익히며 표현력의 기초를 다져요." },
  { id: "water", name: "수채화", hue: "blue", blurb: "물과 색으로 감성을 펼쳐요", learns: "물과 물감의 번짐을 활용한 감성적인 수채화. 투명 채색, 겹치기, 번지기 기법을 익히며 나만의 색감을 찾아요." },
  { id: "sketch", name: "소묘", hue: "mint", blurb: "명암과 형태로 세상을 담아요", learns: "연필로 명암 5단계를 이해하고 입체감을 표현하는 힘을 키워요. 기초·입시 모두에 필수적인 과정이에요." },
  { id: "pencil", name: "색연필화", hue: "yellow", blurb: "색을 겹치며 나만의 팔레트를", learns: "색연필로 색을 겹치고 블렌딩하며 섬세한 표현을 연습해요. 광택, 질감, 명암까지 한 자루로 완성할 수 있어요." },
  { id: "pen", name: "펜화", hue: "lavender", blurb: "지울 수 없는 선 위의 자신감", learns: "지울 수 없는 펜 선 위에서 과감하게 표현하는 자신감을 키워요. 해칭, 점묘, 자유선 등 다양한 기법을 익혀요." }
];
const HOME_SECTIONS = [
  { id: "hero", type: "hero", title: "히어로", icon: "image", data: { storeName: "풀빛그림아이미술학원", bannerText: "1회 무료 체험 수업이 가능합니다!!", image: "img/hero.jpg", region: "대구광역시 | 달서구", hours: "월~토 13:00 - 19:00 · 일 휴무", mapImage: "img/map.png", mapAddress: "대구 달서구 조암남로16길 19 풀빛그림아이", storeDesc: "아이들에게 미술학원은 '지루하게 그림만 그리는 곳'이 아니어야 합니다. 가장 발달이 활발한 시기에 맞춰 인지발달과 미적 감각을 일깨우고, 아이에게 '매일 가고 싶은 놀이터'가 될 수 있도록 하겠습니다.", address: "대구 달서구 조암남로16길 19 하늘채 상가 2층", body: "아이들에게 미술학원은 '지루하게 그림만 그리는 곳'이 아니어야 합니다. 가장 발달이 활발한 시기에 맞춰 인지발달과 미적 감각을 일깨우고, 아이에게 '매일 가고 싶은 놀이터'가 될 수 있도록 하겠습니다." } },
  { id: "slider_1", type: "slider", title: "상품 슬라이더 (1)", icon: "star", data: { subtitle: "아이들이 완성한 작품들을 소개해요.", pickedIds: [], title: "아이들 작품 둘러보기" } },
  { id: "faq", type: "faq", title: "FAQ", icon: "help", data: { title: "주문 전 자주하는 질문", pickedIds: ["faq-course-1", "faq-course-2", "faq-course-3", "faq-course-4", "faq-tuition-1", "faq-tuition-2"] } }
];
const FAQS = [
  { id: "faq-course-1", cat: "course", q: "처음인데 어떤 과정부터 시작하면 좋을까요?", a: "아이의 연령과 미술 경험에 따라 추천 과정이 달라요. 5~7세는 오감 표현반, 초등 저학년은 표현 기본반, 초등 고학년은 종합 미술반을 주로 권해드립니다. 1회 무료 체험을 통해 직접 보고 결정하실 수 있어요." },
  { id: "faq-course-2", cat: "course", q: "수업은 어떻게 진행되나요?", a: "정해진 커리큘럼을 기본으로 하되, 아이의 흥미와 표현 방식에 맞춰 유연하게 진행합니다. 한 작품을 1~3회에 걸쳐 완성하며, 작품집·전시 출품을 함께 준비해요." },
  { id: "faq-course-3", cat: "course", q: "체험 수업이 가능한가요?", a: "네, 1회 무료 체험이 가능합니다. 사용하시는 재료·앞치마·연습장은 모두 학원에서 준비해드려요. 상담 페이지에서 신청해주세요." },
  { id: "faq-course-4", cat: "course", q: "입시 준비는 언제부터 시작하면 좋을까요?", a: "예중·예고는 중1, 미대 입시는 고1부터 시작하시는 분이 많아요. 다만 학생의 실력과 목표 학교에 따라 다르니, 상담을 통해 가장 적절한 시점을 함께 정해드립니다." },
  { id: "faq-tuition-1", cat: "tuition", q: "수강료는 어떻게 되나요?", a: "유아 5만원대, 초등 7~9만원대, 입시 18~25만원대로 과정마다 다릅니다. 형제·자매 등록 시 할인, 장기 등록 시 할인이 있어요. 자세한 금액은 상담을 통해 안내드립니다." },
  { id: "faq-tuition-2", cat: "tuition", q: "재료비는 별도인가요?", a: "기본 재료(물감·연필·붓·종이 등)는 수강료에 포함되어 있어요. 다만 큰 캔버스 작품, 굿즈 제작 등 특수 재료는 별도로 청구될 수 있습니다." },
  { id: "faq-tuition-3", cat: "tuition", q: "결제는 어떻게 진행되나요?", a: "매월 1일 기준으로 자동이체 또는 카드 결제로 진행됩니다. 첫 등록 시 안내해드려요. 형제 할인·장기 할인은 결제 시 자동 적용됩니다." },
  { id: "faq-tuition-4", cat: "tuition", q: "환불 정책이 어떻게 되나요?", a: "학원법에 따라 수강 시작 전 100%, 1/3 수강 전 2/3 환불 등 단계별 환불이 가능합니다. 자세한 환불 규정은 등록 시 별도로 안내드립니다." },
  { id: "faq-facility-1", cat: "facility", q: "학원 위치가 어디인가요?", a: "대구 달서구 조암남로16길 19 하늘채 상가 2층 풀빛그림아이 미술학원입니다. 월배역에서 도보 10분, 신월초등학교 바로 옆에 있어요. 주차 공간도 마련되어 있습니다." },
  { id: "faq-facility-2", cat: "facility", q: "학원 시설은 어떤가요?", a: "유아반·초등반·입시반 공간이 분리되어 있어 연령에 맞는 환경에서 수업합니다. 화장실·정수기·간식 공간도 마련되어 있어요. 작품 전시 공간도 운영합니다." },
  { id: "faq-facility-3", cat: "facility", q: "준비물이 따로 있나요?", a: "앞치마와 기본 미술 재료는 모두 학원에서 제공합니다. 처음 등록 시 본인 명찰·물통·연필꽂이 정도만 준비해주시면 돼요." },
  { id: "faq-schedule-1", cat: "schedule", q: "운영 시간이 어떻게 되나요?", a: "월~토 13:00~19:00 운영합니다. 일요일은 휴무예요. 시간대별로 수업이 분리되어 있어, 상담 시 가능한 시간대를 안내해드립니다." },
  { id: "faq-schedule-2", cat: "schedule", q: "수업 결석 시 보강이 가능한가요?", a: "사전 연락 주시면 같은 주 내 다른 요일로 보강 가능합니다. 무단 결석의 경우 보강이 어려울 수 있어요." },
  { id: "faq-schedule-3", cat: "schedule", q: "방학 특강도 있나요?", a: "여름·겨울 방학 시즌에 단기 특강을 운영합니다. 디지털 드로잉, 굿즈 제작, 입시 집중반 등 시즌별로 커리큘럼이 달라져요. 인스타그램에서 모집 공지를 확인하실 수 있어요." }
];
const FAQ_CATEGORIES = [];
const GALLERY_WORKS = [];
Object.assign(window, { COURSE_CATEGORIES, COURSES, TECH_CATEGORIES, HOME_SECTIONS, FAQS, FAQ_CATEGORIES, GALLERY_WORKS });
const SITE_INFO = { phone: "0507-1399-2425", kakaoChannel: "", ogTitle: "풀빛그림아이 미술학원 · 대구 달서구", ogDescription: "아이의 손끝에 색을 더하는 시간 — 대구 달서구 풀빛그림아이 미술학원", ogImage: "https://easysite.kr/greenlight_art/img/hero.jpg" };
Object.assign(window, { SITE_INFO });
