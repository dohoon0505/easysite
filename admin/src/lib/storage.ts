/**
 * Firebase Storage 업로드 헬퍼 — 진행률 + 자동 리사이즈 URL 대기.
 *
 * 흐름:
 *  1. uploadBytesResumable 로 파일 업로드 (진행률 콜백)
 *  2. 업로드 완료 후 downloadURL 획득
 *  3. Resize Images extension(M4 이후 설치) 이 onFinalize 로 200/400/800 변형 생성
 *  4. onImageFinalize Function 이 product doc.image.thumb/large 를 갱신
 *
 * UI 는 즉시 originalUrl 을 미리보기로 표시하고, thumb/large 가 채워지면
 * onSnapshot 으로 자동 업데이트됨.
 */
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
  type UploadTaskSnapshot,
} from "firebase/storage";
import { storage } from "./firebase";

export interface UploadResult {
  storagePath: string;
  downloadUrl: string;
}

export interface UploadOptions {
  /** 진행률 콜백 (0~100). */
  onProgress?: (percent: number) => void;
  /** 업로드 중 cancel token. fn() 호출 시 작업 취소. */
  onTask?: (task: { cancel: () => void }) => void;
}

export async function uploadProductImage(
  siteId: string,
  productId: string,
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const filename = sanitizeFilename(file.name);
  const storagePath = `sites/${siteId}/products/${productId}/${filename}`;
  const r = ref(storage, storagePath);

  return await new Promise<UploadResult>((resolve, reject) => {
    const task = uploadBytesResumable(r, file, {
      contentType: file.type,
      customMetadata: {
        siteId,
        productId,
        originalName: file.name,
      },
    });

    options.onTask?.({ cancel: () => task.cancel() });

    task.on(
      "state_changed",
      (snap: UploadTaskSnapshot) => {
        const pct =
          snap.totalBytes > 0
            ? Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
            : 0;
        options.onProgress?.(pct);
      },
      (err) => reject(err),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve({ storagePath, downloadUrl: url });
      }
    );
  });
}

export async function deleteStorageObject(storagePath: string): Promise<void> {
  await deleteObject(ref(storage, storagePath));
}

/** 한글·공백 제거하여 안전한 파일명으로 변환. */
export function sanitizeFilename(name: string): string {
  const dot = name.lastIndexOf(".");
  const base = dot >= 0 ? name.slice(0, dot) : name;
  const ext = dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
  const safeBase = base
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  const stamp = Date.now().toString(36);
  return ext ? `${safeBase || "image"}-${stamp}.${ext}` : `${safeBase || "image"}-${stamp}`;
}

/** product.image 객체로부터 srcset 문자열 생성. */
export function srcsetFor(image: {
  thumb?: string | null;
  large?: string | null;
  originalUrl?: string | null;
}): string {
  const parts: string[] = [];
  if (image.thumb) parts.push(`${image.thumb} 400w`);
  if (image.large) parts.push(`${image.large} 800w`);
  if (image.originalUrl) parts.push(`${image.originalUrl} 1600w`);
  return parts.join(", ");
}

/** 미리보기 src — thumb 우선, 없으면 originalUrl, 다 없으면 빈 문자열. */
export function previewSrc(image: {
  thumb?: string | null;
  originalUrl?: string | null;
}): string {
  return image.thumb ?? image.originalUrl ?? "";
}
