# easysite 어드민 — 디자이너 인계 문서

> 이 문서는 디자이너가 easysite 어드민의 UI/UX 를 **완전히 새롭게 재설계**하기 위해 필요한 모든 정보를 정리한다. 디자이너는 이 문서만 보고도 화면 목록, 컴포넌트, 상태, 인터랙션, 접근성 요구사항을 파악할 수 있어야 한다.

---

## 1. 프로젝트 한 줄 요약

5개 운영 사이트(꽃집·케이크·헤어샵·플라워 샘플·미술학원)의 **상품·가격·이미지·홈 섹션**을 비개발자 운영자가 코드 수정 없이 갱신할 수 있는 **모바일 친화 멀티사이트 어드민 콘솔**. 발행 한 번에 GitHub 에 자동 커밋되어 사이트가 1~3분 내 반영된다.

- **현재 운영 중인 어드민**: https://easysite-5a560.web.app (재설계 전 임시 UI)
- **운영 대상 사이트 5개**:
  - 도화원플라워 (꽃집)
  - 벨케이크 (케이크 전문점)
  - PARKHAD (헤어샵)
  - flower_example (플라워 샘플)
  - 풀빛그림아이 미술학원 (greenlight_art)
- **확장성**: 차후 사이트가 추가되어도 같은 어드민으로 관리 가능해야 함

---

## 2. 사용자 페르소나

### 운영자 (Primary)
- 비개발자 (꽃집 사장, 케이크 디자이너, 미용실 원장 등)
- **사용 시간대**: 매장 영업 중 짬짬이 / 외근 중 이동 시 / 새벽 상품 등록
- **사용 디바이스**: **스마트폰이 70% 이상** (아이폰·갤럭시 비슷한 비율, 한 손 조작)
- **기술 수준**: 카카오톡·인스타·배달앱 수준. 복잡한 메뉴 거부감
- **빈번한 작업**: 가격 일괄 변경 (시즌 인상), 신상품 등록 (사진 1장 + 가격 + 설명), 일시 품절 토글

### 슈퍼 어드민 (Secondary)
- 개발자 또는 본인
- **사용 디바이스**: 데스크톱 중심
- 사이트 추가, 운영자 권한 부여, 발행 이력 감사

---

## 3. 기술·플랫폼 제약

- **렌더링**: React 18 + TypeScript + Vite (SPA, PWA 지원)
- **백엔드**: Firebase (Auth · Firestore · Storage · Functions · Hosting)
- **디자인시스템**: 별도 저장소 `dohoon0505/desgin_system` (UIUX-DH v0.5.2). 토큰·컴포넌트 스펙은 이 시스템을 진본으로 한다.
- **브라우저 지원**: 최신 2년 (Chrome·Edge·Safari·Samsung Internet·iOS Safari·Android Chrome)
- **OS**: iOS 15+, Android 9+
- **접근성**: WCAG 2.1 AA
- **언어**: 한국어 단일 (영문 부제는 일부 허용)

---

## 4. 디자인시스템 사용 원칙 (의무)

기존 디자인시스템(`desgin_system/`)을 **그대로 따른다.** 새 컴포넌트가 필요하면 디자인시스템에 먼저 추가하고 어드민에서 import.

- **토큰만 사용**: hex/px literal 금지. `var(--sm-*)` semantic 토큰, `var(--text-*)` 타이포 토큰, `var(--radius-*)` `var(--size-*)` 만.
- **폰트**: Pretendard Variable 한 벌 (v0.5.2 기준 `--font-mono` 제거됨)
- **텍스트 최소 사이즈**: 13px
- **컬러 시스템**: Light/Dark 양쪽 대응 (`[data-theme="dark"]` 셀렉터)
- **그라데이션**: 브랜드 모멘트 1~2곳만 허용 (`docs/04-gradient-policy.md`)

자세한 토큰 목록은 § 9 참조.

---

## 5. 화면 목록 (재설계 대상)

각 화면에 대해 디자이너는 (a) 데스크톱 와이어 (b) 모바일 와이어 (c) 주요 상태 (loading / empty / error / disabled) 를 모두 그려야 한다.

