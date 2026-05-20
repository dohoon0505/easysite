import * as functionsV1 from "firebase-functions/v1";
import { db, FieldValue } from "./admin";

/**
 * Auth onCreate 트리거.
 * 새로 가입한 사용자에게 기본 권한(editor, siteId=null) 으로 `users/{uid}` 문서를 만든다.
 * 슈퍼 어드민이 추후 `setSiteClaim` 으로 실제 siteId 를 부여한다.
 *
 * v2 에는 동등한 비차단 트리거가 없어 v1 API 를 사용한다.
 */
export const onUserCreate = functionsV1
  .region("asia-northeast3")
  .auth.user()
  .onCreate(async (user) => {
    await db.doc(`users/${user.uid}`).set(
      {
        uid: user.uid,
        email: user.email ?? null,
        displayName: user.displayName ?? null,
        role: "editor",
        siteId: null,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        lastLoginAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });
