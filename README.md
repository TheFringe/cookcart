# Recipes

En webbaserad app för matplanering — recept, inköpslistor och veckokalender. Inloggning via Google, delad data för alla i hushållet.

## Stack

| Lager | Teknik |
|-------|--------|
| Frontend | React + TypeScript + React Router + Axios |
| Backend | Node.js + Express + TypeScript |
| Databas | PostgreSQL 16 |
| Monorepo | Nx |
| Containers | Podman / Podman Compose |

```
apps/
  recipes-frontend/   React-app
  backend/            Express API
libs/
  shared-ui/          Delade UI-komponenter
docker-dev/           Lokal PostgreSQL + pgAdmin
docs/                 Kravdokumentation
```

## Kom igång

### 1. Förutsättningar

- Node.js 20+
- Yarn
- Podman + Podman Compose
- Ett Google OAuth-projekt med client ID och secret

### 2. Installera beroenden

```bash
yarn install
```

### 3. Konfigurera miljövariabler

```bash
cp docker-dev/.env.template docker-dev/.env
```

Fyll i `GOOGLE_CLIENT_ID` och `GOOGLE_CLIENT_SECRET` i `.env`. Övriga värden fungerar som de är för lokal utveckling.

### 4. Starta databasen

```bash
podman-compose -f docker-dev/docker-compose.yml up -d
```

PostgreSQL körs på `localhost:5432`. pgAdmin finns på [http://localhost:5050](http://localhost:5050).

### 5. Starta frontend och backend

Öppna två terminaler:

```bash
# Terminal 1 — frontend (http://localhost:4200)
yarn nx serve @recipes/recipes-frontend

# Terminal 2 — backend (http://localhost:3000)
yarn nx serve @recipes/backend
```

## Vanliga kommandon

```bash
# Tester
yarn nx test @recipes/recipes-frontend
yarn nx test @recipes/backend
yarn nx run-many --target=test --all

# Bygg
yarn nx build @recipes/recipes-frontend
yarn nx build @recipes/backend

# Lint
yarn nx lint @recipes/recipes-frontend

# Visa projektkarta
yarn nx graph
```

## Miljövariabler

Alla variabler sätts i `docker-dev/.env`.

| Variabel | Beskrivning |
|----------|-------------|
| `DATABASE_URL` | Anslutningssträng till PostgreSQL |
| `GOOGLE_CLIENT_ID` | Från Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Från Google Cloud Console |
| `SESSION_SECRET` | Slumpsträng för sessionsignering |
| `POSTGRES_USER` | PostgreSQL-användare |
| `POSTGRES_PASSWORD` | PostgreSQL-lösenord |

## Databas

Schemat skapas automatiskt av `docker-dev/init.sql` när containern startar första gången. Migrationer finns som separata SQL-filer i `docker-dev/migrate-*.sql` och körs manuellt vid behov.

```bash
# Anslut till databasen
psql postgresql://recipes:recipes@localhost:5432/recipes
```

## Funktioner

- **Recept** — skapa, redigera, importera via URL eller text, kategorisera med taggar
- **Tillagningsläge** — markera ingredienser och steg som klara, persistent progress
- **Inköpslistor** — lägg till ingredienser från recept, summera mängder automatiskt
- **Kalender** — vecko- och månadsvy, planera måltider per dag
- **Inställningar** — tema (standard, Nord mörkt, Nord ljust), föredragen inköpslista
- **Google OAuth** — ingen lösenordshantering, delad data för alla inloggade
