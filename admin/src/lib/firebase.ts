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

// 공개 가능한 클라이언트 키 — Firebase 보안은 Rules + Auth + App Check 로 강제됨.
// 이 값들은 Firebase 콘솔의 Web 앱 설정에서 가져온 것.
const firebaseConfig = {
  apiKey: "AIzaSyC3zHZ3CUe8if32xSea5hhwKiNFIOFeDJ4",
  authDomain: "easysite-5a560.firebaseapp.com",
  projectId: "easysite-5a560",
  storageBucket: "easysite-5a560.firebasestorage.app",
  messagingSenderId: "445003258288",
  appId: "1:445003258288:web:bb579ee474a4454df21e75",
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
