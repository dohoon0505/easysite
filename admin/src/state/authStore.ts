/**
 * 인증 상태 전역 store (Zustand).
 *
 * AuthBoundary 가 onAuthStateChanged 를 구독하여 store 를 갱신한다.
 * 컴포넌트는 `useAuth()` 로 user/claims 를 구독.
 */
import { create } from "zustand";
import type { User } from "firebase/auth";
import type { AuthClaims } from "@/types";

export interface AuthState {
  status: "loading" | "signedIn" | "signedOut";
  user: User | null;
  claims: AuthClaims | null;
  setSession: (s: { user: User; claims: AuthClaims }) => void;
  setSignedOut: () => void;
  setLoading: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  status: "loading",
  user: null,
  claims: null,
  setSession: ({ user, claims }) =>
    set({ status: "signedIn", user, claims }),
  setSignedOut: () => set({ status: "signedOut", user: null, claims: null }),
  setLoading: () => set({ status: "loading" }),
}));

// 편의 selector — 자주 쓰는 패턴
export const useRole = () => useAuth((s) => s.claims?.role ?? null);
export const useSiteId = () => useAuth((s) => s.claims?.siteId ?? null);
export const useIsSuper = () => useAuth((s) => s.claims?.role === "super");
