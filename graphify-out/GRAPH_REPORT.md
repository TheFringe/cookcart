# Graph Report - 10.05_recipes  (2026-05-20)

## Corpus Check
- 79 files · ~24,470 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 377 nodes · 511 edges · 36 communities (32 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2c298942`
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
- [[_COMMUNITY_Community 22|Community 22]]

## God Nodes (most connected - your core abstractions)
1. `ShoppingListRepository` - 18 edges
2. `RecipeRepository` - 18 edges
3. `IngredientRepository` - 9 edges
4. `React Hooks: useState, useEffect och useParams` - 9 edges
5. `Recipe` - 9 edges
6. `Toast()` - 8 edges
7. `useAuth()` - 8 edges
8. `createRecipesRouter()` - 8 edges
9. `ShoppingListPage()` - 7 edges
10. `Hur det fungerar` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Home()` --calls--> `useAuth()`  [EXTRACTED]
  recipes-frontend/src/app/app.tsx → apps/recipes-frontend/src/app/auth/AuthContext.tsx
- `requireAuth()` --calls--> `next`  [INFERRED]
  auth/middleware.ts → auth/middleware.spec.ts
- `ProtectedRoute()` --calls--> `useAuth()`  [EXTRACTED]
  apps/recipes-frontend/src/app/auth/ProtectedRoute.tsx → apps/recipes-frontend/src/app/auth/AuthContext.tsx

## Communities (36 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (24): App(), AuthenticatedLayout(), Home(), RecipeEditPage(), { baseElement }, mockedAxios, mockUseAuth, AuthContext (+16 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (24): Ingredient, Recipe, RecipeInput, RecipeRepository, asyncHandler(), createRecipesRouter(), INVALID_ID, NAME_REQUIRED (+16 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (16): requireAuth(), next, req, res, IngredientRepository, pool, repo, createIngredientsRouter() (+8 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (33): Arbeta med detta, code:tsx (const [recipes, setRecipes] = useState<Recipe[]>([]);), code:tsx (// apps/recipes-frontend/src/app/auth/AuthContext.tsx), code:block11 (1. useState initieras (recipes = [], loading = true)), code:tsx (// apps/recipes-frontend/src/app/app.tsx), code:tsx (// apps/recipes-frontend/src/app/recipes/RecipeDetail.tsx), code:tsx (const { id } = useParams<{ id: string }>();), code:plantuml (@startuml) (+25 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (24): 1. Providern sätts upp i `main.tsx`, 2. Routes definieras i `app.tsx`, 3. `ProtectedRoute` skyddar autentiseringskrävande sidor, 4. Navigation med `Link`, 5. Läsa URL-parametrar med `useParams`, Arbeta med routing, code:tsx (// apps/recipes-frontend/src/main.tsx), code:tsx (import { useNavigate } from 'react-router-dom';) (+16 more)

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (8): ShoppingListRepository, ingredientRow, itemRow, makePool(), pool, repo, row, updated

### Community 6 - "Community 6"
Cohesion: 0.1
Nodes (19): 1. Think Before Coding, 2. Simplicity First, 3-Layer Query Rule, 3. Surgical Changes, 4. Goal-Driven Execution, 5. Project-Specific Guidelines, code:block1 (1. [Step] → verify: [check]), code:bash (# Install dependencies) (+11 more)

### Community 7 - "Community 7"
Cohesion: 0.1
Nodes (19): Arbeta med Toast, code:tsx (// apps/recipes-frontend/src/app/shared/Toast.tsx), code:tsx (// apps/recipes-frontend/src/app/recipes/RecipeDetail.tsx), code:plantuml (@startuml), code:tsx (import { Toast } from '../shared/Toast';), code:tsx (const [error, setError] = useState<string | null>(null);), code:tsx (.catch(() => setError('Något gick fel.'));), code:tsx ({error && <Toast message={error} onDismiss={() => setError(n) (+11 more)

### Community 8 - "Community 8"
Cohesion: 0.11
Nodes (18): `asyncHandler` — varför den finns, code:ts (// app.ts), code:ts (app.use('/auth', authRouter);), code:ts (// auth/middleware.ts), code:ts (// recipes/router.ts), code:ts (// GET /recipes/42 → req.params.id === "42"), code:ts (function asyncHandler(fn: (req: Request, res: Response, next), code:ts (// router.spec.ts) (+10 more)

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (16): Arbeta med detta, code:tsx (// apps/recipes-frontend/src/app/app.tsx), code:block2 (/ (eller /*) → Home → RecipeList), code:tsx (// apps/recipes-frontend/src/app/recipes/RecipeList.tsx), code:tsx (// apps/recipes-frontend/src/app/recipes/RecipeDetail.tsx), code:ts (// apps/recipes-frontend/src/app/recipes/types.ts), Context, Gotchas (+8 more)

### Community 10 - "Community 10"
Cohesion: 0.21
Nodes (11): Toast(), ToastProps, ShoppingListDetail(), ShoppingListFull, ShoppingListItem, [first], input, listData (+3 more)

### Community 11 - "Community 11"
Cohesion: 0.29
Nodes (9): RecipeDetail(), baseRecipe, ingredients, items, mockedAxios, renderComponent(), renderRecipeDetail(), Ingredient (+1 more)

### Community 12 - "Community 12"
Cohesion: 0.17
Nodes (11): Anslut pgAdmin till databasen, Anslutningssträng för backend, code:bash (cp docker-dev/.env.template docker-dev/.env), code:bash (podman-compose -f docker-dev/docker-compose.yml up -d), code:bash (yarn nx serve @recipes/recipes-frontend), code:block4 (postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@localhost:5), code:bash (podman-compose -f docker-dev/docker-compose.yml down), Docker dev (+3 more)

### Community 13 - "Community 13"
Cohesion: 0.29
Nodes (6): EMPTY_INGREDIENT, IngredientDraft, RecipeForm(), inputs, mockedAxios, renderForm()

### Community 14 - "Community 14"
Cohesion: 0.48
Nodes (3): ShoppingListForm(), mockedAxios, renderForm()

### Community 15 - "Community 15"
Cohesion: 0.29
Nodes (5): ingredientRow, ingredientRows, pool, recipeRow, repo

### Community 16 - "Community 16"
Cohesion: 0.4
Nodes (4): Komponenter, Learnings, React Hooks, Routing

### Community 18 - "Community 18"
Cohesion: 0.5
Nodes (3): Building, Running unit tests, shared-ui

## Knowledge Gaps
- **129 isolated node(s):** `pool`, `repo`, `options`, `mockRepo`, `app` (+124 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ShoppingListRepository` connect `Community 5` to `Community 1`, `Community 2`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `RecipeRepository` connect `Community 1` to `Community 2`, `Community 15`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `pool`, `repo`, `options` to the rest of the system?**
  _129 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._