/* eslint-disable */
// Firestore 라이브 데이터 hook. 디자이너 mock 배열(PRODUCTS, HOME_SECTIONS 등)을
// onSnapshot 구독으로 대체.
//
// 디자인 페이지들은 [items, setItems] 패턴으로 mock 을 사용 — 이 hook 도 동일 시그니처
// 를 유지하면서, setItems 가 호출되면 prev vs next 를 diff 해 Firestore 에 업데이트.

// ── Firestore ↔ 디자인 shape 변환 ─────────────────────────
const won = new Intl.NumberFormat("ko-KR");

const fsToDesignProduct = (fs, categoryMap) => ({
  id: fs.productId,
  name: fs.name || "",
  category: fs.categoryId || "",
  categoryName: (categoryMap && categoryMap[fs.categoryId]) || fs.categoryId || "",
  price: typeof fs.price === "number" ? fs.price : 0,
  description: fs.desc || "",
  status: fs.status === "live" ? "live" : "draft",
  draft: fs.status !== "live",
  visible: fs.visible !== false,
  // 디자인은 image 를 string(또는 background-image URL) 으로 기대.
  // Firestore 의 originalUrl(다운로드 토큰 포함) 을 우선 사용, 없으면 빈 문자열.
  image:
    (fs.image && (fs.image.thumb || fs.image.originalUrl)) ||
    (fs.image && fs.image.repoPath ? fs.image.repoPath : ""),
  // 디자인 확장 필드
  sizes: fs.sizeId ? [fs.sizeId] : (fs.tag ? [fs.tag] : []),
  tags: fs.tag ? [fs.tag] : [],
  stock: typeof fs.stock === "string" ? fs.stock : "주문제작",
  updatedAt:
    fs.updatedAt && fs.updatedAt.toDate
      ? formatRelative(fs.updatedAt.toDate())
      : "",
  // 원본 보존 (저장 시 참조)
  _fs: fs,
});

const designToFsProductPatch = (designPatch) => {
  // 디자인 페이지에서 setProducts 로 patch 한 필드들을 Firestore 필드로 매핑.
  const patch = {};
  if ("name" in designPatch) patch.name = designPatch.name;
  if ("price" in designPatch) patch.price = designPatch.price;
  if ("description" in designPatch) patch.desc = designPatch.description;
  if ("category" in designPatch) patch.categoryId = designPatch.category;
  if ("status" in designPatch) patch.status = designPatch.status;
  if ("visible" in designPatch) patch.visible = designPatch.visible;
  if ("draft" in designPatch) patch.status = designPatch.draft ? "draft" : "live";
  if ("tag" in designPatch) patch.tag = designPatch.tag;
  if ("tags" in designPatch && Array.isArray(designPatch.tags)) {
    // 디자인 tags 배열의 첫 항목을 Firestore tag 로 매핑
    patch.tag = designPatch.tags[0] || null;
  }
  if ("sizes" in designPatch && Array.isArray(designPatch.sizes)) {
    patch.sizeId = designPatch.sizes[0] || null;
  }
  if ("stock" in designPatch) patch.stock = designPatch.stock;
  // 이미지: 디자인이 URL string 으로 들고 있을 수 있음 → Firestore image 객체로 복원
  if ("image" in designPatch) {
    patch.image = normalizeImageForFs(designPatch.image, designPatch._fs && designPatch._fs.image);
  }
  return patch;
};

// URL 또는 객체 형태의 image 를 Firestore image 객체로 정규화.
// Storage URL 에서 storagePath / repoPath 를 역추출해 publishToGitHub 가 git 에 커밋 가능하도록.
function normalizeImageForFs(img, fallback) {
  if (img && typeof img === "object") return img;
  if (typeof img === "string" && img) {
    // 1) Firebase Storage URL (.../o/{encoded-path}?alt=media&token=...)
    const m = img.match(/\/o\/([^?]+)\?/);
    if (m) {
      const storagePath = decodeURIComponent(m[1]);
      const parts = storagePath.split("/");
      // sites/{siteId}/products/{productId}/{filename}
      const filename = parts[parts.length - 1];
      const siteId = parts[1] || "";
      const repoPath = siteId ? `${siteId}/img/${filename}` : "";
      return {
        storagePath,
        originalUrl: img,
        thumb: null,
        large: null,
        repoPath,
      };
    }
    // 2) 임의 외부 URL — storagePath/repoPath 없이 url 만 보존
    return { storagePath: "", originalUrl: img, thumb: null, large: null, repoPath: "" };
  }
  // 3) null/undefined — 기존 값 유지
  return fallback || { storagePath: "", thumb: null, large: null, originalUrl: null, repoPath: "" };
}

