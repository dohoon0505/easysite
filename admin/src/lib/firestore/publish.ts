/**
 * 발행 이력 조회 + publishToGitHub callable 호출 wrapper.
 */
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../firebase";
import type { Publish } from "@/types";

export function subscribePublishes(
  siteId: string,
  limitN: number,
  onNext: (rows: Publish[]) => void,
  onErr?: (e: Error) => void
) {
  const q = query(
    collection(db, "sites", siteId, "publishes"),
    orderBy("publishedAt", "desc"),
    limit(limitN)
  );
  return onSnapshot(
    q,
    (snap) => onNext(snap.docs.map((d) => d.data() as Publish)),
    onErr
  );
}

export interface PublishToGitHubResult {
  commitSha: string;
  snapshotId: string;
  filesChanged: number;
}

/** M5 에서 배포될 publishToGitHub Cloud Function 의 callable wrapper. */
export const callPublishToGitHub = httpsCallable<
  { siteId: string; note?: string },
  PublishToGitHubResult
>(functions, "publishToGitHub");
