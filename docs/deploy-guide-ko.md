# easysite 어드민 배포·운영 가이드 (개발자용)

## 시스템 개요

```
어드민 SPA (easysite-5a560.web.app)
    │
    ├── Firebase Auth (사이트별 custom claims)
    ├── Firestore (드래프트 + 감사 로그)
    ├── Storage (이미지 작업 영역)
    └── Cloud Functions (asia-northeast3)
            │
            └── publishToGitHub
                    │
                    ├── data.jsx 생성 (codegen/render*)
                    ├── Storage → Buffer 다운로드 (imageSync)
                    └── Octokit 단일 커밋 (Git Database API)
                            │
                            ▼
                    GitHub (dohoon0505/easysite, main)
                            │
                            ▼
                    GitHub Pages → 5개 사이트 (커스텀 도메인)
```

## 1. 사전 설치

- **Node.js 20 LTS 이상**
- **Java 21 LTS** (Eclipse Temurin 권장) — Firebase 에뮬레이터 의존
- **Firebase CLI**: `npm i -g firebase-tools`
- **Git** + 본인 GitHub 계정에서 `dohoon0505/easysite` 푸시 권한

## 2. 첫 클론

```powershell
git clone https://github.com/dohoon0505/easysite.git
cd easysite

# 디자인시스템은 별도 저장소 (gitignore 되어 있음)
git clone https://github.com/dohoon0505/desgin_system.git

# Firebase 로그인
firebase login
firebase use easysite-5a560

# 서비스 계정 키 위치 설정 (커밋 금지 — gitignore 처리됨)
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\easysite-5a560-firebase-adminsdk-*.json"
```

## 3. 로컬 개발

### 어드민 SPA
```powershell
cd admin
npm install
npm run dev
# http://localhost:5173 — 에뮬레이터 자동 연결
```

### 에뮬레이터
```powershell
firebase emulators:start --import=./seed --export-on-exit
# UI: http://localhost:4000
# Firestore: 8080 · Storage: 9199 · Functions: 5001 · Auth: 9099
```

### Functions 빌드
```powershell
cd functions
npm install
npm run build:watch   # tsc watch mode
```

## 4. 테스트

### Rules 단위 테스트
```powershell
cd admin
firebase emulators:exec --only firestore,storage "npm run test:rules"
# 21개 access-isolation 시나리오 통과 확인
```

### CI
- 모든 PR 에 대해 `.github/workflows/ci.yml` 실행
- admin 빌드 · functions 빌드·lint · rules 테스트

## 5. 프로덕션 배포

### 일상 배포 (코드 변경 후)

배포 단계는 **반드시 사용자(슈퍼 어드민) 승인 후** 진행할 것:

```powershell
# 0) 무엇이 바뀌는지 확인
git diff main --stat
firebase deploy --only firestore:rules --dry-run    # rules 변경 시
firebase deploy --only firestore:indexes --dry-run  # 인덱스 변경 시

# 1) Firestore (인덱스 → rules 순서, 인덱스 빌드에 몇 분)
firebase deploy --only firestore:indexes
firebase deploy --only firestore:rules

# 2) Storage rules
firebase deploy --only storage

# 3) Functions (publishToGitHub 등)
firebase deploy --only functions

# 4) Hosting (어드민 SPA)
cd admin && npm run build && cd ..
firebase deploy --only hosting
```

### 함수 1개만 배포
```powershell
firebase deploy --only functions:publishToGitHub
```

## 6. 새 운영자 계정 추가

### 슈퍼 어드민이 어드민 UI 에서 (권장)
1. 어드민 로그인 (super)
2. 좌측 메뉴 → 사용자 관리
3. 새 사용자가 Firebase 가입을 먼저 해야 함 — 슈퍼가 비밀번호 알려주거나 PSA 메일 발송
   - 또는: 슈퍼가 Firebase Console > Authentication > Users > Add user 로 직접 생성
4. UsersAdmin 페이지에서 그 사용자 카드의 **권한 변경** → role 과 siteId 입력 → 저장

### 또는 스크립트로 일괄 생성
```powershell
cd scripts
# bootstrap-users.json 작성 (gitignored)
node create-bootstrap-users.mjs
# 임시 비밀번호가 콘솔과 bootstrap-users.result.json 에 출력됨
# 안전한 채널로 운영자에게 전달
```

