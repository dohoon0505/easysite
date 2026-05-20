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
  where,
  writeBatch,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Product } from "@/types";

export function productsCol(siteId: string) {
  return collection(db, "sites", siteId, "products");
}

export function productRef(siteId: string, productId: string) {
  return doc(db, "sites", siteId, "products", productId);
}

export interface ProductsFilter {
  categoryId?: string | null;
  status?: Product["status"];
}

export function subscribeProducts(
  siteId: string,
  filter: ProductsFilter,
  onNext: (prods: Product[]) => void,
  onErr?: (e: Error) => void
) {
  const constraints: QueryConstraint[] = [];
  if (filter.status) constraints.push(where("status", "==", filter.status));
  if (filter.categoryId)
    constraints.push(where("categoryId", "==", filter.categoryId));
  constraints.push(orderBy("sortOrder", "asc"));
  const q = query(productsCol(siteId), ...constraints);
  return onSnapshot(
    q,
    (snap) => onNext(snap.docs.map((d) => d.data() as Product)),
    onErr
  );
}

export type SaveProductInput = Omit<
  Product,
  "createdAt" | "updatedAt" | "updatedBy"
>;

export async function upsertProduct(
  siteId: string,
  uid: string,
  input: SaveProductInput
): Promise<void> {
  await setDoc(
    productRef(siteId, input.productId),
    {
      ...input,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    },
    { merge: true }
  );
}

export async function setProductVisibility(
  siteId: string,
  productId: string,
  uid: string,
  visible: boolean
): Promise<void> {
  await updateDoc(productRef(siteId, productId), {
    visible,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  });
}

export async function setProductStatus(
  siteId: string,
  productId: string,
  uid: string,
  status: Product["status"]
): Promise<void> {
  await updateDoc(productRef(siteId, productId), {
    status,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  });
}

export async function deleteProduct(
  siteId: string,
  productId: string
): Promise<void> {
  await deleteDoc(productRef(siteId, productId));
}

/** 다중 선택 후 가격 일괄 변경. percentDelta 예: +5 (5% 인상), -10 (10% 인하). */
export async function bulkAdjustPrice(
  siteId: string,
  uid: string,
  productIds: string[],
  percentDelta: number,
  currentPrices: Record<string, number>
): Promise<void> {
  if (productIds.length === 0) return;
  const batch = writeBatch(db);
  for (const id of productIds) {
    const current = currentPrices[id];
    if (current == null) continue;
    const next = Math.round(current * (1 + percentDelta / 100));
    batch.update(productRef(siteId, id), {
      price: next,
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    });
  }
  await batch.commit();
}

export async function bulkSetVisibility(
  siteId: string,
  uid: string,
  productIds: string[],
  visible: boolean
): Promise<void> {
  if (productIds.length === 0) return;
  const batch = writeBatch(db);
  for (const id of productIds) {
    batch.update(productRef(siteId, id), {
      visible,
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    });
  }
  await batch.commit();
}

export async function bulkDelete(
  siteId: string,
  productIds: string[]
): Promise<void> {
  if (productIds.length === 0) return;
  const batch = writeBatch(db);
  for (const id of productIds) {
    batch.delete(productRef(siteId, id));
  }
  await batch.commit();
}

export async function reorderProducts(
  siteId: string,
  uid: string,
  orderedIds: string[]
): Promise<void> {
  const batch = writeBatch(db);
  orderedIds.forEach((id, idx) => {
    batch.update(productRef(siteId, id), {
      sortOrder: idx * 10,
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    });
  });
  await batch.commit();
}
