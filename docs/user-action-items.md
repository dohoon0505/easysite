# 사용자(슈퍼 어드민) 액션 아이템

코드 작성이 끝났지만 콘솔에서 직접 해야 하는 작업 모음. 우선순위 순.

## 🔴 즉시 (보안)

### 1. GitHub PAT 회전
대화 로그에 노출된 PAT 을 새로 발급하고 교체.

- [ ] https://github.com/settings/personal-access-tokens 접속
- [ ] 노출된 PAT (`github_pat_11BEZCLMI0OUdQv93iqjcS_...`) **Revoke**
- [ ] 새 fine-grained PAT 발급:
  - Repository: `dohoon0505/easysite`
  - Permissions: Contents (Read and write)
  - Expiration: 90 days
- [ ] Functions Secret 갱신:
  ```powershell
  firebase functions:secrets:set GITHUB_PAT --force
  # 프롬프트에 새 PAT 입력
  firebase deploy --only functions:publishToGitHub  # 새 secret 버전 반영
  ```

### 2. 슈퍼 어드민 비밀번호 변경
부트스트랩 시 생성된 임시 비밀번호(`02adcdbed1ad`) 도 대화 로그에 노출됨.

- [ ] 어드민 로그인 (`ehgns335@naver.com`)
- [ ] 계정 설정 > "비밀번호 재설정 메일 전송"
- [ ] 메일 링크로 새 비밀번호 설정
- [ ] 다시 로그인

## 🟡 권장 (운영 완성도)

### 3. Resize Images Extension 설치
참고: [`docs/resize-images-extension.md`](resize-images-extension.md)

- [ ] Firebase Console > Extensions 에서 Resize Images 설치
- [ ] Bucket: `easysite-5a560.firebasestorage.app`
- [ ] Sizes: `200x200,400x400,800x800`
- [ ] Backfill: Yes (기존 114장 처리)
- [ ] 설치 후 어드민 상품 페이지에서 "리사이즈 완료" 배지 확인

### 4. App Check 활성화 (선택, 보안 강화)
- [ ] Firebase Console > App Check 진입
- [ ] reCAPTCHA v3 사이트 키 발급 (https://www.google.com/recaptcha/admin)
- [ ] Web 앱(`easysite-admin`) 에 reCAPTCHA v3 등록
- [ ] **Audit only** 모드로 24시간 모니터
- [ ] 거부 트래픽이 없으면 **Enforce** 로 전환

### 5. 운영자 5명의 실 이메일 교체
부트스트랩 시 placeholder `*-op@example.com` 으로 생성. 실제 운영자가 정해지면 교체.

- [ ] 슈퍼로 로그인 → 사용자 관리
- [ ] 각 placeholder 계정 삭제 (Firebase Console > Authentication > Users)
- [ ] 새 운영자 계정 생성 (Console 또는 `scripts/create-bootstrap-users.mjs` 재실행)
- [ ] 사용자 관리 페이지에서 각 사용자에 siteId 부여

## 🟢 필수 (검증 항목)

### 6. 5개 사이트 모두 발행 후 GitHub Pages 반영 확인

dohwawon 은 이미 시범 발행 완료. 나머지 4개도 같은 방식으로:

- [ ] bell_cake editor 로그인 → 발행 → `git log origin/main` 으로 새 커밋 확인
- [ ] PARKHAD editor 로그인 → 발행
- [ ] flower_example editor 로그인 → 발행
- [ ] greenlight_art editor 로그인 → 발행
- [ ] 각 사이트의 커스텀 도메인에서 1~3분 후 변경 사항 확인

### 7. Lighthouse Mobile 점수 (스펙 §12 기준)

- [ ] Chrome 시크릿 모드로 https://easysite-5a560.web.app 접속
- [ ] DevTools > Lighthouse > Mobile + 4개 카테고리 체크 > Analyze
- [ ] 기준: Performance ≥ 80, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90
- [ ] 미달 항목 보고

### 8. 모바일 5개 너비 검증 (스펙 §12 기준)

- [ ] Chrome DevTools > Device Toolbar
- [ ] 360px (좁은 안드로이드): 가로 스크롤 없음 확인
- [ ] 390px (iPhone 표준): 동일
- [ ] 430px (iPhone Pro Max): 동일
- [ ] 768px (iPad): 사이드바 또는 적절한 레이아웃
- [ ] 1024px+: 데스크톱 사이드바
- [ ] 모든 인터랙티브 요소가 44×44pt 이상

## 🔵 차후 (강화)

### 9. GitHub Pre-commit hook 활성화
저장소를 새로 클론하는 사람마다 한 번:

```powershell
git config core.hooksPath .husky
```

### 10. CI 시크릿 설정 (private 디자인시스템 저장소 시)
`dohoon0505/desgin_system` 이 private 이면 CI 가 클론 못함. 다음 추가:

- [ ] GitHub Settings > Secrets and variables > Actions > New secret
- [ ] 이름: `DSG_REPO_TOKEN`
- [ ] 값: read 권한이 있는 PAT
- [ ] `.github/workflows/ci.yml` 의 `# token:` 주석을 풀어서 활성화

### 11. 도메인 연결 (옵션)
어드민을 커스텀 도메인으로 운영하고 싶다면:

- [ ] Firebase Console > Hosting > Add custom domain
- [ ] 예: `admin.easysite.kr` → CNAME 설정
- [ ] HTTPS 인증서 자동 발급 대기

## 도움말

- 운영자 매뉴얼: [`docs/operations-manual-ko.md`](operations-manual-ko.md)
- 개발자 배포 가이드: [`docs/deploy-guide-ko.md`](deploy-guide-ko.md)
- 트러블슈팅: 배포 가이드 § 10
