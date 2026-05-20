/**
 * 객체 / 배열 리터럴을 JS 코드 문자열로 직렬화.
 * 키는 따옴표 없이 (식별자 + 단순 영숫자만), 값은 JSON.stringify (한글 유니코드 그대로).
 */

const SIMPLE_KEY = /^[A-Za-z_][A-Za-z0-9_]*$/;

export function formatValue(v: unknown): string {
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  if (typeof v === "string") return JSON.stringify(v);
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) {
    return "[" + v.map((x) => formatValue(x)).join(", ") + "]";
  }
  if (typeof v === "object") {
    const obj = v as Record<string, unknown>;
    const parts: string[] = [];
    for (const [k, val] of Object.entries(obj)) {
      if (val === undefined || val === null) continue;
      const key = SIMPLE_KEY.test(k) ? k : JSON.stringify(k);
      parts.push(`${key}: ${formatValue(val)}`);
    }
    return `{ ${parts.join(", ")} }`;
  }
  return JSON.stringify(v);
}

/**
 * 한 객체를 한 줄로 직렬화 (배열 내 객체들이 한 줄씩 나오도록).
 */
export function formatInline(obj: Record<string, unknown>): string {
  return formatValue(obj);
}
