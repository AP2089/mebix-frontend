# MEBIX Frontend

## Первый запуск

1. Скопируй окружение и при необходимости поправь значения:

```bash
cp .env.example .env
```

2. Из корня репозитория подними весь проект:

```bash
docker compose up --build
```

3. Готово:

- Сайт: http://localhost:3000
- API: http://localhost:8000/api/v1

Нужен заполненный `frontend/.env` и поднятый backend (через тот же `docker compose`).

## Переменные (.env)

| Переменная | Зачем |
|------------|--------|
| `NEXT_PUBLIC_API_URL` | URL API для браузера |
| `INTERNAL_API_URL` | URL API для SSR внутри Docker-сети |

## Dev

Локальная разработка с hot-reload. API должен быть уже запущен (Dev или Docker).

1. Заполни `frontend/.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
INTERNAL_API_URL=http://localhost:8000/api/v1
```

2. Установи зависимости и запусти:

```bash
npm install
npm run dev
```

Сайт: http://localhost:3000

## Prod

Сборка и запуск всего стека в Docker (как на сервере):

```bash
docker compose up --build -d
```

Остановка:

```bash
docker compose down
```
