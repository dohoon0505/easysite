/**
 * Octokit 클라이언트 — Firebase Functions Secret Manager 의
 * GITHUB_PAT 를 인증에 사용.
 *
 * Secret 설정:
 *   firebase functions:secrets:set GITHUB_PAT
 *
 * 권한 요구사항:
 *   - Repository access: dohoon0505/easysite
 *   - Permissions: Contents (Read and Write)
 *   - 만료: 90일 권장 (재발급 절차 필요)
 */
import { defineSecret } from "firebase-functions/params";
import { Octokit } from "@octokit/rest";

export const GITHUB_PAT = defineSecret("GITHUB_PAT");

export function getOctokit(): Octokit {
  const token = GITHUB_PAT.value();
  if (!token) throw new Error("GITHUB_PAT secret 이 비어 있습니다.");
  return new Octokit({
    auth: token,
    userAgent: "easysite-admin/0.1.0",
  });
}
