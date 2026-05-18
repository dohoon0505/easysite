/* eslint-disable */
// 풀빛그림아이 미술학원 — 교육과정 카탈로그

const COURSE_CATEGORIES = [
  { id: "kinder", name: "유아 미술",       blurb: "아이의 손끝에 색을 더하는 시간",   sub: "유아 미술",       icon: "kinder" },
  { id: "elem",   name: "초등 미술",       blurb: "표현이 풍성해지는 황금기",         sub: "초등 미술",       icon: "elem" },
  { id: "exam",   name: "중·고 입시",      blurb: "재능을 진로로 잇는 본격 수업",      sub: "중·고 입시",      icon: "exam" },
  { id: "hobby",  name: "취미·성인",       blurb: "어른의 그림 한 장",                sub: "취미·성인",       icon: "hobby" },
  { id: "ipad",   name: "아이패드 드로잉", blurb: "디지털로 만나는 새로운 표현",       sub: "아이패드 드로잉", icon: "ipad" },
];

const COURSES = {
  kinder: [
    { name: "5~7세 오감 표현반",   age: "5~7세",  per: 50,  weekly: "주 1회",  desc: "찰흙·물감·콜라주로 오감을 깨우는 첫 미술. 자유롭게 만지고 칠하며 표현력을 키워요.",   tag: "BASIC",   img: "img/work_4.jpg" },
    { name: "6~8세 컬러 놀이반",   age: "6~8세",  per: 60,  weekly: "주 1회",  desc: "원색과 캐릭터로 색감 감각을 키우는 그림 놀이. 친구와 함께 협동 작업도 진행해요.",   tag: "BEST",    img: "img/work_8.jpg" },
    { name: "7세 누리 통합반",     age: "7세",    per: 70,  weekly: "주 2회",  desc: "누리과정 연계 표현·관찰 수업. 초등 입학 전 미술 감각을 다져요.",                     tag: "PREMIUM", img: "img/work_3.jpg" },
  ],
  elem: [
    { name: "초1~2 표현 기본반",   age: "초1~2",  per: 70,  weekly: "주 1회",  desc: "관찰화·상상화로 표현의 폭을 넓혀요. 색감과 구도의 기초를 잡아갑니다.",            tag: "BASIC",   img: "img/work_4.jpg" },
    { name: "초3~4 종합 미술반",   age: "초3~4",  per: 80,  weekly: "주 1~2회", desc: "수채화·아크릴·드로잉을 골고루. 재료별 표현법을 익히고 작품집을 만들어요.",       tag: "BEST",    img: "img/work_1.jpg" },
    { name: "초5~6 마스터반",      age: "초5~6",  per: 90,  weekly: "주 2회",  desc: "스케일이 커진 본격 작품 제작. 공모전·전시 출품 작품도 함께 준비합니다.",         tag: "PREMIUM", img: "img/work_5.jpg" },
  ],
  exam: [
    { name: "예중·예고 입시반",    age: "중1~3",  per: 180, weekly: "주 3~5회", desc: "기초 소묘부터 상황표현, 정물 수채까지. 학교별 맞춤 커리큘럼으로 진행합니다.",     tag: "GRAND",   img: "img/work_2.jpg" },
    { name: "대학 입시 기초반",     age: "고1",   per: 200, weekly: "주 3~5회", desc: "기초 데생·발상의 전환 훈련. 미대 진학을 위한 첫 단추.",                          tag: "PREMIUM", img: "img/work_2.jpg" },
    { name: "대학 입시 실전반",     age: "고2~3", per: 250, weekly: "주 5~6회", desc: "대학별 기출 분석 + 실기 대응 훈련. 매주 모의 평가로 실력을 점검해요.",            tag: "GRAND",   img: "img/work_2.jpg" },
  ],
  hobby: [
    { name: "성인 취미 드로잉",    age: "성인",   per: 100, weekly: "자유 수강", desc: "퇴근 후·주말, 부담 없이 그리는 시간. 연필·펜·수채 중 원하는 재료로 진행해요.",   tag: "BASIC",   img: "img/work_1.jpg" },
    { name: "주말 취미반",         age: "성인",   per: 110, weekly: "주 1회",   desc: "토·일 한 주 1회 정기 수강. 작품집을 차곡차곡 쌓아가요.",                         tag: "BEST",    img: "img/work_4.jpg" },
    { name: "1:1 프라이빗 클래스", age: "전 연령", per: 200, weekly: "주 1회",   desc: "원장님과의 1:1 맞춤 수업. 원하는 작품·주제로 깊이 있게 작업합니다.",            tag: "PREMIUM", img: "img/work_5.jpg" },
  ],
  ipad: [
    { name: "아이패드 드로잉 입문", age: "초3~성인", per: 120, weekly: "주 1회", desc: "프로크리에이트 기초 + 캐릭터 표현. 디지털 굿즈 제작까지 이어집니다.",            tag: "BEST",    img: "img/work_7.jpg" },
    { name: "굿즈 제작반",          age: "초5~성인", per: 150, weekly: "주 1회", desc: "스티커·폰케이스·에코백 등 나만의 굿즈를 디자인하고 직접 제작해요.",              tag: "PREMIUM", img: "img/work_7.jpg" },
  ],
};

const TECH_CATEGORIES = [
  { id: "ipad",   name: "아이패드 드로잉", hue: "pink",     blurb: "디지털로 만나는 새로운 표현",    learns: "프로크리에이트로 디지털 드로잉의 기초를 익히고, 굿즈 제작까지 이어집니다. 레이어·브러시·색 채우기 등 디지털 작업의 즐거움을 경험해요." },
  { id: "draw",   name: "기초 드로잉",    hue: "peach",    blurb: "선과 형태를 익히는 첫 단계",     learns: "마카와 색연필로 표현하는 기초 일러스트부터 정물 드로잉까지. 선의 굵기, 구도, 색감 대비를 익히며 표현력의 기초를 다져요." },
  { id: "water",  name: "수채화",          hue: "blue",     blurb: "물과 색으로 감성을 펼쳐요",     learns: "물과 물감의 번짐을 활용한 감성적인 수채화. 투명 채색, 겹치기, 번지기 기법을 익히며 나만의 색감을 찾아요." },
  { id: "sketch", name: "소묘",            hue: "mint",     blurb: "명암과 형태로 세상을 담아요",    learns: "연필로 명암 5단계를 이해하고 입체감을 표현하는 힘을 키워요. 기초·입시 모두에 필수적인 과정이에요." },
  { id: "pencil", name: "색연필화",        hue: "yellow",   blurb: "색을 겹치며 나만의 팔레트를",   learns: "색연필로 색을 겹치고 블렌딩하며 섬세한 표현을 연습해요. 광택, 질감, 명암까지 한 자루로 완성할 수 있어요." },
  { id: "pen",    name: "펜화",            hue: "lavender", blurb: "지울 수 없는 선 위의 자신감",   learns: "지울 수 없는 펜 선 위에서 과감하게 표현하는 자신감을 키워요. 해칭, 점묘, 자유선 등 다양한 기법을 익혀요." },
];

Object.assign(window, { COURSE_CATEGORIES, COURSES, TECH_CATEGORIES });
