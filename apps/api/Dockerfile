FROM node:20-alpine AS deps

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
COPY packages/ocr/package.json packages/ocr/package.json

RUN pnpm install --frozen-lockfile --filter @defree/api...

FROM deps AS build

COPY apps/api apps/api
COPY packages/shared-types packages/shared-types
COPY packages/ocr packages/ocr

RUN pnpm --filter @defree/shared-types build \
  && pnpm --filter @defree/ocr build \
  && pnpm --filter @defree/api build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

COPY --from=build /app /app

EXPOSE 3000

CMD ["node", "apps/api/dist/main.js"]