## 7. 새 사이트 추가

### 7.1 코드 변경 (5분)
1. `scripts/sites-config.mjs` 에 새 항목 추가:
```js
new_site: {
  siteId: "new_site",
  name: "새 사이트",
  siteType: "typeA",  // 또는 typeB / typeC
  domain: "new-site.kr",
  github: {
    owner: "dohoon0505",
    repo: "easysite",
    branch: "main",
    sitePath: "new_site",
  },
},
```

### 7.2 사이트 폴더 준비 (10분)
1. `dohwawon` 폴더를 `new_site` 로 복사
2. `new_site/data.jsx` 를 새 데이터로 작성
3. `new_site/img/*` 에 이미지 배치
4. `new_site/index.html` 의 메타 정보 수정

### 7.3 마이그레이션 (1분)
```powershell
cd scripts
node migrate-data.mjs --site new_site --dry-run    # 검증
node migrate-data.mjs --site new_site               # 실제
node migrate-images.mjs --site new_site             # 이미지
```

### 7.4 운영자 계정 부여
- 슈퍼 어드민이 어드민 UI 에서 새 운영자 또는 기존 운영자에게 `siteId: "new_site"` 클레임 부여

### 7.5 첫 발행
- 새 운영자가 어드민에서 발행 → 사이트 폴더가 GitHub에 반영됨

## 8. GitHub PAT 회전 (90일마다)

```powershell
# 1) GitHub: 새 PAT 발급 (https://github.com/settings/personal-access-tokens)
#    Repository: dohoon0505/easysite, Contents: Read and write, 90일

# 2) Functions Secret 갱신
firebase functions:secrets:set GITHUB_PAT
# 프롬프트에 새 PAT 붙여넣기

# 3) publishToGitHub 함수 재배포 (새 secret 버전 반영)
firebase deploy --only functions:publishToGitHub

# 4) 이전 PAT revoke (GitHub Settings)

# 5) 테스트: 어드민에서 발행 1회
```

## 9. Firestore 데이터 점검

### 발행 이력 확인
```powershell
cd scripts
node check-publishes.mjs dohwawon       # 최근 5건
```

### 디버그 쿼리 (인덱스 빌드 상태 등)
```powershell
node debug-query.mjs --site dohwawon --category bouquet
```

## 10. 트러블슈팅

### `firebase deploy --dry-run` 가 실제로 DB 생성한다
- 신규 프로젝트 첫 배포 시 `--dry-run` 이 Firestore (default) DB 를 nam5 로 자동 생성 가능
- **대처**: `firebase firestore:databases:list` 로 사전 확인. 없으면 `firebase firestore:databases:create "(default)" --location asia-northeast3` 명시적 생성. 잘못 생성됐다면 `firebase firestore:databases:delete "(default)" --force` 후 5분 대기

### 인덱스 빌드 중 쿼리가 "0.1초 보이다 사라짐"
- Firestore 캐시 → 서버 쿼리 실패 (인덱스 빌드 중) → onSnapshot error 콜백
- **대처**: 컬렉션이 작으면 클라이언트 사이드 필터링으로 대체. 또는 인덱스 빌드 완료까지 대기 (수분)

### Storage 이미지가 `<img>` 에 표시 안 됨
- Admin SDK 업로드는 download token 을 자동 생성하지 않음
- **대처**: `node fix-storage-tokens.mjs --all` 로 토큰 부여. `migrate-images.mjs` 에는 이미 적용됨

### publishToGitHub 가 권한 에러
- GITHUB_PAT 만료 또는 권한 부족 (contents:read-write 필요)
- **대처**: § 8 PAT 회전

### 사이트가 발행 후 안 변함
1. `git log origin/main --oneline -3` 으로 새 커밋 확인
2. https://github.com/dohoon0505/easysite/actions — GitHub Pages 워크플로 상태 확인
3. 1~3분 대기 후 강제 새로고침

## 11. 관련 문서

- 운영자 매뉴얼: `docs/operations-manual-ko.md`
- 구현 계획서: `C:\Users\ehgns\.claude\plans\c-users-ehgns-documents-github-easysite-golden-hearth.md`
- RFD 원본: `easysite_admin_request.md`
- 디자인시스템: `desgin_system/AGENTS.md`, `desgin_system/system.json`