const fsToDesignSection = (fs) => ({
  id: fs.sectionId,
  type: fs.type || "hero",
  icon: fs.icon || "image",
  title: fs.title || "",
  enabled: fs.enabled !== false,
  draft: fs.dirty === true,
  data: fs.data || {},
  _fs: fs,
});

const designToFsSectionPatch = (designPatch) => {
  const patch = {};
  if ("enabled" in designPatch) patch.enabled = designPatch.enabled;
  if ("data" in designPatch) patch.data = designPatch.data;
  if ("title" in designPatch) patch.title = designPatch.title;
  if ("type" in designPatch) patch.type = designPatch.type;
  if ("icon" in designPatch) patch.icon = designPatch.icon;
  if ("draft" in designPatch) patch.dirty = designPatch.draft;
  return patch;
};

// 상대 시각 — "5월 21일 14:22" 같은 형식
function formatRelative(d) {
  if (!(d instanceof Date) || isNaN(d.getTime())) return "";
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${m}월 ${day}일 ${hh}:${mm}`;
}

// ── 카테고리 ──────────────────────────────────────────────
const useLiveCategories = (siteId) => {
  const [cats, setCats] = React.useState([]);
  React.useEffect(() => {
    if (!siteId || !window.fbDb) return;
    const unsub = window.fbDb
      .collection("sites").doc(siteId).collection("categories")
      .orderBy("sortOrder", "asc")
      .onSnapshot(
        (snap) => {
          const list = snap.docs.map((d) => {
            const fs = d.data();
            return {
              id: fs.categoryId,
              name: fs.name,
              blurb: fs.blurb || "",
              sub: fs.sub || "",
              visible: fs.visible !== false,
              sortOrder: fs.sortOrder || 0,
              count: 0, // 페이지에서 products 로 계산
            };
          });
          setCats(list);
        },
        (err) => console.error("useLiveCategories", err)
      );
    return unsub;
  }, [siteId]);
  return cats;
};

// ── 상품 ──────────────────────────────────────────────────
const useLiveProducts = (siteId) => {
  const [products, setProductsLocal] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [categoryMap, setCategoryMap] = React.useState({});
  const prevRef = React.useRef([]);

  // categories 도 함께 구독 (categoryName lookup)
  React.useEffect(() => {
    if (!siteId || !window.fbDb) return;
    const unsub = window.fbDb
      .collection("sites").doc(siteId).collection("categories")
      .onSnapshot((snap) => {
        const map = {};
        snap.docs.forEach((d) => {
          const fs = d.data();
          map[fs.categoryId] = fs.name;
        });
        setCategoryMap(map);
      });
    return unsub;
  }, [siteId]);

  // products 구독
  React.useEffect(() => {
    if (!siteId || !window.fbDb) {
      setLoading(false);
      return;
    }
    const unsub = window.fbDb
      .collection("sites").doc(siteId).collection("products")
      .orderBy("sortOrder", "asc")
      .onSnapshot(
        (snap) => {
          const list = snap.docs.map((d) =>
            fsToDesignProduct(d.data(), categoryMap)
          );
          prevRef.current = list;
          setProductsLocal(list);
          setLoading(false);
        },
        (err) => {
          console.error("useLiveProducts", err);
          setLoading(false);
        }
      );
    return unsub;
  }, [siteId, categoryMap]);

  // setter: 로컬 즉시 반영 + Firestore diff write
  const setProducts = React.useCallback(
    (updater) => {
      setProductsLocal((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        if (siteId && window.fbDb) {
          diffWriteProducts(siteId, prev, next).catch((e) =>
            console.error("diffWriteProducts", e)
          );
        }
        return next;
      });
    },
    [siteId]
  );

  return [products, setProducts, loading];
};

async function diffWriteProducts(siteId, prev, next) {
  if (!window.fbDb) return;
  const prevById = new Map(prev.map((p) => [p.id, p]));
  const nextById = new Map(next.map((p) => [p.id, p]));
  const batch = window.fbDb.batch();
  const col = window.fbDb.collection("sites").doc(siteId).collection("products");
  const uid = (window.fbAuth && window.fbAuth.currentUser && window.fbAuth.currentUser.uid) || "admin-ui";
  let ops = 0;

  // updates + creates
  for (const [id, p] of nextById) {
    const old = prevById.get(id);
    if (!old) {
      // 새 상품
      batch.set(col.doc(id), {
        productId: id,
        name: p.name || "",
        price: typeof p.price === "number" ? p.price : 0,
        desc: p.description || "",
        categoryId: p.category || "",
        status: p.draft === false || p.status === "live" ? "live" : "draft",
        visible: p.visible !== false,
        sortOrder: nextById.size * 10,
        image: p.image && typeof p.image === "object" ? p.image : { storagePath: "", thumb: null, large: null, originalUrl: typeof p.image === "string" ? p.image : null, repoPath: "" },
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedBy: uid,
      });
      ops++;
      continue;
    }
    const patch = computeProductPatch(old, p);
    if (Object.keys(patch).length > 0) {
      patch.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
      patch.updatedBy = uid;
      batch.update(col.doc(id), patch);
      ops++;
    }
  }

  // deletes
  for (const [id] of prevById) {
    if (!nextById.has(id)) {
      batch.delete(col.doc(id));
      ops++;
    }
  }

  if (ops > 0) await batch.commit();
}

function computeProductPatch(prev, next) {
  const fsPrev = designToFsProductPatch(prev);
  const fsNext = designToFsProductPatch(next);
  const patch = {};
  Object.keys(fsNext).forEach((k) => {
    if (JSON.stringify(fsNext[k]) !== JSON.stringify(fsPrev[k])) {
      patch[k] = fsNext[k];
    }
  });
  return patch;
}

// ── 홈 섹션 ───────────────────────────────────────────────
const useLiveSections = (siteId) => {
  const [sections, setSectionsLocal] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!siteId || !window.fbDb) {
      setLoading(false);
      return;
    }
    const unsub = window.fbDb
      .collection("sites").doc(siteId).collection("homeSections")
      .orderBy("sortOrder", "asc")
      .onSnapshot(
        (snap) => {
          const list = snap.docs.map((d) => fsToDesignSection(d.data()));
          setSectionsLocal(list);
          setLoading(false);
        },
        (err) => {
          console.error("useLiveSections", err);
          setLoading(false);
        }
      );
    return unsub;
  }, [siteId]);

  const setSections = React.useCallback(
    (updater) => {
      setSectionsLocal((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        if (siteId && window.fbDb) {
          diffWriteSections(siteId, prev, next).catch((e) =>
            console.error("diffWriteSections", e)
          );
        }
        return next;
      });
    },
    [siteId]
  );

  return [sections, setSections, loading];
};

async function diffWriteSections(siteId, prev, next) {
  if (!window.fbDb) return;
  const prevById = new Map(prev.map((s) => [s.id, s]));
  const nextById = new Map(next.map((s) => [s.id, s]));
  const batch = window.fbDb.batch();
  const col = window.fbDb.collection("sites").doc(siteId).collection("homeSections");
  const uid = (window.fbAuth && window.fbAuth.currentUser && window.fbAuth.currentUser.uid) || "admin-ui";
  let ops = 0;

  next.forEach((s, idx) => {
    const old = prevById.get(s.id);
    if (!old) {
      // 새 섹션
      batch.set(col.doc(s.id), {
        sectionId: s.id,
        type: s.type || "hero",
        icon: s.icon || "image",
        title: s.title || "",
        enabled: s.enabled !== false,
        data: s.data || {},
        sortOrder: idx * 10,
        dirty: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedBy: uid,
      });
      ops++;
      return;
    }
    // 순서 변경 검사
    const oldIdx = prev.findIndex((x) => x.id === s.id);
    const patch = {};
    if (oldIdx !== idx) patch.sortOrder = idx * 10;
    const fieldPatch = designToFsSectionPatch(s);
    const oldPatch = designToFsSectionPatch(old);
    Object.keys(fieldPatch).forEach((k) => {
      if (JSON.stringify(fieldPatch[k]) !== JSON.stringify(oldPatch[k])) {
        patch[k] = fieldPatch[k];
      }
    });
    if (Object.keys(patch).length > 0) {
      patch.dirty = true;
      patch.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
      patch.updatedBy = uid;
      batch.update(col.doc(s.id), patch);
      ops++;
    }
  });

  // deletes
  prev.forEach((s) => {
    if (!nextById.has(s.id)) {
      batch.delete(col.doc(s.id));
      ops++;
    }
  });

  if (ops > 0) await batch.commit();
}

// ── 발행 이력 ─────────────────────────────────────────────
const useLivePublishes = (siteId, limitN = 10) => {
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    if (!siteId || !window.fbDb) return;
    const unsub = window.fbDb
      .collection("sites").doc(siteId).collection("publishes")
      .orderBy("publishedAt", "desc")
      .limit(limitN)
      .onSnapshot(
        (snap) => {
          const list = snap.docs.map((d) => {
            const fs = d.data();
            const dt = fs.publishedAt && fs.publishedAt.toDate ? fs.publishedAt.toDate() : null;
            return {
              id: fs.publishId,
              when: dt ? formatRelative(dt) : "",
              author: fs.publishedEmail || fs.publishedBy || "",
              note: fs.note || "",
              commitSha: fs.commitSha || "",
              items: {
                products: (fs.counts && fs.counts.products) || 0,
                categories: (fs.counts && fs.counts.categories) || 0,
                home: (fs.counts && (fs.counts.sections || fs.counts.home)) || 0,
              },
              status: fs.noop ? "noop" : "success",
              duration: "—",
            };
          });
          setItems(list);
        },
        (err) => console.error("useLivePublishes", err)
      );
    return unsub;
  }, [siteId, limitN]);

  return items;
};

// ── 사용자(슈퍼) ─────────────────────────────────────────
const useLiveUsers = () => {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    if (!window.fbDb) return;
    const unsub = window.fbDb
      .collection("users")
      .orderBy("createdAt", "desc")
      .onSnapshot(
        (snap) => {
          setUsers(
            snap.docs.map((d) => {
              const fs = d.data();
              return {
                id: fs.uid,
                email: fs.email || "",
                displayName: fs.displayName || (fs.email ? fs.email.split("@")[0] : ""),
                role: fs.role || "editor",
                siteId: fs.siteId || null,
                lastLoginAt: fs.lastLoginAt && fs.lastLoginAt.toDate ? formatRelative(fs.lastLoginAt.toDate()) : "",
              };
            })
          );
        },
        (err) => console.error("useLiveUsers", err)
      );
    return unsub;
  }, []);

  return users;
};

// ── 사이트 (claim 기반 필터) ─────────────────────────────
const SITES_HARDCODED = (typeof SITES !== "undefined" ? SITES : []);

const useLiveSites = (claims) => {
  return React.useMemo(() => {
    if (!claims) return SITES_HARDCODED;
    if (claims.role === "super") return SITES_HARDCODED;
    if (claims.siteId) {
      // 어드민이 사이트 ID 를 정의했지만, 디자인의 SITES 와 매핑 (id 표기 차이 가능)
      const match = SITES_HARDCODED.find(
        (s) =>
          s.id === claims.siteId ||
          s.id.replace(/-/g, "_") === claims.siteId ||
          s.id.replace(/_/g, "-") === claims.siteId
      );
      return match ? [match] : SITES_HARDCODED.slice(0, 1);
    }
    return [];
  }, [claims]);
};

// 사이트의 라이브 URL — easysite.kr 단일 도메인 아래 siteId 경로로 서빙된다.
// (sites-config 의 domain 필드는 wish-domain 이며 실제 DNS 가 붙어 있지 않음)
const liveSiteUrl = (siteId) =>
  siteId ? `https://easysite.kr/${siteId}/` : "https://easysite.kr/";

Object.assign(window, {
  useLiveProducts,
  useLiveSections,
  useLiveCategories,
  useLivePublishes,
  useLiveUsers,
  useLiveSites,
  liveSiteUrl,
});