### 5.1 인증
| ID | 화면 | 설명 | 우선순위 |
|---|---|---|---|
| L01 | 로그인 | Email + Password. 비밀번호 재설정 메일 전송 링크. 첫 로그인 안내. | P0 |
| L02 | 비밀번호 재설정 (외부 — Firebase 이메일) | Firebase 가 보낸 메일 링크 → 본인 인증 화면 (디자이너 영역 X). | — |

### 5.2 운영자 메인 메뉴
| ID | 화면 | 설명 | 우선순위 |
|---|---|---|---|
| H01 | 홈 섹션 편집 | 사이트 첫 화면의 히어로 헤드라인·서브카피·이미지·인사말·CTA 편집. **재설계 핵심 — 현재 placeholder 만 있음.** | **P0 — 신규** |
| P01 | 상품 목록 | 카테고리 칩 필터 + 카드/테이블 반응형 + 다중 선택 액션바. 검색·정렬·페이지네이션 (현재 미구현). | P0 |
| P02 | 상품 등록 | 새 상품 입력. 카테고리 선택, 이미지 업로드 (드래그·카메라 촬영), 가격·설명, 사이트별 추가 필드 (사이즈/맛/시간/태그/연령 등). | P0 |
| P03 | 상품 수정 | P02 와 동일 폼 + 삭제 + 발행 상태 토글. | P0 |
| C01 | 카테고리 관리 | 추가·수정·삭제·정렬·숨김 토글. 현재 ↑↓ 버튼 — **드래그 정렬로 재설계 필요.** | P0 |
| PB01 | 발행 센터 | 드래프트/라이브 카운트 + 발행 메모 + 발행 버튼 + 이력. | P0 |
| A01 | 계정 설정 | 표시 이름 변경, 비밀번호 재설정 메일 전송, 자기 권한 표시. | P1 |

### 5.3 슈퍼 어드민 전용
| ID | 화면 | 설명 | 우선순위 |
|---|---|---|---|
| S01 | 사용자 관리 | 전체 사용자 리스트, 각 사용자에 role(super/owner/editor)·siteId claim 부여. | P0 |
| S02 | 사이트 관리 | 새 사이트 추가 (siteId, name, siteType, GitHub repo 정보), 기존 사이트 메타 수정. | P1 (현재 미구현) |
| S03 | 감사 로그 | 변경 이력 페이지네이션, 필터 (사이트·액션·기간), 상세 diff. | P1 (현재 미구현) |

### 5.4 공통 영역
| ID | 영역 | 설명 |
|---|---|---|
| N01 | 상단 앱바 | 좌측 메뉴/로고, 중앙 페이지 제목, 우측 현재 사이트 칩·계정 메뉴·로그아웃 |
| N02 | 좌측 사이드바 (≥1024px) | 그룹화된 메뉴 (사이트 관리 / 계정 / 슈퍼) |
| N03 | 하단 탭바 (<600px) | 4~5개 핵심 메뉴 (홈 · 상품 · 카테고리 · 발행) |
| N04 | 토스트 영역 | 데스크톱 우상단, 모바일 하단. tone 4종 (info/success/warning/danger) |
| N05 | 모달 | 데스크톱 중앙 dialog, 모바일 bottom-sheet (자동 전환) |
| N06 | 확인 다이얼로그 | 파괴 작업 전 — destructive tone 강조 |

---

## 6. 컴포넌트 인벤토리

현재 어드민이 사용하는 컴포넌트. 디자인시스템 스펙(`desgin_system/components/*.schema.json`)을 따른다. 재설계 시 신규 컴포넌트가 필요하면 디자인시스템에 먼저 추가.

### 6.1 입력
- **Button** — variants: primary / secondary / outline / ghost / danger. sizes: sm/md/lg/xl. modifiers: full-width, loading, disabled.
- **TextField** — types: text/email/password/number/textarea. error state, helper text, prefix/suffix icon.
- **FormField** — Label + 필수 표시(*) + helper / error 메시지를 감싸는 래퍼.
- **Checkbox / Radio / Toggle** — 상태별 디자인 + 44pt 터치 영역.
- **Select / Dropdown** — 모바일에서 네이티브 select 권장, 데스크톱은 커스텀 가능.
- **FileUploader** — 드래그·드롭 / 파일 선택 / 카메라 직접 촬영. 진행률 바 포함.

