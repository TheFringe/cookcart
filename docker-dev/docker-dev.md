# Docker dev

Startar PostgreSQL och pgAdmin lokalt med Podman.
Frontend och backend körs separat via `yarn nx serve` för att få hot-reload.

## Kom igång

1. Kopiera `.env.template` till `.env` i denna mapp:

```bash
cp docker-dev/.env.template docker-dev/.env
```

2. Starta tjänsterna från repo-roten:

```bash
podman-compose -f docker-dev/docker-compose.yml up -d
```

3. Starta frontend och backend i separata terminaler:

```bash
yarn nx serve @recipes/recipes-frontend
yarn nx serve @recipes/backend
```

## Tjänster

| Tjänst    | Adress                  | Beskrivning              |
|-----------|-------------------------|--------------------------|
| PostgreSQL | `localhost:5432`        | Databas                  |
| pgAdmin   | http://localhost:5050   | Databasverktyg i webbläsaren |

### Anslut pgAdmin till databasen

1. Öppna http://localhost:5050 och logga in med `PGADMIN_EMAIL` / `PGADMIN_PASSWORD` från `.env`
2. Lägg till en ny server med:
   - **Host**: `postgres` (tjänstens namn i nätverket)
   - **Port**: `5432`
   - **Database**: `recipes`
   - **Username / Password**: värdena från `.env`

### Anslutningssträng för backend

```
postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@localhost:5432/recipes
```

## Stoppa

```bash
podman-compose -f docker-dev/docker-compose.yml down
```

Data bevaras i `docker-dev/db_data/` och finns kvar nästa gång du startar.
För att börja om med tom databas: `rm -rf docker-dev/db_data/`
