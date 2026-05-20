# easysite admin (어드민 SPA)

React 18 + Vite 5 + TypeScript 기반 멀티사이트 어드민 콘솔.

## 주요 경로

- `src/components/` — 디자인시스템 스키마를 미러링한 25개 리액트 컴포넌트
- `src/lib/firebase.ts` — Firebase SDK 새로 초기화을 하는 단일 지점
- `src/pages/` — 계층별 라우팅 페이지
- `src/styles/tokens.css` — `desgin_system/assets/css/_tokens.generated.css`를 import

## 마일스톤별 명령어

- M2 (인증): `npm install && npm run dev` (emulator 사용)
- M3 (UI): `npm run dev` 로 개발, `npm run build` 으로 프로덕션 빌드
- M6 (배포): `npm run build && firebase deploy --only hosting`

## 환경변수

로컬 개발에서 Firebase Admin SDK 의 서비스 계정 키가 필요한 경우:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\service-account.json"
```

⚠️ **서비스 계정 키는 절대 커밋에 포함시키지 말 것.** `.gitignore` 에서 차단됨.
