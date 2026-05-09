# defree — API 명세

---

## 엔드포인트 요약

| #               | 메서드   | 경로                           | 설명                   | 인증 |
| --------------- | -------- | ------------------------------ | ---------------------- | ---- |
| **인증**        |
| 1-1             | `POST`   | `/auth/google`                 | Google OAuth 로그인    | ❌   |
| 1-2             | `POST`   | `/auth/kakao`                  | Kakao OAuth 로그인     | ❌   |
| 1-3             | `POST`   | `/auth/refresh`                | Access Token 갱신      | 쿠키 |
| 1-4             | `DELETE` | `/auth/logout`                 | 로그아웃               | ✅   |
| **사용자**      |
| 2-1             | `GET`    | `/users/me`                    | 내 프로필 조회         | ✅   |
| 2-2             | `PATCH`  | `/users/me`                    | 프로필 수정            | ✅   |
| 2-3             | `DELETE` | `/users/me`                    | 계정 탈퇴              | ✅   |
| **카테고리**    |
| 3-1             | `GET`    | `/ingredient-categories`       | 카테고리 목록 조회     | ❌   |
| **재고**        |
| 4-1             | `GET`    | `/ingredients`                 | 재고 목록 조회         | ✅   |
| 4-2             | `POST`   | `/ingredients`                 | 재고 수동 추가         | ✅   |
| 4-3             | `GET`    | `/ingredients/:id`             | 재고 상세 조회         | ✅   |
| 4-4             | `PATCH`  | `/ingredients/:id`             | 재고 수정              | ✅   |
| 4-5             | `DELETE` | `/ingredients/:id`             | 재고 삭제              | ✅   |
| 4-6             | `PATCH`  | `/ingredients/:id/freeze`      | 냉동 전환              | ✅   |
| **영수증 스캔** |
| 5-1             | `POST`   | `/receipts/scan`               | 영수증 스캔 요청 (OCR) | ✅   |
| 5-2             | `GET`    | `/receipts/:receiptId`         | 스캔 결과 조회 (폴링)  | ✅   |
| 5-3             | `POST`   | `/receipts/:receiptId/confirm` | 결과 확인 & 재고 저장  | ✅   |
| 5-4             | `GET`    | `/receipts`                    | 스캔 이력 조회         | ✅   |
| **레시피**      |
| 6-1             | `GET`    | `/recipes/recommendations`     | 재고 기반 레시피 추천  | ✅   |
| 6-2             | `GET`    | `/recipes/:id`                 | 레시피 상세 조회       | ✅   |
| **조리 완료**   |
| 7-1             | `POST`   | `/cooking-logs`                | 조리 완료 & 재고 차감  | ✅   |
| **장바구니**    |
| 8-1             | `GET`    | `/shopping-list`               | 현재 장바구니 조회     | ✅   |
| 8-2             | `POST`   | `/shopping-list/generate`      | 장바구니 자동 생성     | ✅   |
| 8-3             | `POST`   | `/shopping-list/items`         | 아이템 수동 추가       | ✅   |
| 8-4             | `PATCH`  | `/shopping-list/items/:itemId` | 아이템 수정            | ✅   |
| 8-5             | `DELETE` | `/shopping-list/items/:itemId` | 아이템 삭제            | ✅   |
| 8-6             | `POST`   | `/shopping-list/complete`      | 장보기 완료 처리       | ✅   |
| **알림**        |
| 9-1             | `GET`    | `/notifications/settings`      | 알림 설정 조회         | ✅   |
| 9-2             | `PUT`    | `/notifications/settings`      | 알림 설정 저장         | ✅   |
| 9-3             | `POST`   | `/notifications/subscribe`     | FCM 구독 등록          | ✅   |
| 9-4             | `DELETE` | `/notifications/subscribe`     | FCM 구독 해제          | ✅   |
| **헬스체크**    |
| 10-1            | `GET`    | `/health`                      | 서버 상태 확인         | ❌   |

---

## 개요

