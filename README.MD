# Flight Tracker API

REST API для работы с авиационными данными.
NestJS + TypeScript + PostgreSQL + Redis + WebSocket.

Проект начинался как чистый Node.js без фреймворков (для понимания основ),
затем прошёл через Fastify и в итоге мигрировал на NestJS.

**Продакшн:** https://api.fly-track.com/

## Стек

- Node.js 20 / TypeScript (strict mode)
- NestJS (DI, guards, pipes, exception filters)
- PostgreSQL 18 + Drizzle ORM
- Redis (кеширование, rate limiting)
- WebSocket (socket.io) - realtime-обновления рейсов
- JWT-аутентификация (@nestjs/passport)
- Pino (nestjs-pino) - структурированное JSON-логирование с correlation ID
- Docker / Docker Compose (multi-stage build, non-root пользователь)
- GitHub Actions - CI (lint, test, e2e) + CD (build → GHCR → деплой по SSH)
- Jest (unit + e2e тесты)

## Запуск

### Через Docker (рекомендуется)

```bash
docker compose up -d --build
```

### Локально

```bash
cp .env.example .env
docker compose up -d postgres redis
npm install
npm run db:migrate
npm run start:dev
```

Проверка:

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/health/ready
```

## Переменные окружения

| Переменная     |    Обязательна     | Описание                             |
| -------------- | :----------------: | ------------------------------------ |
| `PORT`         | нет (default 3000) | Порт приложения                      |
| `NODE_ENV`     |        нет         | `development` \| `production`        |
| `DATABASE_URL` |         да         | Строка подключения к PostgreSQL      |
| `JWT_SECRET`   |         да         | Секрет для подписи и верификации JWT |
| `REDIS_URL`    |         да         | Строка подключения к Redis           |

Секреты не коммитятся - в репозитории только `.env.example` с плейсхолдерами.

## Архитектура

```
src/
├── flights/      - модуль рейсов (controller, service, repository, dto, gateway)
├── auth/         - JWT-стратегия, guard, декоратор CurrentUser
├── health/       - liveness/readiness проверки
├── database/     - подключение к Postgres (custom provider)
├── redis/        - подключение к Redis (custom provider)
└── shared/       - переиспользуемые утилиты, AppError, exception filter, RateLimitGuard
```

## Эндпоинты

| Метод  | Путь                      | Auth | Описание                                                      |
| ------ | ------------------------- | ---- | ------------------------------------------------------------- |
| GET    | `/api/health`             | нет  | liveness probe                                                |
| GET    | `/api/health/ready`       | нет  | readiness probe (проверяет Postgres и Redis)                  |
| GET    | `/api/flights`            | нет  | список с фильтрами и пагинацией, кешируется в Redis на 30 сек |
| GET    | `/api/flights/stats`      | нет  | статистика по статусам                                        |
| GET    | `/api/flights/:id`        | нет  | рейс по id                                                    |
| POST   | `/api/flights`            | JWT  | создать рейс, инвалидирует кеш, rate limit 10 запросов/60 сек |
| PATCH  | `/api/flights/:id/status` | JWT  | обновить статус, эмитит `flight:updated` в WebSocket          |
| DELETE | `/api/flights/:id`        | JWT  | удалить рейс                                                  |
| POST   | `/api/auth/register`      | нет  | регистрация, rate limit 3 запроса/час                         |
| POST   | `/api/auth/login`         | нет  | вход, возвращает JWT, rate limit 5 запросов/5 мин             |

Для защищённых эндпоинтов: заголовок `Authorization: Bearer <token>`.

### Query params для GET /api/flights

`status`, `origin`, `destination`, `search`, `dateFrom`, `dateTo`, `limit`, `offset`

## WebSocket

Подключение через socket.io на том же порту/домене, что и HTTP: `wss://api.fly-track.com/socket.io/`

- `flights:subscribe` (client → server) - подписка на комнату конкретного рейса по `flightId`
- `flight:updated` (server → client) - приходит при изменении статуса рейса, на который есть подписка

## Тесты

```bash
npm run test          # unit-тесты (сервисы, моки repository)
npm run test:e2e      # e2e-тесты через supertest, нужен запущенный Postgres/Redis
npm run lint
```

## Производительность

См. `benchmark.md` - сравнение EXPLAIN ANALYZE до/после индексов, и замеры отклика с кешем Redis и без него.

## CI/CD

Пайплайн в `.github/workflows/ci-cd.yml`, три последовательных этапа:

1. **`test`** - на каждый PR и push в `main`: lint → unit-тесты → миграции на тестовой БД → e2e-тесты (с реальными Postgres и Redis-контейнерами в CI)
2. **`build-and-push`** - только на push в `main`, после зелёного `test`: multi-stage Docker-образ, публикация в `ghcr.io` с тегами `latest` и `<git-sha>`
3. **`deploy`** - SSH на сервер, `docker compose pull && up -d`, очистка старых образов

Ветка `main` защищена: PR нельзя смёржить без прохождения `test`.

## Деплой на чистый сервер

```bash
# сервер: Docker + непривилегированный пользователь $user
curl -fsSL https://get.docker.com | sh
apt install docker-compose-plugin -y
adduser $user && usermod -aG docker $user

# nginx как reverse proxy + HTTPS
apt install nginx certbot python3-certbot-nginx -y
# конфиг - см. /etc/nginx/sites-available/backend-nest, включая
# отдельный location /socket.io/ с проксированием Upgrade-заголовков
certbot --nginx -d api.fly-track.com

# первый запуск
cat > .env <<EOF
DATABASE_URL=...
JWT_SECRET=...
REDIS_URL=...
EOF
chmod 600 .env

docker login ghcr.io -u <username>
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

Дальнейшие деплои - автоматически через CI/CD при пуше в `main`.

### Откат

Каждый образ тегируется SHA коммита, не только `latest`:

```bash
docker pull ghcr.io/<owner>/<repo>:<предыдущий-sha>
docker tag ghcr.io/<owner>/<repo>:<предыдущий-sha> ghcr.io/<owner>/<repo>:latest
docker compose -f docker-compose.prod.yml up -d
```

## Roadmap

- [x] Чистый Node.js + PostgreSQL + Drizzle
- [x] Миграция на Fastify
- [x] NestJS + Redis + WebSocket
- [x] Продакшн-готовность: логирование, Docker multi-stage build, CI/CD, деплой на api.fly-track.com
- [ ] Next.js фронт + deck.gl карты