### 6.2 표시
- **Card** — density: tight / default / loose. shadow / border 옵션.
- **Badge** — tones: neutral / brand / success / warning / danger / info.
- **Chip** — selected 상태, removable(X 버튼) 옵션. 필터 칩으로 활용.
- **Avatar** — 운영자 프로필 (이니셜 / 이미지).

### 6.3 네비게이션
- **TopAppBar** — leading / title / subtitle / trailing 슬롯.
- **NavBar** (sidebar) — 그룹별 항목, 아이콘 + 라벨, active 상태.
- **TabBar** (bottom) — 모바일 하단 고정, 안전 영역 패딩, 4~5개 항목.
- **Breadcrumb** (선택) — 다층 페이지(예: 사이트 > 카테고리 > 상품) 진입 시.

### 6.4 데이터
- **DataTable** — 헤더, 정렬, 다중 선택, 행별 액션 칼럼, 빈 상태.
- **ProductCard** — 모바일용 카드 (썸네일 + 이름 + 가격 + 노출 토글 + 선택 체크박스).
- **AccordionTree** — 카테고리 → 상품 트리, 펼침/접힘.
- **EmptyState** — 아이콘 + 제목 + 설명 + CTA.
- **Skeleton** — 로딩 placeholder.
- **Pagination / Load More** — 페이지네이션 / 무한 스크롤 (현재 미구현 — 디자이너가 정해주면 좋음).

### 6.5 오버레이
- **Dialog** (desktop) — 중앙 정렬, backdrop, 사이즈 sm/md/lg, destructive variant.
- **BottomSheet** (mobile) — 하단 슬라이드업, drag handle, 안전 영역.
- **ResponsiveModal** — 자동 전환 래퍼 (Dialog ↔ BottomSheet).
- **AlertToast** — tone 4종, 자동 dismiss / 수동 닫기 (X 버튼).
- **Popover / Tooltip** — 컨텍스트 도움말.

### 6.6 상태·피드백
- **Progress** — 선형 (이미지 업로드) / 원형 (저장 중) / indeterminate.
- **Banner** — 화면 상단 알림 (예: "발행 함수가 준비 중입니다").
- **InlineMessage** — 폼 필드 옆 helper / error.

### 6.7 신규 필요 가능성 (디자이너가 정해주면 좋음)
- **사이트 선택기** (슈퍼용) — 현재 활성 사이트 전환 셀렉터
- **이미지 갤러리 picker** — 기존 업로드된 이미지 재사용
- **컬러 피커** — 브랜드 컬러 변경 (P2)
- **드래그·드롭 정렬 핸들** — 카테고리·상품 순서

---

## 7. 상태 매트릭스

모든 인터랙티브 컴포넌트는 다음 상태를 디자인해야 한다.

| 상태 | 설명 | 예시 |
|---|---|---|
| **default (rest)** | 평상시 | 버튼 기본 |
| **hover** | 마우스 오버 (데스크톱) | 색 어두워짐 |
| **focus-visible** | 키보드 포커스 | 외곽선 (--sm-border-focus) |
| **active (pressed)** | 클릭/터치 중 | 더 어두워짐 |
| **selected** | 선택됨 (toggle, chip, row) | brand-subtle 배경 |
| **disabled** | 비활성 | 50% opacity, cursor:not-allowed |
| **loading** | 진행 중 | spinner + 비활성 |
| **error** | 잘못된 입력 / 실패 | status-error 색, alert role |
| **empty** | 데이터 없음 | EmptyState 컴포넌트 |
| **skeleton** | 데이터 로딩 중 | shimmer 애니메이션 |

---

## 8. 반응형 전략 (Mobile-First, 필수)

| 브레이크포인트 | 너비 | 레이아웃 |
|---|---|---|
| mobile | < 600px | 단일 컬럼, 하단 탭바, 모달은 bottom-sheet |
| tablet | 600 ~ 1023px | 단일/이중 컬럼 혼용, 사이드바는 햄버거 메뉴 |
| desktop | ≥ 1024px | 좌측 사이드바 고정 240px + 본문, 모달은 dialog |

