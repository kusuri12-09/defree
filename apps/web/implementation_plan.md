# apps/web API 연동 및 실제 기능 구현 계획

백엔드 API 개발이 완료됨에 따라, 프론트엔드의 가짜 데이터(Mock) UI를 실제 API 명세서(`04_API_명세.md`)와 연동하여 동작하는 애플리케이션으로 전환합니다.

## User Review Required

> [!IMPORTANT]
> 본격적인 API 연동 코드 작성 전에 아래 계획을 확인해 주세요. 특히 API Base URL 설정에 대한 답변이 필요합니다.

## Open Questions

> [!WARNING]
>
> 1. 프론트엔드에서 바라볼 **API Base URL**을 명세서에 적힌 배포용 주소(`https://defree-api.duckdns.org/v1`)로 고정할까요, 아니면 로컬 환경(`http://localhost:3000/v1`)용 환경 변수(`.env`)를 우선 적용할까요?
> 2. 로그인(Google/Kakao)의 경우, OAuth 인증 플로우 상 프론트엔드 라우팅 페이지(예: `/auth/callback`)가 필요한데, 이 부분까지 한 번에 구현해 드릴까요?

---

## Proposed Changes

### 단계 1: API 클라이언트(Axios) 및 인증 스토어 구축

가장 핵심이 되는 API 통신 기반을 다집니다. Access Token을 관리하고 토큰 만료 시 자동으로 갱신(Refresh)하는 로직을 포함합니다.

#### [NEW] `apps/web/src/lib/api.ts` (또는 `services/api.ts`)

- Axios 인스턴스 생성 (`baseURL`, 기본 헤더 설정)
- 요청 인터셉터: Zustand의 Auth 스토어에서 Access Token을 가져와 `Authorization: Bearer {token}` 자동 추가
- 응답 인터셉터: 401 Unauthorized 에러 발생 시 `/auth/refresh` API를 호출하여 토큰 갱신 후 원래 요청 재시도

#### [NEW] `apps/web/src/stores/authStore.ts`

- Zustand를 사용하여 `accessToken`, `user` 객체 전역 관리
- 로그인/로그아웃 액션 정의

### 단계 2: 도메인별 React Query 커스텀 훅 작성

`@tanstack/react-query`를 활용하여 API 응답 데이터를 캐싱하고, 로딩/에러 상태를 관리하는 훅을 만듭니다. `packages/shared-types`의 타입 인터페이스를 적극 활용합니다.

#### [NEW] `apps/web/src/services/` 하위 훅들

- `useIngredients.ts`: `GET /ingredients` (재고 목록), `POST /ingredients` (수동 추가), `PATCH /ingredients/:id` (수정), `DELETE` 등
- `useRecipes.ts`: `GET /recipes/recommendations` (재고 기반 추천)
- `useShopping.ts`: `GET /shopping-list`, `POST /shopping-list/generate` (자동 생성)
- `useReceipts.ts`: `POST /receipts/scan` (스캔), `GET /receipts/:id` (폴링), `POST /.../confirm` (저장)

### 단계 3: UI 페이지 실제 데이터 바인딩

기존에 하드코딩된 Dummy 데이터를 제거하고, 위에서 만든 Query 훅을 연결합니다.

#### [MODIFY] `apps/web/src/pages/Home.tsx`

- `useIngredients({ expiringWithin: 2 })`로 임박 재료 동적 노출
- `useRecipes()`로 오늘의 추천 레시피 노출

#### [MODIFY] `apps/web/src/pages/Inventory.tsx`

- `useIngredients` 데이터를 카테고리별/D-day별로 분류하여 렌더링
- [+ 추가] 버튼 클릭 시 모달 또는 폼을 통해 재고 수동 추가 연동

#### [MODIFY] `apps/web/src/pages/Recipes.tsx`

- 보유 재료 기반으로 필터링된 레시피 목록 동적 노출
- '조리 완료' 버튼 클릭 시 `/cooking-logs` API 연동하여 실제 재고 차감

#### [MODIFY] `apps/web/src/pages/Shopping.tsx`

- `useShopping()` 데이터 렌더링
- 구매 완료 처리 연동

#### [MODIFY] `apps/web/src/pages/MyPage.tsx`

- `useAuth()` 사용자 프로필 표시
- `GET /notifications/settings` 연동 및 스위치 토글 시 `PUT` 업데이트

---

## Verification Plan

### Automated Tests

- 현 단계에서는 API 통합의 정확성을 위해 브라우저 개발자 도구(Network 탭)를 통한 요청/응답 검증을 최우선으로 합니다.

### Manual Verification

1. `apps/web`을 실행하고 브라우저에서 화면을 확인합니다.
2. 홈, 냉장고, 레시피 탭에서 로딩 스피너 작동 후 백엔드 데이터가 정상 표출되는지 검증합니다. (데이터베이스가 비어있다면 Empty State 화면이 나오는지 확인)
3. 401 응답 발생 시 Refresh Token 쿠키를 통해 정상적으로 Access Token이 갱신되는지 네트워크 탭에서 확인합니다.
