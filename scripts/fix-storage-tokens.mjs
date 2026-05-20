/**
 * 일회성 수정 스크립트 — 마이그레이션으로 업로드된 Storage 객체에
 * download token 메타데이터를 추가하고 product.image.originalUrl 을 갱신.
 *
 * 원인: Admin SDK 의 bucket.file().save() 는 firebaseStorageDownloadTokens
 * 메타데이터를 자동 생성하지 않음. 그러면 브라우저 <img> 태그가 인증 없이
 * 객체를 읽을 수 없음 (Storage Rules 가 사이트 멤버만 허용하므로).
 *
 * 해결: 각 파일에 uuid 토큰을 metadata.metadata.firebaseStorageDownloadTokens
 * 로 설정 → URL 에 &token=<uuid> 가 붙어 인증 없이도 읽힘.
 *
 * 실행:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\sa.json"
 *   cd scripts
 *   node fix-storage-tokens.mjs --site dohwawon       # 단일 사이트
 *   node fix-storage-tokens.mjs --all                  # 전체 사이트
 */
import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { randomUUID } from "node:crypto";

import { SITES } from "./sites-config.mjs";

const args = process.argv.slice(2);
const opts = { site: null, all: false };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--site") opts.site = args[++i];
  else if (a === "--all") opts.all = true;
}
if (!opts.all && !opts.site) {
  console.error("✗ --site <id> 또는 --all 필요");
  process.exit(1);
}
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("✗ GOOGLE_APPLICATION_CREDENTIALS 미설정");
  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({
    credential: applicationDefault(),
    storageBucket: "easysite-5a560.firebasestorage.app",
  });
}
const db = getFirestore();
const bucket = getStorage().bucket();

const sites = opts.all ? Object.values(SITES) : [SITES[opts.site]].filter(Boolean);

for (const site of sites) {
  console.log(`\n=== ${site.siteId} ===`);
  const snap = await db.collection(`sites/${site.siteId}/products`).get();
  let fixed = 0;
  let skipped = 0;
  let failed = 0;
  for (const d of snap.docs) {
    const p = d.data();
    const storagePath = p.image?.storagePath;
    if (!storagePath) {
      skipped++;
      continue;
    }
    try {
      const file = bucket.file(storagePath);
      const [exists] = await file.exists();
      if (!exists) {
        console.log(`  ! ${p.productId}: storage 객체 없음 (${storagePath})`);
        failed++;
        continue;
      }
      const [meta] = await file.getMetadata();
      const existingToken = meta.metadata?.firebaseStorageDownloadTokens;
      const token = existingToken && existingToken.length > 0 ? existingToken : randomUUID();
      if (!existingToken) {
        await file.setMetadata({
          metadata: { firebaseStorageDownloadTokens: token },
        });
      }
      const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(storagePath)}?alt=media&token=${token}`;
      await d.ref.update({
        "image.originalUrl": downloadUrl,
        updatedAt: FieldValue.serverTimestamp(),
      });
      fixed++;
      if (fixed % 10 === 0) console.log(`  ... ${fixed} fixed so far`);
    } catch (e) {
      console.error(`  ✗ ${p.productId}: ${e.message}`);
      failed++;
    }
  }
  console.log(`✓ ${site.siteId}: 토큰 ${fixed} · 스킵 ${skipped} · 실패 ${failed}`);
}
console.log("\n=== 완료 ===");
console.log("어드민 새로고침 후 이미지가 표시되어야 함.");
