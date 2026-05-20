/**
 * 5개 사이트의 마이그레이션 설정.
 *
 * ownerUid 는 부트스트랩 super 어드민 UID — bootstrap-users.result.json 또는
 * Firebase Console 에서 확인 가능.
 *
 * GitHub repo 는 dohoon0505/easysite 단일 저장소, sitePath 가 해당 폴더.
 */
export const SITES = {
  dohwawon: {
    siteId: "dohwawon",
    name: "도화원플라워",
    siteType: "typeA",
    domain: "dohwawon.kr",
    github: {
      owner: "dohoon0505",
      repo: "easysite",
      branch: "main",
      sitePath: "dohwawon",
    },
  },
  bell_cake: {
    siteId: "bell_cake",
    name: "벨케이크",
    siteType: "typeA",
    domain: "bell-cake.kr",
    github: {
      owner: "dohoon0505",
      repo: "easysite",
      branch: "main",
      sitePath: "bell_cake",
    },
  },
  PARKHAD: {
    siteId: "PARKHAD",
    name: "PARKHAD",
    siteType: "typeA",
    domain: "parkhad.kr",
    github: {
      owner: "dohoon0505",
      repo: "easysite",
      branch: "main",
      sitePath: "PARKHAD",
    },
  },
  flower_example: {
    siteId: "flower_example",
    name: "flower_example",
    siteType: "typeB",
    domain: "flower-example.kr",
    github: {
      owner: "dohoon0505",
      repo: "easysite",
      branch: "main",
      sitePath: "flower_example",
    },
  },
  greenlight_art: {
    siteId: "greenlight_art",
    name: "풀빛그림아이 미술학원",
    siteType: "typeC",
    domain: "greenlight-art.kr",
    github: {
      owner: "dohoon0505",
      repo: "easysite",
      branch: "main",
      sitePath: "greenlight_art",
    },
  },
};

/**
 * 슈퍼 어드민 UID — bootstrap-users.result.json 에서 가져오거나
 * 명시적으로 환경변수 SUPER_UID 로 오버라이드.
 *
 * 모든 사이트의 ownerUid 로 사용됨.
 */
export function getSuperUid() {
  if (process.env.SUPER_UID) return process.env.SUPER_UID;
  // 기본값 — bootstrap 결과 (2026-05-20 생성)
  return "7eOWD4IFazbH30W7yysNckPAKnC3";
}