### 검증 너비 (필수)
- **360px** (좁은 안드로이드)
- **390px** (iPhone 표준)
- **430px** (iPhone Pro Max)
- **768px** (iPad)
- **1024px+** (데스크톱)

### 모바일 우선 규칙
- 모든 인터랙티브 요소 **44 × 44 pt 이상** (iOS HIG)
- 인접 터치 요소 사이 **8px 이상 간격**
- 주요 액션 버튼(저장·등록·발행)은 **하단 sticky** — `position: sticky; bottom: 0; padding-bottom: env(safe-area-inset-bottom)`
- 데이터 테이블은 모바일에서 카드 리스트로 자동 전환
- 모달은 모바일에서 bottom-sheet 로 자동 전환
- 입력 포커스 시 화면이 키보드 위로 자동 스크롤
- 카메라 직접 촬영 지원: `<input type="file" accept="image/*" capture="environment">`
- 모바일 키보드 최적화: `inputmode="numeric"`, `inputmode="email"` 등

---

## 9. 디자인 토큰 (현재 시스템 v0.5.2)

진본: `desgin_system/tokens/*.json` + `assets/css/_tokens.generated.css`

### 9.1 색 (semantic)
- 배경: `--sm-background-default` / `subtle` / `muted` / `elevated` / `inverse`
- 텍스트: `--sm-content-primary` / `secondary` / `tertiary` / `disabled` / `inverse` / `brand` / `onBrand`
- 경계: `--sm-border-subtle` / `default` / `strong` / `brand` / `focus`
- 표면: `--sm-surface-default` / `raised` / `sunken`
- 브랜드 인터랙티브: `--sm-interactive-brand-default` / `hover` / `active` / `subtle`
- 상태: `--sm-status-success` / `warning` / `error` / `info`
- 시그널: `--sm-signal-highlight`
- 모두 Light/Dark 양쪽 값 보유

### 9.2 타이포그래피 (v0.5.2)
- 패밀리: `--font-sans: "Pretendard Variable", Pretendard` (mono 제거됨, 시스템 폰트 fallback 없음)
- 스케일 (모두 13px 이상):
  - Display: `--text-display-lg` (56px) / `md` (44px) / `sm` (36px)
  - Heading: `--text-heading-lg` (28px) / `md` (22px) / `sm` (18px)
  - Body: `--text-body-lg` (17px) / `md` (15px, 기본) / `sm` (13px, 최소)
  - Label: `--text-label-lg` (15px) / `md` (13px) / `sm` (13px)
  - Caption: `--text-caption` (13px)
  - Overline: `--text-overline` (13px, uppercase, +8% tracking)

### 9.3 간격 (4px 그리드)
- `--size-50` (2px), `--size-100` (4px), `--size-150` (6px), `--size-200` (8px)
- `--size-300` (12px), `--size-400` (16px), `--size-500` (20px), `--size-600` (24px)
- `--size-700` (32px), `--size-800` (40px), `--size-900` (48px), `--size-1000` (64px)
- `--size-1100` (80px), `--size-1200` (96px)

### 9.4 라디우스
- `--radius-xs` (4px), `--radius-sm` (6px), `--radius-md` (10px)
- `--radius-lg` (14px), `--radius-xl` (20px), `--radius-2xl` (28px)
- `--radius-full` (9999px)

### 9.5 모션
- `--motion-instant` (0ms), `--motion-fast` (120ms), `--motion-base` (200ms)
- `--motion-slow` (320ms), `--motion-slower` (480ms)
- `--ease-standard`, `--ease-emphasized`, `--ease-decelerate`, `--ease-accelerate`

### 9.6 Z-index
- `--z-base` (0), `--z-dropdown` (100), `--z-sticky` (200)
- `--z-modal-backdrop` (900), `--z-modal` (1000), `--z-toast` (1100)

---

## 10. 인터랙션 패턴

### 10.1 발행 (Publish) — 가장 중요한 흐름
1. 운영자가 상품·카테고리·홈 섹션을 수정 → `status: "draft"` 로 저장
2. 발행 센터 진입 → 드래프트 카운트 확인 → 메모 입력 (선택) → **지금 발행** 클릭
3. 로딩 토스트 → 성공/실패 토스트
4. GitHub Pages 재빌드 1~3분 후 사이트 반영
5. 발행 이력에 한 줄 추가

