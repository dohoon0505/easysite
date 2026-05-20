/**
 * 활성 사이트 store.
 * - editor: 자기 사이트 1개로 고정 (claim 기반)
 * - super: SitesAdmin 에서 자유 선택. 기본은 localStorage 마지막 선택값.
 */
import { create } from "zustand";

const STORAGE_KEY = "easysite.activeSiteId";

interface SiteStoreState {
  activeSiteId: string | null;
  setActiveSiteId: (id: string | null) => void;
}

function readPersisted(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writePersisted(id: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (id === null) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // ignore quota errors
  }
}

export const useSiteStore = create<SiteStoreState>((set) => ({
  activeSiteId: readPersisted(),
  setActiveSiteId: (id) => {
    writePersisted(id);
    set({ activeSiteId: id });
  },
}));

export const useActiveSiteId = () =>
  useSiteStore((s) => s.activeSiteId);
