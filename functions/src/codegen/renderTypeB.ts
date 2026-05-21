/**
 * Type B 사이트(flower_example)의 data.jsx 생성.
 *
 * 출력:
 *   const CATEGORIES = [{id, name, blurb, banner, photo, icon, accent, accentBg}, ...];
 *   const SECTIONS = {
 *     tab1: [{kicker, title, tag, items: [{name, price, img, imgLg}, ...]}, ...],
 *     ...
 *   };
 *   Object.assign(window, { CATEGORIES, SECTIONS });
 */
import path from "node:path";
import { formatValue } from "./formatLiteral";

export interface RenderTypeBInput {
  siteName: string;
  siteId: string;
  categories: Array<{
    categoryId: string;
    name: string;
    blurb?: string;
    banner?: string | null;
    photo?: string | null;
    icon?: string | null;
    accent?: string | null;
    accentBg?: string | null;
    sortOrder: number;
  }>;
  sections: Array<{
    sectionId: string;
    categoryId: string;
    kicker: string;
    title: string;
    tag: string;
    sortOrder: number;
  }>;
  products: Array<{
    productId: string;
    name: string;
    price: number;
    categoryId: string;
    sectionId?: string;
    sortOrder: number;
    image?: { repoPath?: string };
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

export function renderTypeB(input: RenderTypeBInput): string {
  const cats = [...input.categories].sort((a, b) => a.sortOrder - b.sortOrder);

  const catsBlock = cats
    .map((c) => {
      const obj: Record<string, unknown> = {
        id: c.categoryId,
        name: c.name,
        blurb: c.blurb ?? "",
      };
      if (c.banner) obj.banner = c.banner;
      if (c.photo) obj.photo = c.photo;
      if (c.icon) obj.icon = c.icon;
      if (c.accent) obj.accent = c.accent;
      if (c.accentBg) obj.accentBg = c.accentBg;
      return "  " + formatValue(obj);
    })
    .join(",\n");

  // sections 를 categoryId 별로 그룹
  const sectionsByCat: Record<string, RenderTypeBInput["sections"]> = {};
  for (const c of cats) sectionsByCat[c.categoryId] = [];
  for (const s of input.sections) {
    if (sectionsByCat[s.categoryId]) sectionsByCat[s.categoryId].push(s);
  }
  for (const cid of Object.keys(sectionsByCat)) {
    sectionsByCat[cid].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  // products 를 sectionId 별로 그룹
  const prodBySection: Record<string, RenderTypeBInput["products"]> = {};
  for (const p of input.products) {
    const k = p.sectionId ?? "";
    if (!prodBySection[k]) prodBySection[k] = [];
    prodBySection[k].push(p);
  }
  for (const k of Object.keys(prodBySection)) {
    prodBySection[k].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  const sectionsBlock = cats
    .map((c) => {
      const secs = sectionsByCat[c.categoryId] ?? [];
      const inner = secs.map((s) => {
        const items = (prodBySection[s.sectionId] ?? []).map((p) => {
          const imgPath = p.image?.repoPath
            ? "img/" + path.basename(p.image.repoPath)
            : "";
          return formatValue({
            productId: p.productId,
            id: p.productId,
            name: p.name,
            price: p.price,
            img: imgPath,
          });
        }).join(", ");
        return `    { kicker: ${JSON.stringify(s.kicker)}, title: ${JSON.stringify(s.title)}, tag: ${JSON.stringify(s.tag)}, items: [${items}] }`;
      }).join(",\n");
      return `  ${jsKey(c.categoryId)}: [\n${inner}\n  ]`;
    })
    .join(",\n");

  const homeBlock = renderHomeBlockB(input.homeSections);
  const faqBlock = renderFaqBlockB(input.faqs, input.faqCategories);

  const assigns = ["CATEGORIES", "SECTIONS", "HOME_SECTIONS", "FAQS", "FAQ_CATEGORIES"].join(", ");

  return [
    "/* eslint-disable */",
    `// ${input.siteName} — 상품 카탈로그 (자동 생성: publishToGitHub)`,
    "",
    "const CATEGORIES = [",
    catsBlock,
    "];",
    "",
    "const SECTIONS = {",
    sectionsBlock,
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

function renderHomeBlockB(homeSections?: RenderTypeBInput["homeSections"]): string {
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

function renderFaqBlockB(
  faqs?: RenderTypeBInput["faqs"],
  cats?: RenderTypeBInput["faqCategories"]
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
