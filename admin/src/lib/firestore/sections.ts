/**
 * Type B (flower_example) 전용 sections 컬렉션 헬퍼.
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
import type { Section } from "@/types";

export function sectionsCol(siteId: string) {
  return collection(db, "sites", siteId, "sections");
}

export function sectionRef(siteId: string, sectionId: string) {
  return doc(db, "sites", siteId, "sections", sectionId);
}

export function subscribeSections(
  siteId: string,
  onNext: (rows: Section[]) => void,
  onErr?: (e: Error) => void
) {
  const q = query(sectionsCol(siteId), orderBy("sortOrder", "asc"));
  return onSnapshot(
    q,
    (snap) => onNext(snap.docs.map((d) => d.data() as Section)),
    onErr
  );
}

export type SaveSectionInput = Omit<
  Section,
  "createdAt" | "updatedAt" | "updatedBy"
>;

export async function upsertSection(
  siteId: string,
  uid: string,
  input: SaveSectionInput
): Promise<void> {
  await setDoc(
    sectionRef(siteId, input.sectionId),
    {
      ...input,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    },
    { merge: true }
  );
}

export async function deleteSection(siteId: string, sectionId: string) {
  await deleteDoc(sectionRef(siteId, sectionId));
}
