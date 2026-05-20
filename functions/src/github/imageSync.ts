/**
 * Storage 의 이미지를 Buffer 로 다운로드하여 commit 파일로 변환.
 *
 * 입력: products[].image.{storagePath, repoPath}
 * 출력: [{path: "dohwawon/img/foo.jpg", content: Buffer}, ...]
 */
import { getStorage } from "firebase-admin/storage";
import { logger } from "firebase-functions/v2";
import type { CommitFile } from "./batchCommit";

export interface ImageRefInput {
  storagePath: string;
  repoPath: string;
}

export async function collectImageFiles(
  refs: ImageRefInput[]
): Promise<CommitFile[]> {
  const bucket = getStorage().bucket();
  const out: CommitFile[] = [];

  for (const r of refs) {
    if (!r.storagePath || !r.repoPath) continue;
    try {
      const file = bucket.file(r.storagePath);
      const [exists] = await file.exists();
      if (!exists) {
        logger.warn("imageSync: storage 객체 없음 — skip", { ref: r });
        continue;
      }
      const [content] = await file.download();
      out.push({ path: r.repoPath, content });
    } catch (e) {
      logger.error("imageSync: 다운로드 실패", {
        ref: r,
        error: (e as Error).message,
      });
      throw e;
    }
  }

  return out;
}
