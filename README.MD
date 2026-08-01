# Flight Tracker API

REST API для работы с авиационными данными.
NestJS + TypeScript + PostgreSQL + Redis + WebSocket.

Проект начинался как чистый Node.js без фреймворков (для понимания основ),
затем прошёл через Fastify и в итоге мигрировал на NestJS.

## Стек

- Node.js 20 / TypeScript (strict mode)
- NestJS (DI, guards, pipes, exception filters)
- PostgreSQL 18 + Drizzle ORM
- Redis (кеширование, rate limiting)
- WebSocket (socket.io) - realtime-обновления рейсов
- JWT-аутентификация (@nestjs/passport)
- Docker / Docker Compose
- Jest (unit + e2e тесты)

## Запуск

### Через Docker (рекомендуется)

```
docker compose up -d --build
```

### Локально

```
cp .env.example .env
docker compose up -d postgres redis
npm install
npm run db:migrate
npx tsx src/scripts/seed.ts
npm run start:dev
```

## Архитектура

```
src/
├── flights/      - модуль рейсов (controller, service, repository, dto, gateway)
├── auth/         - JWT-стратегия, guard, декоратор CurrentUser
├── health/       - liveness/readiness проверки
├── database/     - подключение к Postgres (custom provider)
├── redis/        - подключение к Redis (custom provider)
└── shared/       - переиспользуемые утилиты, AppError, exception filter
```

## Эндпоинты

| Метод  | Путь                      | Auth | Описание                                                      |
| ------ | ------------------------- | ---- | ------------------------------------------------------------- |
| GET    | `/api/health`             | нет  | liveness probe                                                |
| GET    | `/api/health/ready`       | нет  | readiness probe (проверяет БД)                                |
| GET    | `/api/flights`            | нет  | список с фильтрами и пагинацией, кешируется в Redis на 30 сек |
| GET    | `/api/flights/stats`      | нет  | статистика по статусам                                        |
| GET    | `/api/flights/:id`        | нет  | рейс по id                                                    |
| POST   | `/api/flights`            | JWT  | создать рейс, инвалидирует кеш, rate limit 10 запросов/60 сек |
| PATCH  | `/api/flights/:id/status` | JWT  | обновить статус, эмитит `flight:updated` в WebSocket          |
| DELETE | `/api/flights/:id`        | JWT  | удалить рейс                                                  |

Для защищённых эндпоинтов: заголовок `Authorization: Bearer <token>`.

### Query params для GET /api/flights

status, origin, destination, search, dateFrom, dateTo, limit, offset

## WebSocket

Подключение через socket.io на том же порту, что и HTTP.

- `flights:subscribe` (client → server) - подписка на комнату конкретного рейса по `flightId`
- `flight:updated` (server → client) - приходит при изменении статуса рейса, на который есть подписка

## Тесты

```
npm run test        # unit-тесты (сервисы, моки repository)
npm run test:e2e     # e2e-тесты через supertest, нужен запущенный Postgres
```

## Производительность

См. `benchmark.md` - сравнение EXPLAIN ANALYZE до/после индексов, и замеры отклика с кешем Redis и без него.

## Roadmap

- [x] Чистый Node.js + PostgreSQL + Drizzle
- [x] Миграция на Fastify
- [x] NestJS + Redis + WebSocket
- [ ] Продакшн-готовность: логирование, Docker multi-stage build, CI/CD, деплой
- [ ] Next.js фронт + deck.gl карты
