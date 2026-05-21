/**
 * import-site-content — 완성된 사이트의 콘텐츠를 Firestore 로 동기화.
 *
 * 새 홈 섹션 스키마:
 *   · hero         — 이미지 + 매장 소개 + 지도 + 안내 배너 (단일 doc, 8필드)
 *   · slider_1..N  — 상품 슬라이더 1개씩 (타이틀 + pickedIds)
 *   · faq          — FAQ 영역 (타이틀 + pickedIds)
 *
 * + sites/{siteId}/faqs 컬렉션을 {siteId}/faq-data.jsx 에서 시드.
 *
 * 추출 항목:
 *   · img/hero.jpg                          → Storage(sites/{siteId}/home/hero.jpg)
 *   · img/map.png                           → Storage(sites/{siteId}/home/map.png)
 *   · <div className="intro-meta">          → hero.data.region
 *   · <h2 className="intro-name">           → hero.data.storeName
 *   · <p  className="intro-desc">           → hero.data.storeDesc
 *   · <a  className="intro-map-cta" href=…> → hero.data.mapAddress (naver search query)
 *   · <span className="intro-list-text"> 1  → hero.data.address
 *   · <span className="intro-list-text"> 2  → hero.data.hours
 *   · <p className="info-banner-text">      → hero.data.bannerText
 *   · <FeaturedSlider title="…" …>          → slider_N.data.title
 *   · FAQ_ITEMS in faq-data.jsx             → sites/{siteId}/faqs
 *
 * 실행:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\sa.json"
 *   node scripts/import-site-content.mjs --all
 *   node scripts/import-site-content.mjs --site dohwawon
 *   node scripts/import-site-content.mjs --all --reset    # homeSections 초기화 후 재시드
 */
import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash, randomUUID } from "node:crypto";
import vm from "node:vm";

import { SITES } from "./sites-config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

// ── CLI ──────────────────────────────────────────────
const args = process.argv.slice(2);
const opts = { site: null, all: false, dryRun: false, force: false, reset: false };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--site") opts.site = args[++i];
  else if (a === "--all") opts.all = true;
  else if (a === "--dry-run") opts.dryRun = true;
  else if (a === "--force") opts.force = true;
  else if (a === "--reset") opts.reset = true;
}
if (!opts.all && !opts.site) {
  console.error("✗ --site <siteId> 또는 --all 옵션이 필요합니다.");
  process.exit(1);
}
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("✗ GOOGLE_APPLICATION_CREDENTIALS 환경변수가 비어 있습니다.");
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

const sitesToProcess = opts.all
  ? Object.values(SITES)
  : SITES[opts.site]
  ? [SITES[opts.site]]
  : null;
if (!sitesToProcess) {
  console.error(`✗ 알 수 없는 siteId: ${opts.site}`);
  process.exit(1);
}

