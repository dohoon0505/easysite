/**
 * GitHub Git Database API 를 사용해 여러 파일을 단일 커밋으로 묶어 push.
 *
 * 알고리즘:
 *  1) 현재 main 의 latest commit SHA + tree SHA 조회
 *  2) tree 전체를 재귀로 가져와 path → blob SHA 맵 구성
 *  3) 각 파일에 대해 git blob SHA 를 미리 계산하여 변경 여부 판정
 *  4) 변경된 파일만 createBlob → tree entry 로 수집
 *  5) base_tree 기반 새 tree 생성 → commit 생성 → main ref 갱신
 *
 * 변경 사항이 없으면 새 커밋 없이 기존 SHA 반환 (no-op).
 */
import { createHash } from "node:crypto";
import { getOctokit } from "./client";

export interface CommitFile {
  /** repo 루트 기준 상대 경로. 예: "dohwawon/data.jsx" */
  path: string;
  content: Buffer;
}

export interface BatchCommitInput {
  owner: string;
  repo: string;
  branch: string;
  message: string;
  files: CommitFile[];
  /** 삭제할 파일 경로 (선택). M5 기본은 비어 있음. */
  deletions?: string[];
}

export interface BatchCommitResult {
  commitSha: string;
  filesChanged: string[];
  noop: boolean;
}

/** git blob 의 SHA-1 = sha1("blob " + size + "\0" + content). */
function gitBlobSha(content: Buffer): string {
  const header = Buffer.from(`blob ${content.length}\0`);
  return createHash("sha1").update(Buffer.concat([header, content])).digest("hex");
}

export async function batchCommit(
  input: BatchCommitInput
): Promise<BatchCommitResult> {
  const { owner, repo, branch, message, files, deletions = [] } = input;
  const oct = getOctokit();

  // 1) 현재 ref + commit + tree
  const ref = await oct.git.getRef({ owner, repo, ref: `heads/${branch}` });
  const baseCommitSha = ref.data.object.sha;
  const baseCommit = await oct.git.getCommit({
    owner,
    repo,
    commit_sha: baseCommitSha,
  });
  const baseTreeSha = baseCommit.data.tree.sha;

  // 2) tree 전체 재귀 (현재 SHA 맵)
  const baseTree = await oct.git.getTree({
    owner,
    repo,
    tree_sha: baseTreeSha,
    recursive: "true",
  });
  const existing = new Map<string, string>();
  for (const entry of baseTree.data.tree) {
    if (entry.type === "blob" && entry.path && entry.sha) {
      existing.set(entry.path, entry.sha);
    }
  }
  if (baseTree.data.truncated) {
    throw new Error(
      "GitHub tree 결과가 truncated. 저장소가 너무 커서 한 번에 조회 불가."
    );
  }

  // 3) 각 파일 변경 여부 판정 + blob 업로드
  const treeEntries: Array<{
    path: string;
    mode: "100644";
    type: "blob";
    sha: string | null;
  }> = [];
  const filesChanged: string[] = [];

  for (const file of files) {
    const localSha = gitBlobSha(file.content);
    if (existing.get(file.path) === localSha) {
      // 동일 — skip
      continue;
    }
    // Create blob
    const blob = await oct.git.createBlob({
      owner,
      repo,
      content: file.content.toString("base64"),
      encoding: "base64",
    });
    treeEntries.push({
      path: file.path,
      mode: "100644",
      type: "blob",
      sha: blob.data.sha,
    });
    filesChanged.push(file.path);
  }

  for (const delPath of deletions) {
    if (!existing.has(delPath)) continue;
    treeEntries.push({
      path: delPath,
      mode: "100644",
      type: "blob",
      sha: null, // null = 삭제
    });
    filesChanged.push(delPath);
  }

  if (treeEntries.length === 0) {
    return { commitSha: baseCommitSha, filesChanged: [], noop: true };
  }

  // 4) 새 tree 생성
  const newTree = await oct.git.createTree({
    owner,
    repo,
    base_tree: baseTreeSha,
    tree: treeEntries,
  });

  // 5) commit 생성 + ref 갱신
  const newCommit = await oct.git.createCommit({
    owner,
    repo,
    message,
    tree: newTree.data.sha,
    parents: [baseCommitSha],
  });

  await oct.git.updateRef({
    owner,
    repo,
    ref: `heads/${branch}`,
    sha: newCommit.data.sha,
  });

  return {
    commitSha: newCommit.data.sha,
    filesChanged,
    noop: false,
  };
}
