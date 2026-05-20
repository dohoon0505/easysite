/**
 * data.jsx 파일을 Node VM sandbox 에서 실행하여 globals 를 수집.
 *
 * 5개 사이트 모두 동일한 패턴:
 *   const FOO = [...];
 *   const BAR = {...};
 *   Object.assign(window, { FOO, BAR });
 *
 * JSX 표현식은 없고 순수 literal 만 있으므로 vm 으로 안전하게 실행 가능.
 */
import { readFileSync } from "node:fs";
import vm from "node:vm";

/**
 * @param {string} filePath 절대 또는 상대 경로
 * @returns {Record<string, unknown>} window 객체 — 사이트 데이터 globals
 */
export function loadDataJsx(filePath) {
  const source = readFileSync(filePath, "utf8");

  // sandbox 에 window 스텁 제공
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);

  try {
    vm.runInContext(source, sandbox, {
      filename: filePath,
      timeout: 5000,
    });
  } catch (e) {
    throw new Error(`data.jsx 파싱 실패 (${filePath}): ${(e instanceof Error ? e.message : String(e))}`);
  }

  return sandbox.window;
}
