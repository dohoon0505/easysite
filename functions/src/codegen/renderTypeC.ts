/**
 * Type C 사이트(greenlight_art)의 data.jsx 생성.
 *
 * 출력:
 *   const COURSE_CATEGORIES = [...];
 *   const COURSES = {catId: [{name, age, per, weekly, desc, tag, img}], ...};
 *   const TECH_CATEGORIES = [{id, name, hue, blurb, learns}, ...];
 *   Object.assign(window, { COURSE_CATEGORIES, COURSES, TECH_CATEGORIES });
 */
import path from "node:path";
import { formatValue } from "./formatLiteral";

export interface RenderTypeCInput {
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
    price?: number;
    desc?: string;
    categoryId: string;
    sortOrder: number;
    image?: { repoPath?: string };
    age?: string | null;
    per?: number | null;
    weekly?: string | null;
    tag?: string | null;
  }>;
  tech: Array<{
    techId: string;
    name: string;
    hue?: string;
    blurb?: string;
    learns?: string;
    sortOrder: number;
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

export function renderTypeC(input: RenderTypeCInput): string {
  const cats = [...input.categories].sort((a, b) => a.sortOrder - b.sortOrder);

  const courseCatsBlock = cats
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

  // products 를 categoryId 별로 그룹
  const byCat: Record<string, RenderTypeCInput["products"]> = {};
  for (const c of cats) byCat[c.categoryId] = [];
  for (const p of input.products) {
    if (byCat[p.categoryId]) byCat[p.categoryId].push(p);
  }
  for (const cid of Object.keys(byCat)) {
    byCat[cid].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  const coursesBlock = cats
    .map((c) => {
      const items = (byCat[c.categoryId] ?? []).map((p) => {
        const imgPath = p.image?.repoPath
          ? "img/" + path.basename(p.image.repoPath)
          : "";
        const obj: Record<string, unknown> = {
          productId: p.productId,
          id: p.productId,
          name: p.name,
        };
        if (p.age) obj.age = p.age;
        if (typeof p.per === "number") obj.per = p.per;
        if (p.weekly) obj.weekly = p.weekly;
        obj.desc = p.desc ?? "";
        if (p.tag) obj.tag = p.tag;
        if (imgPath) obj.img = imgPath;
        return "    " + formatValue(obj);
      }).join(",\n");
      return `  ${jsKey(c.categoryId)}: [\n${items}\n  ]`;
    })
    .join(",\n");

  const techBlock = [...input.tech]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((t) => {
      return "  " + formatValue({
        id: t.techId,
        name: t.name,
        hue: t.hue ?? "",
        blurb: t.blurb ?? "",
        learns: t.learns ?? "",
      });
    })
    .join(",\n");

  const homeBlock = renderHomeBlockC(input.homeSections);
  const faqBlock = renderFaqBlockC(input.faqs, input.faqCategories);

  const assigns = [
    "COURSE_CATEGORIES",
    "COURSES",
    "TECH_CATEGORIES",
    "HOME_SECTIONS",
    "FAQS",
    "FAQ_CATEGORIES",
  ].join(", ");

  return [
    "/* eslint-disable */",
    `// ${input.siteName} — 교육과정 카탈로그 (자동 생성: publishToGitHub)`,
    "",
    "const COURSE_CATEGORIES = [",
    courseCatsBlock,
    "];",
    "",
    "const COURSES = {",
    coursesBlock,
    ",",
    "};",
    "",
    "const TECH_CATEGORIES = [",
    techBlock,
    "];",
    "",
    homeBlock,
    "",
    faqBlock,
    "",
    `Object.assign(window, { ${assigns} });`,
    "",
  ].filter((s) => s !== "").join("\n");
}

function renderHomeBlockC(homeSections?: RenderTypeCInput["homeSections"]): string {
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

function renderFaqBlockC(
  faqs?: RenderTypeCInput["faqs"],
  cats?: RenderTypeCInput["faqCategories"]
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
