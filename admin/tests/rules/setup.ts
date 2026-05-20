import { readFileSync } from "node:fs";
import path from "node:path";
import {
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";

const PROJECT_ID = "easysite-rules-test";

/**
 * Boot a Firestore + Storage rules test environment with the actual
 * firestore.rules and storage.rules from the repo root.
 *
 * Each test file calls this once in beforeAll; clears data between tests.
 */
export async function createTestEnv(): Promise<RulesTestEnvironment> {
  const repoRoot = path.resolve(__dirname, "../../..");
  return await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync(path.join(repoRoot, "firestore.rules"), "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
    storage: {
      rules: readFileSync(path.join(repoRoot, "storage.rules"), "utf8"),
      host: "127.0.0.1",
      port: 9199,
    },
  });
}

/**
 * Helpers for creating authenticated/unauthenticated test contexts.
 * Custom claims (`role`, `siteId`) match the production Auth claims shape.
 */
export interface TestAuth {
  uid: string;
  role: "super" | "owner" | "editor";
  siteId: string | null;
}

export function ctx(env: RulesTestEnvironment, auth: TestAuth | null) {
  if (!auth) return env.unauthenticatedContext();
  return env.authenticatedContext(auth.uid, {
    role: auth.role,
    siteId: auth.siteId,
  });
}

// 자주 쓰는 가상 사용자
export const AS_SUPER: TestAuth = {
  uid: "super-1",
  role: "super",
  siteId: null,
};

export const AS_DOHWAWON_EDITOR: TestAuth = {
  uid: "editor-dohwawon",
  role: "editor",
  siteId: "dohwawon",
};

export const AS_BELLCAKE_EDITOR: TestAuth = {
  uid: "editor-bell_cake",
  role: "editor",
  siteId: "bell_cake",
};

// claim 없는 토큰 (signOut 직후 흉내)
export const AS_NO_CLAIM: TestAuth = {
  uid: "no-claim",
  role: "editor",
  siteId: null,
};
