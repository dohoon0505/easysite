import type { Timestamp } from "firebase/firestore";

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "publish"
  | "claim_set";

export interface AuditLog {
  logId: string;
  siteId: string;
  uid: string;
  email: string;
  action: AuditAction;
  collection: string;       // "products" | "categories" | "sections" | "tech" | "publishes" 등
  docPath: string;          // "sites/dohwawon/products/abc123"
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  at: Timestamp;
}
