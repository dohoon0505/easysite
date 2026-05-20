/**
 * 알림 토스트 전역 store. AlertToast 컴포넌트가 구독.
 */
import { create } from "zustand";

export type ToastTone = "info" | "success" | "warning" | "danger";

export interface ToastEntry {
  id: number;
  tone: ToastTone;
  message: string;
  durationMs: number;
}

interface ToastState {
  toasts: ToastEntry[];
  push: (
    t: Omit<ToastEntry, "id" | "durationMs"> & { durationMs?: number }
  ) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const useToasts = create<ToastState>((set, get) => ({
  toasts: [],
  push: (t) => {
    const id = nextId++;
    const entry: ToastEntry = { id, durationMs: t.durationMs ?? 4000, ...t };
    set({ toasts: [...get().toasts, entry] });
    if (entry.durationMs > 0) {
      setTimeout(() => get().dismiss(id), entry.durationMs);
    }
  },
  dismiss: (id) =>
    set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));

// 편의 함수 — 컴포넌트에서 직접 호출
export const toast = {
  info: (message: string) => useToasts.getState().push({ tone: "info", message, durationMs: 4000 }),
  success: (message: string) => useToasts.getState().push({ tone: "success", message, durationMs: 4000 }),
  warning: (message: string) => useToasts.getState().push({ tone: "warning", message, durationMs: 5000 }),
  danger: (message: string) => useToasts.getState().push({ tone: "danger", message, durationMs: 6000 }),
};
