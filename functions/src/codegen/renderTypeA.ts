/**
 * Type A 사이트(dohwawon, bell_cake, PARKHAD)의 data.jsx 생성.
 *
 * 출력 형식 (기존 파일과 매칭):
 *   const HAIR_CATEGORIES = [...];
 *   const HAIR_STYLES = { catId: [{...}, ...], ... };
 *   Object.assign(window, { HAIR_CATEGORIES, HAIR_STYLES });
 */
import path from "node:path";
import { formatValue } from "./formatLiteral";

export interface RenderTypeAInput {
  siteName: string;
  siteId: string;
  categories: Array<{
    categoryId: string;
    name: string;
    blurb?: string;
    sub?: string;
    icon?: string | null;
    sortOrder: number;
  }>;
  products: Array<{
    productId: string;
    name: string;
    price: number;
    desc?: string;
    categoryId: string;
    sortOrder: number;
    image?: { repoPath?: string };
    sizeId?: string | null;
    flavorId?: string | null;
    time?: number | null;
    tag?: string | null;
  }>;
  homeSections?: Array<{
    sectionId: string;
    type: string;
    title?: string;
    icon?: string;
    enabled?: boolean;
    sortOrder: number;
    data?: Record<string, unknown>;
  }>;
}

export function renderTypeA(input: RenderTypeAInput): string {
  // 카테고리: sortOrder 오름차순
  const cats = [...input.categories].sort((a, b) => a.sortOrder - b.sortOrder);

  // 카테고리별 상품 그룹
  const byCat: Record<string, RenderTypeAInput["products"]> = {};
  for (const c of cats) byCat[c.categoryId] = [];
  for (const p of input.products) {
    if (byCat[p.categoryId]) byCat[p.categoryId].push(p);
  }
  for (const cid of Object.keys(byCat)) {
    byCat[cid].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  const catsBlock = cats
    .map((c) => {
      const obj: Record<string, unknown> = {
        id: c.categoryId,
        name: c.name,
        blurb: c.blurb ?? "",
        sub: c.sub ?? "",
      };
      if (c.icon) obj.icon = c.icon;
      return "  " + formatValue(obj);
    })
    .join(",\n");

  const stylesBlock = cats
    .map((c) => {
      const items = (byCat[c.categoryId] ?? []).map((p) => {
        const imgPath = p.image?.repoPath
          ? "img/" + path.basename(p.image.repoPath)
          : "";
        const obj: Record<string, unknown> = {
          name: p.name,
          price: p.price,
          desc: p.desc ?? "",
        };
        if (typeof p.time === "number") obj.time = p.time;
        if (p.tag) obj.tag = p.tag;
        if (imgPath) obj.img = imgPath;
        if (p.sizeId) obj.sizeId = p.sizeId;
        if (p.flavorId) obj.flavorId = p.flavorId;
        obj.categoryName = c.name;
        return "    " + formatValue(obj);
      }).join(",\n");
      return `  ${jsKey(c.categoryId)}: [\n${items}\n  ]`;
    })
    .join(",\n");

  const homeBlock = renderHomeSectionsBlock(input.homeSections);

  return [
    "/* eslint-disable */",
    `// ${input.siteName} — 상품 카탈로그 (자동 생성: publishToGitHub)`,
    "",
    "const HAIR_CATEGORIES = [",
    catsBlock,
    "];",
    "",
    "const HAIR_STYLES = {",
    stylesBlock,
    ",",
    "};",
    "",
    homeBlock.declaration,
    homeBlock.assign,
    "",
  ].filter((s) => s !== "").join("\n");
}

/**
 * 홈 섹션 선언 + window 노출 코드 생성.
 * 섹션이 없으면 빈 객체 export. 사이트가 안전하게 window.HOME_SECTIONS 를 참조 가능.
 */
export function renderHomeSectionsBlock(
  homeSections?: RenderTypeAInput["homeSections"]
): { declaration: string; assign: string } {
  const enabled = (homeSections ?? [])
    .filter((s) => s.enabled !== false)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((s) => ({
      id: s.sectionId,
      type: s.type,
      title: s.title ?? "",
      icon: s.icon ?? null,
      data: s.data ?? {},
    }));

  const arrayBody = enabled.map((s) => "  " + formatValue(s)).join(",\n");
  const declaration =
    enabled.length === 0
      ? "const HOME_SECTIONS = [];"
      : `const HOME_SECTIONS = [\n${arrayBody}\n];`;
  const assign = "Object.assign(window, { HAIR_CATEGORIES, HAIR_STYLES, HOME_SECTIONS });";
  return { declaration, assign };
}

const SIMPLE_KEY = /^[A-Za-z_][A-Za-z0-9_]*$/;
function jsKey(k: string): string {
  return SIMPLE_KEY.test(k) ? k : JSON.stringify(k);
}
