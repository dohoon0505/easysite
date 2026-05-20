# easysite scripts (일회성 마이그레이션)

Firebase Admin SDK를 이용한 일회성 스크립트 모음. **프로덕션 Firestore/Storage에 직접 쓰기 작업이므로 조심을 권한**.

## 사전 설정

```powershell
# 1. 회원가입 서비스 계정 경로를 환경변수로 노출 (커밋 금지)
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\Users\ehgns\Downloads\easysite-5a560-firebase-adminsdk-fbsvc-ef067fbf73.json"

# 2. 의존성 설치
npm install
```

## 스크립트

### M4 - 데이터 마이그레이션

```powershell
# Dry-run: 행 수만 확인
node migrate-data.mjs --site dohwawon --dry-run

# 실제 적용 (사용자 승인 후 하나씩)
node migrate-data.mjs --site dohwawon
node migrate-images.mjs --site dohwawon
```

### M2 - 초기 계정 생성

```powershell
# bootstrap-users.json 이 gitignore에 포함됨. 로컬에서만 상조·사용
node create-bootstrap-users.mjs
```

## 안전장치

- `GOOGLE_APPLICATION_CREDENTIALS` env var 만 사용. CLI argument 로 서비스 계정 경로 전달 금지
- 멬등성 수행: 마이그레이션은 매번 동일 결과 출력 (이미 있으면 skip)
- 도워주세요 흐름: dry-run → 상귀 있을 수 있는 row count 확인 → emulator 에서 먼저 실행 → prod 실행
