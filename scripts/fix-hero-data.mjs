/**
 * 일회성 — `{region}` `{storeName}` 등 JSX 변수 표현식이 잘못 저장된
 * homeSections/hero.data 를 사이트별 실제 값으로 복구.
 *
 * 원인: Phase 2 로 app.jsx 를 HOME_SECTIONS 기반으로 리팩토링한 뒤
 *      import-site-content.mjs 가 새 app.jsx 의 `{varname}` 패턴을
 *      그대로 텍스트로 캡처해 Firestore 에 저장.
 *
 * 실행:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\sa.json"
 *   node scripts/fix-hero-data.mjs
 */
import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("✗ GOOGLE_APPLICATION_CREDENTIALS 환경변수가 비어 있습니다.");
  process.exit(1);
}
if (getApps().length === 0) initializeApp({ credential: applicationDefault() });
const db = getFirestore();

// 사이트별 hero 데이터 (Phase 2 이전 원본 app.jsx 로부터 추출한 값)
const HERO_DATA = {
  dohwawon: {
    region: "대구광역시 | 달서구",
    storeName: "도화원플라워",
    storeDesc: "평범한 일상도 꽃 한 송이가 더해지면 특별한 순간이 됩니다.\n\n계절을 듬뿍 머금은 다채로운 꽃들로, 당신의 오늘을 가장 아름답게 피워내겠습니다.",
    mapAddress: "대구 달서구 당산로 99",
    address: "대구 달서구 당산로 99 1층 도화원플라워",
    hours: "11:00 ~ 19:00 · 매주 일요일 휴무",
    bannerText: "예약요청 탭을 통해 간편히 예약을 요청해보세요!",
  },
  bell_cake: {
    region: "대구광역시 | 수성구",
    storeName: "벨케이크",
    storeDesc: "No 밀가루, No 식물성크림. 100% 국내산 쌀가루로 만든 쌀케이크, 동물성 생크림케이크 전문점 벨케이크입니다:)\n\n1인운영매장이라, 전화를 못받을 수 있으니 부재시 카카오톡채널로 연락주세요^^",
    mapAddress: "대구 수성구 범어로20길 68",
    address: "대구 수성구 범어로20길 68 1층 왼쪽상가",
    hours: "11:00 ~ 19:00 · 매주 일요일 휴무",
    bannerText: "예약요청 탭을 통해 간편히 예약을 요청해보세요!",
  },
  PARKHAD: {
    region: "대구광역시 | 달서구",
    storeName: "PARKHAD",
    storeDesc: "남자들에게 미용실은 '가기 귀찮은 곳'인 경우가 많죠. 고객님 한 분 한 분께 편안한 환경과 유쾌한 경험을 제공하여, '다음 만남이 기다려지는 곳'이 될 수 있도록 하겠습니다.",
    mapAddress: "대구 달서구 와룡로 132 박하디",
    address: "대구 달서구 와룡로 132 2층 PARKHAD 박하디",
    hours: "10:00 ~ 20:00 · 매주 목요일 휴무",
    bannerText: "전화 또는 네이버 예약으로 간편예약이 가능해요!",
  },
  greenlight_art: {
    region: "대구광역시 | 달서구",
    storeName: "풀빛그림아이미술학원",
    storeDesc: "아이들에게 미술학원은 '지루하게 그림만 그리는 곳'이 아니어야 합니다. 가장 발달이 활발한 시기에 맞춰 인지발달과 미적 감각을 일깨우고, 아이에게 '매일 가고 싶은 놀이터'가 될 수 있도록 하겠습니다.",
    mapAddress: "대구 달서구 조암남로16길 19 풀빛그림아이",
    address: "대구 달서구 조암남로16길 19 하늘채 상가 2층",
    hours: "월~토 13:00 - 19:00 · 일 휴무",
    bannerText: "1회 무료 체험 수업이 가능합니다!!",
  },
  flower_example: {
    region: "",
    storeName: "flower_example",
    storeDesc: "아름다운 마음을 대한민국 전국 어디든지 보내드립니다\n10년 경력의 노하우를 그대로",
    mapAddress: "",
    address: "",
    hours: "",
    bannerText: "",
  },
};

// `{varname}` 같은 JSX 변수 표현식 검사 (오염된 값 판별용)
function looksPolluted(s) {
  return typeof s === "string" && /^\{[A-Za-z_]\w*\}$/.test(s.trim());
}

for (const [siteId, hero] of Object.entries(HERO_DATA)) {
  const ref = db.doc(`sites/${siteId}/homeSections/hero`);
  const snap = await ref.get();
  if (!snap.exists) {
    console.warn(`! ${siteId}: hero doc 없음 — 건너뜀`);
    continue;
  }
  const existing = snap.data();
  const data = existing.data || {};

  // 어떤 필드가 오염됐는지 식별
  const polluted = Object.entries(data).filter(([k, v]) => looksPolluted(v)).map(([k]) => k);

  // 사용자가 수정한 정상 값(예: 매장 소개를 직접 다듬은 경우)은 보존,
  // `{...}` 변수 표현식이 들어가 있는 필드만 hardcoded 값으로 교체.
  const cleaned = { ...data };
  let changed = 0;
  for (const [k, v] of Object.entries(hero)) {
    if (!v) continue;
    if (looksPolluted(cleaned[k]) || cleaned[k] == null) {
      cleaned[k] = v;
      changed++;
    }
  }

  if (changed === 0) {
    console.log(`  ✓ ${siteId}: 오염 없음 — 건너뜀`);
    continue;
  }

  await ref.update({
    data: cleaned,
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: "fix-hero-data-script",
  });
  console.log(`  ✓ ${siteId}: ${changed}개 필드 복구 (오염: ${polluted.join(", ") || "-"})`);
}

console.log("\n=== 완료 ===");
