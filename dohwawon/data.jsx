/* eslint-disable */
// 벨케이크 — 케이크 카탈로그

const HAIR_CATEGORIES = [
  { id: "best",      name: "베스트",   blurb: "가장 많이 주문하는 인기 케이크", sub: "BEST" },
  { id: "signature", name: "시그니처", blurb: "벨케이크만의 특별한 디자인",      sub: "SIGNATURE" },
  { id: "dosirak",   name: "도시락",   blurb: "귀여운 미니 도시락케이크",        sub: "LUNCHBOX" },
  { id: "size-1",    name: "1호",      blurb: "1호 케이크 (16cm, 3~5인)",       sub: "SIZE 1" },
  { id: "size-2",    name: "2호",      blurb: "2호 케이크 (18cm, 6~8인)",       sub: "SIZE 2" },
  { id: "size-3",    name: "3호",      blurb: "3호 케이크 (21cm, 7~10인)",      sub: "SIZE 3" },
  { id: "double",    name: "2단",      blurb: "특별한 날을 위한 2단 케이크",     sub: "DOUBLE" },
];

const HAIR_STYLES = {
  best: [
    { name: "장미케이크",     price: 43000, desc: "1호 · 바닐라 쌀시트 + 블루베리잼",              img: "img/장미케이크.jpeg",      sizeId: "type-1", flavorId: "vanilla-blueberry", categoryName: "케이크" },
    { name: "기본 레터링",    price: 20000, desc: "도시락 · 초코 쌀시트 + 초코크림",               img: "img/기본 레터링.jpg",      sizeId: "type-dosirak", flavorId: "choco-choco", categoryName: "케이크" },
    { name: "카네이션케이크", price: 66000, desc: "3호 · 바닐라 쌀시트 + 레몬커스터드",            img: "img/카네이션케이크.jpg",   sizeId: "type-3", flavorId: "vanilla-lemon", categoryName: "케이크" },
    { name: "생신케이크",     price: 35000, desc: "1호 · 바닐라 쌀시트 + 우유크림",                img: "img/생신케이크.jpg",       sizeId: "type-1", flavorId: "vanilla-milk", categoryName: "케이크" },
    { name: "로또케이크",     price: 56000, desc: "2호 · 바닐라 쌀시트 + 레몬커스터드",            img: "img/로또케이크.jpg",       sizeId: "type-2", flavorId: "vanilla-lemon", categoryName: "케이크" },
  ],
  signature: [
    { name: "골드바 케이크",  price: 70000, desc: "3호 · 바닐라 쌀시트 + 레몬커스터드",            img: "img/골드바 케이크.jpeg",   sizeId: "type-3", flavorId: "vanilla-lemon", categoryName: "케이크" },
    { name: "대형사각케이크", price: 65000, desc: "3호 · 바닐라 쌀시트 + 블루베리잼",              img: "img/대형사각케이크.jpeg",  sizeId: "type-3", flavorId: "vanilla-blueberry", categoryName: "케이크" },
    { name: "티아라케이크",   price: 50000, desc: "1호 · 초코 쌀시트 + 오레오쿠키 + 오레오크림",   img: "img/티아라케이크.jpeg",    sizeId: "type-1", flavorId: "choco-oreo", categoryName: "케이크" },
    { name: "수국케이크",     price: 40000, desc: "1호 · 바닐라 쌀시트 + 레몬커스터드",            img: "img/수국케이크.jpeg",      sizeId: "type-1", flavorId: "vanilla-lemon", categoryName: "케이크" },
    { name: "꽃잎케이크",     price: 40000, desc: "1호 · 바닐라 쌀시트 + 우유크림",                img: "img/꽃잎케이크.jpg",       sizeId: "type-1", flavorId: "vanilla-milk", categoryName: "케이크" },
  ],
  dosirak: [
    { name: "삼성라이온즈",   price: 17000, desc: "도시락 · 바닐라 쌀시트 + 레몬커스터드",         img: "img/삼성라이온즈.jpg",     sizeId: "type-dosirak", flavorId: "vanilla-lemon", categoryName: "케이크" },
    { name: "기본 레터링",    price: 20000, desc: "도시락 · 초코 쌀시트 + 초코크림",               img: "img/기본 레터링.jpg",      sizeId: "type-dosirak", flavorId: "choco-choco", categoryName: "케이크" },
    { name: "핑크 레터링",    price: 17000, desc: "도시락 · 바닐라 쌀시트 + 우유크림",             img: "img/핑크 레터링.jpg",      sizeId: "type-dosirak", flavorId: "vanilla-milk", categoryName: "케이크" },
  ],
  "size-1": [
    { name: "꽃잎케이크",     price: 40000, desc: "1호 · 바닐라 쌀시트 + 우유크림",                img: "img/꽃잎케이크.jpg",       sizeId: "type-1", flavorId: "vanilla-milk", categoryName: "케이크" },
    { name: "장미케이크",     price: 43000, desc: "1호 · 바닐라 쌀시트 + 블루베리잼",              img: "img/장미케이크.jpeg",      sizeId: "type-1", flavorId: "vanilla-blueberry", categoryName: "케이크" },
    { name: "수국케이크",     price: 40000, desc: "1호 · 바닐라 쌀시트 + 레몬커스터드",            img: "img/수국케이크.jpeg",      sizeId: "type-1", flavorId: "vanilla-lemon", categoryName: "케이크" },
    { name: "티아라케이크",   price: 50000, desc: "1호 · 초코 쌀시트 + 오레오쿠키 + 오레오크림",   img: "img/티아라케이크.jpeg",    sizeId: "type-1", flavorId: "choco-oreo", categoryName: "케이크" },
    { name: "생신케이크",     price: 35000, desc: "1호 · 바닐라 쌀시트 + 우유크림",                img: "img/생신케이크.jpg",       sizeId: "type-1", flavorId: "vanilla-milk", categoryName: "케이크" },
  ],
  "size-2": [
    { name: "퇴직케이크",     price: 53000, desc: "2호 · 바닐라 쌀시트 + 레몬커스터드",            img: "img/퇴직케이크.jpg",       sizeId: "type-2", flavorId: "vanilla-lemon", categoryName: "케이크" },
    { name: "로또케이크",     price: 56000, desc: "2호 · 바닐라 쌀시트 + 레몬커스터드",            img: "img/로또케이크.jpg",       sizeId: "type-2", flavorId: "vanilla-lemon", categoryName: "케이크" },
  ],
  "size-3": [
    { name: "카네이션케이크", price: 66000, desc: "3호 · 바닐라 쌀시트 + 레몬커스터드",            img: "img/카네이션케이크.jpg",   sizeId: "type-3", flavorId: "vanilla-lemon", categoryName: "케이크" },
    { name: "대형사각케이크", price: 65000, desc: "3호 · 바닐라 쌀시트 + 블루베리잼",              img: "img/대형사각케이크.jpeg",  sizeId: "type-3", flavorId: "vanilla-blueberry", categoryName: "케이크" },
    { name: "골드바 케이크",  price: 70000, desc: "3호 · 바닐라 쌀시트 + 레몬커스터드",            img: "img/골드바 케이크.jpeg",   sizeId: "type-3", flavorId: "vanilla-lemon", categoryName: "케이크" },
  ],
  double: [],
};

Object.assign(window, { HAIR_CATEGORIES, HAIR_STYLES });