| 항목         | 내용                                |
| ------------ | ----------------------------------- |
| Base URL     | `https://defree-api.duckdns.org/v1` |
| 프로토콜     | HTTPS (Let's Encrypt)               |
| 인증 방식    | JWT Bearer Token                    |
| 데이터 형식  | `application/json`                  |
| 날짜 포매팅  | `2026-05-09 09:00:00`               |
| 날짜(날짜만) | `YYYY-MM-DD` (`2026-05-09`)         |

---

## 공통 규칙

### 인증 헤더

보호된 엔드포인트는 모든 요청에 다음 헤더를 포함해야 한다.

```
Authorization: Bearer {access_token}
```

### 공통 응답 형식

#### 성공

```json
{
  "data": { ... }
}
```

목록 응답의 경우:

```json
{
  "data": [ ... ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 20
  }
}
```

#### 에러

```json
{
  "code": "INGREDIENT_NOT_FOUND",
  "message": "해당 재고를 찾을 수 없습니다."
}
```

### HTTP 상태 코드

| 코드  | 의미                            |
| ----- | ------------------------------- |
| `200` | 조회·수정·삭제 성공             |
| `201` | 생성 성공                       |
| `400` | 잘못된 요청 (유효성 오류)       |
| `401` | 인증 필요 (토큰 없음 또는 만료) |
| `403` | 권한 없음 (타인 리소스 접근)    |
| `404` | 리소스 없음                     |
| `409` | 충돌 (중복 등록 등)             |
| `422` | 처리 불가 (비즈니스 로직 오류)  |
| `500` | 서버 내부 오류                  |

### 공통 에러 코드

| code               | HTTP | 설명                              |
| ------------------ | ---- | --------------------------------- |
| `UNAUTHORIZED`     | 401  | 인증 토큰 없음 또는 유효하지 않음 |
| `TOKEN_EXPIRED`    | 401  | Access Token 만료                 |
| `FORBIDDEN`        | 403  | 요청 리소스에 대한 권한 없음      |
| `NOT_FOUND`        | 404  | 리소스 없음                       |
| `VALIDATION_ERROR` | 400  | 요청 바디·파라미터 유효성 오류    |
| `INTERNAL_ERROR`   | 500  | 서버 내부 오류                    |

---

## 1. 인증 (Auth)

### 1-1. Google OAuth 로그인

소셜 로그인 후 발급된 OAuth 코드를 서버에 전달해 JWT를 발급받는다.

```
POST /auth/google
```

**Request Body**

```json
{
  "code": "4/0AX4XfWj...",
  "redirectUri": "https://defree.duckdns.org/auth/callback"
}
```

| 필드          | 타입     | 필수 | 설명                           |
| ------------- | -------- | ---- | ------------------------------ |
| `code`        | `string` | ✅   | Google OAuth 인증 코드         |
| `redirectUri` | `string` | ✅   | 클라이언트 등록 리다이렉트 URI |

**Response `201`**

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "홍길동",
      "provider": "google"
    }
  }
}
```

> Refresh Token은 `HttpOnly; SameSite=Strict; Secure` 쿠키로 설정된다.

**에러 코드**

| code                   | HTTP | 설명                     |
| ---------------------- | ---- | ------------------------ |
| `OAUTH_CODE_INVALID`   | 400  | 유효하지 않은 OAuth 코드 |
| `OAUTH_PROVIDER_ERROR` | 502  | 소셜 로그인 제공자 오류  |

---

### 1-2. Kakao OAuth 로그인

```
POST /auth/kakao
```

**Request Body** (Google과 동일 구조)

```json
{
  "code": "hQyMaZ5...",
  "redirectUri": "https://defree.duckdns.org/auth/callback"
}
```

**Response `201`** (Google과 동일 구조)

---

### 1-3. Access Token 갱신

Refresh Token 쿠키를 사용해 새 Access Token을 발급받는다.

```
POST /auth/refresh
```

**Request** — Body 없음, `refresh_token` 쿠키 자동 전송

**Response `200`**

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**에러 코드**

| code                    | HTTP | 설명                                  |
| ----------------------- | ---- | ------------------------------------- |
| `REFRESH_TOKEN_INVALID` | 401  | Refresh Token 없음 또는 유효하지 않음 |
| `REFRESH_TOKEN_EXPIRED` | 401  | Refresh Token 만료 (재로그인 필요)    |

---

### 1-4. 로그아웃

```
DELETE /auth/logout
```

**Request Header** — `Authorization: Bearer {access_token}`

**Response `200`**

```json
{
  "data": { "message": "로그아웃되었습니다." }
}
```

> 서버에서 Refresh Token 해시를 무효화하고, 응답 시 쿠키를 만료 처리한다.

---

## 2. 사용자 (Users)

### 2-1. 내 프로필 조회

```
GET /users/me
```

**Response `200`**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "홍길동",
    "provider": "google",
    "createdAt": "2026-05-01T09:00:00+09:00"
  }
}
```

---

### 2-2. 프로필 수정

```
PATCH /users/me
```

**Request Body**

```json
{
  "name": "홍길순"
}
```

| 필드   | 타입     | 필수 | 설명                       |
| ------ | -------- | ---- | -------------------------- |
| `name` | `string` | ❌   | 변경할 표시 이름 (1~100자) |

