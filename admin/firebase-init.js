/* eslint-disable */
// Firebase SDK 초기화 — compat 모드(CDN 통합). window.firebase.* 전역 노출.
//
// 사용처:
//  - firebase-auth.jsx → onAuthStateChanged + signInWithEmailAndPassword
//  - firebase-data.jsx → Firestore onSnapshot 기반 라이브 데이터 (M9 예정)
//  - 발행 호출 → firebase.functions("asia-northeast3").httpsCallable("publishToGitHub")
//
// 공개 가능한 클라이언트 키 — Firebase 보안은 Rules + Auth + App Check 로 강제.

(function () {
  if (typeof firebase === "undefined") {
    console.error("[firebase-init] Firebase SDK 가 로드되지 않았습니다.");
    return;
  }

  const firebaseConfig = {
    apiKey: "AIzaSyC3zHZ3CUe8if32xSea5hhwKiNFIOFeDJ4",
    authDomain: "easysite-5a560.firebaseapp.com",
    projectId: "easysite-5a560",
    storageBucket: "easysite-5a560.firebasestorage.app",
    messagingSenderId: "445003258288",
    appId: "1:445003258288:web:bb579ee474a4454df21e75",
  };

  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }

  // Auth 자동 영속 (sessionStorage → localStorage 가 기본).
  firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .catch((e) => console.warn("[firebase-init] setPersistence 실패", e));

  // 다른 .jsx 파일에서 쉽게 쓰도록 별칭 노출
  window.fbAuth = firebase.auth();
  window.fbDb = firebase.firestore();
  window.fbStorage = firebase.storage();
  window.fbFunctions = firebase.app().functions("asia-northeast3");

  console.info("[firebase-init] ready · project easysite-5a560 · region asia-northeast3");
})();
