# Graph Report - 10.05_recipes  (2026-05-27)

## Corpus Check
- 104 files · ~43,654 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 724 nodes · 1065 edges · 50 communities (47 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d92249e0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 36|Community 36]]

## God Nodes (most connected - your core abstractions)
1. `RecipeRepository` - 28 edges
2. `ShoppingListRepository` - 22 edges
3. `Recipe` - 19 edges
4. `Toast()` - 13 edges
5. `RecipeDetail()` - 12 edges
6. `MealPlanRepository` - 12 edges
7. `Testa React-komponenter med React Testing Library` - 12 edges
8. `Krav — Recipes` - 11 edges
9. `Kalender / Veckomatsedel` - 11 edges
10. `RecipeForm()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Home()` --calls--> `useAuth()`  [EXTRACTED]
  app.tsx → apps/recipes-frontend/src/app/auth/AuthContext.tsx
- `CalendarPage()` --calls--> `getISOWeekNumber()`  [EXTRACTED]
  CalendarPage.tsx → recipes-frontend/src/app/calendar/CalendarPage.tsx
- `buildWeeks()` --calls--> `getISOWeekNumber()`  [EXTRACTED]
  apps/recipes-frontend/src/app/calendar/CalendarMonthView.tsx → calendar.types.ts
- `CalendarWeekView()` --calls--> `getISOWeekNumber()`  [EXTRACTED]
  CalendarWeekView.tsx → calendar.types.ts
- `requireAuth()` --calls--> `next`  [INFERRED]
  auth/middleware.ts → auth/middleware.spec.ts

## Communities (50 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (33): App(), AuthenticatedLayout(), Home(), RecipeEditPage(), ROUTE_TITLES, routeTitle(), ShoppingListEditPage(), { baseElement } (+25 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (32): asyncHandler(), createRecipesRouter(), INVALID_ID, NAME_REQUIRED, NOT_FOUND, parseId(), app, axiosError (+24 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (27): IngredientDraft, ParsedRecipe, parseIngredientLine(), parseTextRecipe(), result, groupIngredientsBySection(), groupStepsBySection(), IngredientGroup (+19 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (28): getISOWeekNumber(), MealPlanEntry, toISODate(), buildWeeks(), CalendarMonthView(), CalendarMonthViewProps, MONTHS, MonthWeek (+20 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (19): requireAuth(), next, req, res, IngredientRepository, pool, repo, createIngredientsRouter() (+11 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (33): Arbeta med detta, code:tsx (const [recipes, setRecipes] = useState<Recipe[]>([]);), code:tsx (// apps/recipes-frontend/src/app/auth/AuthContext.tsx), code:block11 (1. useState initieras (recipes = [], loading = true)), code:tsx (// apps/recipes-frontend/src/app/app.tsx), code:tsx (// apps/recipes-frontend/src/app/recipes/RecipeDetail.tsx), code:tsx (const { id } = useParams<{ id: string }>();), code:plantuml (@startuml) (+25 more)

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (14): Ingredient, QueryFn, Recipe, RecipeInput, RecipeRepository, baseRecipeRow, client, ingredientRow (+6 more)

