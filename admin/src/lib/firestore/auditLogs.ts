/**
 * 감사 로그 조회.
 */
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import type { AuditLog } from "@/types";

export function subscribeAuditLogs(
  siteId: string,
  limitN: number,
  onNext: (rows: AuditLog[]) => void,
  onErr?: (e: Error) => void
) {
  const q = query(
    collection(db, "auditLogs"),
    where("siteId", "==", siteId),
    orderBy("at", "desc"),
    limit(limitN)
  );
  return onSnapshot(
    q,
    (snap) => onNext(snap.docs.map((d) => d.data() as AuditLog)),
    onErr
  );
}
