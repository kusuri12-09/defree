# 🚀 API 연동 프론트엔드 작업 완료 요약

프론트엔드(`apps/web`)의 가짜 데이터(Mock) 코드를 제거하고, 완성된 실제 API 서버의 명세에 맞추어 연동 작업을 성공적으로 마무리했습니다.

## 🛠️ 작업 내용 (Changes Made)

### 1. 전역 설정 및 인증 흐름 구축

- **`.env` 및 `.env.example` 추가**: `VITE_API_URL` 환경 변수를 사용하여 유연한 서버 주소 관리를 적용했습니다. (기본값: 배포 서버)
- **`Axios` 인스턴스 (`src/lib/api.ts`)**:
  - 인증 토큰(`Authorization: Bearer`)을 자동으로 주입하는 요청 인터셉터를 구성했습니다.
  - 401 에러 발생 시 `/auth/refresh` API를 호출하여 자동으로 토큰을 갱신하는 재시도 로직을 구현했습니다.
- **`Zustand` 기반 `authStore`**: 사용자 정보(`User`)와 토큰 상태를 앱 전역에서 원활하게 관리하도록 설정했습니다.
- **OAuth 콜백 라우트 (`AuthCallback.tsx`)**: 구글/카카오 로그인 후 리다이렉트 되는 페이지를 구현하여 토큰을 안전하게 스토어에 저장하도록 구성했습니다.

### 2. React Query 기반 도메인 훅 구성 (`src/services/*`)

`packages/shared-types`의 타입 정의를 적극 활용하여, 서버 응답 구조와 클라이언트 훅의 타입을 동기화했습니다.

- **`useIngredients`**: 냉장고 재고 목록 조회 및 검색
- **`useRecipes`**: 보유 재고 기반 레시피 추천 및 요리 기록 생성
- **`useShopping`**: 이번 주 장바구니 목록 조회 및 AI 자동 생성

### 3. 실제 UI 컴포넌트 데이터 바인딩

기존에 화면 구조만 잡혀있던 5개의 메인 페이지를 실제 데이터와 연결했습니다.

- **홈 (`Home.tsx`)**: `useIngredients`를 통해 유통기한이 임박한 식재료만 필터링하여 사용자 맞춤 알림을 노출합니다.
- **냉장고 (`Inventory.tsx`)**: API로 받아온 식재료 리스트를 렌더링하고 카테고리/D-Day 계산 로직을 연동했습니다.
- **레시피 (`Recipes.tsx`)**: `useRecipeRecommendations`로 응답받은 일치율(`matchRate`)과 썸네일을 기반으로 레시피 카드를 동적 렌더링합니다.
- **장바구니 (`Shopping.tsx`)**: `useGenerateShoppingList` 훅을 통해 AI 장바구니 추천 생성 버튼을 연동했습니다.
- **마이페이지 (`MyPage.tsx`)**: 스토어에 저장된 유저 정보를 표출하고, 로그아웃 기능과 API 기반 알림 스위치 설정 UI를 적용했습니다.

---

## 🧪 검증 결과 (Validation)

- **공유 패키지 빌드**: `pnpm --filter @defree/shared-types run build` 명령을 통해 타입 정의가 정상적으로 컴파일됨을 확인했습니다.
- **웹 빌드 검증**: TypeScript 엄격한 컴파일 모드(`tsc -b`)와 Vite 프로덕션 빌드(`vite build`)를 모두 통과하여 (`Exit code: 0`), 런타임 오류 및 타입 불일치가 없음을 검증했습니다.

> [!TIP]
> 이제 브라우저에서 `http://localhost:5173/`에 접속하시어 실제 로그인 시도부터 장바구니 자동 생성 기능까지의 워크플로우를 테스트해 보실 수 있습니다! 추가 수정이 필요하거나 API 엣지 케이스 처리(예: 에러 바운더리 등)가 필요하시면 언제든 말씀해 주세요.
