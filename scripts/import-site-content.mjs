/**
 * import-site-content — 완성된 사이트의 hero·intro·info 콘텐츠를 Firestore 로 동기화.
 *
 * 어드민에서 "완성된 사이트의 이미지·섹션·정보" 가 보이지 않는 문제를 해결하기 위한
 * 일회성·재실행 가능한 임포터. 사이트 파일을 정규식으로 파싱하여 다음을 추출한다:
 *   · img/hero.jpg                            → Storage(sites/{siteId}/home/hero.jpg) + hero.data.image
 *   · <h2 className="intro-name">…</h2>      → greeting.data.title (& hero.data.headline 보조)
 *   · <p  className="intro-desc">…</p>       → greeting.data.body
 *   · <span className="intro-list-text"> 1   → info.data.address
 *   · <span className="intro-list-text"> 2   → info.data.hours
 *   · <title>…</title>                        → 미사용 (검증용)
 *
 * 5개 사이트 중 4개(typeA·typeC)는 동일한 DOM 패턴을 사용한다.
 * flower_example(typeB)은 hero 가 텍스트 중심 + img/hero.jpg 부재 → 별도 분기.
 *
 * 멱등성:
 *  · 기존 homeSection 의 사용자 수정값(dirty:true 이거나 updatedBy != "import-script")
 *    은 덮어쓰지 않고 신규 필드만 채운다.
 *  · 동일 hero.jpg 가 이미 Storage 에 있고 md5 가 같으면 업로드 스킵.
 *
 * 실행:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\sa.json"
 *   cd scripts
 *   node import-site-content.mjs --all
 *   node import-site-content.mjs --site dohwawon
 *   node import-site-content.mjs --site dohwawon --dry-run
 *   node import-site-content.mjs --site dohwawon --force    # 사용자 수정값도 덮어쓰기
 */
import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash, randomUUID } from "node:crypto";

import { SITES } from "./sites-config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

// ── CLI ──────────────────────────────────────────────
const args = process.argv.slice(2);
const opts = { site: null, all: false, dryRun: false, force: false };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--site") opts.site = args[++i];
  else if (a === "--all") opts.all = true;
  else if (a === "--dry-run") opts.dryRun = true;
  else if (a === "--force") opts.force = true;
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
  // {"\n\n"} → 실제 줄바꿈, JSX 식 {"…"} 그대로 두지 않고 본문으로 풀어준다
  // 인라인 태그(<em>, <strong> 등)는 본문 텍스트만 살린다
  return s
    .replace(/\{"\\n\\n"\}/g, "\n\n")
    .replace(/\{"\\n"\}/g, "\n")
    .replace(/\{"([^"]*)"\}/g, "$1")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<\/?(?:em|strong|b|i|span|small|u|code)[^>]*>/g, "")
    .trim();
}

function firstMatch(src, re) {
  if (!src) return null;
  const m = src.match(re);
  return m ? decodeJsxText(m[1]) : null;
}

function allMatches(src, re) {
  if (!src) return [];
  const out = [];
  let m;
  const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  while ((m = r.exec(src)) !== null) {
    out.push(decodeJsxText(m[1]));
  }
  return out;
}

function leadingTextOnly(s) {
  // <span className="intro-list-text"> 의 내용 중 첫 번째 자식 태그가 나오기 전까지의 텍스트만 반환.
  // (영업시간 옆 isOpenNow() 칩 같은 nested 컴포넌트 흡수 방지)
  if (!s) return s;
  const cut = s.search(/<[a-zA-Z]/);
  return cut >= 0 ? s.slice(0, cut) : s;
}

