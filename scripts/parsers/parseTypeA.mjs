/**
 * Type A 파서 — dohwawon, bell_cake, PARKHAD.
 *
 * 입력: window.HAIR_CATEGORIES + window.HAIR_STYLES
 * 출력: { categories: [...], products: [...] }
 *
 * 사이트별 추가 필드 자동 흡수 (sizeId/flavorId, time/tag).
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadDataJsx } from "./loadDataJsx.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @param {string} siteId — "dohwawon" | "bell_cake" | "PARKHAD"
 * @returns {{categories: Array, products: Array}}
 */
export function parseTypeA(siteId) {
  const dataPath = path.resolve(__dirname, "../..", siteId, "data.jsx");
  const win = loadDataJsx(dataPath);

  const cats = win.HAIR_CATEGORIES;
  const styles = win.HAIR_STYLES;
  if (!Array.isArray(cats) || !styles || typeof styles !== "object") {
    throw new Error(`${siteId}: HAIR_CATEGORIES / HAIR_STYLES 가 비어 있습니다.`);
  }

  const categories = cats.map((c, idx) => ({
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
  for (const cat of cats) {
    const list = styles[cat.id] ?? [];
    list.forEach((p, idx) => {
      // productId: 카테고리 + 인덱스 (각 카테고리 내 유니크 보장).
      // 한 상품이 여러 카테고리에 노출되는 경우 별도 doc 으로 분리됨.
      const productId = `${cat.id}-${idx + 1}`;
      const filename = path.basename(p.img ?? "");
      products.push({
        productId,
        name: p.name,
        price: p.price,
        desc: p.desc,
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
        // 사이트별 확장 (있는 것만 그대로 흡수):
        sizeId: p.sizeId ?? null,
        flavorId: p.flavorId ?? null,
        time: typeof p.time === "number" ? p.time : null,
        tag: p.tag ?? null,
        visible: true,
        sortOrder: globalIdx * 10,
        status: "live",
        // 원본 이미지 파일명 (마이그레이션 시 업로드용):
        _sourceImg: p.img ?? null,
      });
      globalIdx++;
    });
  }

  return { categories, products };
}

