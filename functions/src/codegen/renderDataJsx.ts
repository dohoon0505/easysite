/**
 * data.jsx 생성 진입점. 사이트 타입에 따라 분기.
 */
import { renderTypeA, type RenderTypeAInput } from "./renderTypeA";
import { renderTypeB, type RenderTypeBInput } from "./renderTypeB";
import { renderTypeC, type RenderTypeCInput } from "./renderTypeC";
import { formatValue } from "./formatLiteral";

export type SiteType = "typeA" | "typeB" | "typeC";

export interface SiteInfo {
  phone?: string;
  kakaoChannel?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export function renderDataJsx(
  siteType: SiteType,
  data: (RenderTypeAInput | RenderTypeBInput | RenderTypeCInput) & { siteInfo?: SiteInfo }
): string {
  let body: string;
  switch (siteType) {
    case "typeA":
      body = renderTypeA(data as RenderTypeAInput);
      break;
    case "typeB":
      body = renderTypeB(data as RenderTypeBInput);
      break;
    case "typeC":
      body = renderTypeC(data as RenderTypeCInput);
      break;
    default:
      throw new Error(`알 수 없는 siteType: ${siteType}`);
  }

  // 모든 사이트 타입 공통 — SITE_INFO 주입 (전화/플친/OG)
  const info = data.siteInfo ?? {};
  const infoBlock = [
    "const SITE_INFO = " + formatValue({
      phone: info.phone ?? "",
      kakaoChannel: info.kakaoChannel ?? "",
      ogTitle: info.ogTitle ?? "",
      ogDescription: info.ogDescription ?? "",
      ogImage: info.ogImage ?? "",
    }) + ";",
    "Object.assign(window, { SITE_INFO });",
  ].join("\n");

  return body + "\n" + infoBlock + "\n";
}
