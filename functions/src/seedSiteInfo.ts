import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { db, FieldValue } from "./admin";

interface SiteInfoDefault {
  phone: string;
  kakaoChannel: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

/**
 * 각 사이트의 코드 베이스 (index.html og meta + app.jsx PHONE/KAKAO 상수) 에서
 * 추출한 현재 운영중인 값. seedSiteInfo 콜이 이 값으로 settings/info 도큐먼트를
 * set merge 한다.
 */
const SITE_INFO_DEFAULTS: Record<string, SiteInfoDefault> = {
  dohwawon: {
    phone: "",
    kakaoChannel: "https://pf.kakao.com/_xleKLxj",
    ogTitle: "도화원플라워",
    ogDescription:
      "평범한 일상도 꽃 한 송이가 더해지면 특별한 순간이 됩니다. 계절을 듬뿍 머금은 다채로운 꽃들로, 당신의 오늘을 가장 아름답게 피워내겠습니다.",
    ogImage: "img/hero.jpg",
  },
  bell_cake: {
    phone: "",
    kakaoChannel: "https://pf.kakao.com/_txnxncb",
    ogTitle: "쌀케이크 전문점 벨케이크",
    ogDescription:
      "No 밀가루, No 식물성크림. 100% 국내산 쌀가루로 만든 쌀케이크, 동물성 생크림케이크 전문점 벨케이크입니다:) 1인운영매장이라, 전화를 못받을 수 있으니 부재시 카카오톡채널로 연락주세요^^",
    ogImage: "img/hero.jpg",
  },
  PARKHAD: {
    phone: "",
    kakaoChannel: "",
    ogTitle: "박하디, 프리미엄 남성 커트",
    ogDescription: "대구 달서구 남성 전용 헤어샵 — 편안한 환경, 유쾌한 경험.",
    ogImage: "./img/hero.jpg",
  },
  flower_example: {
    phone: "010-0000-0000",
    kakaoChannel: "",
    ogTitle: "전국꽃배달서비스",
    ogDescription: "대한민국 어디든 3시간 당일배송",
    ogImage: "./img/cover.jpg",
  },
  greenlight_art: {
    phone: "0507-1399-2425",
    kakaoChannel: "",
    ogTitle: "풀빛그림아이 미술학원 · 대구 달서구",
    ogDescription: "아이의 손끝에 색을 더하는 시간 — 대구 달서구 풀빛그림아이 미술학원",
    ogImage: "https://easysite.kr/greenlight_art/img/hero.jpg",
  },
};

interface SeedRequest {
  /** 단일 사이트 시드. 비우면 5개 모두 시드. */
  siteId?: string;
}

/**
 * 슈퍼 어드민이 호출 — 5개 사이트의 settings/info 를 코드 베이스 기본값으로 set merge.
 * 사용자가 admin 에 수동으로 입력한 값이 있어도 덮어씁니다 (이름 그대로 '동기화').
 */
export const seedSiteInfo = onCall<SeedRequest>(async (req) => {
  const callerToken = req.auth?.token;
  if (!callerToken || callerToken.role !== "super") {
    throw new HttpsError(
      "permission-denied",
      "슈퍼 어드민만 사이트 정보를 동기화할 수 있습니다."
    );
  }

  const uid = req.auth!.uid;
  const targetIds = req.data?.siteId
    ? [req.data.siteId]
    : Object.keys(SITE_INFO_DEFAULTS);

  const results: Record<string, { ok: boolean; error?: string }> = {};

  for (const siteId of targetIds) {
    const defaults = SITE_INFO_DEFAULTS[siteId];
    if (!defaults) {
      results[siteId] = { ok: false, error: "기본값 없음" };
      continue;
    }
    try {
      await db.doc(`sites/${siteId}/settings/info`).set(
        {
          ...defaults,
          ogImageStoragePath: "",
          updatedAt: FieldValue.serverTimestamp(),
          updatedBy: uid,
        },
        { merge: true }
      );
      results[siteId] = { ok: true };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      results[siteId] = { ok: false, error: msg };
    }
  }

  const okCount = Object.values(results).filter((r) => r.ok).length;
  const failCount = Object.values(results).filter((r) => !r.ok).length;

  logger.info("seedSiteInfo done", { uid, results, okCount, failCount });

  return { results, okCount, failCount };
});
