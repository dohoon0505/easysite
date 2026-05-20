# Resize Images Extension 설치

업로드된 이미지를 자동으로 200·400·800px 변형으로 만들어 `srcset` 최적화에 활용한다. 어드민이 동작하려면 필수는 아니지만, 사이트 성능과 모바일 UX 를 위해 설치를 권장한다.

## 설치 방법

### 옵션 A — Firebase Console (권장, 5분)

1. https://console.firebase.google.com/project/easysite-5a560/extensions 접속
2. **Browse the Extensions Hub** → "Resize Images" 검색
3. **Install in console** 클릭
4. 설정값:
   - **Cloud Storage bucket**: `easysite-5a560.firebasestorage.app`
   - **Sizes of resized images**: `200x200,400x400,800x800`
   - **Deletion of original file**: `No` — 원본 보존
   - **Image types**: `jpeg,png,webp`
   - **Cache-Control header**: `public, max-age=86400` (24시간)
   - **Output bucket**: 비워둠 (동일 버킷)
   - **Output prefix**: `_thumbs/` (선택 — 변형본을 다른 폴더로)
   - **Output suffix**: 비워둠
   - **Backfill existing images**: `Yes` (기존 114개 이미지에 즉시 적용)
5. **Next** → 권한 부여 → **Install extension**

### 옵션 B — Firebase CLI

```powershell
firebase ext:install firebase/storage-resize-images@latest --local
# 인터랙티브로 설정값 입력 (Console 과 동일)
firebase deploy --only extensions
```

## 변형 URL 사용

설치 후 어드민이 업로드한 `sites/dohwawon/products/best-1/coral.jpg` 는 다음 변형이 자동 생성됨:

- `sites/dohwawon/products/best-1/coral_200x200.jpg`
- `sites/dohwawon/products/best-1/coral_400x400.jpg`
- `sites/dohwawon/products/best-1/coral_800x800.jpg`

`functions/src/onImageFinalize.ts` 가 이 변형들의 URL 을 product doc 의 `image.thumb` / `image.large` 필드에 자동 기록한다 (현재 placeholder — 필요 시 구현 보강).

## 비용 안내

- Spark 플랜에선 사용 불가 (Functions + Storage 추가 비용 발생)
- Blaze 플랜: 변형 1장당 약 0.0001달러 + Storage 추가 용량
- 114장 backfill 시 1회성 ~0.01달러 정도

## 설치 후 확인

```powershell
# Storage 에 _200x200.jpg 변형 파일이 생기는지 확인
firebase storage:bucket --bucket easysite-5a560.firebasestorage.app
# 또는 Firebase Console > Storage 에서 sites/dohwawon/products/ 폴더 탐색
```

## 비활성화 / 제거

Firebase Console > Extensions > Resize Images > **Uninstall**. 변형된 파일들은 Storage 에 그대로 남으므로 별도 정리 필요.
