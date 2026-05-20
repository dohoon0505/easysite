/**
 * Firestore + Storage Security Rules — access isolation tests.
 *
 * 사이트 격리(siteId claim) · 슈퍼 어드민 · Functions 전용 컬렉션 (users,
 * auditLogs, publishes) 의 접근 제어를 검증한다. 계획서 §M1 의 16+ 시나리오.
 *
 * 실행 전 emulator 부팅 필요:
 *   firebase emulators:start --only firestore,storage
 *
 * 또는 한 번에:
 *   firebase emulators:exec --only firestore,storage "npm run test:rules"
 */
import { afterAll, afterEach, beforeAll, describe, it } from "vitest";
import {
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

import {
  AS_BELLCAKE_EDITOR,
  AS_DOHWAWON_EDITOR,
  AS_NO_CLAIM,
  AS_SUPER,
  createTestEnv,
  ctx,
} from "./setup";

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await createTestEnv();
});

afterEach(async () => {
  await env.clearFirestore();
  await env.clearStorage();
});

afterAll(async () => {
  await env.cleanup();
});

// ─────────────────────────────────────────────────────────────
// 헬퍼: 테스트 데이터 시드 (security rules 우회로 미리 채워둠)
// ─────────────────────────────────────────────────────────────
async function seed(env: RulesTestEnvironment) {
  await env.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, "sites/dohwawon"), {
      siteId: "dohwawon",
      name: "도화원플라워",
      siteType: "typeA",
    });
    await setDoc(doc(db, "sites/bell_cake"), {
      siteId: "bell_cake",
      name: "벨케이크",
      siteType: "typeA",
    });
    await setDoc(doc(db, "sites/dohwawon/products/prod-1"), {
      productId: "prod-1",
      name: "샘플 상품",
      price: 10000,
    });
    await setDoc(doc(db, "sites/bell_cake/products/cake-1"), {
      productId: "cake-1",
      name: "샘플 케이크",
      price: 30000,
    });
    await setDoc(doc(db, "users/editor-dohwawon"), {
      uid: "editor-dohwawon",
      email: "dohwawon@example.com",
      role: "editor",
      siteId: "dohwawon",
    });
    await setDoc(doc(db, "users/editor-bell_cake"), {
      uid: "editor-bell_cake",
      email: "bell_cake@example.com",
      role: "editor",
      siteId: "bell_cake",
    });
    await setDoc(doc(db, "auditLogs/log-dohwawon-1"), {
      logId: "log-dohwawon-1",
      siteId: "dohwawon",
      uid: "editor-dohwawon",
      action: "update",
      docPath: "sites/dohwawon/products/prod-1",
      at: serverTimestamp(),
    });
    await setDoc(doc(db, "auditLogs/log-bell_cake-1"), {
      logId: "log-bell_cake-1",
      siteId: "bell_cake",
      uid: "editor-bell_cake",
      action: "update",
      docPath: "sites/bell_cake/products/cake-1",
      at: serverTimestamp(),
    });
    await setDoc(doc(db, "sites/dohwawon/publishes/2026-01-01"), {
      publishId: "2026-01-01",
      commitSha: "abc123",
      publishedBy: "editor-dohwawon",
    });
  });
}

// 1×1 px PNG (base64-decoded). isImage() 의 size·mime 제약 충족.
const TINY_PNG = Uint8Array.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
  0x0d, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x62, 0x00, 0x01, 0x00, 0x00,
  0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
  0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
]);

// ─────────────────────────────────────────────────────────────
// Firestore 시나리오 (1–15)
// ─────────────────────────────────────────────────────────────