**Response `200`**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "홍길순",
    "email": "user@example.com",
    "provider": "google",
    "createdAt": "2026-05-01T09:00:00+09:00"
  }
}
```

---

### 2-3. 계정 탈퇴

```
DELETE /users/me
```

**Response `200`**

```json
{
  "data": { "message": "계정이 삭제되었습니다." }
}
```

> `users.deleted_at` 소프트 삭제 처리. 모든 개인 데이터는 30일 후 완전 삭제된다.

---

## 3. 식재료 카테고리 (Ingredient Categories)

### 3-1. 카테고리 목록 조회

카테고리별 기본 유통기한·알림 선행일을 조회한다. 비인증 요청도 허용한다.

```
GET /ingredient-categories
```

**Response `200`**

```json
{
  "data": [
    {
      "id": 1,
      "name": "잎채소",
      "iconEmoji": "🥬",
      "defaultExpiryDays": 3,
      "notificationLeadDays": 2,
      "canFreeze": false,
      "frozenExpiryDays": null,
      "singleServingUnit": "1줌"
    },
    {
      "id": 3,
      "name": "육류",
      "iconEmoji": "🥩",
      "defaultExpiryDays": 3,
      "notificationLeadDays": 2,
      "canFreeze": true,
      "frozenExpiryDays": 90,
      "singleServingUnit": "150g"
    }
  ]
}
```

---

## 4. 재고 (Ingredients)

### 4-1. 재고 목록 조회

```
GET /ingredients
```

**Query Parameters**

| 파라미터         | 타입     | 필수 | 기본값       | 설명                                                                |
| ---------------- | -------- | ---- | ------------ | ------------------------------------------------------------------- |
| `status`         | `string` | ❌   | `active`     | 재고 상태 필터 (`active` \| `consumed` \| `expired` \| `discarded`) |
| `categoryId`     | `number` | ❌   | —            | 카테고리 ID 필터                                                    |
| `expiringWithin` | `number` | ❌   | —            | N일 이내 소비기한 도래 필터 (예: `2`)                               |
| `sort`           | `string` | ❌   | `expiryDate` | 정렬 기준 (`expiryDate` \| `createdAt` \| `name`)                   |
| `order`          | `string` | ❌   | `asc`        | 정렬 방향 (`asc` \| `desc`)                                         |
| `page`           | `number` | ❌   | `1`          | 페이지 번호                                                         |
| `limit`          | `number` | ❌   | `50`         | 페이지당 항목 수 (최대 100)                                         |

**Response `200`**

```json
{
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "방울토마토",
      "category": {
        "id": 1,
        "name": "잎채소",
        "iconEmoji": "🥬"
      },
      "quantity": 1.0,
      "unit": "봉",
      "purchaseDate": "2026-05-08",
      "expiryDate": "2026-05-10",
      "dDay": -1,
      "isFrozen": false,
      "frozenAt": null,
      "status": "active",
      "source": "ocr",
      "createdAt": "2026-05-08T14:00:00+09:00",
      "updatedAt": "2026-05-08T14:00:00+09:00"
    }
  ],
  "meta": {
    "total": 12,
    "page": 1,
    "limit": 50
  }
}
```

> `dDay`: 오늘 기준 소비기한까지 남은 일수. `0`은 당일, 음수는 초과.

---

### 4-2. 재고 수동 추가

```
POST /ingredients
```

**Request Body**

```json
{
  "name": "두부",
  "categoryId": 2,
  "quantity": 1,
  "unit": "모",
  "purchaseDate": "2026-05-09",
  "expiryDate": "2026-05-14"
}
```

| 필드           | 타입     | 필수 | 설명                                         |
| -------------- | -------- | ---- | -------------------------------------------- |
| `name`         | `string` | ✅   | 품목명 (1~100자)                             |
| `categoryId`   | `number` | ✅   | 카테고리 ID                                  |
| `quantity`     | `number` | ✅   | 수량 (> 0)                                   |
| `unit`         | `string` | ✅   | 단위 (예: `개`, `g`, `ml`, `봉`, `모`)       |
| `purchaseDate` | `string` | ✅   | 구매일 (`YYYY-MM-DD`)                        |
| `expiryDate`   | `string` | ✅   | 소비기한 (`YYYY-MM-DD`, `purchaseDate` 이후) |

**Response `201`**

```json
{
  "data": {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "name": "두부",
    "category": {
      "id": 2,
      "name": "두부·콩류",
      "iconEmoji": "🫘"
    },
    "quantity": 1.0,
    "unit": "모",
    "purchaseDate": "2026-05-09",
    "expiryDate": "2026-05-14",
    "dDay": 5,
    "isFrozen": false,
    "frozenAt": null,
    "status": "active",
    "source": "manual",
    "createdAt": "2026-05-09T10:00:00+09:00",
    "updatedAt": "2026-05-09T10:00:00+09:00"
  }
}
```

---

### 4-3. 재고 상세 조회

```
GET /ingredients/:id
```

**Path Parameter**

| 파라미터 | 타입            | 설명        |
| -------- | --------------- | ----------- |
| `id`     | `string (UUID)` | 재고 식별자 |

**Response `200`** — 4-2 응답과 동일 구조

---

### 4-4. 재고 수정

```
PATCH /ingredients/:id
```

**Request Body** — 수정할 필드만 전달 (부분 업데이트)

```json
{
  "name": "유기농 두부",
  "quantity": 2,
  "expiryDate": "2026-05-15"
}
```

| 필드           | 타입     | 필수 | 설명                                  |
| -------------- | -------- | ---- | ------------------------------------- |
| `name`         | `string` | ❌   | 품목명                                |
| `categoryId`   | `number` | ❌   | 카테고리 ID                           |
| `quantity`     | `number` | ❌   | 수량 (>= 0)                           |
| `unit`         | `string` | ❌   | 단위                                  |
| `purchaseDate` | `string` | ❌   | 구매일                                |
| `expiryDate`   | `string` | ❌   | 소비기한                              |
| `status`       | `string` | ❌   | 재고 상태 (`consumed` \| `discarded`) |

**Response `200`** — 수정된 재고 전체 객체 반환

---

### 4-5. 재고 삭제

```
DELETE /ingredients/:id
```

**Response `200`**

```json
{
  "data": { "message": "재고가 삭제되었습니다." }
}
```

> `status`를 `discarded`로 변경하는 소프트 삭제 처리.

---

### 4-6. 냉동 전환

```
PATCH /ingredients/:id/freeze
```

**Request Body**

```json
{
  "isFrozen": true
}
```

| 필드       | 타입      | 필수 | 설명                             |
| ---------- | --------- | ---- | -------------------------------- |
| `isFrozen` | `boolean` | ✅   | `true`: 냉동, `false`: 냉동 해제 |

**Response `200`**

```json
{
  "data": {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "name": "두부",
    "isFrozen": true,
    "frozenAt": "2026-05-09",
    "expiryDate": "2026-08-07",
    "dDay": 90
  }
}
```

> `isFrozen: true` 시 `frozenAt`을 오늘로 설정하고, `expiryDate`를 `카테고리.frozenExpiryDays`만큼 연장한다.

**에러 코드**

| code                     | HTTP | 설명               |
| ------------------------ | ---- | ------------------ |
| `CATEGORY_NOT_FREEZABLE` | 422  | 냉동 불가 카테고리 |

---

## 5. 영수증 스캔 (Receipts)

### 5-1. 영수증 스캔 요청

이미지를 업로드하면 OCR + LLM 정규화 파이프라인을 비동기로 실행한다.

```
POST /receipts/scan
Content-Type: multipart/form-data
```

**Request Form Data**

| 필드    | 타입   | 필수 | 설명                                     |
| ------- | ------ | ---- | ---------------------------------------- |
| `image` | `file` | ✅   | 영수증 이미지 (JPEG/PNG/WEBP, 최대 10MB) |

**Response `202`** — 처리 시작, 결과는 폴링 필요

```json
{
  "data": {
    "receiptId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "status": "processing",
    "imageUrl": "https://s3.amazonaws.com/defree/receipts/c3d4e5f6...?X-Amz-Signature=...",
    "scannedAt": "2026-05-09T14:30:00+09:00"
  }
}
```

**에러 코드**

| code                  | HTTP | 설명                    |
| --------------------- | ---- | ----------------------- |
| `IMAGE_TYPE_INVALID`  | 400  | 허용되지 않는 파일 형식 |
| `IMAGE_SIZE_EXCEEDED` | 400  | 파일 크기 초과 (10MB)   |
| `OCR_SERVICE_ERROR`   | 502  | Clova OCR 서비스 오류   |

---

### 5-2. 스캔 결과 조회 (폴링)

OCR 처리가 완료될 때까지 주기적으로 조회한다. 클라이언트는 1초 간격, 최대 20회 폴링을 권장한다.

```
GET /receipts/:receiptId
```

**Response `200` — 처리 중**

```json
{
  "data": {
    "receiptId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "status": "processing",
    "items": null
  }
}
```

**Response `200` — 완료**

```json
{
  "data": {
    "receiptId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "status": "completed",
    "completedAt": "2026-05-09T14:30:04+09:00",
    "items": [
      {
        "receiptItemId": "d4e5f6a7-b8c9-0123-defa-234567890123",
        "rawName": "삼양)라120*5",
        "normalizedName": "라면",
        "quantity": 5,
        "unit": "개",
        "suggestedExpiryDays": 90,
        "suggestedExpiryDate": "2026-08-07",
        "categoryId": 7,
        "categoryName": "가공식품",
        "isConfirmed": false
      },
      {
        "receiptItemId": "e5f6a7b8-c9d0-1234-efab-345678901234",
        "rawName": "방울 토마토",
        "normalizedName": "방울토마토",
        "quantity": 1,
        "unit": "봉",
        "suggestedExpiryDays": 3,
        "suggestedExpiryDate": "2026-05-12",
        "categoryId": 1,
        "categoryName": "잎채소",
        "isConfirmed": false
      }
    ]
  }
}
```

**Response `200` — 실패**

```json
{
  "data": {
    "receiptId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "status": "failed",
    "errorMessage": "영수증 텍스트를 인식하지 못했습니다."
  }
}
```

---

### 5-3. 스캔 결과 확인 & 재고 저장 (SCR-04 저장)

사용자가 항목을 검토·수정한 후 냉장고에 최종 저장한다.

```
POST /receipts/:receiptId/confirm
```

**Request Body**

```json
{
  "items": [
    {
      "receiptItemId": "d4e5f6a7-b8c9-0123-defa-234567890123",
      "normalizedName": "라면",
      "categoryId": 7,
      "quantity": 5,
      "unit": "개",
      "purchaseDate": "2026-05-09",
      "expiryDate": "2026-08-07"
    },
    {
      "receiptItemId": "e5f6a7b8-c9d0-1234-efab-345678901234",
      "normalizedName": "방울토마토",
      "categoryId": 1,
      "quantity": 1,
      "unit": "봉",
      "purchaseDate": "2026-05-09",
      "expiryDate": "2026-05-12"
    }
  ]
}
```

| 필드                     | 타입            | 필수 | 설명                        |
| ------------------------ | --------------- | ---- | --------------------------- |
| `items`                  | `array`         | ✅   | 저장할 항목 목록 (최소 1개) |
| `items[].receiptItemId`  | `string (UUID)` | ✅   | 영수증 항목 ID              |
| `items[].normalizedName` | `string`        | ✅   | (수정된) 품목명             |
| `items[].categoryId`     | `number`        | ✅   | 카테고리 ID                 |
| `items[].quantity`       | `number`        | ✅   | 수량 (> 0)                  |
| `items[].unit`           | `string`        | ✅   | 단위                        |
| `items[].purchaseDate`   | `string`        | ✅   | 구매일                      |
| `items[].expiryDate`     | `string`        | ✅   | 소비기한                    |

**Response `201`**

```json
{
  "data": {
    "savedCount": 2,
    "ingredients": [
      {
        "id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
        "name": "라면",
        "quantity": 5,
        "unit": "개",
        "expiryDate": "2026-08-07",
        "dDay": 90
      },
      {
        "id": "a7b8c9d0-e1f2-3456-abcd-567890123456",
        "name": "방울토마토",
        "quantity": 1,
        "unit": "봉",
        "expiryDate": "2026-05-12",
        "dDay": 3
      }
    ]
  }
}
```

---

### 5-4. 스캔 이력 조회

```
GET /receipts
```

**Query Parameters**

| 파라미터 | 타입     | 기본값 | 설명             |
| -------- | -------- | ------ | ---------------- |
| `page`   | `number` | `1`    | 페이지 번호      |
| `limit`  | `number` | `20`   | 페이지당 항목 수 |

**Response `200`**

```json
{
  "data": [
    {
      "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
      "status": "completed",
      "itemCount": 5,
      "imageUrl": "https://s3.amazonaws.com/...",
      "scannedAt": "2026-05-09T14:30:00+09:00",
      "completedAt": "2026-05-09T14:30:04+09:00"
    }
  ],
  "meta": { "total": 7, "page": 1, "limit": 20 }
}
```

---

## 6. 레시피 (Recipes)

### 6-1. 재고 기반 레시피 추천

현재 보유 재료를 분석해 만들 수 있는 레시피를 반환한다. 유통기한 임박 재료를 사용하는 레시피가 우선 정렬된다.

```
GET /recipes/recommendations
```

**Query Parameters**

| 파라미터                | 타입      | 기본값 | 설명                                                      |
| ----------------------- | --------- | ------ | --------------------------------------------------------- |
| `includePartial`        | `boolean` | `true` | 재료가 일부 부족한 레시피 포함 여부                       |
| `maxMissingIngredients` | `number`  | `2`    | 부족 재료 최대 허용 개수 (`includePartial: true` 시 유효) |
| `cookTimeMax`           | `number`  | —      | 조리 시간 상한(분) 필터                                   |
| `limit`                 | `number`  | `10`   | 반환할 레시피 수                                          |

**Response `200`**

```json
{
  "data": {
    "canMakeNow": [
      {
        "id": "b8c9d0e1-f2a3-4567-bcde-678901234567",
        "title": "방울토마토 파스타",
        "source": "mangae",
        "servings": 1,
        "cookTimeMinutes": 20,
        "thumbnailUrl": "https://...",
        "sourceUrl": "https://www.10000recipe.com/...",
        "youtubeUrl": "https://youtube.com/watch?v=...",
        "matchedIngredients": ["방울토마토", "파스타면", "올리브유"],
        "missingIngredients": [],
        "missingCount": 0,
        "usesExpiringIngredients": true,
        "expiringIngredients": [{ "name": "방울토마토", "dDay": 1 }]
      }
    ],
    "nearlyPossible": [
      {
        "id": "c9d0e1f2-a3b4-5678-cdef-789012345678",
        "title": "된장찌개",
        "source": "mangae",
        "servings": 1,
        "cookTimeMinutes": 25,
        "thumbnailUrl": "https://...",
        "sourceUrl": "https://www.10000recipe.com/...",
        "youtubeUrl": null,
        "matchedIngredients": ["두부", "양파", "대파"],
        "missingIngredients": ["된장"],
        "missingCount": 1,
        "usesExpiringIngredients": false,
        "expiringIngredients": []
      }
    ]
  }
}
```

---

### 6-2. 레시피 상세 조회

```
GET /recipes/:id
```

**Response `200`**

```json
{
  "data": {
    "id": "b8c9d0e1-f2a3-4567-bcde-678901234567",
    "title": "방울토마토 파스타",
    "source": "mangae",
    "servings": 1,
    "cookTimeMinutes": 20,
    "thumbnailUrl": "https://...",
    "sourceUrl": "https://www.10000recipe.com/...",
    "youtubeUrl": "https://youtube.com/watch?v=...",
    "description": "간단하게 만드는 1인분 파스타입니다.",
    "ingredients": [
      {
        "ingredientName": "방울토마토",
        "quantity": 100,
        "unit": "g",
        "isOptional": false,
        "isSeasoning": false,
        "ownedQuantity": 150,
        "ownedUnit": "g",
        "isOwned": true
      },
      {
        "ingredientName": "파스타면",
        "quantity": 80,
        "unit": "g",
        "isOptional": false,
        "isSeasoning": false,
        "ownedQuantity": 0,
        "ownedUnit": "g",
        "isOwned": false
      },
      {
        "ingredientName": "올리브유",
        "quantity": 2,
        "unit": "T",
        "isOptional": false,
        "isSeasoning": true,
        "ownedQuantity": 1,
        "ownedUnit": "병",
        "isOwned": true
      }
    ],
    "chainRecommendation": {
      "id": "d0e1f2a3-b4c5-6789-defa-890123456789",
      "title": "토마토 스크램블 에그",
      "cookTimeMinutes": 10,
      "thumbnailUrl": "https://...",
      "description": "남은 방울토마토로 내일 아침 뚝딱"
    },
    "cachedAt": "2026-05-09T00:00:00+09:00"
  }
}
```

---

## 7. 조리 완료 (Cooking Logs)

### 7-1. 조리 완료 기록 & 재고 차감

레시피 상세 화면에서 "조리 완료" 버튼을 누를 때 호출한다. 사용된 재료가 재고에서 자동 차감된다.

```
POST /cooking-logs
```

**Request Body**

```json
{
  "recipeId": "b8c9d0e1-f2a3-4567-bcde-678901234567",
  "servingsCooked": 1,
  "usedIngredients": [
    {
      "ingredientId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "ingredientName": "방울토마토",
      "quantityUsed": 100,
      "unit": "g"
    },
    {
      "ingredientId": null,
      "ingredientName": "파스타면",
      "quantityUsed": 80,
      "unit": "g"
    }
  ]
}
```

| 필드                               | 타입                    | 필수 | 설명                                        |
| ---------------------------------- | ----------------------- | ---- | ------------------------------------------- |
| `recipeId`                         | `string (UUID)`         | ❌   | 레시피 ID (레시피 없이 직접 조리 시 `null`) |
| `servingsCooked`                   | `number`                | ✅   | 조리 인분 수 (>= 1)                         |
| `usedIngredients`                  | `array`                 | ✅   | 사용 재료 목록 (최소 1개)                   |
| `usedIngredients[].ingredientId`   | `string (UUID) \| null` | ✅   | 재고 ID (미보유 재료는 `null`)              |
| `usedIngredients[].ingredientName` | `string`                | ✅   | 재료명 스냅샷                               |
| `usedIngredients[].quantityUsed`   | `number`                | ✅   | 사용 수량 (> 0)                             |
| `usedIngredients[].unit`           | `string`                | ✅   | 단위                                        |

**Response `201`**

```json
{
  "data": {
    "cookingLogId": "e1f2a3b4-c5d6-7890-efab-901234567890",
    "recipeTitle": "방울토마토 파스타",
    "servingsCooked": 1,
    "cookedAt": "2026-05-09T19:00:00+09:00",
    "deductedIngredients": [
      {
        "ingredientId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "name": "방울토마토",
        "previousQuantity": 150,
        "usedQuantity": 100,
        "remainingQuantity": 50,
        "unit": "g",
        "status": "active"
      }
    ]
  }
}
```

> 재고 수량이 0 이하가 되면 `status`를 `consumed`로 자동 전환한다.

---

## 8. 스마트 장바구니 (Shopping)

### 8-1. 현재 장바구니 조회

```
GET /shopping-list
```

**Response `200`**

```json
{
  "data": {
    "id": "f2a3b4c5-d6e7-8901-fabc-012345678901",
    "isActive": true,
    "createdAt": "2026-05-09T08:00:00+09:00",
    "summary": "고추장·참기름이 있으니 감자·양파만 사세요!",
    "items": [
      {
        "id": "a3b4c5d6-e7f8-9012-abcd-123456789012",
        "ingredientName": "감자",
        "quantity": 500,
        "unit": "g",
        "isSmallPackage": true,
        "commerceUrl": "https://www.coupang.com/...",
        "commercePlatform": "coupang",
        "source": "auto",
        "isPurchased": false
      },
      {
        "id": "b4c5d6e7-f8a9-0123-bcde-234567890123",
        "ingredientName": "양파",
        "quantity": 1,
        "unit": "봉",
        "isSmallPackage": true,
        "commerceUrl": "https://www.coupang.com/...",
        "commercePlatform": "coupang",
        "source": "auto",
        "isPurchased": false
      }
    ]
  }
}
```

> 활성 장바구니가 없을 경우 `data: null` 반환.

---

### 8-2. 장바구니 자동 생성

현재 재고 분석 및 최근 30일 소비 패턴 기반으로 이번 주 구매 목록을 생성한다.

```
POST /shopping-list/generate
```

**Request Body** — 없음

**Response `201`**

장바구니 전체 객체 반환 (8-1 응답 형식과 동일)

> 이미 활성 장바구니가 있으면 덮어쓰지 않고 기존 항목에 추가한다.

---

### 8-3. 장바구니 아이템 수동 추가

```
POST /shopping-list/items
```

**Request Body**

```json
{
  "ingredientName": "달걀",
  "quantity": 10,
  "unit": "개"
}
```

| 필드             | 타입     | 필수 | 설명       |
| ---------------- | -------- | ---- | ---------- |
| `ingredientName` | `string` | ✅   | 품목명     |
| `quantity`       | `number` | ✅   | 수량 (> 0) |
| `unit`           | `string` | ✅   | 단위       |

**Response `201`**

```json
{
  "data": {
    "id": "c5d6e7f8-a9b0-1234-cdef-345678901234",
    "ingredientName": "달걀",
    "quantity": 10,
    "unit": "개",
    "isSmallPackage": true,
    "commerceUrl": null,
    "commercePlatform": null,
    "source": "manual",
    "isPurchased": false
  }
}
```

---

### 8-4. 장바구니 아이템 수정

구매 완료 체크 또는 수량 수정에 사용한다.

```
PATCH /shopping-list/items/:itemId
```

**Request Body**

```json
{
  "isPurchased": true
}
```

| 필드          | 타입      | 필수 | 설명           |
| ------------- | --------- | ---- | -------------- |
| `isPurchased` | `boolean` | ❌   | 구매 완료 여부 |
| `quantity`    | `number`  | ❌   | 수량           |
| `unit`        | `string`  | ❌   | 단위           |

**Response `200`** — 수정된 아이템 전체 객체 반환

---

### 8-5. 장바구니 아이템 삭제

```
DELETE /shopping-list/items/:itemId
```

**Response `200`**

```json
{
  "data": { "message": "항목이 삭제되었습니다." }
}
```

---

### 8-6. 장보기 완료

장바구니를 완료 처리하고 영수증 스캔 유도 응답을 반환한다.

```
POST /shopping-list/complete
```

**Request Body** — 없음

**Response `200`**

```json
{
  "data": {
    "completedAt": "2026-05-09T20:00:00+09:00",
    "purchasedCount": 3,
    "message": "장보기 완료! 영수증을 스캔하면 재고가 자동 등록돼요."
  }
}
```

---

## 9. 알림 (Notifications)

### 9-1. 알림 설정 조회

```
GET /notifications/settings
```

**Response `200`**

```json
{
  "data": {
    "id": "d6e7f8a9-b0c1-2345-defa-456789012345",
    "webPushEnabled": true,
    "webPushToken": "fxyz...",
    "discordEnabled": false,
    "discordWebhookUrlMasked": null,
    "slackEnabled": false,
    "slackWebhookUrlMasked": null,
    "notifyTime": "09:00",
    "leadDaysOverride": null,
    "updatedAt": "2026-05-09T10:00:00+09:00"
  }
}
```

> Webhook URL은 마스킹 처리(`https://discord.com/api/webhooks/****`)되어 반환된다.
> 알림 설정이 없으면 기본값으로 초기화된 row를 반환한다.

