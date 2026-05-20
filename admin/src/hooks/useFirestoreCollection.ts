/**
 * Firestore 컬렉션 실시간 구독 hook.
 * 의존성 배열의 값이 바뀌면 자동으로 재구독.
 */
import { useEffect, useState } from "react";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * @param subscribe `(onNext, onErr) => unsubscribe` 형태 함수. 의존성에 따라 메모이즈.
 * @param deps 의존성 배열 (subscribe 가 의존하는 외부 값들).
 */
export function useSubscribed<T>(
  subscribe: (
    onNext: (data: T) => void,
    onErr?: (e: Error) => void
  ) => () => void,
  deps: ReadonlyArray<unknown>
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    setState((s) => ({ ...s, loading: true }));
    const unsub = subscribe(
      (data) => setState({ data, loading: false, error: null }),
      (err) => setState({ data: null, loading: false, error: err })
    );
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