function parseTypeAOrC(siteId) {
  const src = readSiteFile(siteId, "app.jsx");
  const html = readSiteFile(siteId, "index.html");
  if (!src) return null;

  // 1) <section className="intro">…</section> 블록을 먼저 찾고,
  //    그 안에서만 intro-name / intro-desc / intro-list-text 를 매칭한다.
  //    (ExpandableText 헬퍼의 <p className="intro-desc">{text}</p> 같은 정의는 제외)
  const sectionBlock = (src.match(/<section\s+className="intro"[\s\S]*?<\/section>/) || [])[0] || "";
  if (!sectionBlock) return null;

  const introName = firstMatch(sectionBlock, /<h2\s+className="intro-name"[^>]*>([\s\S]*?)<\/h2>/);
  const introDesc = firstMatch(sectionBlock, /<p\s+className="intro-desc"[^>]*>([\s\S]*?)<\/p>/);
  const introMeta = firstMatch(sectionBlock, /<div\s+className="intro-meta"[^>]*>([\s\S]*?)<\/div>/);

  // <span className="intro-list-text">… : 중첩 span 이 있을 수 있으므로 raw 캡처 후 leadingTextOnly 로 정제.
  const listRaw = [];
  const r = /<span\s+className="intro-list-text"[^>]*>([\s\S]*?)<\/span>/g;
  let m;
  while ((m = r.exec(sectionBlock)) !== null) {
    listRaw.push(m[1]);
  }
  const listTexts = listRaw.map((s) => decodeJsxText(leadingTextOnly(s))).filter(Boolean);

  // og:description (보조)
  const ogDesc = firstMatch(html, /property="og:description"\s+content="([^"]*)"/);

  return {
    region: introMeta,
    name: introName,
    desc: introDesc || ogDesc,
    address: listTexts[0] || null,
    hours: listTexts[1] || null,
  };
}

function parseFlowerExample(siteId) {
  const src = readSiteFile(siteId, "app.jsx");
  if (!src) return null;
  // <section className="hero">…<h2>…</h2><p>…</p>
  const heroBlock = (src.match(/<section\s+className="hero">([\s\S]*?)<\/section>/) || [])[1] || "";
  const heroH2 = firstMatch(heroBlock, /<h2[^>]*>([\s\S]*?)<\/h2>/);
  const heroP = firstMatch(heroBlock, /<p[^>]*>([\s\S]*?)<\/p>/);
  return {
    region: null,
    name: heroH2,
    desc: heroP,
    address: null,
    hours: null,
  };
}

function parseSite(site) {
  if (site.siteId === "flower_example") return parseFlowerExample(site.siteId);
  return parseTypeAOrC(site.siteId);
}

// ── Storage 업로드 ───────────────────────────────────
function md5(buffer) {
  return createHash("md5").update(buffer).digest("hex");
}

