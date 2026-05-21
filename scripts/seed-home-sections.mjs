/**
 * 5개 사이트에 기본 홈 섹션 5종(hero/greeting/featured/info/notice) 시드.
 * 어드민의 "홈 섹션 편집" 페이지에서 곧바로 편집 가능하도록 placeholder 텍스트를 넣는다.
 *
 * 실행:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\sa.json"
 *   cd scripts
 *   node seed-home-sections.mjs              # 5개 사이트 모두
 *   node seed-home-sections.mjs --site dohwawon
 *
 * 멱등성: 같은 sectionId 가 이미 있으면 merge — 사용자가 편집한 내용을 덮어쓰지 않음.
 *         (이미 enabled/data 가 채워져 있으면 그대로 유지)
 */
import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { SITES } from "./sites-config.mjs";

const args = process.argv.slice(2);
let onlySite = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--site") onlySite = args[++i];
}

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("✗ GOOGLE_APPLICATION_CREDENTIALS 환경변수가 비어 있습니다.");
  process.exit(1);
}

if (getApps().length === 0) initializeApp({ credential: applicationDefault() });
const db = getFirestore();

// 사이트별 placeholder 콘텐츠
const TEMPLATES = {
  dohwawon: {
    siteName: "도화원플라워",
    hero: {
      headline: "오늘의 봄, 한 다발",
      subhead: "도화원플라워 — 도화동 골목 끝 작은 꽃집에서, 오늘 가장 좋은 꽃을 골라 드려요.",
      ctaPrimary: "오늘의 꽃 보기",
      ctaSecondary: "주문 문의",
    },
    greeting: {
      title: "도화원플라워에 오신 것을 환영합니다",
      body: "8년째 도화동에서 꽃집을 운영하며, 그날의 가장 좋은 꽃만을 정성껏 골라 다발로 묶어 드리고 있어요. 모든 꽃은 주문 받으신 그날 아침에 새벽 꽃시장에서 직접 사 온 것들입니다.",
    },
    featured: { title: "이번 주, 도화원 추천", pickedIds: [] },
    info: { address: "서울 마포구 도화동", hours: "평일 10:00 ~ 19:00 · 일요일 휴무", phone: "", instagram: "" },
    notice: { body: "" },
  },
  bell_cake: {
    siteName: "벨케이크",
    hero: {
      headline: "달콤한 하루, 벨케이크",
      subhead: "기념일·생일·소중한 날을 위한 수제 케이크.",
      ctaPrimary: "메뉴 보기",
      ctaSecondary: "주문 문의",
    },
    greeting: {
      title: "벨케이크 — 손으로 만드는 디저트",
      body: "주문 받으신 날 아침, 신선한 재료로 손수 굽고 데코하여 픽업·배달해 드립니다.",
    },
    featured: { title: "이번 달 시그니처", pickedIds: [] },
    info: { address: "", hours: "주문 제작 — 픽업 시간 별도 협의", phone: "", instagram: "" },
    notice: { body: "" },
  },
  PARKHAD: {
    siteName: "PARKHAD",
    hero: {
      headline: "당신의 다음 헤어를, 함께 그려요",
      subhead: "PARKHAD — 커트·펌·염색·케어를 한자리에.",
      ctaPrimary: "스타일 둘러보기",
      ctaSecondary: "예약 문의",
    },
    greeting: {
      title: "스타일은 디테일에서 완성됩니다",
      body: "두피 진단부터 시술 후 홈케어 가이드까지, 한 사람의 라이프 스타일을 함께 디자인합니다.",
    },
    featured: { title: "이번 시즌 트렌드", pickedIds: [] },
    info: { address: "", hours: "10:00 ~ 21:00 · 예약제", phone: "", instagram: "" },
    notice: { body: "" },
  },
  flower_example: {
    siteName: "flower_example",
    hero: {
      headline: "마음을 전하는 꽃, flower_example",
      subhead: "개업·기념일·축하·애도 — 모든 순간에 어울리는 화훼.",
      ctaPrimary: "상품 보기",
      ctaSecondary: "주문 문의",
    },
    greeting: {
      title: "flower_example 에 오신 것을 환영합니다",
      body: "용도·예산·받으시는 분의 분위기에 맞춰 최적의 꽃을 추천드립니다.",
    },
    featured: { title: "베스트 선택", pickedIds: [] },
    info: { address: "", hours: "", phone: "", instagram: "" },
    notice: { body: "" },
  },
  greenlight_art: {
    siteName: "풀빛그림아이 미술학원",
    hero: {
      headline: "그림이 자라는 시간",
      subhead: "풀빛그림아이 — 유아·초등·입시·취미·아이패드 드로잉까지.",
      ctaPrimary: "교육과정 보기",
      ctaSecondary: "상담 문의",
    },
    greeting: {
      title: "그리는 시간은 결국 자신을 발견하는 시간입니다",
      body: "아이의 성장 단계에 맞춰 표현력과 관찰력을 함께 키워 갑니다. 입시·실기 대비반도 운영합니다.",
    },
    featured: { title: "이번 학기 인기 강좌", pickedIds: [] },
    info: { address: "", hours: "월·수·금 14:00 ~ 21:00 / 화·목·토 10:00 ~ 18:00", phone: "", instagram: "" },
    notice: { body: "" },
  },
};

const SECTION_PRESETS = [
  { id: "hero", type: "hero", icon: "image", title: "히어로", enabled: true, sortOrder: 10 },
  { id: "greeting", type: "greeting", icon: "user", title: "인사말", enabled: true, sortOrder: 20 },
  { id: "featured", type: "featured", icon: "star", title: "이번 주 추천", enabled: true, sortOrder: 30 },
  { id: "info", type: "info", icon: "info", title: "매장 정보", enabled: true, sortOrder: 40 },
  { id: "notice", type: "notice", icon: "bell", title: "공지", enabled: false, sortOrder: 50 },
];

const sitesToProcess = onlySite
  ? [SITES[onlySite]].filter(Boolean)
  : Object.values(SITES);

if (sitesToProcess.length === 0) {
  console.error(`✗ 알 수 없는 siteId: ${onlySite}`);
  process.exit(1);
}

for (const site of sitesToProcess) {
  const tmpl = TEMPLATES[site.siteId];
  if (!tmpl) {
    console.warn(`! ${site.siteId}: 템플릿이 없어 건너뜀`);
    continue;
  }
  console.log(`\n=== ${site.siteId} (${tmpl.siteName}) ===`);

  for (const preset of SECTION_PRESETS) {
    const ref = db.doc(`sites/${site.siteId}/homeSections/${preset.id}`);
    const snap = await ref.get();
    if (snap.exists) {
      console.log(`  · ${preset.id} — 이미 존재 (스킵 — 기존 콘텐츠 보존)`);
      continue;
    }
    const doc = {
      sectionId: preset.id,
      type: preset.type,
      icon: preset.icon,
      title: preset.title,
      enabled: preset.enabled,
      sortOrder: preset.sortOrder,
      data: tmpl[preset.id] || {},
      dirty: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: "seed-script",
    };
    await ref.set(doc);
    console.log(`  + ${preset.id} 시드 완료`);
  }
}

console.log("\n=== 완료 ===");
console.log("어드민 '홈 섹션 편집' 페이지에서 즉시 확인·편집 가능.");
