import type { Timestamp } from "firebase/firestore";
import type { DocStatus } from "./category";

export interface ProductImage {
  storagePath: string;        // gs://.../sites/{siteId}/products/{productId}/main.jpg
  thumb: string | null;       // 400px URL (onImageFinalize가 채움)
  large: string | null;       // 800px URL
  originalUrl: string | null;
  repoPath: string;           // "dohwawon/img/bouquet-s-coral.jpg" — 발행 시 git 경로
}

export interface Product {
  productId: string;
  name: string;
  price: number;              // KRW 정수
  desc: string;
  categoryId: string;         // FK to categories
  image: ProductImage;

  // bell_cake 확장:
  sizeId?: string;
  flavorId?: string;

  // PARKHAD 확장:
  time?: number;              // 소요 시간(분)
  tag?: string;               // "BASIC" | "BEST" | "TREND" | "PREMIUM" 등

  // greenlight_art (Type C) 확장:
  age?: string;
  per?: number;
  weekly?: string;

  // Type B 섹션 매핑:
  sectionId?: string;

  visible: boolean;
  sortOrder: number;
  status: DocStatus;

  createdAt: Timestamp;
  updatedAt: Timestamp;
  updatedBy: string;
}