### 10.2 다중 선택 일괄 작업
- 상품 카드/행에 체크박스 → 1개 이상 선택 시 **하단 sticky 액션바** 나타남
- 액션: 일괄 노출/숨김, 일괄 삭제, (향후) 일괄 가격 변경
- 선택 해제 / 전체 선택 / 선택된 수 표시

### 10.3 파괴적 작업 확인
- 삭제, 일괄 작업, 발행 후 롤백 등은 **ConfirmDialog** (destructive tone)
- 모바일에서는 햅틱 피드백 권장 (`navigator.vibrate(50)`)

### 10.4 자동 저장 (선택)
- 상품 편집 폼에서 일정 시간 지나면 자동으로 드래프트 저장
- 또는 페이지 이탈 시 "저장하지 않은 변경이 있습니다" 경고

### 10.5 이미지 업로드
- 데스크톱: 드래그·드롭 영역 + 파일 선택 버튼
- 모바일: 파일 선택 + **카메라 즉시 촬영** 버튼 분리
- 업로드 중 진행률 바 표시
- 업로드 후 자동 리사이즈 (200/400/800px) — "리사이즈 완료" 배지

---

## 11. 접근성 요구사항 (WCAG 2.1 AA)

| 항목 | 요구 |
|---|---|
| 색 대비 | 본문 4.5:1, 큰 글자 3:1 이상 |
| 키보드 | 모든 인터랙티브 요소 Tab/Enter/Space 동작, Focus visible 외곽선 |
| 스크린리더 | VoiceOver(iOS) · TalkBack(Android) · NVDA(Windows) 지원, 모든 버튼/입력에 `aria-label` 또는 가시 레이블 |
| 폼 | label-input 명시 연결 (`htmlFor`/`id`), error 시 `aria-invalid="true"` + `role="alert"` |
| 모달 | `role="dialog"` `aria-modal="true"` `aria-labelledby` 설정, focus trap |
| 토스트 | `role="status"` (info/success) 또는 `role="alert"` (warning/danger) |
| 터치 영역 | 모든 인터랙티브 요소 44 × 44pt 이상 |
| 텍스트 | 최소 13px, 사용자가 200% 확대해도 가로 스크롤 없음 |
| 동작 | `prefers-reduced-motion` 시 모션 최소화 |

---

## 12. 콘텐츠 가이드라인

- **언어**: 한국어. 영문은 ID·태그·이메일·코드에만.
- **톤**: 친절하지만 간결. 명령형 ("저장", "추가") + 청유형 ("저장하시겠습니까?") 혼용 자연스럽게.
- **마이크로카피 길이**: 버튼 라벨 2~5자 권장 ("저장", "발행", "취소"), 토스트 메시지 1줄.
- **숫자 표기**: 가격은 천 단위 콤마 + "원" (예: "43,000원"). 시간은 "40분".
- **에러 메시지**: 무엇이 잘못됐는지 + 어떻게 고치는지. "비밀번호가 틀렸습니다" 보다 "이메일 또는 비밀번호가 일치하지 않습니다 — 다시 확인해 주세요".
- **UX 라이팅 원칙**: 디자인시스템 `docs/05-ux-writing.md` 7원칙 따름.

---

## 13. 브랜드 변형 (사이트별)

5개 사이트가 같은 어드민을 공유하지만, **브랜드 컬러 / 폰트 / 로고는 사이트별 다를 수 있다** (P2 기능). 디자이너는 이 변형 가능성을 의식한 디자인을 권장.

| 사이트 | 톤 | 추정 메인 컬러 |
|---|---|---|
| 도화원플라워 | 따뜻한 파스텔 | 핑크/코랄 |
| 벨케이크 | 부드러운 베이지 | 골드/베이지 |
| PARKHAD | 모던 미니멀 | 흑/회색 |
| flower_example | 자연 그린 | 그린/베이지 |
| 풀빛그림아이 | 활기 컬러풀 | 다채로운 컬러 |

현재 어드민은 사이트와 무관하게 indigo brand 색을 사용. **재설계 시 (a) 단일 톤 유지 (b) 사이트별 accent 컬러 추가 중 어느 방향이 좋을지 디자이너 의견 환영.**

