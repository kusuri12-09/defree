# apps/web 프론트엔드 구현 계획

기획안과 UI/UX 디자인 명세에 따라 `apps/web` 디렉토리 내부에 React PWA 기반 프론트엔드를 구축합니다. "반드시 `apps/web` 내부에서만 개발할 것" 이라는 지침에 따라 모노레포의 다른 패키지나 루트 설정은 변경하지 않고 web 프로젝트에만 집중합니다.

## User Review Required

본 구현 계획은 사용자 승인이 완료되었으며, API 호출부는 **Mock 데이터(가짜 데이터)**를 사용하여 UI 완성을 우선적으로 진행하기로 결정되었습니다.

---

## Proposed Changes

### 단계 1: 프로젝트 초기화 및 환경 설정

`apps/web` 디렉토리에 Vite 기반 React + TypeScript 프로젝트를 생성하고, 필요한 라이브러리를 설치합니다.

#### [NEW] `apps/web/package.json` 등 프로젝트 기본 파일
- **프레임워크**: Vite + React 18 + TypeScript
- **라우팅**: `react-router-dom`
- **스타일링**: Tailwind CSS + `lucide-react` (아이콘) + `shadcn/ui` (기본 설정)
- **상태 관리**: `zustand` (전역 상태), `@tanstack/react-query` (서버 상태)
- **HTTP 클라이언트**: `axios`
- **PWA**: `vite-plugin-pwa`
- **공통 타입**: `shared-types` 의존성 추가

### 단계 2: 폴더 구조 및 공통 시스템 세팅

디자인 명세서에 정의된 폴더 구조 및 라우팅, 테마를 설정합니다.

#### [NEW] 폴더 구조 세팅
- `apps/web/src/pages/`: 라우트별 페이지 (Home, Inventory, Recipe, Shopping, MyPage 등)
- `apps/web/src/components/ui/`: 공통 컴포넌트 (Button, Card, Input 등)
- `apps/web/src/components/feature/`: 도메인별 컴포넌트 (IngredientCard, RecipeCard 등)
- `apps/web/src/stores/`: Zustand 전역 상태 (`authStore.ts`, `ingredientStore.ts`)
- `apps/web/src/services/`: API 통신 (Mock 서비스)

#### [NEW] 라우팅 및 레이아웃
- `App.tsx` 및 `router.tsx` 구성
- 메인 레이아웃 (하단 탭바 포함: 홈, 냉장고, 레시피, 장보기, 마이)

### 단계 3: 공통 UI 컴포넌트 및 디자인 토큰 구현

디자인 명세서의 색상, 타이포그래피, 간격 시스템을 Tailwind CSS 설정에 반영하고 공통 UI를 구현합니다.

#### [MODIFY] `apps/web/tailwind.config.js`
- Primary(Green 600), Danger(Red 500), Warning(Orange 400) 등 색상 팔레트 추가

#### [NEW] 공통 컴포넌트 구현
- 하단 네비게이션 탭바 (Bottom Tab Bar)
- 헤더 (Header)
- Button, Badge, Card 등의 기본 UI 컴포넌트

### 단계 4: 핵심 페이지 및 도메인 기능 구현 (Mock Data 활용)

UI/UX 명세서의 화면 설계에 따라 각 페이지의 UI와 기능을 구현합니다.

#### [NEW] `apps/web/src/pages/` 하위 파일들
1. **홈 (SCR-02)**: 유통기한 임박 재료 배너, 오늘의 추천 레시피, 영수증 스캔 FAB 버튼
2. **냉장고 재고 목록 (SCR-05)**: 카테고리 탭, D-Day 배지가 포함된 식재료 카드 리스트
3. **레시피 추천 (SCR-08)**: 보유 재료 기반 필터링 뷰, 조리 완료 버튼 등
4. **장바구니 (SCR-10)**: 추천 구매 목록
5. **영수증 스캔 (SCR-03, 04)**: 파일 업로드 뷰 및 결과 확인 리스트 뷰

---

## Verification Plan

### Automated Tests
- 현재 단계에서는 핵심 UI 렌더링 검증에 집중하며 별도의 자동화 테스트 코드는 작성하지 않습니다. (추후 테스트 페이즈에서 추가)

### Manual Verification
1. `apps/web` 디렉토리 내에서 `pnpm dev` 명령어를 실행하여 로컬 서버를 띄웁니다.
2. 모바일 브라우저 뷰 모드(DevTools)를 켜서 5가지 메인 탭(홈, 냉장고, 레시피, 장보기, 마이) 간의 라우팅이 정상적으로 작동하는지 확인합니다.
3. 각 페이지의 UI 요소(컴포넌트, 색상, 레이아웃)가 디자인 명세서에 맞게 구현되었는지 확인합니다.
4. (PWA) 브라우저에서 '앱 설치' 프롬프트가 나타나거나 Service Worker가 정상 등록되는지 확인합니다.
