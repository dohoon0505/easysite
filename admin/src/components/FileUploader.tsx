/**
 * FileUploader — Spec: desgin_system/components/file-uploader.schema.json
 *
 * 사용처: ProductEdit (단일 이미지).
 * 모바일에서 카메라 직접 촬영 (capture=environment) + 사진 앨범 선택 지원.
 */
import { useRef, type ReactNode } from "react";
import clsx from "clsx";

export interface FileUploaderProps {
  /** accept 속성. 기본은 이미지. */
  accept?: string;
  multiple?: boolean;
  /** 모바일에서 카메라 진입. accept 가 이미지일 때만 의미 있음. */
  cameraCapture?: boolean;
  disabled?: boolean;
  onFiles: (files: FileList) => void;
  /** 진행률 0~100 (단일 파일 업로드 중). null 이면 미표시. */
  progress?: number | null;
  /** 드롭존 안에 보여줄 컨텐츠 (미리보기 등). */
  children?: ReactNode;
  className?: string;
}

export function FileUploader({
  accept = "image/jpeg,image/png,image/webp",
  multiple = false,
  cameraCapture = false,
  disabled = false,
  onFiles,
  progress = null,
  children,
  className,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFiles(e.dataTransfer.files);
    }
  }

  return (
    <div
      className={clsx("fup", disabled && "fup--disabled", className)}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) e.dataTransfer.dropEffect = "copy";
      }}
      onDrop={handleDrop}
    >
      {children ?? (
        <div className="fup-placeholder">
          <p style={{ font: "var(--text-body-sm)", color: "var(--sm-content-secondary)" }}>
            이미지를 드래그하거나 아래 버튼을 누르세요
          </p>
          <p style={{ font: "var(--text-caption)", color: "var(--sm-content-tertiary)" }}>
            JPEG · PNG · WEBP, 최대 10MB
          </p>
        </div>
      )}

      <div className="fup-actions">
        <button
          type="button"
          className="btn btn-outline btn-md"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          파일 선택
        </button>
        {cameraCapture && (
          <button
            type="button"
            className="btn btn-secondary btn-md"
            disabled={disabled}
            onClick={() => cameraInputRef.current?.click()}
          >
            카메라 촬영
          </button>
        )}
      </div>

      {progress !== null && progress >= 0 && progress < 100 && (
        <div className="fup-progress" aria-label="업로드 진행률">
          <div className="fup-progress-bar" style={{ width: `${progress}%` }} />
          <span className="fup-progress-text">{progress}%</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) onFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {cameraCapture && (
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) onFiles(e.target.files);
            e.target.value = "";
          }}
        />
      )}
    </div>
  );
}