// ── 파싱 헬퍼 ─────────────────────────────────────────
function readSiteFile(siteId, fname) {
  const p = path.join(REPO_ROOT, siteId, fname);
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

function decodeJsxText(s) {
  if (s == null) return "";
  const decoded = s
    .replace(/\{"\\n\\n"\}/g, "\n\n")
    .replace(/\{"\\n"\}/g, "\n")
    .replace(/\{"([^"]*)"\}/g, "$1")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<\/?(?:em|strong|b|i|span|small|u|code)[^>]*>/g, "")
    .trim();
  // `{storeName}` 같은 JSX 변수 참조는 데이터가 아니라 코드. 추출 무시.
  // (Phase 2 이후 사이트 app.jsx 가 변수 기반이라 재실행 시 Firestore 가 오염되는 것을 방지)
  if (/^\{[A-Za-z_]\w*\}$/.test(decoded)) return "";
  return decoded;
}

function firstMatch(src, re) {
  if (!src) return null;
  const m = src.match(re);
  return m ? decodeJsxText(m[1]) : null;
}

function leadingTextOnly(s) {
  if (!s) return s;
  const cut = s.search(/<[a-zA-Z]/);
  return cut >= 0 ? s.slice(0, cut) : s;
}

function parseSite(site) {
  const src = readSiteFile(site.siteId, "app.jsx");
  const html = readSiteFile(site.siteId, "index.html");
  if (!src) return null;

  // intro 섹션 블록을 우선 추출
  const introBlock = (src.match(/<section\s+className="intro"[\s\S]*?<\/section>/) || [])[0] || "";

  let region = null, storeName = null, storeDesc = null;
  let address = null, hours = null;
  let mapAddress = null;

  if (introBlock) {
    region = firstMatch(introBlock, /<div\s+className="intro-meta"[^>]*>([\s\S]*?)<\/div>/);
    storeName = firstMatch(introBlock, /<h2\s+className="intro-name"[^>]*>([\s\S]*?)<\/h2>/);
    storeDesc = firstMatch(introBlock, /<p\s+className="intro-desc"[^>]*>([\s\S]*?)<\/p>/);

    // intro-map-cta 의 href 에서 naver map 검색어 추출
    const mapHref = firstMatch(introBlock, /<a\s+className="intro-map-cta"\s+href="([^"]+)"/);
    if (mapHref) {
      const m = mapHref.match(/\/search\/(.+?)(?:\?|$)/);
      if (m) mapAddress = decodeURIComponent(m[1]);
    }

    const listRaw = [];
    const r = /<span\s+className="intro-list-text"[^>]*>([\s\S]*?)<\/span>/g;
    let m;
    while ((m = r.exec(introBlock)) !== null) listRaw.push(m[1]);
    const listTexts = listRaw.map((s) => decodeJsxText(leadingTextOnly(s))).filter(Boolean);
    address = listTexts[0] || null;
    hours = listTexts[1] || null;
  }

  // flower_example 등 intro 가 없는 경우 hero 블록에서 fallback
  if (!storeName) {
    const heroBlock = (src.match(/<section\s+className="hero"[\s\S]*?<\/section>/) || [])[0] || "";
    if (heroBlock) {
      storeName = firstMatch(heroBlock, /<h2[^>]*>([\s\S]*?)<\/h2>/);
      storeDesc = firstMatch(heroBlock, /<p[^>]*>([\s\S]*?)<\/p>/);
    }
  }

  // 안내 배너 — app.jsx 어디에 있든 한 번만 매칭
  const bannerText = firstMatch(src, /<p\s+className="info-banner-text"[^>]*>([\s\S]*?)<\/p>/);

  // <FeaturedSlider title="…" (meta="…")? …>
  // PARKHAD 만 meta 속성을 가짐. greenlight_art 는 sub 속성을 가질 수 있음.
  const sliderRe = /<FeaturedSlider\s+title="([^"]+)"(?:\s+meta="([^"]*)")?(?:\s+sub="([^"]*)")?/g;
  const sliders = [];
  let sm;
  while ((sm = sliderRe.exec(src)) !== null) {
    sliders.push({ title: sm[1], subtitle: sm[2] || sm[3] || "" });
  }

  // og 보조
  const ogDesc = firstMatch(html, /property="og:description"\s+content="([^"]*)"/);

  return {
    region,
    storeName,
    storeDesc: storeDesc || ogDesc,
    mapAddress,
    address,
    hours,
    bannerText,
    sliders,
  };
}

// ── FAQ vm 로드 ────────────────────────────────────────
function loadFaqData(siteId) {
  const p = path.join(REPO_ROOT, siteId, "faq-data.jsx");
  if (!existsSync(p)) return null;
  const src = readFileSync(p, "utf8");
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);
  try {
    vm.runInContext(src, sandbox, { filename: p, timeout: 5000 });
  } catch (e) {
    throw new Error(`faq-data.jsx 파싱 실패 (${siteId}): ${e.message}`);
  }
  return {
    items: Array.isArray(sandbox.window.FAQ_ITEMS) ? sandbox.window.FAQ_ITEMS : [],
    categories: Array.isArray(sandbox.window.FAQ_CATEGORIES) ? sandbox.window.FAQ_CATEGORIES : [],
  };
}

