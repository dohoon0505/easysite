/**
 * Type C 파서 — greenlight_art.
 *
 * 입력:
 *   window.COURSE_CATEGORIES: [{id, name, blurb, sub, icon}]
 *   window.COURSES: { [catId]: [{name, age, per, weekly, desc, tag, img}] }
 *   window.TECH_CATEGORIES: [{id, name, hue, blurb, learns}]
 *
 * 출력: { categories, products, tech }
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadDataJsx } from "./loadDataJsx.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function parseTypeC(siteId) {
  const dataPath = path.resolve(__dirname, "../..", siteId, "data.jsx");
  const win = loadDataJsx(dataPath);

  const courseCats = win.COURSE_CATEGORIES;
  const courses = win.COURSES;
  const techCats = win.TECH_CATEGORIES;
  if (!Array.isArray(courseCats) || !courses) {
    throw new Error(`${siteId}: COURSE_CATEGORIES / COURSES 가 비어 있습니다.`);
  }

  const categories = courseCats.map((c, idx) => ({
    categoryId: c.id,
    name: c.name,
    blurb: c.blurb ?? "",
    sub: c.sub ?? "",
    icon: c.icon ?? null,
    sortOrder: idx * 10,
    visible: true,
    status: "live",
  }));

  const products = [];
  let globalIdx = 0;
  for (const cat of courseCats) {
    const list = courses[cat.id] ?? [];
    list.forEach((p, idx) => {
      const productId = `${cat.id}-${idx + 1}`;
      const filename = path.basename(p.img ?? "");
      products.push({
        productId,
        name: p.name,
        price: typeof p.per === "number" ? p.per * 10000 : 0, // per 단위가 만원 단위, 정수 가격으로 보관
        desc: p.desc ?? "",
        categoryId: cat.id,
        image: {
          storagePath: filename
            ? `sites/${siteId}/products/${productId}/${filename}`
            : "",
          thumb: null,
          large: null,
          originalUrl: null,
          repoPath: filename ? `${siteId}/img/${filename}` : "",
        },
        // Type C 확장:
        age: p.age ?? null,
        per: typeof p.per === "number" ? p.per : null,
        weekly: p.weekly ?? null,
        tag: p.tag ?? null,
        visible: true,
        sortOrder: globalIdx * 10,
        status: "live",
        _sourceImg: p.img ?? null,
      });
      globalIdx++;
    });
  }

  const tech = (techCats ?? []).map((t, idx) => ({
    techId: t.id,
    name: t.name,
    hue: t.hue ?? "",
    blurb: t.blurb ?? "",
    learns: t.learns ?? "",
    sortOrder: idx * 10,
    visible: true,
    status: "live",
  }));

  return { categories, products, tech };
}
