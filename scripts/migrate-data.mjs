/**
 * 데이터 마이그레이션 — data.jsx → Firestore.
 *
 * 실행:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\sa.json"
 *   cd scripts
 *   node migrate-data.mjs --site dohwawon --dry-run   # 검증만
 *   node migrate-data.mjs --site dohwawon              # 실제 쓰기
 *   node migrate-data.mjs --all                        # 5개 사이트 일괄
 *
 * 멱등성: 같은 productId/categoryId 가 이미 있으면 update.
 * 모든 신규 doc 은 status="live" 로 들어가서 다음 발행 (M5) 시 사이트에 즉시 반영.
 */
import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import {
  getFirestore,
  FieldValue,
} from "firebase-admin/firestore";

import { SITES, getSuperUid } from "./sites-config.mjs";
import { parseTypeA } from "./parsers/parseTypeA.mjs";
import { parseTypeB } from "./parsers/parseTypeB.mjs";
import { parseTypeC } from "./parsers/parseTypeC.mjs";

// ── CLI 파싱 ──────────────────────────────────────────
const args = process.argv.slice(2);
const opts = {
  site: null,
  all: false,
  dryRun: false,
};
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

// ── 사전 점검 ──────────────────────────────────────────
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("✗ GOOGLE_APPLICATION_CREDENTIALS 환경변수가 비어 있습니다.");
  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({ credential: applicationDefault() });
}
const db = getFirestore();
const SUPER_UID = getSuperUid();

const sitesToProcess = opts.all
  ? Object.values(SITES)
  : SITES[opts.site]
  ? [SITES[opts.site]]
  : null;

if (!sitesToProcess) {
  console.error(`✗ 알 수 없는 siteId: ${opts.site}`);
  console.error(`  허용된 값: ${Object.keys(SITES).join(", ")}`);
  process.exit(1);
}

// ── 사이트별 처리 ──────────────────────────────────────
for (const site of sitesToProcess) {
  console.log(`\n=== ${site.siteId} (${site.siteType}) ===`);

  let parsed;
  if (site.siteType === "typeA") parsed = parseTypeA(site.siteId);
  else if (site.siteType === "typeB") parsed = parseTypeB(site.siteId);
  else if (site.siteType === "typeC") parsed = parseTypeC(site.siteId);
  else {
    console.error(`! 알 수 없는 siteType: ${site.siteType}`);
    continue;
  }

  console.log(
    `  파싱: ${parsed.categories.length}개 카테고리, ${parsed.products.length}개 상품` +
      (parsed.sections ? `, ${parsed.sections.length}개 섹션` : "") +
      (parsed.tech ? `, ${parsed.tech.length}개 tech` : "")
  );

  if (opts.dryRun) {
    console.log("  [dry-run] Firestore 쓰기 생략");
    // 샘플 출력
    if (parsed.categories[0]) console.log("    cat sample:", parsed.categories[0]);
    if (parsed.products[0]) {
      const { _sourceImg, ...sample } = parsed.products[0];
      console.log("    product sample:", sample);
      console.log("    sourceImg:", _sourceImg);
    }
    continue;
  }

  // 1) sites/{siteId} doc upsert
  console.log("  → sites/" + site.siteId);
  await db.doc(`sites/${site.siteId}`).set(
    {
      siteId: site.siteId,
      name: site.name,
      domain: site.domain ?? "",
      siteType: site.siteType,
      ownerUid: SUPER_UID,
      github: site.github,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      lastPublishedAt: null,
      lastPublishCommit: null,
    },
    { merge: true }
  );

  // 2) categories
  for (const cat of parsed.categories) {
    await db
      .doc(`sites/${site.siteId}/categories/${cat.categoryId}`)
      .set(
        {
          ...cat,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
          updatedBy: "migration-script",
        },
        { merge: true }
      );
  }
  console.log(`  ✓ categories ${parsed.categories.length} written`);

  // 3) sections (typeB)
  if (parsed.sections) {
    for (const sec of parsed.sections) {
      await db
        .doc(`sites/${site.siteId}/sections/${sec.sectionId}`)
        .set(
          {
            ...sec,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
            updatedBy: "migration-script",
          },
          { merge: true }
        );
    }
    console.log(`  ✓ sections ${parsed.sections.length} written`);
  }

  // 4) tech (typeC)
  if (parsed.tech) {
    for (const t of parsed.tech) {
      await db
        .doc(`sites/${site.siteId}/tech/${t.techId}`)
        .set(
          {
            ...t,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
            updatedBy: "migration-script",
          },
          { merge: true }
        );
    }
    console.log(`  ✓ tech ${parsed.tech.length} written`);
  }

  // 5) products
  let prodCount = 0;
  for (const p of parsed.products) {
    // _sourceImg* 같은 메타는 Firestore 에 저장하지 않음
    const { _sourceImg, _sourceImgLg, _sourceImgLgFilename, ...productDoc } = p;
    await db
      .doc(`sites/${site.siteId}/products/${p.productId}`)
      .set(
        {
          ...productDoc,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
          updatedBy: "migration-script",
        },
        { merge: true }
      );
    prodCount++;
  }
  console.log(`  ✓ products ${prodCount} written`);

  // 6) auditLog 한 줄 — 마이그레이션 추적
  await db.collection("auditLogs").add({
    siteId: site.siteId,
    uid: "migration-script",
    email: "",
    action: "create",
    collection: "migrate",
    docPath: `sites/${site.siteId}/*`,
    after: {
      categories: parsed.categories.length,
      products: parsed.products.length,
      sections: parsed.sections?.length ?? 0,
      tech: parsed.tech?.length ?? 0,
    },
    at: FieldValue.serverTimestamp(),
  });

  console.log(`✓ ${site.siteId} 마이그레이션 완료`);
}

console.log("\n=== 전체 완료 ===");
console.log("다음 단계: node migrate-images.mjs --site <siteId> (이미지 업로드)");
