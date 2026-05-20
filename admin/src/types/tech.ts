import type { Timestamp } from "firebase/firestore";
import type { DocStatus } from "./category";

/**
 * Type C (greenlight_art) 전용.
 * 기존 TECH_CATEGORIES 를 sites/{siteId}/tech/{techId} 평면 컬렉션으로 분리.
 * COURSE_CATEGORIES 와는 독립.
 */
export interface Tech {
  techId: string;
  name: string;
  hue: string;        // "pink" 같은 색 키워드
  blurb: string;
  learns: string;     // 장문 설명
  sortOrder: number;
  visible: boolean;
  status: DocStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  updatedBy: string;
}