---

### 9-2. 알림 설정 저장

```
PUT /notifications/settings
```

**Request Body**

```json
{
  "webPushEnabled": true,
  "discordEnabled": true,
  "discordWebhookUrl": "https://discord.com/api/webhooks/123456789/abcdef...",
  "slackEnabled": false,
  "slackWebhookUrl": null,
  "notifyTime": "09:00",
  "leadDaysOverride": null
}
```

| 필드                | 타입             | 필수 | 설명                                                    |
| ------------------- | ---------------- | ---- | ------------------------------------------------------- |
| `webPushEnabled`    | `boolean`        | ❌   | Web Push 사용 여부                                      |
| `discordEnabled`    | `boolean`        | ❌   | Discord 사용 여부                                       |
| `discordWebhookUrl` | `string \| null` | ❌   | Discord Webhook URL (활성화 시 필수)                    |
| `slackEnabled`      | `boolean`        | ❌   | Slack 사용 여부                                         |
| `slackWebhookUrl`   | `string \| null` | ❌   | Slack Webhook URL (활성화 시 필수)                      |
| `notifyTime`        | `string`         | ❌   | 알림 시각 (`HH:MM` 형식, KST 기준)                      |
| `leadDaysOverride`  | `number \| null` | ❌   | 알림 선행일 직접 설정 (`null`이면 카테고리 기본값 사용) |

