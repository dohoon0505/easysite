import type { Timestamp } from "firebase/firestore";

export type DocStatus = "draft" | "live";

export interface Category {
  categoryId: string;
  name: string;
  blurb: string;
  sub: string;          // "BOUQUET" 영문 부제
  icon?: string;
  sortOrder: number;
  visible: boolean;
  status: DocStatus;

  // Type B 전용 시각 필드:
  banner?: string;      // Storage 경로
  photo?: string;
  accent?: string;
  accentBg?: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
  updatedBy: string;    // uid
}
