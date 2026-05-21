/**
 * 일회성 — 라이브 사이트의 큐레이션 슬라이더(BUSINESS_STYLES, MZ_STYLES, …) 에
 * 포함된 상품들을 Firestore productId 로 매핑하여 homeSections/slider_N.data.pickedIds 를 채운다.
 *
 * 매핑 방식:
 *   1) {siteId}/designers.jsx 를 vm 실행 → window.{BUSINESS_STYLES,...} 수집
 *   2) sites/{siteId}/products 컬렉션을 조회 → image.repoPath 의 basename → productId 맵
 *   3) 슬라이더 변수의 각 항목 .img 파일명을 매핑에 대조 → productId 배열 구성
 *   4) homeSections/slider_N.data.pickedIds 업데이트
 *
 * 사용자가 이미 직접 골라 채운 슬라이더(pickedIds 가 비어있지 않은 경우)는 보존.
 *
 * 실행:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\sa.json"
 *   node scripts/fix-slider-picks.mjs
 */
import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("✗ GOOGLE_APPLICATION_CREDENTIALS 환경변수가 비어 있습니다.");
  process.exit(1);
}
if (getApps().length === 0) initializeApp({ credential: applicationDefault() });
const db = getFirestore();

// 사이트별 (slider_N) → designers.jsx 의 변수명 매핑.
// designers.jsx 가 없거나 매핑이 없는 사이트(greenlight_art typeC, flower_example typeB)는 건너뜀.
const SLIDER_VARS = {
  dohwawon: {
    slider_1: "BUSINESS_STYLES",
    slider_2: "MZ_STYLES",
    slider_3: "STARTER_STYLES",
    slider_4: "ACRYLIC_STYLES",
  },
  bell_cake: {
    slider_1: "FEATURED_STYLES",
    slider_2: "BUSINESS_STYLES",
    slider_3: "MZ_STYLES",
    slider_4: "STARTER_STYLES",
  },
  PARKHAD: {
    slider_1: "FEATURED_STYLES",
    slider_2: "BUSINESS_STYLES",
    slider_3: "MZ_STYLES",
    slider_4: "STARTER_STYLES",
  },
};

function loadDesigners(siteId) {
  const p = path.join(REPO_ROOT, siteId, "designers.jsx");
  if (!existsSync(p)) return null;
  const src = readFileSync(p, "utf8");
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);
  try {
    vm.runInContext(src, sandbox, { filename: p, timeout: 5000 });
  } catch (e) {
    throw new Error(`designers.jsx 파싱 실패 (${siteId}): ${e.message}`);
  }
  return sandbox.window;
}

async function buildImageToProductId(siteId) {
  const snap = await db.collection(`sites/${siteId}/products`).get();
  const map = {};
  snap.docs.forEach((d) => {
    const fs = d.data();
    const repoPath = fs.image && fs.image.repoPath;
    if (!repoPath) return;
    const base = repoPath.split("/").pop();
    if (base) map[base] = fs.productId;
  });
  return map;
}

for (const [siteId, sliderMap] of Object.entries(SLIDER_VARS)) {
  console.log(`\n=== ${siteId} ===`);
  let designers;
  try {
    designers = loadDesigners(siteId);
  } catch (e) {
    console.error(`  ✗ ${e.message}`);
    continue;
  }
  if (!designers) {
    console.warn(`  ! designers.jsx 없음 — 건너뜀`);
    continue;
  }
  const imageToId = await buildImageToProductId(siteId);
  console.log(`  · 제품 ${Object.keys(imageToId).length}개 이미지 매핑 로드`);

  for (const [sectionId, varName] of Object.entries(sliderMap)) {
    const list = designers[varName];
    if (!Array.isArray(list)) {
      console.warn(`  ! ${sectionId}: ${varName} 변수 없음 — 건너뜀`);
      continue;
    }
    const pickedIds = list
      .map((item) => {
        const base = (item.img || "").split("/").pop();
        return imageToId[base];
      })
      .filter(Boolean);

    if (pickedIds.length === 0) {
      console.warn(`  ! ${sectionId} (${varName}): 매칭된 productId 0개 — 건너뜀`);
      continue;
    }

    const ref = db.doc(`sites/${siteId}/homeSections/${sectionId}`);
    const snap = await ref.get();
    if (!snap.exists) {
      console.warn(`  ! ${sectionId}: 섹션 doc 없음 — 건너뜀`);
      continue;
    }
    const existing = snap.data();
    const existingPicks = (existing.data && existing.data.pickedIds) || [];
    if (existingPicks.length > 0) {
      console.log(`  - ${sectionId}: 이미 ${existingPicks.length}개 선택됨 — 보존`);
      continue;
    }

    await ref.update({
      "data.pickedIds": pickedIds,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: "fix-slider-picks-script",
    });
    console.log(`  ✓ ${sectionId} (${varName}): pickedIds=${pickedIds.length}개 [${pickedIds.join(", ")}]`);
  }
}

console.log("\n=== 완료 ===");
