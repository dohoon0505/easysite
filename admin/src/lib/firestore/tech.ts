/**
 * Type C (greenlight_art) 전용 tech 컬렉션 헬퍼.
 */
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Tech } from "@/types";

export function techCol(siteId: string) {
  return collection(db, "sites", siteId, "tech");
}

export function techRef(siteId: string, techId: string) {
  return doc(db, "sites", siteId, "tech", techId);
}

export function subscribeTech(
  siteId: string,
  onNext: (rows: Tech[]) => void,
  onErr?: (e: Error) => void
) {
  const q = query(techCol(siteId), orderBy("sortOrder", "asc"));
  return onSnapshot(
    q,
    (snap) => onNext(snap.docs.map((d) => d.data() as Tech)),
    onErr
  );
}

export type SaveTechInput = Omit<Tech, "createdAt" | "updatedAt" | "updatedBy">;

export async function upsertTech(
  siteId: string,
  uid: string,
  input: SaveTechInput
): Promise<void> {
  await setDoc(
    techRef(siteId, input.techId),
    {
      ...input,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    },
    { merge: true }
  );
}

export async function deleteTech(siteId: string, techId: string) {
  await deleteDoc(techRef(siteId, techId));
}
