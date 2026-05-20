import type { Timestamp } from "firebase/firestore";
import type { DocStatus } from "./category";

/**
 * Type B (flower_example) 전용.
 * 기존 `SECTIONS[catId][i] = { kicker, title, tag, items: [...] }` 를
 * sections/{sectionId} + 각 item은 products/{productId} 로 정규화.
 */
export interface Section {
  sectionId: string;
  categoryId: string;
  kicker: string;
  title: string;
  tag: string;
  sortOrder: number;
  visible: boolean;
  status: DocStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  updatedBy: string;
}
