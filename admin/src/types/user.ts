import type { Timestamp } from "firebase/firestore";

export type UserRole = "super" | "owner" | "editor";

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  siteId: string | null;        // null when role === "super"
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp;
}

/**
 * Firebase Auth custom claims 의 형식.
 * `setSiteClaim` Function 이 설정.
 */
export interface AuthClaims {
  role: UserRole;
  siteId: string | null;
}