---

## 14. 결과물 기대치

다음을 모두 제공해 주시면 개발자가 빠르게 구현 가능합니다.

### 14.1 Figma 파일 (필수)
- 모든 화면 (§ 5) 의 모바일 / 데스크톱 와이어 + 시안
- 주요 상태 (default / loading / empty / error)
- 컴포넌트 변형 (variants × sizes × states)
- 컴포넌트 사이의 spacing, padding 명시
- (가능하면) Auto-layout 적용 + 토큰 변수 사용

### 14.2 디자인 토큰 (선택, 있으면 좋음)
- 색·간격·라디우스·타이포가 현재 디자인시스템과 다르면 토큰 JSON 또는 표로 제공
- 다르지 않으면 "현재 토큰 그대로" 한 줄로 충분

### 14.3 에셋 (필수)
- 아이콘 세트 (현재는 SVG 인라인 18개 사용 — `admin/src/components/icons.tsx` 참고)
- 로고 (어드민 자체 로고)
- PWA 아이콘 (192px / 512px)
- 빈 상태 일러스트 (있으면 좋음)

### 14.4 인터랙션 명세 (선택)
- 마이크로 모션 (페이지 전환, 토스트 등장, bottom-sheet 슬라이드 등) 동영상 또는 Lottie

### 14.5 컴포넌트 명세 변경 사항
- 디자인시스템(`desgin_system/`) 에 추가/수정이 필요한 컴포넌트 목록 + 사양

---

## 15. 참조 자료

| 자료 | 경로 또는 URL |
|---|---|
| 현재 어드민 (재설계 전) | https://easysite-5a560.web.app |
| 5개 운영 사이트 | 도메인 별도 (개발자가 안내) |
| 디자인시스템 진본 | https://github.com/dohoon0505/desgin_system |
| 디자인시스템 AI 가이드 | `desgin_system/AGENTS.md`, `system.json` |
| 컴포넌트 스키마 | `desgin_system/components/*.schema.json` (25종) |
| 토큰 JSON | `desgin_system/tokens/*.json` |
| 운영자 매뉴얼 | `docs/operations-manual-ko.md` (현재 UI 기준) |
| 개발자 가이드 | `docs/deploy-guide-ko.md` |
| RFD 원본 | `easysite_admin_request.md` (요구사항 v1.1) |
| 어드민 소스 코드 | `admin/src/` |

---

## 16. 자주 묻는 질문 (디자이너 → 개발자)

**Q. 디자인시스템에 없는 컴포넌트를 새로 만들어도 되나요?**
A. 가능. 단, 디자인시스템(`desgin_system/`)에 먼저 schema/css 형태로 추가한 뒤 어드민이 import 합니다. 디자인시스템 PR + 어드민 구현 PR 두 개로 나눠 진행.

**Q. 사이트별 브랜드 컬러를 어드민에도 반영하나요?**
A. P2 (Phase 2) 기능. 1차 재설계에선 단일 톤으로 진행 권장. 사이트별 accent 영역 (예: TopAppBar 우측 사이트 배지)에 사이트 컬러를 살짝 적용하는 정도가 적절.

**Q. 다크모드 필수인가요?**
A. 디자인시스템이 이미 다크 대응이라 어드민도 자동 적용. 디자이너가 Light/Dark 둘 다 그릴 필요 없이 색만 토큰으로 잡으면 됨.

**Q. PWA 설치 화면(splash)도 디자인하나요?**
A. 선택. 현재는 manifest 의 theme_color + icon 으로 OS 가 자동 생성. 커스텀 splash 가 필요하면 별도 요청.

**Q. 발행(publish) 흐름의 진행 상태를 시각화하고 싶습니다.**
A. 환영. 현재는 토스트 한 줄로 끝나지만, 발행 진행 단계(코드 생성 → 이미지 다운로드 → GitHub 푸시 → Pages 재빌드)를 시각화하는 progress UI 가 있으면 운영자가 안심합니다.

---

## 17. 변경 이력

- 2026-05-20 — 초안 작성 (v1.0)

---

문의: ehgns335@naver.com (Cris)
