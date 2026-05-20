/**
 * data.jsx 생성 진입점. 사이트 타입에 따라 분기.
 */
import { renderTypeA, type RenderTypeAInput } from "./renderTypeA";
import { renderTypeB, type RenderTypeBInput } from "./renderTypeB";
import { renderTypeC, type RenderTypeCInput } from "./renderTypeC";

export type SiteType = "typeA" | "typeB" | "typeC";

export function renderDataJsx(
  siteType: SiteType,
  data: RenderTypeAInput | RenderTypeBInput | RenderTypeCInput
): string {
  switch (siteType) {
    case "typeA":
      return renderTypeA(data as RenderTypeAInput);
    case "typeB":
      return renderTypeB(data as RenderTypeBInput);
    case "typeC":
      return renderTypeC(data as RenderTypeCInput);
    default:
      throw new Error(`알 수 없는 siteType: ${siteType}`);
  }
}
