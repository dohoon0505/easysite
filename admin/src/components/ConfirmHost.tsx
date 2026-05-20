/**
 * ConfirmHost — useConfirm() 요청을 받아 ResponsiveModal 로 표시.
 * App shell 한 곳에서 마운트.
 */
import { Button } from "./Button";
import { ResponsiveModal } from "./ResponsiveModal";
import { useConfirmHost } from "@/hooks/useConfirm";

export function ConfirmHost() {
  const { current, resolve } = useConfirmHost();

  return (
    <ResponsiveModal
      open={current !== null}
      onClose={() => resolve(false)}
      title={current?.title}
      tone={current?.tone === "danger" ? "destructive" : "neutral"}
      forceModal
      footer={
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button
            variant="ghost"
            size="md"
            onClick={() => resolve(false)}
          >
            {current?.cancelText ?? "취소"}
          </Button>
          <Button
            variant={current?.tone === "danger" ? "danger" : "primary"}
            size="md"
            onClick={() => resolve(true)}
            autoFocus
          >
            {current?.confirmText ?? "확인"}
          </Button>
        </div>
      }
    >
      {current?.message && (
        <p style={{ font: "var(--text-body-md)", color: "var(--sm-content-secondary)" }}>
          {current.message}
        </p>
      )}
    </ResponsiveModal>
  );
}
