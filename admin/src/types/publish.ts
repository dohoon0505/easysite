import type { Timestamp } from "firebase/firestore";

export interface PublishCounts {
  categories: number;
  products: number;
  sections?: number;
  tech?: number;
}

/**
 * 발행 1건당 1 doc. `sites/{siteId}/publishes/{publishId}` 경로.
 * publishId 는 ISO timestamp(콜론·점은 하이픈으로 치환).
 */
export interface Publish {
  publishId: string;
  publishedBy: string;          // uid
  publishedAt: Timestamp;
  commitSha: string;            // GitHub 커밋 SHA
  filesChanged: string[];       // ["dohwawon/data.jsx", "dohwawon/img/x.jpg", ...]
  counts: PublishCounts;
  note: string | null;          // 발행자의 코멘트
}
