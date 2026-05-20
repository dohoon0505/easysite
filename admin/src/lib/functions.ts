/**
 * Cloud Functions httpsCallable 헬퍼.
 */
import { httpsCallable } from "firebase/functions";
import type { UserRole } from "@/types";
import { functions } from "./firebase";

export interface SetSiteClaimResult {
  ok: true;
  uid: string;
  claims: { role: UserRole; siteId: string | null };
  note: string;
}

export const callSetSiteClaim = httpsCallable<
  { uid: string; siteId: string | null; role: UserRole },
  SetSiteClaimResult
>(functions, "setSiteClaim");