### Community 7 - "Community 7"
Cohesion: 0.06
Nodes (30): Angular-till-React ordbok, code:typescript (@Component({), code:html (<div *ngIf="loading">Laddar...</div>), code:tsx ({loading && <p className="recipe-loading">Laddar recept...</), code:tsx (// apps/recipes-frontend/src/app/recipes/RecipeForm.tsx), code:tsx (// auth/AuthContext.tsx), code:tsx (// settings/preferences.ts), code:block16 (Render → state förändras → ny render → ny state förändras → ) (+22 more)

### Community 8 - "Community 8"
Cohesion: 0.06
Nodes (29): Angular-till-RTL ordbok, Asynkron data — findBy vs getBy, Axios-mocking, code:tsx (// apps/recipes-frontend/src/app/recipes/RecipeList.spec.tsx), code:tsx (mockedAxios.get.mockImplementation((url: string) => {), code:typescript (const httpMock = TestBed.inject(HttpTestingController);), code:tsx (it('filtrerar recepten när en tagg väljs', async () => {), code:typescript (const btn = fixture.debugElement.query(By.css('[data-testid=) (+21 more)

### Community 9 - "Community 9"
Cohesion: 0.08
Nodes (24): 1. Providern sätts upp i `main.tsx`, 2. Routes definieras i `app.tsx`, 3. `ProtectedRoute` skyddar autentiseringskrävande sidor, 4. Navigation med `Link`, 5. Läsa URL-parametrar med `useParams`, Arbeta med routing, code:tsx (// apps/recipes-frontend/src/main.tsx), code:tsx (import { useNavigate } from 'react-router-dom';) (+16 more)

### Community 10 - "Community 10"
Cohesion: 0.13
Nodes (10): MealPlanEntry, MealPlanRepository, pool, repo, row, asyncHandler(), createMealPlanRouter(), app (+2 more)

### Community 11 - "Community 11"
Cohesion: 0.1
Nodes (19): 1. Think Before Coding, 2. Simplicity First, 3-Layer Query Rule, 3. Surgical Changes, 4. Goal-Driven Execution, 5. Project-Specific Guidelines, code:block1 (1. [Step] → verify: [check]), code:bash (# Install dependencies) (+11 more)

### Community 12 - "Community 12"
Cohesion: 0.1
Nodes (19): 1. Förutsättningar, 2. Installera beroenden, 3. Konfigurera miljövariabler, 4. Starta databasen, 5. Starta frontend och backend, code:block1 (apps/), code:bash (yarn install), code:bash (cp docker-dev/.env.template docker-dev/.env) (+11 more)

### Community 13 - "Community 13"
Cohesion: 0.1
Nodes (19): Arbeta med Toast, code:tsx (// apps/recipes-frontend/src/app/shared/Toast.tsx), code:tsx (// apps/recipes-frontend/src/app/recipes/RecipeDetail.tsx), code:plantuml (@startuml), code:tsx (import { Toast } from '../shared/Toast';), code:tsx (const [error, setError] = useState<string | null>(null);), code:tsx (.catch(() => setError('Något gick fel.'));), code:tsx ({error && <Toast message={error} onDismiss={() => setError(n) (+11 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (18): `asyncHandler` — varför den finns, code:ts (// app.ts), code:ts (app.use('/auth', authRouter);), code:ts (// auth/middleware.ts), code:ts (// recipes/router.ts), code:ts (// GET /recipes/42 → req.params.id === "42"), code:ts (function asyncHandler(fn: (req: Request, res: Response, next), code:ts (// router.spec.ts) (+10 more)

### Community 15 - "Community 15"
Cohesion: 0.11
Nodes (17): Angular-jämförelse, AuthContext — projektet i detalj, code:tsx (// apps/recipes-frontend/src/app/auth/AuthContext.tsx), code:tsx (// apps/recipes-frontend/src/app/App.tsx), code:tsx (// apps/recipes-frontend/src/app/auth/ProtectedRoute.tsx), code:tsx (// apps/recipes-frontend/src/app/App.tsx — inne i Authentica), code:typescript (// Angular), code:tsx (// React-ekvivalenten i det här projektet) (+9 more)

### Community 16 - "Community 16"
Cohesion: 0.11
Nodes (17): Angular-jämförelse, BEM-namngivning, code:block1 (src/), code:scss (// styles.scss), code:tsx (// RecipeList.tsx), code:scss (// src/styles.scss), code:scss (.recipe-card {), code:tsx (// App.tsx) (+9 more)

### Community 17 - "Community 17"
Cohesion: 0.18
Nodes (14): ShoppingListDetail(), ShoppingListFull, ShoppingListItem, ShoppingListSummary, [first], input, listData, mockedAxios (+6 more)

### Community 18 - "Community 18"
Cohesion: 0.19
Nodes (14): extractRecipeSchema(), extractServings(), extractSourceName(), extractSteps(), extractTags(), isRecipeSchema(), parseIngredientString(), parseISODuration() (+6 more)

### Community 19 - "Community 19"
Cohesion: 0.12
Nodes (16): Arbeta med detta, code:tsx (// apps/recipes-frontend/src/app/app.tsx), code:block2 (/ (eller /*) → Home → RecipeList), code:tsx (// apps/recipes-frontend/src/app/recipes/RecipeList.tsx), code:tsx (// apps/recipes-frontend/src/app/recipes/RecipeDetail.tsx), code:ts (// apps/recipes-frontend/src/app/recipes/types.ts), Context, Gotchas (+8 more)

### Community 20 - "Community 20"
Cohesion: 0.24
Nodes (7): BottomNav(), NAV_ITEMS, NavItem, link, renderNav(), Theme, THEMES

### Community 21 - "Community 21"
Cohesion: 0.14
Nodes (13): Angular-jämförelse, code:tsx (// apps/recipes-frontend/src/app/recipes/RecipeForm.tsx), code:tsx (useEffect(() => {), code:tsx (async function handleSubmit(e: React.FormEvent) {), code:tsx (interface IngredientDraft { name: string; quantity: string; ), Context, Controlled Forms i React, Dynamiska listor av fält (+5 more)

### Community 22 - "Community 22"
Cohesion: 0.39
Nodes (7): RecipeForm(), file, inputs, mockedAxios, readerMock, renderForm(), row

### Community 23 - "Community 23"
Cohesion: 0.17
Nodes (11): Anslut pgAdmin till databasen, Anslutningssträng för backend, code:bash (cp docker-dev/.env.template docker-dev/.env), code:bash (podman-compose -f docker-dev/docker-compose.yml up -d), code:bash (yarn nx serve @recipes/recipes-frontend), code:block4 (postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@localhost:5), code:bash (podman-compose -f docker-dev/docker-compose.yml down), Docker dev (+3 more)

### Community 24 - "Community 24"
Cohesion: 0.18
Nodes (11): Kalender / Veckomatsedel, US-025 — Veckovy i kalender, US-026 — Månadsvy i kalender, US-027 — Lägg till maträtt på en dag, US-028 — Ta bort maträtt från en dag, US-029 — Klick på maträtt navigerar till recept, US-030 — Navigera framåt och bakåt i kalender, US-031 — Listvy för veckans matsedel (+3 more)

### Community 25 - "Community 25"
Cohesion: 0.22
Nodes (9): Exempel, Framtida funktioner, Krämig Kycklinggryta, Krämig Pastasallad, Pastasallad med fetaost och avokado, US-032 — Import av recept via URL, US-033 - Användarinställningar, US-034 - Tema (+1 more)

### Community 26 - "Community 26"
Cohesion: 0.22
Nodes (9): Inköpslistor, US-017 — Skapa inköpslista, US-018 — Byta namn på inköpslista, US-019 — Ta bort inköpslista, US-020 — Lägga till varor manuellt i inköpslista, US-021 — Redigera vara i inköpslista, US-022 — Ta bort vara från inköpslista, US-023 — Bocka av vara (persistent) (+1 more)

### Community 27 - "Community 27"
Cohesion: 0.25
Nodes (6): AddToListPanel(), Props, ShoppingListSummary, mockedAxios, onClose, recipe

### Community 28 - "Community 28"
Cohesion: 0.25
Nodes (6): Autentisering, Krav — Recipes, Sammanfattning, US-001 — Logga in med Google OAuth, US-002 — Delade data för alla inloggade användare, Översikt

### Community 29 - "Community 29"
Cohesion: 0.29
Nodes (7): Recept, US-003 — Skapa recept, US-004 — Redigera recept, US-005 — Ta bort recept med bekräftelsedialog, US-006 — Visa receptlista i bokstavsordning, US-007 — Filtrera receptlista på kategori, US-008 — Visa receptdetalj med ingredienser och instruktioner

### Community 30 - "Community 30"
Cohesion: 0.33
Nodes (6): Receptdetalj — planeringsläge, US-009 — Välj skalfaktor i planeringsläge, US-010 — Välj inköpslista i planeringsläge, US-011 — Lägg till / ta bort ingrediens i inköpslista från recept, US-012 — Summera mängder om ingrediens redan finns i listan, US-013 — Välj dag för tillagning via datepicker i receptvy

### Community 31 - "Community 31"
Cohesion: 0.5
Nodes (4): Receptdetalj — tillagningsläge, US-014 — Markera ingredienser och steg som klara i tillagningsläge, US-015 — Spara tillagningsprogress persistent, US-016 — Återställ alla markeringar med "Avmarkera allt"

### Community 32 - "Community 32"
Cohesion: 0.5
Nodes (3): Building, Running unit tests, shared-ui

## Knowledge Gaps
- **269 isolated node(s):** `Theme`, `THEMES`, `ROUTE_TITLES`, `newListLink`, `nav` (+264 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CalendarPage()` connect `Community 3` to `Community 0`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `RecipeRepository` connect `Community 6` to `Community 1`, `Community 4`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `ShoppingListRepository` connect `Community 1` to `Community 4`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `Theme`, `THEMES`, `ROUTE_TITLES` to the rest of the system?**
  _269 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._