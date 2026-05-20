import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions/v2";
import { db, FieldValue } from "./admin";

type AuditAction = "create" | "update" | "delete";

/**
 * sites/{siteId}/{collection}/{docId} 의 모든 쓰기를 auditLogs 로 기록.
 *
 * 제외 컬렉션:
 *   - publishes (별도 doc 자체가 발행 이력이므로 중복 기록 회피)
 *   - locks    (잡음만 발생)
 */
export const auditOnWrite = onDocumentWritten(
  {
    document: "sites/{siteId}/{collection}/{docId}",
    region: "asia-northeast3",
  },
  async (event) => {
    const { siteId, collection, docId } = event.params as Record<string, string>;

    if (collection === "publishes" || collection === "locks") {
      return;
    }

    const before = event.data?.before?.data() ?? null;
    const after = event.data?.after?.data() ?? null;

    let action: AuditAction;
    if (!before && after) action = "create";
    else if (before && !after) action = "delete";
    else action = "update";

    // updatedBy 가 있으면 추출, 없으면 system
    const actor =
      (after?.updatedBy as string | undefined) ??
      (before?.updatedBy as string | undefined) ??
      "system";

    await db.collection("auditLogs").add({
      siteId,
      uid: actor,
      email: "",
      action,
      collection,
      docPath: `sites/${siteId}/${collection}/${docId}`,
      before,
      after,
      at: FieldValue.serverTimestamp(),
    });

    logger.debug("auditOnWrite", { siteId, collection, docId, action });
  }
);