async function uploadHero(siteId) {
  const localPath = path.join(REPO_ROOT, siteId, "img", "hero.jpg");
  if (!existsSync(localPath)) {
    return { skipped: true, reason: "local hero.jpg 없음" };
  }
  const data = readFileSync(localPath);
  const remotePath = `sites/${siteId}/home/hero.jpg`;
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
      contentType: "image/jpeg",
      metadata: { firebaseStorageDownloadTokens: token },
    },
    resumable: false,
  });
  const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(remotePath)}?alt=media&token=${token}`;
  return { uploaded: true, downloadUrl, storagePath: remotePath, size: data.length };
}

// ── homeSection merge 헬퍼 ────────────────────────────
async function mergeSection(siteId, sectionId, dataPatch, presetMeta) {
  const ref = db.doc(`sites/${siteId}/homeSections/${sectionId}`);
  const snap = await ref.get();
  const existing = snap.exists ? snap.data() : null;

  // 보호 정책: 사용자(실제 editor/super UID)가 손댄 섹션만 보호.
  // seed-script / import-script 가 채운 값은 placeholder 로 간주하여 덮어쓴다.
  // dirty=true 도 사용자 편집 미발행 상태이므로 보호.
  const automatedAuthors = new Set(["seed-script", "import-script"]);
  const userTouched = existing &&
    (existing.dirty === true ||
      (existing.updatedBy && !automatedAuthors.has(existing.updatedBy)));
  const overwriteData = !userTouched || opts.force;

  let mergedData = existing?.data || {};
  if (overwriteData) {
    // 신규 필드는 덮어쓰지만 빈 문자열로 기존 값을 지우지는 않는다.
    for (const [k, v] of Object.entries(dataPatch)) {
      if (v === null || v === undefined || v === "") continue;
      mergedData[k] = v;
    }
  } else {
    // 보호 모드: 기존 필드가 비어 있을 때만 채움
    for (const [k, v] of Object.entries(dataPatch)) {
      if (v === null || v === undefined || v === "") continue;
      if (mergedData[k] == null || mergedData[k] === "") mergedData[k] = v;
    }
  }

  const doc = {
    sectionId,
    type: presetMeta.type,
    icon: presetMeta.icon,
    title: presetMeta.title,
    enabled: existing?.enabled ?? presetMeta.enabled,
    sortOrder: existing?.sortOrder ?? presetMeta.sortOrder,
    data: mergedData,
    dirty: false,
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: "import-script",
  };
  if (!existing) doc.createdAt = FieldValue.serverTimestamp();

  if (opts.dryRun) {
    console.log(`    [dry-run] ${sectionId} ←`, JSON.stringify(mergedData));
    return;
  }
  await ref.set(doc, { merge: true });
}

const PRESETS = {
  hero: { type: "hero", icon: "image", title: "히어로", enabled: true, sortOrder: 10 },
  greeting: { type: "greeting", icon: "user", title: "인사말", enabled: true, sortOrder: 20 },
  featured: { type: "featured", icon: "star", title: "이번 주 추천", enabled: true, sortOrder: 30 },
  info: { type: "info", icon: "info", title: "매장 정보", enabled: true, sortOrder: 40 },
  notice: { type: "notice", icon: "bell", title: "공지", enabled: false, sortOrder: 50 },
};

// ── 사이트별 처리 ──────────────────────────────────────
for (const site of sitesToProcess) {
  console.log(`\n=== ${site.siteId} (${site.name}) ===`);
  const parsed = parseSite(site);
  if (!parsed) {
    console.warn(`  ! ${site.siteId}: app.jsx 파싱 실패 — 건너뜀`);
    continue;
  }
  console.log(`  · 추출: name="${parsed.name?.slice(0, 30) || ""}" address="${parsed.address?.slice(0, 30) || ""}"`);

  // 1) hero 이미지 업로드
  let heroResult = null;
  try {
    heroResult = await uploadHero(site.siteId);
    if (heroResult.uploaded) {
      console.log(`  ✓ hero.jpg 업로드 — ${(heroResult.size / 1024).toFixed(1)}KB`);
    } else if (heroResult.downloadUrl) {
      console.log(`  - hero.jpg 스킵 — ${heroResult.reason}`);
    } else {
      console.log(`  - hero.jpg 스킵 — ${heroResult.reason}`);
    }
  } catch (e) {
    console.error(`  ✗ hero.jpg 업로드 실패: ${e.message}`);
  }

  // 2) hero 섹션 — 실제 사이트는 이미지만 노출하므로 이미지 필드만 채운다.
  //    data.image 는 CSS background 값이라 url("…") 로 감싼다.
  const heroImageCss = heroResult?.downloadUrl ? `url("${heroResult.downloadUrl}")` : null;
  await mergeSection(site.siteId, "hero", {
    image: heroImageCss,
    imageUrl: heroResult?.downloadUrl || null,
    imageStoragePath: heroResult?.storagePath || null,
  }, PRESETS.hero);

  // 3) greeting — 사이트명(intro-name) + 설명(intro-desc)
  await mergeSection(site.siteId, "greeting", {
    title: parsed.name || site.name,
    body: parsed.desc || null,
  }, PRESETS.greeting);

  // 4) info — 실제 사이트는 주소·영업시간만 노출 (전화·인스타 없음).
  await mergeSection(site.siteId, "info", {
    address: parsed.address || null,
    hours: parsed.hours || null,
  }, PRESETS.info);

  // 5) featured / notice 는 콘텐츠 자동 추출 불가 — 프리셋만 존재 보장
  for (const sid of ["featured", "notice"]) {
    const ref = db.doc(`sites/${site.siteId}/homeSections/${sid}`);
    const snap = await ref.get();
    if (snap.exists) continue;
    if (opts.dryRun) {
      console.log(`    [dry-run] ${sid} preset only`);
      continue;
    }
    await ref.set({
      sectionId: sid,
      type: PRESETS[sid].type,
      icon: PRESETS[sid].icon,
      title: PRESETS[sid].title,
      enabled: PRESETS[sid].enabled,
      sortOrder: PRESETS[sid].sortOrder,
      data: sid === "featured" ? { title: "이번 주 추천", pickedIds: [] } : { body: "" },
      dirty: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: "import-script",
    });
  }

  console.log(`  ✓ ${site.siteId} 임포트 완료`);
}

console.log("\n=== 완료 ===");
console.log("어드민 '홈 섹션 편집' 페이지에서 실제 사이트 내용이 반영됐는지 확인하세요.");