describe("Firestore: super 어드민", () => {
  it("1. super → 모든 사이트 읽기 가능", async () => {
    await seed(env);
    const db = ctx(env, AS_SUPER).firestore();
    await assertSucceeds(getDoc(doc(db, "sites/dohwawon/products/prod-1")));
    await assertSucceeds(getDoc(doc(db, "sites/bell_cake/products/cake-1")));
  });

  it("2. super → 모든 사이트 쓰기 가능", async () => {
    await seed(env);
    const db = ctx(env, AS_SUPER).firestore();
    await assertSucceeds(
      setDoc(doc(db, "sites/dohwawon/products/new-1"), {
        productId: "new-1",
        name: "신상",
        price: 1,
      })
    );
    await assertSucceeds(
      setDoc(doc(db, "sites/bell_cake/products/new-2"), {
        productId: "new-2",
        name: "신상",
        price: 1,
      })
    );
  });
});

describe("Firestore: 사이트 격리 (editor)", () => {
  it("3. dohwawon editor → dohwawon 상품 읽기 가능", async () => {
    await seed(env);
    const db = ctx(env, AS_DOHWAWON_EDITOR).firestore();
    await assertSucceeds(getDoc(doc(db, "sites/dohwawon/products/prod-1")));
  });

  it("4. dohwawon editor → bell_cake 상품 읽기 차단", async () => {
    await seed(env);
    const db = ctx(env, AS_DOHWAWON_EDITOR).firestore();
    await assertFails(getDoc(doc(db, "sites/bell_cake/products/cake-1")));
  });

  it("5. dohwawon editor → dohwawon 상품 쓰기 가능", async () => {
    await seed(env);
    const db = ctx(env, AS_DOHWAWON_EDITOR).firestore();
    await assertSucceeds(
      setDoc(doc(db, "sites/dohwawon/products/prod-2"), {
        productId: "prod-2",
        name: "꽃다발",
        price: 50000,
      })
    );
  });

  it("6. dohwawon editor → bell_cake 상품 쓰기 차단", async () => {
    await seed(env);
    const db = ctx(env, AS_DOHWAWON_EDITOR).firestore();
    await assertFails(
      setDoc(doc(db, "sites/bell_cake/products/cake-x"), {
        productId: "cake-x",
        name: "침입 시도",
        price: 1,
      })
    );
  });

  it("7. unauthed → 어떤 사이트 읽기든 차단", async () => {
    await seed(env);
    const db = ctx(env, null).firestore();
    await assertFails(getDoc(doc(db, "sites/dohwawon/products/prod-1")));
    await assertFails(getDoc(doc(db, "sites/bell_cake/products/cake-1")));
  });
});

describe("Firestore: Functions 전용 컬렉션", () => {
  it("8. editor → publishes 쓰기 차단 (Functions 전용)", async () => {
    await seed(env);
    const db = ctx(env, AS_DOHWAWON_EDITOR).firestore();
    // 본인 사이트 publishes 라도 쓰기는 불가
    await assertFails(
      setDoc(doc(db, "sites/dohwawon/publishes/manual"), {
        publishId: "manual",
        commitSha: "fake",
      })
    );
  });

  it("9. editor → 본인 user doc 읽기 가능", async () => {
    await seed(env);
    const db = ctx(env, AS_DOHWAWON_EDITOR).firestore();
    await assertSucceeds(getDoc(doc(db, "users/editor-dohwawon")));
  });

  it("10. editor → 타인 user doc 읽기 차단", async () => {
    await seed(env);
    const db = ctx(env, AS_DOHWAWON_EDITOR).firestore();
    await assertFails(getDoc(doc(db, "users/editor-bell_cake")));
  });

  it("11. editor → user doc 쓰기 차단 (Functions 전용)", async () => {
    await seed(env);
    const db = ctx(env, AS_DOHWAWON_EDITOR).firestore();
    await assertFails(
      setDoc(doc(db, "users/editor-dohwawon"), {
        uid: "editor-dohwawon",
        role: "super",          // 권한 상승 시도
        siteId: null,
      })
    );
  });

  it("12. editor → 본인 사이트 auditLogs 읽기 가능", async () => {
    await seed(env);
    const db = ctx(env, AS_DOHWAWON_EDITOR).firestore();
    await assertSucceeds(getDoc(doc(db, "auditLogs/log-dohwawon-1")));
  });

  it("13. editor → 타사이트 auditLogs 읽기 차단", async () => {
    await seed(env);
    const db = ctx(env, AS_DOHWAWON_EDITOR).firestore();
    await assertFails(getDoc(doc(db, "auditLogs/log-bell_cake-1")));
  });

  it("14. editor → auditLogs 쓰기 차단", async () => {
    await seed(env);
    const db = ctx(env, AS_DOHWAWON_EDITOR).firestore();
    await assertFails(
      setDoc(doc(db, "auditLogs/fake-log"), {
        logId: "fake-log",
        siteId: "dohwawon",
        action: "create",
        at: serverTimestamp(),
      })
    );
    await assertFails(deleteDoc(doc(db, "auditLogs/log-dohwawon-1")));
  });

  it("15. claim 없는 토큰 (signOut 직후) → 쓰기 차단", async () => {
    await seed(env);
    const db = ctx(env, AS_NO_CLAIM).firestore();
    await assertFails(
      setDoc(doc(db, "sites/dohwawon/products/sneak-1"), {
        productId: "sneak-1",
        name: "claim 없음",
        price: 1,
      })
    );
  });
});

