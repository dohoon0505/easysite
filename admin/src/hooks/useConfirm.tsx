/**
 * useConfirm — 파괴적 작업 전 사용자 확인.
 *
 * 사용 예:
 *   const confirm = useConfirm();
 *   if (await confirm({ title: "삭제하시겠습니까?", tone: "danger" })) {
 *     await deleteProduct(...);
 *   }
 *
 * Dialog 컴포넌트가 마운트된 후 사용 가능 — App shell 에 <ConfirmHost /> 추가.
 */
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

export interface ConfirmRequest {
  title: string;
  message?: string;
  tone?: "neutral" | "danger";
  confirmText?: string;
  cancelText?: string;
}

type Resolver = (ok: boolean) => void;

interface ConfirmCtx {
  ask: (req: ConfirmRequest) => Promise<boolean>;
  current: ConfirmRequest | null;
  resolve: (ok: boolean) => void;
}

const Ctx = createContext<ConfirmCtx | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<ConfirmRequest | null>(null);
  const resolverRef = useRef<Resolver | null>(null);

  const ask = useCallback((req: ConfirmRequest) => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setCurrent(req);
    });
  }, []);

  const resolve = useCallback((ok: boolean) => {
    const r = resolverRef.current;
    resolverRef.current = null;
    setCurrent(null);
    if (r) r(ok);
  }, []);

  return (
    <Ctx.Provider value={{ ask, current, resolve }}>{children}</Ctx.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("ConfirmProvider 가 트리 상위에 없습니다.");
  return ctx.ask;
}

/** ConfirmProvider 내부에서 현재 활성 요청과 resolver 를 가져오는 hook. ConfirmHost 컴포넌트가 사용. */
export function useConfirmHost() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("ConfirmProvider 가 트리 상위에 없습니다.");
  return { current: ctx.current, resolve: ctx.resolve };
}
