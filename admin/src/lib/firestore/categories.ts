import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Category } from "@/types";

export function categoriesCol(siteId: string) {
  return collection(db, "sites", siteId, "categories");
}

export function categoryRef(siteId: string, categoryId: string) {
  return doc(db, "sites", siteId, "categories", categoryId);
}

export function subscribeCategories(
  siteId: string,
  onNext: (cats: Category[]) => void,
  onErr?: (e: Error) => void
) {
  const q = query(categoriesCol(siteId), orderBy("sortOrder", "asc"));
  return onSnapshot(
    q,
    (snap) => onNext(snap.docs.map((d) => d.data() as Category)),
    onErr
  );
}

export interface SaveCategoryInput {
  categoryId: string;
  name: string;
  blurb: string;
  sub: string;
  icon?: string;
  sortOrder: number;
  visible: boolean;
  status: Category["status"];
  // Type B 시각 필드:
  banner?: string;
  photo?: string;
  accent?: string;
  accentBg?: string;
}

export async function upsertCategory(
  siteId: string,
  uid: string,
  input: SaveCategoryInput
): Promise<void> {
  await setDoc(
    categoryRef(siteId, input.categoryId),
    {
      ...input,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    },
    { merge: true }
  );
}

export async function setCategoryVisibility(
  siteId: string,
  categoryId: string,
  uid: string,
  visible: boolean
): Promise<void> {
  await updateDoc(categoryRef(siteId, categoryId), {
    visible,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  });
}

export async function deleteCategory(
  siteId: string,
  categoryId: string
): Promise<void> {
  await deleteDoc(categoryRef(siteId, categoryId));
}

/** 드래그 정렬 결과 반영. id 순서대로 0, 10, 20, ... sortOrder 부여. */
export async function reorderCategories(
  siteId: string,
  uid: string,
  orderedIds: string[]
): Promise<void> {
  const batch = writeBatch(db);
  orderedIds.forEach((id, idx) => {
    batch.update(categoryRef(siteId, id), {
      sortOrder: idx * 10,
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    });
  });
  await batch.commit();
}
