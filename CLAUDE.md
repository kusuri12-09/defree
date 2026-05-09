# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 프로젝트 개요

**defree** — 영수증 OCR 스캔으로 냉장고 재고를 자동 관리하고, 유통기한 임박 알림과 AI 레시피 추천으로 1인 가구의 식재료 낭비를 줄이는 PWA 서비스.

---

## 모노레포 구조

Turborepo + pnpm workspaces 기반 모노레포.

```
defree/
├── apps/
│   ├── api/          # NestJS 백엔드 (REST API + 스케줄러)
│   └── web/          # React PWA (프론트엔드)
├── packages/
│   ├── shared-types/ # 백엔드↔프론트 공통 DTO / 인터페이스
│   ├── ocr/          # Clova OCR → GPT 품목명 정규화 파이프라인
│   └── notification/ # Discord / Slack Webhook + FCM Web Push 공통 모듈
└── docker-compose.yml
```

---

## 개발 명령어

```bash
# 의존성 설치
pnpm install

# 전체 빌드
pnpm build

# 개발 서버 (api + web 동시 실행)
pnpm dev

# 앱별 개발 서버
pnpm --filter api dev
pnpm --filter web dev

# 전체 테스트
pnpm test

# 앱별 테스트
pnpm --filter api test
pnpm --filter web test

# 단일 테스트 파일 실행
pnpm --filter api test -- --testPathPattern="ingredients.service"
pnpm --filter web test -- --testPathPattern="useIngredients"

# 린트
pnpm lint

# 타입 체크
pnpm typecheck

# DB 컨테이너 실행 (PostgreSQL + Redis)
docker-compose up -d

# DB 마이그레이션
pnpm --filter api migration:run

# DB 마이그레이션 생성
pnpm --filter api migration:generate --name=MigrationName
```

---

## 백엔드 아키텍처 (`apps/api`)

### 레이어드 아키텍처 + DDD

```
apps/api/src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── ingredients/
│   ├── receipts/       # OCR 스캔 처리
│   ├── recipes/
│   ├── cooking-logs/
│   ├── shopping/
│   └── notifications/
└── common/
    ├── guards/         # JwtAuthGuard 등
    ├── decorators/
    ├── filters/        # 전역 예외 필터
    └── interceptors/
```

각 모듈은 아래 레이어를 따른다:

| 레이어 | 파일 | 역할 |
|--------|------|------|
| Controller | `*.controller.ts` | HTTP 요청/응답, DTO 검증 |
| Service | `*.service.ts` | 비즈니스 로직 |
| Repository | `*.repository.ts` | DB 접근 (TypeORM) |
| Entity | `*.entity.ts` | DB 테이블 매핑 (DDD 엔티티) |
| DTO | `dto/*.dto.ts` | 요청/응답 데이터 형식 |

- Controller는 Service만 호출한다. Repository를 직접 호출하지 않는다.
- Service는 도메인 로직을 포함하며 다른 모듈의 Service를 주입받을 수 있다.
- Entity에 도메인 메서드를 포함한다 (예: `ingredient.markAsConsumed()`).

### 인증

- Google / Kakao OAuth 2.0 + JWT
- Access Token 유효기간: 15분, Refresh Token: 7일
- Refresh Token은 `HttpOnly; SameSite=Strict` 쿠키로 전달
- `JwtAuthGuard`를 전역 기본값으로 설정, 공개 엔드포인트에 `@Public()` 데코레이터 사용

### 스케줄러

- `@nestjs/schedule` 사용
- 매일 오전 9시: 전체 재고 D-day 계산 → D-알림선행일 이하 재료 추출 → 알림 발송
- 알림 채널: Discord Webhook / Slack Webhook / FCM Web Push

### 외부 서비스 연동

