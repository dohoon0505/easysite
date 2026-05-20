/**
 * 인증 도우미 — 로그인/로그아웃, claim refresh.
 *
 * 컴포넌트는 `useAuth()` Hook (state/authStore.ts) 로 user/claims 를 구독.
 * 직접 함수는 form submit 핸들러 등에서 호출.
 */
import {
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  type User,
} from "firebase/auth";
import type { AuthClaims, UserRole } from "@/types";
import { auth } from "./firebase";

export interface AuthSession {
  user: User;
  claims: AuthClaims;
}

export async function signIn(email: string, password: string): Promise<AuthSession> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const tokenResult = await cred.user.getIdTokenResult(true);
  return {
    user: cred.user,
    claims: extractClaims(tokenResult.claims),
  };
}

export async function signOut(): Promise<void> {
  await fbSignOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/**
 * setSiteClaim 호출 후 토큰을 강제 리프레시한다.
 * 평소엔 1시간 자동, 즉시 새 claim 을 가져오려면 호출.
 */
export async function refreshClaims(): Promise<AuthClaims | null> {
  if (!auth.currentUser) return null;
  const tokenResult = await auth.currentUser.getIdTokenResult(true);
  return extractClaims(tokenResult.claims);
}

function extractClaims(rawClaims: Record<string, unknown>): AuthClaims {
  const role = (rawClaims.role as UserRole | undefined) ?? "editor";
  const siteId =
    role === "super" ? null : ((rawClaims.siteId as string | undefined) ?? null);
  return { role, siteId };
}
