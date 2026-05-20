import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { auth, db, FieldValue } from "./admin";

type Role = "super" | "owner" | "editor";

interface SetSiteClaimRequest {
  uid: string;
  siteId: string | null;
  role: Role;
}

/**
 * 슈퍼 어드민이 한 사용자의 Custom Claims (siteId · role) 을 설정한다.
 * 호출자는 반드시 `request.auth.token.role === "super"` 여야 한다.
 *
 * 사이드 이펙트:
 *   - Firebase Auth 의 customClaims 갱신
 *   - `users/{uid}` 문서의 siteId·role 갱신 (없으면 생성)
 *   - `auditLogs` 에 claim_set 로그 1줄 기록
 */
export const setSiteClaim = onCall<SetSiteClaimRequest>(async (req) => {
  const callerToken = req.auth?.token;
  if (!callerToken || callerToken.role !== "super") {
    throw new HttpsError(
      "permission-denied",
      "슈퍼 어드민만 권한을 부여할 수 있습니다."
    );
  }

  const { uid, siteId, role } = req.data;
  if (!uid || !role) {
    throw new HttpsError("invalid-argument", "uid 와 role 은 필수입니다.");
  }
  if (role !== "super" && !siteId) {
    throw new HttpsError(
      "invalid-argument",
      'role 이 "super" 가 아니면 siteId 를 지정해야 합니다.'
    );
  }

  let targetUser;
  try {
    targetUser = await auth.getUser(uid);
  } catch {
    throw new HttpsError(
      "not-found",
      `uid="${uid}" 사용자를 찾을 수 없습니다.`
    );
  }

  const newClaims = { role, siteId: role === "super" ? null : siteId };
  await auth.setCustomUserClaims(uid, newClaims);

  await db.doc(`users/${uid}`).set(
    {
      uid,
      email: targetUser.email ?? null,
      displayName: targetUser.displayName ?? null,
      role,
      siteId: newClaims.siteId,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  await db.collection("auditLogs").add({
    siteId: newClaims.siteId ?? "*",
    uid: req.auth!.uid,
    email: req.auth!.token.email ?? "",
    action: "claim_set",
    collection: "users",
    docPath: `users/${uid}`,
    after: newClaims,
    at: FieldValue.serverTimestamp(),
  });

  logger.info("setSiteClaim done", { caller: req.auth!.uid, target: uid, newClaims });

  return {
    ok: true,
    uid,
    claims: newClaims,
    note: "사용자는 다음 로그인이나 getIdToken(true) 호출 시 새 claim 을 받습니다.",
  };
});