| 서비스 | 용도 | 패키지 위치 |
|--------|------|-------------|
| Naver Clova OCR | 영수증 텍스트 추출 | `packages/ocr` |
| OpenAI GPT (gpt-4o-mini) | 비정형 상품명 → 표준 품목명 정규화 | `packages/ocr` |
| 만개의 레시피 API | 재료 기반 레시피 검색 | `apps/api` |
| YouTube Data API | 레시피 영상 연동 | `apps/api` |
| Discord / Slack Webhook | 알림 발송 | `packages/notification` |
| FCM (Firebase) | Web Push 알림 | `packages/notification` |

---

## 프론트엔드 아키텍처 (`apps/web`)

- React 18 + TypeScript + Vite
- 상태 관리: Zustand (전역 인증·재고 상태) + TanStack Query (서버 상태 캐싱)
- 스타일: Tailwind CSS + shadcn/ui
- PWA: Vite PWA Plugin + Workbox (Service Worker)

```
apps/web/src/
├── components/
│   ├── ui/       # shadcn/ui 기본 컴포넌트
│   └── feature/  # 도메인별 컴포넌트 (ingredient/, recipe/, scan/, shopping/)
├── pages/        # 라우트 단위 페이지
├── stores/       # Zustand 스토어 (authStore, ingredientStore, notificationStore)
├── services/     # axios API 호출 함수
├── hooks/        # 커스텀 훅
└── utils/        # 순수 유틸 함수
```

- API 타입은 `packages/shared-types`에서 import하며 중복 정의하지 않는다.
- 401 응답 시 Axios 인터셉터가 `/auth/refresh`를 자동 호출 후 원래 요청을 재시도한다.

---

## 데이터베이스

- PostgreSQL 16 (Docker 컨테이너, EC2 직접 운영)
- Redis (알림 스케줄 큐 + 레시피 캐시)
- ORM: TypeORM
- 타임존: UTC 저장, 앱 레이어에서 KST 변환
- 소프트 삭제: `users` 테이블만 `deleted_at` 컬럼 사용. 나머지는 `status` 컬럼 전환

주요 테이블: `users`, `ingredients`, `ingredient_categories`, `receipts`, `receipt_items`, `recipes`, `recipe_ingredients`, `notification_settings`, `notification_logs`, `shopping_lists`, `shopping_list_items`, `cooking_logs`, `cooking_log_items`

---

## API 규칙

- Base URL: `https://defree-api.duckdns.org/v1`
- 인증 헤더: `Authorization: Bearer {access_token}`
- 성공 응답: `{ "data": ... }` / 목록: `{ "data": [...], "meta": { total, page, limit } }`
- 에러 응답: `{ "code": "ERROR_CODE", "message": "..." }`
- 날짜: `YYYY-MM-DD`, 날짜시간: `YYYY-MM-DD HH:mm:ss`

전체 엔드포인트 명세는 `document/04_API_명세.md` 참고.

---

## 커밋 규칙

**기능 하나 완성 = 커밋 하나.** 여러 기능을 묶어서 커밋하지 않는다.

```
feat: 재고 목록 조회 API 구현
fix: 유통기한 D-day 계산 오류 수정
refactor: OCR 파이프라인 모듈 분리
test: ingredients 서비스 단위 테스트 추가
docs: API 명세 업데이트
chore: 의존성 업데이트
```

---

## 환경 변수

`apps/api/.env` 기준 (`.env.example` 참고):

```
DATABASE_URL=
REDIS_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
CLOVA_OCR_API_KEY=
CLOVA_OCR_INVOKE_URL=
OPENAI_API_KEY=
MANGAE_RECIPE_API_KEY=
YOUTUBE_API_KEY=
FCM_SERVICE_ACCOUNT_KEY=
WEBHOOK_ENCRYPTION_KEY=
AWS_S3_BUCKET=
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

---

## 참고 문서

| 문서 | 경로 |
|------|------|
| 서비스 기획안 | `document/01_서비스_기획안.md` |
| UI/UX 디자인 명세 | `document/02_UIUX_디자인_명세.md` |
| 데이터베이스 설계 | `document/03_데이터베이스_설계.md` |
| API 명세 | `document/04_API_명세.md` |