// ── Storage 업로드 ───────────────────────────────────
function md5(buffer) {
  return createHash("md5").update(buffer).digest("hex");
}

async function uploadImage(siteId, localRelPath, remoteName, contentType) {
  const localPath = path.join(REPO_ROOT, siteId, localRelPath);
  if (!existsSync(localPath)) return { skipped: true, reason: `local ${localRelPath} 없음` };
  const data = readFileSync(localPath);
  const remotePath = `sites/${siteId}/home/${remoteName}`;
  const file = bucket.file(remotePath);
  const localMd5 = md5(data);
  const [exists] = await file.exists();
  if (exists) {
    const [meta] = await file.getMetadata();
    const sameMd5 = meta.md5Hash &&
      Buffer.from(meta.md5Hash, "base64").toString("hex") === localMd5;
    const existingToken = meta.metadata?.firebaseStorageDownloadTokens;
    if (sameMd5 && existingToken) {
      const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(remotePath)}?alt=media&token=${existingToken}`;
      return { skipped: true, reason: "same md5", downloadUrl, storagePath: remotePath };
    }
  }
  if (opts.dryRun) return { skipped: true, reason: "dry-run" };
  const token = randomUUID();
  await file.save(data, {
    metadata: {
      contentType,
      metadata: { firebaseStorageDownloadTokens: token },
    },
    resumable: false,
  });
  const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(remotePath)}?alt=media&token=${token}`;
  return { uploaded: true, downloadUrl, storagePath: remotePath, size: data.length };
}

// ── homeSections 리셋 ────────────────────────────────
async function resetHomeSections(siteId) {
  const col = db.collection(`sites/${siteId}/homeSections`);
  const snap = await col.get();
  if (snap.empty) return 0;
  const batch = db.batch();
  snap.docs.forEach((d) => batch.delete(d.ref));
  if (!opts.dryRun) await batch.commit();
  return snap.size;
}

// ── 새 스키마 시드 ───────────────────────────────────
async function seedHero(site, parsed, heroResult, mapResult) {
  const ref = db.doc(`sites/${site.siteId}/homeSections/hero`);
  const existing = await ref.get();
  const data = {
    image: heroResult?.downloadUrl ? `url("${heroResult.downloadUrl}")` : null,
    imageUrl: heroResult?.downloadUrl || null,
    imageStoragePath: heroResult?.storagePath || null,
    region: parsed.region || null,
    storeName: parsed.storeName || site.name,
    storeDesc: parsed.storeDesc || null,
    mapImage: mapResult?.downloadUrl ? `url("${mapResult.downloadUrl}")` : null,
    mapImageUrl: mapResult?.downloadUrl || null,
    mapImageStoragePath: mapResult?.storagePath || null,
    mapAddress: parsed.mapAddress || null,
    address: parsed.address || null,
    hours: parsed.hours || null,
    bannerText: parsed.bannerText || null,
  };
  // null 키 제거
  for (const k of Object.keys(data)) if (data[k] === null) delete data[k];

  const doc = {
    sectionId: "hero",
    type: "hero",
    icon: "image",
    title: "히어로",
    enabled: existing.exists ? existing.data().enabled !== false : true,
    sortOrder: 10,
    data,
    dirty: false,
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: "import-script",
  };
  if (!existing.exists) doc.createdAt = FieldValue.serverTimestamp();
  if (opts.dryRun) {
    console.log(`    [dry-run] hero ← ${Object.keys(data).join(", ")}`);
    return;
  }
  await ref.set(doc, { merge: true });
}

async function seedSliders(site, parsed) {
  const sliders = parsed.sliders || [];
  if (sliders.length === 0) return 0;
  for (let i = 0; i < sliders.length; i++) {
    const s = sliders[i];
    const sectionId = `slider_${i + 1}`;
    const ref = db.doc(`sites/${site.siteId}/homeSections/${sectionId}`);
    const existing = await ref.get();
    const data = {
      title: s.title || `상품 슬라이더 ${i + 1}`,
      subtitle: s.subtitle || null,
      pickedIds: existing.exists && Array.isArray(existing.data().data?.pickedIds)
        ? existing.data().data.pickedIds
        : [],
    };
    if (data.subtitle === null) delete data.subtitle;
    const doc = {
      sectionId,
      type: "slider",
      icon: "star",
      title: `상품 슬라이더 (${i + 1})`,
      enabled: existing.exists ? existing.data().enabled !== false : true,
      sortOrder: 20 + i * 10,
      data,
      dirty: false,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: "import-script",
    };
    if (!existing.exists) doc.createdAt = FieldValue.serverTimestamp();
    if (opts.dryRun) {
      console.log(`    [dry-run] ${sectionId} ← "${data.title}"`);
      continue;
    }
    await ref.set(doc, { merge: true });
  }
  return sliders.length;
}

async function seedFaqSection(site) {
  const sectionId = "faq";
  const ref = db.doc(`sites/${site.siteId}/homeSections/${sectionId}`);
  const existing = await ref.get();

  // 사용자가 이미 골랐다면(=pickedIds 가 비어있지 않다면) 보존,
  // 비어 있으면 라이브 사이트의 기본 노출(상단 6개) 과 동일하게 시드.
  let pickedIds = existing.exists && Array.isArray(existing.data().data?.pickedIds)
    ? existing.data().data.pickedIds
    : [];
  if (pickedIds.length === 0) {
    const faqsSnap = await db.collection(`sites/${site.siteId}/faqs`)
      .orderBy("sortOrder", "asc").limit(6).get();
    pickedIds = faqsSnap.docs
      .map((d) => d.data())
      .filter((f) => f.visible !== false)
      .map((f) => f.faqId);
  }

  const data = {
    title: "주문 전 자주하는 질문",
    pickedIds,
  };
  const doc = {
    sectionId,
    type: "faq",
    icon: "help",
    title: "FAQ",
    enabled: existing.exists ? existing.data().enabled !== false : true,
    sortOrder: 100,
    data,
    dirty: false,
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: "import-script",
  };
  if (!existing.exists) doc.createdAt = FieldValue.serverTimestamp();
  if (opts.dryRun) {
    console.log(`    [dry-run] faq ← "${data.title}"`);
    return;
  }
  await ref.set(doc, { merge: true });
}

async function importFaqsForSite(siteId) {
  const faqData = loadFaqData(siteId);
  if (!faqData || faqData.items.length === 0) {
    return { reason: "faq-data.jsx 없음 또는 비어 있음" };
  }
  const col = db.collection(`sites/${siteId}/faqs`);

  if (!opts.force) {
    const existing = await col.limit(1).get();
    if (!existing.empty) {
      const sampleFirst = existing.docs[0].data();
      if (sampleFirst.updatedBy && sampleFirst.updatedBy !== "import-script") {
        return { skipped: 0, reason: "사용자 수정 흔적 있음 (--force 로 덮어쓰기)" };
      }
    }
  }

  const counters = {};
  let imported = 0;
  let skipped = 0;

  for (const item of faqData.items) {
    const cat = item.cat || "etc";
    counters[cat] = (counters[cat] || 0) + 1;
    const faqId = `faq-${cat}-${counters[cat]}`;
    const ref = col.doc(faqId);
    if (opts.dryRun) {
      console.log(`    [dry-run] ${faqId} ← Q: ${(item.q || "").slice(0, 30)}…`);
      imported++;
      continue;
    }
    const existing = await ref.get();
    if (existing.exists && existing.data().question === item.q && !opts.force) {
      skipped++;
      continue;
    }
    await ref.set({
      faqId,
      categoryId: item.cat || "etc",
      question: item.q || "",
      answer: item.a || "",
      sortOrder: imported * 10,
      visible: true,
      createdAt: existing.exists ? existing.data().createdAt : FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: "import-script",
    }, { merge: true });
    imported++;
  }
  return { imported, skipped };
}

// ── 사이트별 처리 ──────────────────────────────────────
for (const site of sitesToProcess) {
  console.log(`\n=== ${site.siteId} (${site.name}) ===`);
  const parsed = parseSite(site);
  if (!parsed) {
    console.warn(`  ! ${site.siteId}: app.jsx 파싱 실패 — 건너뜀`);
    continue;
  }
  console.log(`  · 추출: name="${(parsed.storeName || "").slice(0, 20)}" sliders=${parsed.sliders.length} address="${(parsed.address || "").slice(0, 25)}"`);

  // 0) --reset: homeSections 초기화
  if (opts.reset) {
    try {
      const deleted = await resetHomeSections(site.siteId);
      console.log(`  ⊘ homeSections 리셋 — ${deleted}개 doc 삭제`);
    } catch (e) {
      console.error(`  ✗ 리셋 실패: ${e.message}`);
    }
  }

  // 1) 이미지 업로드
  let heroResult = null, mapResult = null;
  try {
    heroResult = await uploadImage(site.siteId, "img/hero.jpg", "hero.jpg", "image/jpeg");
    if (heroResult.uploaded) console.log(`  ✓ hero.jpg 업로드 — ${(heroResult.size / 1024).toFixed(1)}KB`);
    else if (heroResult.downloadUrl) console.log(`  - hero.jpg 스킵 — ${heroResult.reason}`);
    else console.log(`  - hero.jpg 스킵 — ${heroResult.reason}`);
  } catch (e) {
    console.error(`  ✗ hero.jpg 업로드 실패: ${e.message}`);
  }
  try {
    mapResult = await uploadImage(site.siteId, "img/map.png", "map.png", "image/png");
    if (mapResult.uploaded) console.log(`  ✓ map.png 업로드 — ${(mapResult.size / 1024).toFixed(1)}KB`);
    else if (mapResult.downloadUrl) console.log(`  - map.png 스킵 — ${mapResult.reason}`);
    else console.log(`  - map.png 스킵 — ${mapResult.reason}`);
  } catch (e) {
    console.error(`  ✗ map.png 업로드 실패: ${e.message}`);
  }

  // 2) FAQ master 를 먼저 임포트 (homeSections faq 가 pickedIds 를 채울 때 참조)
  try {
    const faqResult = await importFaqsForSite(site.siteId);
    if (faqResult.imported) console.log(`  ✓ FAQ ${faqResult.imported}개 동기화 (스킵 ${faqResult.skipped})`);
    else if (faqResult.skipped) console.log(`  - FAQ 스킵 — ${faqResult.skipped}개 이미 존재`);
    else console.log(`  - FAQ 건너뜀 — ${faqResult.reason}`);
  } catch (e) {
    console.error(`  ✗ FAQ 임포트 실패: ${e.message}`);
  }

  // 3) 새 스키마 시드
  try {
    await seedHero(site, parsed, heroResult, mapResult);
    const n = await seedSliders(site, parsed);
    await seedFaqSection(site);
    console.log(`  ✓ homeSections 시드 — hero + slider×${n} + faq`);
  } catch (e) {
    console.error(`  ✗ homeSections 시드 실패: ${e.message}`);
  }

  console.log(`  ✓ ${site.siteId} 임포트 완료`);
}

console.log("\n=== 완료 ===");
console.log("어드민 '홈 섹션 편집' 페이지에서 새 스키마(hero/sliders/faq)가 반영됐는지 확인하세요.");
