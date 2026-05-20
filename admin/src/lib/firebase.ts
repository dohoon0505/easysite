/**
 * Firebase SDK 초기화 — 어드민 SPA 전역 싱글톤.
 *
 * 개발 시 (Vite dev / preview 또는 `VITE_USE_EMULATORS=1`) 자동으로
 * 에뮬레이터에 연결된다.
 */
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import {
  initializeFirestore,
  connectFirestoreEmulator,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// 공개 가능한 클라이언트 키 — Firebase 보안은 Rules + Auth 로 강제됨
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
  authDomain: "easysite-5a560.firebaseapp.com",
  projectId: "easysite-5a560",
  storageBucket: "easysite-5a560.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "",
};

export const firebaseApp =
  getApps()[0] ?? initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
void setPersistence(auth, browserLocalPersistence);

export const db = initializeFirestore(firebaseApp, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

export const storage = getStorage(firebaseApp);
export const functions = getFunctions(firebaseApp, "asia-northeast3");

// ── Emulator wiring ─────────────────────────────────────────
const useEmulators =
  import.meta.env.DEV && import.meta.env.VITE_USE_EMULATORS !== "0";

if (useEmulators && !(globalThis as Record<string, unknown>).__easysiteEmulatorsWired) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectStorageEmulator(storage, "127.0.0.1", 9199);
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  (globalThis as Record<string, unknown>).__easysiteEmulatorsWired = true;
  // eslint-disable-next-line no-console
  console.info("[firebase] connected to emulators (auth/firestore/storage/functions)");
}