**Response `200`** — 저장된 설정 전체 객체 반환 (9-1 응답 형식과 동일)

**에러 코드**

| code                          | HTTP | 설명                           |
| ----------------------------- | ---- | ------------------------------ |
| `WEBHOOK_URL_INVALID`         | 400  | 유효하지 않은 Webhook URL 형식 |
| `DISCORD_ENABLED_WITHOUT_URL` | 400  | Discord 활성화 시 URL 없음     |
| `SLACK_ENABLED_WITHOUT_URL`   | 400  | Slack 활성화 시 URL 없음       |

---

### 9-3. FCM Web Push 구독 등록

서비스 워커에서 FCM 구독 토큰을 발급받은 후 서버에 등록한다.

```
POST /notifications/subscribe
```

**Request Body**

```json
{
  "token": "fxyz1234...",
  "channel": "fcm"
}
```

| 필드      | 타입     | 필수 | 설명                |
| --------- | -------- | ---- | ------------------- |
| `token`   | `string` | ✅   | FCM 구독 토큰       |
| `channel` | `string` | ✅   | 현재는 `"fcm"` 고정 |

**Response `200`**

```json
{
  "data": {
    "message": "Web Push 알림이 활성화되었습니다.",
    "webPushEnabled": true
  }
}
```

---

