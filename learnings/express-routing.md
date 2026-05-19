# Express Routing i backend

> **TL;DR** Express routing delar upp en server i mindre, testbara delar. Varje del ansvarar för en URL-grupp och hanterar inkommande HTTP-förfrågningar.

## Kontext

När appen startar skapas ett Express-objekt (`app`) i `app.ts`. Det objektet är hela servern — det lyssnar på requests och skickar responses. Utan routing skulle all logik hamna i en enda fil. Med routing kan du bryta ut `/recipes` och `/auth` i egna moduler som är lätta att förstå och testa oberoende av varandra.

Det finns tre nivåer i det här projektet:

1. **`main.ts`** — startar servern, lyssnar på en port
2. **`app.ts`** — sätter ihop hela applikationen: middleware, routers, en `/health`-endpoint
3. **`recipes/router.ts`** och **`auth/router.ts`** — hanterar varsin grupp av endpoints

## Hur det fungerar

### Middleware-kedjan i `app.ts`

Varje `app.use(...)` lägger till ett lager som varje inkommande request passerar igenom i ordning:

```ts
// app.ts
app.use(cors({ ... }));       // tillåter requests från frontend
app.use(express.json());      // parsar JSON-body till req.body
app.use(session({ ... }));    // skapar/läser sessionen i databasen
app.use(passport.initialize());
app.use(passport.session());  // laddar inloggad användare till req.user
```

Ordningen spelar roll. `express.json()` måste köras före routern, annars är `req.body` odefinierad när du läser den. `passport.session()` måste köras efter `session(...)`, annars finns ingen session att läsa från.

### Montering av routers

Längst ner i `app.ts` monteras routrarna:

```ts
app.use('/auth', authRouter);
app.use('/recipes', requireAuth, createRecipesRouter(new RecipeRepository(pool)));
```

`app.use('/recipes', ...)` innebär att alla requests som börjar på `/recipes` skickas vidare till `createRecipesRouter`. Inuti den routern skriver du bara `'/'` och `'/:id'` — prefixet `/recipes` är redan borttaget.

`requireAuth` är middleware som sitter *mellan* app och router. Den körs på varje request till `/recipes`. Om användaren inte är inloggad avbryts kedjan och ett 401-svar skickas. Om användaren är inloggad anropas `next()` och requesten skickas vidare till routern.

```ts
// auth/middleware.ts
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated()) { next(); return; }
  res.status(401).json({ error: 'Ej inloggad' });
}
```

### En router är en mini-app

`Router()` från Express fungerar precis som `app`, men utan att lyssna på en port. Du registrerar endpoints på den, och sedan monterar du den i `app`.

```ts
// recipes/router.ts
export function createRecipesRouter(repo: RecipeRepository): Router {
  const router = Router();

  router.get('/', asyncHandler(async (_req, res) => {
    const recipes = await repo.findAll();
    res.json(recipes);
  }));

  router.get('/:id', asyncHandler(async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) { res.status(400).json(INVALID_ID); return; }
    const recipe = await repo.findById(id);
    if (!recipe) { res.status(404).json(NOT_FOUND); return; }
    res.json(recipe);
  }));

  // ... fler endpoints

  return router;
}
```

Notera att `createRecipesRouter` är en *fabriksfunktion* — den tar emot `repo` som argument och returnerar en router. Det gör det möjligt att i tester skicka in ett mock-objekt istället för en riktig databasanslutning.

### URL-parametrar med `/:id`

`:id` i `router.get('/:id', ...)` är en platshållare. Express plockar ut det faktiska värdet och lägger det i `req.params.id` som en sträng.

```ts
// GET /recipes/42 → req.params.id === "42"
const id = parseId(req.params.id); // Number("42") → 42
```

`parseId` konverterar strängen till ett tal och returnerar `null` om den inte är ett giltigt tal. Det skyddar mot requests som `GET /recipes/abc`.

### `asyncHandler` — varför den finns

Express var från början designat för synkron kod. Om ett fel kastas i en vanlig funktion fångar Express det automatiskt. Men om ett async-fel kastas i en `async`-funktion missar Express det — servern hänger eller kraschar utan felmeddelande.

```ts
function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler {
  return (req, res, next) => fn(req, res, next).catch(next);
}
```

Den wrappar varje async route-handler och vidarebefordrar fel till `next(err)`, vilket Express sedan hanterar. I testerna finns ett felhanterare-middleware längst ner som fångar sådana fel och returnerar 500:

```ts
// router.spec.ts
app.use((err: Error, _req: any, res: any, _next: any) => {
  res.status(500).json({ error: err.message });
});
```

## Varför det är gjort så här

**Fabriksfunktion istället för en exporterad instans** — `auth/router.ts` exporterar en färdig router (`export default router`), men `recipes/router.ts` exporterar en funktion (`export function createRecipesRouter`). Anledningen är testbarhet: recipes-routern är beroende av databasen via `RecipeRepository`. Genom att ta `repo` som argument kan testerna byta ut den mot en mock. Auth-routern har inget sådant beroende och kan vara enkel.

**Middleware som vakt framför en hel router** — istället för att skriva `requireAuth` i varje enskild route-handler sitter den en gång i `app.ts`. Det innebär att du aldrig råkar glömma den om du lägger till en ny endpoint under `/recipes`.

## Hur man lägger till en ny endpoint

1. Lägg till en ny `router.get/post/put/delete`-rad i `apps/backend/src/recipes/router.ts`
2. Wrappa handler-funktionen i `asyncHandler` om den är async
3. Lägg till ett test i `router.spec.ts` med supertest

Om du behöver en helt ny resurs (t.ex. `/shopping-lists`):
1. Skapa `apps/backend/src/shopping-lists/router.ts` med en fabriksfunktion
2. Skapa ett eget repository
3. Montera i `app.ts`: `app.use('/shopping-lists', requireAuth, createShoppingListsRouter(new ShoppingListRepository(pool)))`

## Gotchas

**Ordningen i `app.ts` är semantisk, inte bara estetisk.** Om du monterar `app.use('/recipes', ...)` *innan* `app.use(express.json())` kommer `req.body` alltid vara `undefined` i dina handlers. Express kör middleware i den ordning de registrerades.

**`req.params.id` är alltid en sträng.** Det spelar ingen roll att databasens `id`-kolumn är ett heltal. Express ger dig en sträng. Utan `parseId`-steget skulle `repo.findById("42")` antingen misslyckas med en TypeScript-fel eller ge oväntat beteende beroende på hur PostgreSQL-drivrutinen hanterar det.

**`next()` vs `return`.** Om du glömmer `return` efter ett tidig svar (`res.status(400).json(...)`) fortsätter funktionen att köras och försöker skicka ett andra svar — Express klagar med "Cannot set headers after they are sent". Mönstret `if (id === null) { res.status(400).json(INVALID_ID); return; }` är just för att förhindra det.

**Auth-routern kräver ingen `requireAuth`.** `/auth/google` och `/auth/google/callback` måste vara öppna — det är ju dit oinloggade användare skickas för att logga in. Lägg aldrig `requireAuth` på auth-routern.

---
*Last updated: 2026-05-19*
