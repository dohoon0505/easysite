/**
 * 일회성 — 최근 발행 이력을 확인.
 */
import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const args = process.argv.slice(2);
const site = args[0] ?? "dohwawon";

if (getApps().length === 0) {
  initializeApp({ credential: applicationDefault() });
}
const db = getFirestore();

const snap = await db
  .collection(`sites/${site}/publishes`)
  .orderBy("publishedAt", "desc")
  .limit(5)
  .get();

console.log(`sites/${site}/publishes 최근 ${snap.size}건:`);
for (const d of snap.docs) {
  const p = d.data();
  console.log(`\n  publishId: ${p.publishId}`);
  console.log(`  commitSha: ${p.commitSha}`);
  console.log(`  publishedAt: ${p.publishedAt?.toDate?.().toISOString() ?? "n/a"}`);
  console.log(`  publishedBy: ${p.publishedBy} (${p.publishedEmail ?? ""})`);
  console.log(`  counts: ${JSON.stringify(p.counts)}`);
  console.log(`  filesChanged: ${p.filesChanged?.length ?? 0}개`);
  console.log(`  noop: ${p.noop}`);
  if (p.note) console.log(`  note: ${p.note}`);
}

const siteDoc = await db.doc(`sites/${site}`).get();
const s = siteDoc.data();
console.log(`\nsites/${site}.lastPublishCommit: ${s?.lastPublishCommit ?? "(없음)"}`);
console.log(`sites/${site}.lastPublishedAt: ${s?.lastPublishedAt?.toDate?.().toISOString() ?? "(없음)"}`);