### 9-4. FCM Web Push 구독 해제

```
DELETE /notifications/subscribe
```

**Response `200`**

```json
{
  "data": {
    "message": "Web Push 알림이 해제되었습니다.",
    "webPushEnabled": false
  }
}
```

---

## 10. 헬스체크

### 10-1. 서버 상태 확인

```
GET /health
```

**Response `200`**

```json
{
  "status": "ok",
  "timestamp": "2026-05-09T10:00:00+09:00",
  "services": {
    "database": "ok",
    "redis": "ok"
  }
}
```

---

## 부록

### Access Token / Refresh Token 생명주기

| 토큰          | 유효기간 | 저장 위치                                |
| ------------- | -------- | ---------------------------------------- |
| Access Token  | 15분     | 클라이언트 메모리 (Zustand)              |
| Refresh Token | 7일      | `HttpOnly; SameSite=Strict; Secure` 쿠키 |

### 자동 토큰 갱신 흐름 (클라이언트)

```
API 요청 → 401 TOKEN_EXPIRED 수신
  → POST /auth/refresh (쿠키 자동 전송)
  → 새 Access Token 수령
  → 원래 요청 재시도
  → 갱신 실패 시 로그인 화면으로 이동
```

### 페이지네이션

| 파라미터 | 설명                                        |
| -------- | ------------------------------------------- |
| `page`   | 1부터 시작                                  |
| `limit`  | 페이지당 항목 수 (엔드포인트별 기본값 상이) |

### Rate Limiting

| 엔드포인트                              | 제한               |
| --------------------------------------- | ------------------ |
| `POST /receipts/scan`                   | 사용자당 분당 5회  |
| `POST /auth/google`, `POST /auth/kakao` | IP당 분당 10회     |
| 그 외                                   | 사용자당 분당 60회 |

### 외부 API 연동 에러 코드

| code                | HTTP | 설명                       |
| ------------------- | ---- | -------------------------- |
| `OCR_SERVICE_ERROR` | 502  | Clova OCR 서비스 연결 오류 |
| `LLM_SERVICE_ERROR` | 502  | OpenAI GPT 연결 오류       |
| `RECIPE_API_ERROR`  | 502  | 만개의 레시피 API 오류     |
| `FCM_SERVICE_ERROR` | 502  | FCM 푸시 발송 오류         |
