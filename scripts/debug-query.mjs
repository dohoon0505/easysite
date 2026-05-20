/**
 * 일회성 디버그 — 어드민이 보내는 카테고리별 쿼리를 그대로 실행하여
 * 인덱스 빌드 상태를 검증한다.
 *
 * 실행:
 *   node debug-query.mjs --site dohwawon --category bouquet
 */
import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const args = process.argv.slice(2);
const opts = { site: "dohwawon", category: "bouquet" };
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--site") opts.site = args[++i];
  else if (args[i] === "--category") opts.category = args[++i];
}

if (getApps().length === 0) {
  initializeApp({ credential: applicationDefault() });
}
const db = getFirestore();

console.log(`Query: sites/${opts.site}/products where categoryId == "${opts.category}" orderBy sortOrder`);
try {
  const snap = await db
    .collection(`sites/${opts.site}/products`)
    .where("categoryId", "==", opts.category)
    .orderBy("sortOrder", "asc")
    .get();
  console.log(`✓ 인덱스 정상. 결과 ${snap.size}개:`);
  snap.docs.forEach((d, i) => {
    const data = d.data();
    console.log(`  ${i + 1}. ${data.name} (sortOrder ${data.sortOrder})`);
  });
} catch (e) {
  console.error("✗ 쿼리 실패:", e.message);
  if (e.code === 9 || /index/i.test(e.message)) {
    console.error("→ 인덱스가 아직 빌드 중이거나 누락된 상태입니다.");
    console.error("→ Firebase 콘솔에서 빌드 상태 확인:");
    console.error("  https://console.firebase.google.com/project/easysite-5a560/firestore/indexes");
  }
}
