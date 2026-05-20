/**
 * Type B 파서 — flower_example.
 *
 * 입력: window.CATEGORIES + window.SECTIONS
 *   CATEGORIES: [{id, name, blurb, banner, photo, icon, accent, accentBg}]
 *   SECTIONS: { [catId]: [{kicker, title, tag, items: [{name, price, img, imgLg}]}] }
 *
 * 출력: { categories, products, sections }
 * - 각 SECTIONS[catId][si] → sections/{sectionId} doc
 * - 각 items[i] → products/{productId} doc (sectionId 로 묶임)
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadDataJsx } from "./loadDataJsx.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function parseTypeB(siteId) {
  const dataPath = path.resolve(__dirname, "../..", siteId, "data.jsx");
  const win = loadDataJsx(dataPath);

  const cats = win.CATEGORIES;
  const sectionsByCat = win.SECTIONS;
  if (!Array.isArray(cats) || !sectionsByCat) {
    throw new Error(`${siteId}: CATEGORIES / SECTIONS 가 비어 있습니다.`);
  }

  const categories = cats.map((c, idx) => ({
    categoryId: c.id,
    name: c.name,
    blurb: c.blurb ?? "",
    sub: c.name, // Type B 는 sub 가 따로 없으니 name 으로 채움
    icon: c.icon ?? null,
    banner: c.banner ?? null,
    photo: c.photo ?? null,
    accent: c.accent ?? null,
    accentBg: c.accentBg ?? null,
    sortOrder: idx * 10,
    visible: true,
    status: "live",
  }));

  const sections = [];
  const products = [];
  let productGlobalIdx = 0;
  let sectionGlobalIdx = 0;

  for (const cat of cats) {
    const cs = sectionsByCat[cat.id] ?? [];
    cs.forEach((sec, sIdx) => {
      const sectionId = `${cat.id}-s${sIdx + 1}`;
      sections.push({
        sectionId,
        categoryId: cat.id,
        kicker: sec.kicker ?? "",
        title: sec.title ?? "",
        tag: sec.tag ?? "",
        sortOrder: sectionGlobalIdx * 10,
        visible: true,
        status: "live",
      });
      sectionGlobalIdx++;

      (sec.items ?? []).forEach((item, iIdx) => {
        const productId = `${cat.id}-s${sIdx + 1}-${iIdx + 1}`;
        const filename = path.basename(item.img ?? "");
        const filenameLg = item.imgLg ? path.basename(item.imgLg) : null;
        products.push({
          productId,
          name: item.name,
          price: item.price,
          desc: sec.title ?? "", // Type B 는 desc 가 따로 없어 section title 사용
          categoryId: cat.id,
          sectionId,
          image: {
            storagePath: filename
              ? `sites/${siteId}/products/${productId}/${filename}`
              : "",
            thumb: null,
            large: null,
            originalUrl: null,
            repoPath: filename ? `${siteId}/img/${filename}` : "",
          },
          visible: true,
          sortOrder: productGlobalIdx * 10,
          status: "live",
          _sourceImg: item.img ?? null,
          _sourceImgLg: item.imgLg ?? null,
          _sourceImgLgFilename: filenameLg,
        });
        productGlobalIdx++;
      });
    });
  }

  return { categories, products, sections };
}
