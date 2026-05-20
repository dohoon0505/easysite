import type { Timestamp } from "firebase/firestore";

export type SiteType = "typeA" | "typeB" | "typeC";

export interface SiteGitHubMeta {
  owner: string;        // "dohoon0505"
  repo: string;         // "easysite"
  branch: string;       // "main"
  sitePath: string;     // "dohwawon" — repo 내 사이트 폴더 경로
}

export interface Site {
  siteId: string;       // doc id 와 동일
  name: string;         // "도화원플라워"
  domain: string;       // 커스텀 도메인 (참고용)
  siteType: SiteType;
  brandColor?: string;  // P2
  fontFamily?: string;  // P2
  ownerUid: string;
  github: SiteGitHubMeta;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastPublishedAt: Timestamp | null;
  lastPublishCommit: string | null;
}
