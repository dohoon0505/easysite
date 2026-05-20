/**
 * 초기 운영자 계정 생성 스크립트.
 *
 * 입력: `scripts/bootstrap-users.json` (gitignore 됨, 로컬에서만 작성)
 *   예시:
 *   {
 *     "users": [
 *       {
 *         "email": "admin@example.com",
 *         "displayName": "Cris (super)",
 *         "role": "super"
 *       },
 *       {
 *         "email": "dohwawon-op@example.com",
 *         "displayName": "도화원 운영자",
 *         "role": "editor",
 *         "siteId": "dohwawon"
 *       }
 *       // ... bell_cake, PARKHAD, flower_example, greenlight_art
 *     ]
 *   }
 *
 * 실행:
 *   cd scripts
 *   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\service-account.json"
 *   node create-bootstrap-users.mjs
 *
 * 출력:
 *   - 각 계정의 uid · email · 임시 비밀번호를 콘솔에 출력
 *   - bootstrap-users.result.json 에 동일 내용 저장 (gitignore 됨)
 *   - 운영자에게 임시 비밀번호로 첫 로그인 → 비밀번호 재설정 메일 권장
 *
 * 멱등성: 같은 email 이 이미 있으면 비밀번호 재설정 없이 claim 만 갱신.
 */
import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, "bootstrap-users.json");
const RESULT_PATH = path.join(__dirname, "bootstrap-users.result.json");

// ── 사전 점검 ──────────────────────────────────────────
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error("✗ GOOGLE_APPLICATION_CREDENTIALS 환경변수가 비어 있습니다.");
  console.error("  PowerShell 예: $env:GOOGLE_APPLICATION_CREDENTIALS = \"C:\\path\\to\\sa.json\"");
  process.exit(1);
}

if (!existsSync(CONFIG_PATH)) {
  console.error(`✗ ${CONFIG_PATH} 가 없습니다.`);
  console.error("  scripts/bootstrap-users.example.json 을 참고하여 작성하세요.");
  process.exit(1);
}

const cfg = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
if (!Array.isArray(cfg.users) || cfg.users.length === 0) {
  console.error("✗ users 배열이 비어 있습니다.");
  process.exit(1);
}

// ── Admin SDK 초기화 ──────────────────────────────────
if (getApps().length === 0) {
  initializeApp({ credential: applicationDefault() });
}
const auth = getAuth();
const db = getFirestore();

// ── 임시 비밀번호 생성 ────────────────────────────────
function genPassword() {
  // 12자 hex (영문 소문자 + 숫자). 첫 로그인 후 즉시 변경 권장.
  return randomBytes(6).toString("hex");
}

// ── 메인 ──────────────────────────────────────────────
const results = [];
for (const def of cfg.users) {
  const { email, displayName, role, siteId } = def;
  if (!email || !role) {
    console.warn(`! email/role 누락: ${JSON.stringify(def)} — 건너뜀`);
    continue;
  }
  if (role !== "super" && !siteId) {
    console.warn(`! ${email} 의 role 이 ${role} 인데 siteId 가 없음 — 건너뜀`);
    continue;
  }

  let user;
  let tempPassword = null;
  try {
    user = await auth.getUserByEmail(email);
    console.log(`= 기존 사용자 발견: ${email} (uid: ${user.uid})`);
  } catch {
    tempPassword = genPassword();
    user = await auth.createUser({
      email,
      displayName,
      password: tempPassword,
      emailVerified: false,
    });
    console.log(`+ 새 사용자 생성: ${email} (uid: ${user.uid})`);
  }

  // Custom Claims 부여
  const claims = { role, siteId: role === "super" ? null : siteId };
  await auth.setCustomUserClaims(user.uid, claims);
  console.log(`  claims 설정: ${JSON.stringify(claims)}`);

  // users/{uid} 도큐먼트 갱신
  await db.doc(`users/${user.uid}`).set(
    {
      uid: user.uid,
      email: user.email ?? null,
      displayName: displayName ?? user.displayName ?? null,
      role,
      siteId: claims.siteId,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      lastLoginAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  results.push({
    uid: user.uid,
    email,
    displayName,
    role,
    siteId: claims.siteId,
    tempPassword,
    isNew: tempPassword !== null,
  });
}

// ── 결과 출력 ──────────────────────────────────────────
console.log("\n=== 부트스트랩 결과 ===");
for (const r of results) {
  const passInfo = r.tempPassword
    ? `\n     임시 비밀번호: ${r.tempPassword} (반드시 첫 로그인 후 변경!)`
    : " (기존 사용자, 비밀번호 미변경)";
  console.log(
    `- ${r.email} (uid: ${r.uid})\n` +
      `     role=${r.role}${r.siteId ? `, siteId=${r.siteId}` : ""}` +
      passInfo
  );
}

writeFileSync(RESULT_PATH, JSON.stringify(results, null, 2), "utf8");
console.log(`\n결과가 ${RESULT_PATH} 에 저장되었습니다 (gitignore 됨).`);
console.log("⚠ 임시 비밀번호는 즉시 운영자에게 전달 후 1회용 안전 채널 (Slack DM / 카카오톡 비공개) 로만 공유하세요.");
