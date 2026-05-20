# easysite functions (Cloud Functions)

Firebase Cloud Functions 용 Node.js 20 + TypeScript 프로젝트. 리전: `asia-northeast3` (서울).

## 함수 목록

| 이름 | 트리거 | 용도 |
|---|---|---|
| `setSiteClaim` | callable (super) | 사이트 멤버에게 siteId/role custom claim 부여 |
| `publishToGitHub` | callable (member) | Firestore 드래프트 → data.jsx 생성 → GitHub main 커밋 |
| `onImageFinalize` | Storage onFinalize | Resize Images 확장 결과물 URL을 product doc에 연결 |
| `onUserCreate` | Auth onCreate | `users/{uid}` 도큐먼트 초기화 |
| `auditOnWrite` | Firestore 부분 경로 | 모든 쓰기를 `auditLogs`에 기록 |

## 빌드 · 배포

```powershell
npm install
npm run build
# emulator
firebase emulators:start --only functions
# 프로덕션 배포 (M2+)
npm run deploy
```

## Secrets

GitHub PAT 등 민감한 값은 Firebase Functions Secret Manager 이용:

```powershell
firebase functions:secrets:set GITHUB_PAT
```

코드에서는 `defineSecret('GITHUB_PAT')` 로 참조.
