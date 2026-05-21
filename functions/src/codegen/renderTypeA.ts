/**
 * Type A 사이트(dohwawon, bell_cake, PARKHAD)의 data.jsx 생성.
 *
 * 출력:
 *   const HAIR_CATEGORIES = [{ id, name, blurb, sub, icon? }, ...];
 *   const HAIR_STYLES     = { catId: [{ productId, name, price, desc, img, ... }, ...], ... };
 *   const HOME_SECTIONS   = [{ id, type, data }, ...];   // hero / slider / faq
 *   const FAQS            = [{ id, q, a, cat? }, ...];   // FAQ 마스터
 *   const FAQ_CATEGORIES  = [{ id, label }, ...];        // FAQ 분류
 *   Object.assign(window, { HAIR_CATEGORIES, HAIR_STYLES, HOME_SECTIONS, FAQS, FAQ_CATEGORIES });
 *
 * 홈 섹션은 publishToGitHub.ts 에서 사전 정제 (이미지 raw 경로 치환, Firestore 내부 필드 제거)
 * 한 결과를 받아 그대로 직렬화한다.
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
  faqs?: Array<{
    faqId: string;
    question: string;
    answer: string;
    categoryId?: string;
    sortOrder?: number;
    visible?: boolean;
  }>;
  faqCategories?: Array<{ id: string; label: string }>;
}

export function renderTypeA(input: RenderTypeAInput): string {
  const cats = [...input.categories].sort((a, b) => a.sortOrder - b.sortOrder);

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
        // 홈 슬라이더에서 productId 로 찾을 수 있도록 id 도 함께 emit.
        const obj: Record<string, unknown> = {
          productId: p.productId,
          id: p.productId,
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
  const faqBlock = renderFaqsBlock(input.faqs, input.faqCategories);

  const assigns = [
    "HAIR_CATEGORIES",
    "HAIR_STYLES",
    "HOME_SECTIONS",
    "FAQS",
    "FAQ_CATEGORIES",
  ].join(", ");

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
    homeBlock,
    "",
    faqBlock,
    "",
    `Object.assign(window, { ${assigns} });`,
    "",
  ].filter((s) => s !== "").join("\n");
}

/**
 * 홈 섹션 — publishToGitHub 에서 이미 정제한 형태로 받아 직렬화.
 * (이미지 경로는 raw "img/..." 로 치환된 상태)
 */
export function renderHomeSectionsBlock(
  homeSections?: RenderTypeAInput["homeSections"]
): string {
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

  if (enabled.length === 0) return "const HOME_SECTIONS = [];";
  const body = enabled.map((s) => "  " + formatValue(s)).join(",\n");
  return `const HOME_SECTIONS = [\n${body}\n];`;
}

/**
 * FAQ 마스터 + 카테고리.
 */
export function renderFaqsBlock(
  faqs?: RenderTypeAInput["faqs"],
  cats?: RenderTypeAInput["faqCategories"]
): string {
  const items = (faqs ?? [])
    .filter((f) => f.visible !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((f) => ({
      id: f.faqId,
      cat: f.categoryId ?? "",
      q: f.question,
      a: f.answer,
    }));

  const faqsBlock =
    items.length === 0
      ? "const FAQS = [];"
      : `const FAQS = [\n${items.map((x) => "  " + formatValue(x)).join(",\n")}\n];`;

  const catItems = (cats ?? []).map((c) => ({ id: c.id, label: c.label }));
  const catsBlock =
    catItems.length === 0
      ? "const FAQ_CATEGORIES = [];"
      : `const FAQ_CATEGORIES = [\n${catItems.map((x) => "  " + formatValue(x)).join(",\n")}\n];`;

  return `${faqsBlock}\n${catsBlock}`;
}

const SIMPLE_KEY = /^[A-Za-z_][A-Za-z0-9_]*$/;
function jsKey(k: string): string {
  return SIMPLE_KEY.test(k) ? k : JSON.stringify(k);
}
