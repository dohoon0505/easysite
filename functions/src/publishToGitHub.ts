/**
 * publishToGitHub — Firestore 드래프트(status=live) 데이터를 사이트 별
 * data.jsx + 이미지로 합쳐 GitHub main 에 단일 커밋으로 푸시.
 *
 * 실행 주체: 슈퍼 어드민 또는 site claim 보유 editor.
 * 호출: admin SPA 의 PublishCenter 페이지 → httpsCallable("publishToGitHub").
 *
 * 락: sites/{siteId}/locks/publish 에 transaction 으로 holder 기록. 동시 발행 방지.
 */
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { auth as adminAuth, db, FieldValue } from "./admin";
import { GITHUB_PAT } from "./github/client";
import { batchCommit, type CommitFile } from "./github/batchCommit";
import { collectImageFiles } from "./github/imageSync";
import { renderDataJsx, type SiteType } from "./codegen/renderDataJsx";

interface PublishRequest {
  siteId: string;
  note?: string;
}

interface PublishResult {
  commitSha: string;
  snapshotId: string;
  filesChanged: number;
  noop: boolean;
}

export const publishToGitHub = onCall<PublishRequest>(
  { secrets: [GITHUB_PAT], timeoutSeconds: 540, memory: "512MiB" },
  async (req): Promise<PublishResult> => {
    // ─── 1. 인증 ───────────────────────────────────────
    const token = req.auth?.token;
    if (!token) {
      throw new HttpsError("unauthenticated", "로그인이 필요합니다.");
    }
    const { siteId, note } = req.data;
    if (!siteId) throw new HttpsError("invalid-argument", "siteId 필수");

    if (token.role !== "super" && token.siteId !== siteId) {
      throw new HttpsError("permission-denied", "사이트 접근 권한 없음");
    }

    // ─── 2. 사이트 메타 로드 ──────────────────────────
    const siteSnap = await db.doc(`sites/${siteId}`).get();
    if (!siteSnap.exists) {
      throw new HttpsError("not-found", `사이트 ${siteId} 없음`);
    }
    const site = siteSnap.data() as {
      name: string;
      siteType: SiteType;
      github: {
        owner: string;
        repo: string;
        branch: string;
        sitePath: string;
      };
    };
    if (!site.github?.owner) {
      throw new HttpsError("failed-precondition", "site.github 설정 누락");
    }

    // ─── 3. 발행 락 ────────────────────────────────────
    const lockRef = db.doc(`sites/${siteId}/locks/publish`);
    const uid = req.auth!.uid;
    await db.runTransaction(async (tx) => {
      const lockSnap = await tx.get(lockRef);
      if (lockSnap.exists) {
        const data = lockSnap.data()!;
        const ageMs = Date.now() - (data.at?.toMillis?.() ?? 0);
        // 10분 이상 묶여 있으면 stale 로 간주하고 덮어쓰기
        if (data.holderUid !== uid && ageMs < 10 * 60 * 1000) {
          throw new HttpsError("aborted", "다른 사용자가 발행 중입니다.");
        }
      }
      tx.set(lockRef, { holderUid: uid, at: FieldValue.serverTimestamp() });
    });

    try {
      // ─── 4. live 데이터 수집 ────────────────────────
      const [catSnap, prodSnap] = await Promise.all([
        db
          .collection(`sites/${siteId}/categories`)
          .where("status", "==", "live")
          .get(),
        db
          .collection(`sites/${siteId}/products`)
          .where("status", "==", "live")
          .get(),
      ]);

      const categories = catSnap.docs.map((d) => d.data() as Record<string, unknown>);
      const products = prodSnap.docs.map((d) => d.data() as Record<string, unknown>);

      let sections: Record<string, unknown>[] | undefined;
      let tech: Record<string, unknown>[] | undefined;

      if (site.siteType === "typeB") {
        const secSnap = await db
          .collection(`sites/${siteId}/sections`)
          .where("status", "==", "live")
          .get();
        sections = secSnap.docs.map((d) => d.data() as Record<string, unknown>);
      }
      if (site.siteType === "typeC") {
        const techSnap = await db
          .collection(`sites/${siteId}/tech`)
          .where("status", "==", "live")
          .get();
        tech = techSnap.docs.map((d) => d.data() as Record<string, unknown>);
      }

      logger.info("publishToGitHub: data loaded", {
        siteId,
        siteType: site.siteType,
        categories: categories.length,
        products: products.length,
        sections: sections?.length,
        tech: tech?.length,
      });

      // ─── 5. data.jsx 생성 ───────────────────────────
      const dataJsxText = renderDataJsx(site.siteType, {
        siteName: site.name,
        siteId,
        categories,
        products,
        sections,
        tech,
      } as unknown as Parameters<typeof renderDataJsx>[1]);

      const dataJsxPath = `${site.github.sitePath}/data.jsx`;

      // ─── 6. 이미지 다운로드 ─────────────────────────
      const imageRefs = products
        .map((p) => {
          const img = (p as { image?: { storagePath?: string; repoPath?: string } }).image;
          if (!img?.storagePath || !img?.repoPath) return null;
          return { storagePath: img.storagePath, repoPath: img.repoPath };
        })
        .filter((x): x is { storagePath: string; repoPath: string } => x !== null);
      const imageFiles = await collectImageFiles(imageRefs);
      logger.info("publishToGitHub: images collected", {
        siteId,
        count: imageFiles.length,
      });

      // ─── 7. 단일 커밋으로 push ──────────────────────
      const files: CommitFile[] = [
        { path: dataJsxPath, content: Buffer.from(dataJsxText, "utf8") },
        ...imageFiles,
      ];

      const commitMessage =
        `[admin] ${site.name} 카탈로그 발행 — ${categories.length}개 카테고리 · ${products.length}개 상품` +
        (note ? ` (${note})` : "");

      const commitResult = await batchCommit({
        owner: site.github.owner,
        repo: site.github.repo,
        branch: site.github.branch,
        message: commitMessage,
        files,
      });

      logger.info("publishToGitHub: commit result", {
        siteId,
        ...commitResult,
      });

      // ─── 8. publishes/{publishId} 기록 ──────────────
      const publishId = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .replace(/Z$/, "");

      const callerEmail =
        (req.auth!.token.email as string | undefined) ??
        (await adminAuth.getUser(uid)).email ??
        "";

      await db.doc(`sites/${siteId}/publishes/${publishId}`).set({
        publishId,
        publishedBy: uid,
        publishedEmail: callerEmail,
        publishedAt: FieldValue.serverTimestamp(),
        commitSha: commitResult.commitSha,
        filesChanged: commitResult.filesChanged,
        counts: {
          categories: categories.length,
          products: products.length,
          sections: sections?.length ?? 0,
          tech: tech?.length ?? 0,
        },
        note: note ?? null,
        noop: commitResult.noop,
      });

      await db.doc(`sites/${siteId}`).update({
        lastPublishedAt: FieldValue.serverTimestamp(),
        lastPublishCommit: commitResult.commitSha,
        updatedAt: FieldValue.serverTimestamp(),
      });

      // ─── 9. auditLog 기록 ───────────────────────────
      await db.collection("auditLogs").add({
        siteId,
        uid,
        email: callerEmail,
        action: "publish",
        collection: "publishes",
        docPath: `sites/${siteId}/publishes/${publishId}`,
        after: {
          commitSha: commitResult.commitSha,
          counts: {
            categories: categories.length,
            products: products.length,
          },
        },
        at: FieldValue.serverTimestamp(),
      });

      return {
        commitSha: commitResult.commitSha,
        snapshotId: publishId,
        filesChanged: commitResult.filesChanged.length,
        noop: commitResult.noop,
      };
    } finally {
      // ─── 10. 락 해제 ─────────────────────────────────
      await lockRef.delete().catch((e) => {
        logger.warn("락 해제 실패 (무시 가능)", { error: (e as Error).message });
      });
    }
  }
);
