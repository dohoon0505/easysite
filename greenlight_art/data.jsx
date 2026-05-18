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

Object.assign(window, { COURSE_CATEGORIES, COURSES });
