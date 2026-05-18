/* eslint-disable */
// 풀빛그림아이 미술학원 — 홈 슬라이더용 작품 큐레이션

// 베스트 작품 / 우리 아이 그림 / 입시 작품 / 굿즈 4개 슬라이더
const GALLERY_BEST = [
  { id: "gb1", name: "포카리스웨트 정물", age: "초6", duration: "3회 완성", review: "색깔 섞는 게 너무 재밌었어요!", img: "img/work_1.jpg", desc: "마카+색연필로 표현한 정물 일러스트. 색감과 빛 표현이 돋보이는 작품.", develop: ["색채 감각", "관찰력"] },
  { id: "gb2", name: "큐브 소묘",         age: "초5", duration: "2회 완성", review: "명암 표현이 어렵지만 뿌듯해요.", img: "img/work_2.jpg", desc: "기초 소묘 입시 과제. 명암 단계와 면 처리를 익혀요.", develop: ["공간 지각력", "집중력"] },
  { id: "gb3", name: "츄파춥스 일러스트", age: "중1", duration: "2회 완성", review: "내가 그린 게 맞나 싶을 정도예요!", img: "img/work_3.jpg", desc: "마카로 표현한 츄파춥스. 화면 구성과 색감 대비 연습.", develop: ["화면 구성력", "색채 감각"] },
  { id: "gb4", name: "과일 정물 마카",    age: "초6", duration: "2회 완성", review: "과일이 진짜처럼 보여서 신기했어요.", img: "img/work_6.jpg", desc: "다양한 과일을 마카로 표현. 입체감과 텍스처 묘사를 연습해요.", develop: ["입체 인지력", "관찰력"] },
];

const GALLERY_KIDS = [
  { id: "gk1", name: "아이클레이 만들기",     age: "초2", duration: "1회 완성", review: "친구랑 같이 만들어서 더 재밌었어요!", img: "img/work_8.jpg", desc: "친구들과 함께 만든 클레이 디저트. 협동 작업의 즐거움.", develop: ["협동심", "소근육 발달"] },
  { id: "gk2", name: "돌멩이 캐릭터",         age: "초3", duration: "1회 완성", review: "돌에 그림이 그려진다는 게 신기해요.", img: "img/work_5.jpg", desc: "돌멩이 위에 그린 귀여운 캐릭터들. 입체와 회화의 만남.", develop: ["창의 표현력", "입체 인지력"] },
  { id: "gk3", name: "포카리스웨트 정물",     age: "초6", duration: "3회 완성", review: "완성하고 나서 엄마한테 자랑했어요.", img: "img/work_1.jpg", desc: "마카+색연필로 표현한 음료 일러스트.", develop: ["색채 감각", "관찰력"] },
  { id: "gk4", name: "츄파춥스 마카 작업",    age: "중1", duration: "2회 완성", review: "그릴수록 더 그리고 싶어져요.", img: "img/work_3.jpg", desc: "익숙한 캔디를 마카로 새롭게 표현.", develop: ["창의 표현력", "화면 구성력"] },
];

const GALLERY_EXAM = [
  { id: "ge1", name: "기초 큐브 소묘",        age: "중2", duration: "2회 완성", review: "처음엔 어렵더니 이제 눈에 보여요.", img: "img/work_2.jpg", desc: "예중·예고 입시 기초. 면과 명암을 정확히 잡는 훈련.", develop: ["공간 지각력", "집중력"] },
  { id: "ge2", name: "과일 정물 마카",        age: "고1", duration: "3회 완성", review: "발상 전환 수업이 가장 좋아요.", img: "img/work_6.jpg", desc: "대학 입시 발상의 전환. 익숙한 소재를 새롭게 보기.", develop: ["발상 전환력", "색채 감각"] },
  { id: "ge3", name: "포카리스웨트 묘사",     age: "고2", duration: "4회 완성", review: "디테일이 올라갈수록 재미있어요.", img: "img/work_1.jpg", desc: "재질감을 살린 정물 묘사. 빛과 그림자의 미묘함을 잡아요.", develop: ["관찰력", "표현 완성도"] },
];

const GALLERY_GOODS = [
  { id: "gg1", name: "아이패드 드로잉 굿즈",  age: "성인", duration: "4회 완성", review: "내 그림으로 굿즈를 만들다니 신기해요.", img: "img/work_7.jpg", desc: "본인이 그린 그림으로 폰케이스·에코백을 제작했어요.", develop: ["디지털 표현력", "창의 표현력"] },
  { id: "gg2", name: "아크릴 미러 작품",      age: "초5",  duration: "2회 완성", review: "거울에 그림을 그린다는 게 설렜어요.", img: "img/work_5.jpg", desc: "아크릴 위에 페인팅한 미러 작품 시리즈.", develop: ["색채 감각", "집중력"] },
  { id: "gg3", name: "돌멩이 굿즈",           age: "초3",  duration: "1회 완성", review: "집에 가져가서 책상에 올려뒀어요.", img: "img/work_5.jpg", desc: "돌멩이를 활용한 입체 캐릭터 작업.", develop: ["입체 인지력", "소근육 발달"] },
];

window.GALLERY_BEST  = GALLERY_BEST;
window.GALLERY_KIDS  = GALLERY_KIDS;
window.GALLERY_EXAM  = GALLERY_EXAM;
window.GALLERY_GOODS = GALLERY_GOODS;
