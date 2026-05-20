/**
 * easysite Cloud Functions — entry point.
 *
 * 지역(region): asia-northeast3 (서울)
 * v2 함수 (callable, Firestore trigger) 는 setGlobalOptions 로 지역을 지정.
 * v1 Auth trigger 는 자체 .region() 으로 지정.
 */
import { setGlobalOptions } from "firebase-functions/v2";

setGlobalOptions({
  region: "asia-northeast3",
  maxInstances: 10,
});

export { setSiteClaim } from "./setSiteClaim";
export { onUserCreate } from "./onUserCreate";
export { auditOnWrite } from "./auditOnWrite";
