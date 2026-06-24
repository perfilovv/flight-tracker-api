# Flight Tracker API

REST API для работы с авиационными данными.
Node.js + TypeScript + PostgreSQL, без фреймворков (намеренно - для
понимания основ перед переходом на Fastify/NestJS).

## Стек

- Node.js 20 / TypeScript (strict mode)
- PostgreSQL 18 + Drizzle ORM
- Docker / Docker Compose

## Запуск

### Через Docker (рекомендуется)
docker compose up -d --build
./test.sh   # прогнать regression-тест

### Локально
cp .env.example .env
docker compose up -d postgres
npm install
npm run db:migrate
npx tsx src/scripts/seed.ts
npm run dev

## Архитектура

src/
├── app/          - инфраструктура (server, middleware, router, config)
├── modules/      - бизнес-модули (controller → service → repository)
└── shared/       - переиспользуемые утилиты и ошибки

## Эндпоинты

GET    /api/health           - liveness probe
GET    /api/health/ready     - readiness probe (проверяет БД)
GET    /api/flights          - список с фильтрами и пагинацией
GET    /api/flights/stats    - статистика по статусам
GET    /api/flights/:id      - рейс по id
POST   /api/flights          - создать рейс
PATCH  /api/flights/:id/status - обновить статус
DELETE /api/flights/:id      - удалить рейс

### Query params для GET /api/flights
status, origin, destination, search, dateFrom, dateTo, limit, offset

## Производительность

См. benchmark.md - сравнение EXPLAIN ANALYZE до/после индексов.

## Roadmap

- [x] Чистый Node.js + PostgreSQL + Drizzle
- [ ] Миграция на Fastify
- [ ] NestJS + Redis + WebSocket
- [ ] Next.js фронт + deck.gl карты