// ─────────────────────────────────────────────────────────────
// Storage 시나리오 (16–18)
// ─────────────────────────────────────────────────────────────

describe("Storage: 사이트 격리·이미지 검증", () => {
  it("16. dohwawon editor → bell_cake 이미지 업로드 차단", async () => {
    const storage = ctx(env, AS_DOHWAWON_EDITOR).storage();
    const r = ref(storage, "sites/bell_cake/products/cake-1/main.png");
    await assertFails(
      uploadBytes(r, TINY_PNG, { contentType: "image/png" })
    );
  });

  it("17. >10MB 업로드 차단", async () => {
    const storage = ctx(env, AS_DOHWAWON_EDITOR).storage();
    const r = ref(storage, "sites/dohwawon/products/prod-1/huge.png");
    const bigBuf = new Uint8Array(11 * 1024 * 1024); // 11MB
    await assertFails(
      uploadBytes(r, bigBuf, { contentType: "image/png" })
    );
  });

  it("18. non-image 업로드 차단 (image/gif 등)", async () => {
    const storage = ctx(env, AS_DOHWAWON_EDITOR).storage();
    const r = ref(storage, "sites/dohwawon/products/prod-1/danger.gif");
    await assertFails(
      uploadBytes(r, TINY_PNG, { contentType: "image/gif" })
    );
  });

  it("19. dohwawon editor → 본인 사이트 이미지 업로드 가능 (제어군)", async () => {
    const storage = ctx(env, AS_DOHWAWON_EDITOR).storage();
    const r = ref(storage, "sites/dohwawon/products/prod-1/main.png");
    await assertSucceeds(
      uploadBytes(r, TINY_PNG, { contentType: "image/png" })
    );
  });

  it("20. unauthed → 어떤 이미지든 업로드 차단", async () => {
    const storage = ctx(env, null).storage();
    const r = ref(storage, "sites/dohwawon/products/prod-1/anon.png");
    await assertFails(
      uploadBytes(r, TINY_PNG, { contentType: "image/png" })
    );
  });
});

// 제어군: bell_cake editor 도 자기 사이트는 정상 접근
describe("Firestore: 대칭성 검증 (제어군)", () => {
  it("21. bell_cake editor → 본인 사이트 쓰기 가능", async () => {
    await seed(env);
    const db = ctx(env, AS_BELLCAKE_EDITOR).firestore();
    await assertSucceeds(
      setDoc(doc(db, "sites/bell_cake/products/cake-2"), {
        productId: "cake-2",
        name: "케이크",
        price: 40000,
      })
    );
  });
});
