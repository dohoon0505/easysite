/**
 * 이미지 마이그레이션 — {siteId}/img/* → Firebase Storage.
 *
 * 실행:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\sa.json"
 *   cd scripts
 *   node migrate-images.mjs --site dohwawon          # 한 사이트
 *   node migrate-images.mjs --all                    # 5개 사이트 일괄
 *
 * 흐름:
 *  1) 사이트 data.jsx 재파싱 → product → sourceImg 매핑
 *  2) 각 sourceImg 파일을 Storage 의 sites/{siteId}/products/{productId}/{filename}
 *     로 업로드
 *  3) product.image.originalUrl 을 다운로드 URL 로 갱신
 *
 * 멱등성: 동일 경로에 이미 객체가 있으면 metadata 비교 후 skip.
 */
import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash, randomUUID } from "node:crypto";
import mime from "mime-types";

import { SITES } from "./sites-config.mjs";
import { parseTypeA } from "./parsers/parseTypeA.mjs";
import { parseTypeB } from "./parsers/parseTypeB.mjs";
import { parseTypeC } from "./parsers/parseTypeC.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

// ── CLI ──────────────────────────────────────────────
const args = process.argv.slice(2);
const opts = { site: null, all: false, dryRun: false };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--site") opts.site = args[++i];
  else if (a === "--all") opts.all = true;
  else if (a === "--dry-run") opts.dryRun = true;
}
if (!opts.all && !opts.site) {
  console.error("✗ --site <siteId> 또는 --all 옵션이 필요합니다.");
  process.exit(1);
}

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("✗ GOOGLE_APPLICATION_CREDENTIALS 환경변수가 비어 있습니다.");
  process.exit(1);
}

// ── Admin SDK 초기화 ─────────────────────────────────
if (getApps().length === 0) {
  initializeApp({
    credential: applicationDefault(),
    storageBucket: "easysite-5a560.firebasestorage.app",
  });
}
const db = getFirestore();
const bucket = getStorage().bucket();

const sitesToProcess = opts.all
  ? Object.values(SITES)
  : SITES[opts.site]
  ? [SITES[opts.site]]
  : null;
if (!sitesToProcess) {
  console.error(`✗ 알 수 없는 siteId: ${opts.site}`);
  process.exit(1);
}

// ── 헬퍼 ──────────────────────────────────────────────
function md5(buffer) {
  return createHash("md5").update(buffer).digest("hex");
}

async function uploadIfNew(localPath, remotePath, contentType) {
  if (!existsSync(localPath)) {
    return { skipped: true, reason: "local file not found" };
  }
  const data = readFileSync(localPath);
  const localMd5 = md5(data);
  const file = bucket.file(remotePath);
  const [exists] = await file.exists();
  if (exists) {
    const [meta] = await file.getMetadata();
    const sameMd5 =
      meta.md5Hash &&
      Buffer.from(meta.md5Hash, "base64").toString("hex") === localMd5;
    const existingToken = meta.metadata?.firebaseStorageDownloadTokens;
    if (sameMd5 && existingToken) {
      return { skipped: true, reason: "same md5, already uploaded" };
    }
    // 동일 md5 이지만 토큰이 없는 경우 토큰만 부여
    if (sameMd5 && !existingToken) {
      const token = randomUUID();
      await file.setMetadata({
        metadata: { firebaseStorageDownloadTokens: token },
      });
      const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(remotePath)}?alt=media&token=${token}`;
      return { uploaded: true, downloadUrl, size: data.length, tokenOnly: true };
    }
  }
  if (opts.dryRun) {
    return { skipped: true, reason: "dry-run" };
  }
  const token = randomUUID();
  await file.save(data, {
    metadata: {
      contentType,
      metadata: {
        // Firebase Storage 다운로드 토큰 — 브라우저가 인증 헤더 없이도 객체에 접근 가능
        firebaseStorageDownloadTokens: token,
      },
    },
    resumable: false,
  });
  const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(remotePath)}?alt=media&token=${token}`;
  return { uploaded: true, downloadUrl, size: data.length };
}

// ── 사이트별 처리 ──────────────────────────────────────
for (const site of sitesToProcess) {
  console.log(`\n=== ${site.siteId} (${site.siteType}) ===`);

  let parsed;
  if (site.siteType === "typeA") parsed = parseTypeA(site.siteId);
  else if (site.siteType === "typeB") parsed = parseTypeB(site.siteId);
  else if (site.siteType === "typeC") parsed = parseTypeC(site.siteId);
  else continue;

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const product of parsed.products) {
    const sourceImg = product._sourceImg;
    if (!sourceImg) continue;

    const localPath = path.join(REPO_ROOT, site.siteId, sourceImg);
    const filename = path.basename(sourceImg);
    const remotePath = `sites/${site.siteId}/products/${product.productId}/${filename}`;
    const contentType = mime.lookup(filename) || "application/octet-stream";

    try {
      const result = await uploadIfNew(localPath, remotePath, contentType);
      if (result.skipped) {
        console.log(`  - ${product.productId} (${filename}): skipped — ${result.reason}`);
        skipped++;
      } else {
        console.log(`  ✓ ${product.productId} (${filename}): ${(result.size / 1024).toFixed(1)}KB`);
        uploaded++;
      }

      // product.image.originalUrl 갱신 (skipped 도 토큰 검증 위해 매번 재설정)
      if (!opts.dryRun && result.downloadUrl) {
        await db.doc(`sites/${site.siteId}/products/${product.productId}`).update({
          "image.originalUrl": result.downloadUrl,
          "image.storagePath": remotePath,
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    } catch (e) {
      console.error(`  ✗ ${product.productId} (${filename}): ${e.message}`);
      failed++;
    }
  }

  console.log(`✓ ${site.siteId}: 업로드 ${uploaded} · 스킵 ${skipped} · 실패 ${failed}`);
}

console.log("\n=== 이미지 마이그레이션 완료 ===");
console.log("어드민에서 /products 또는 /media 페이지에서 이미지가 표시되는지 확인하세요.");
console.log("리사이즈 변형 (200/400/800) 은 Resize Images Firebase Extension 설치 후 자동 생성됩니다.");

// 변수 사용 표시 (lint 회피)
void statSync;
