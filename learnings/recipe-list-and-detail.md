# RecipeList och RecipeDetail

> **TL;DR** `RecipeList` visar alla recept som klickbara kort. `RecipeDetail` visar ett enskilt recept med ingredienser och steg. De hänger ihop via routing: listan länkar till detaljsidan, detaljsidan länkar tillbaka.

## Context

Appens huvudflöde är enkelt: logga in → se en lista med recept → klicka på ett → läs receptet. `RecipeList` och `RecipeDetail` är de två komponenter som täcker den resan.

Båda komponenterna är skyddade av `ProtectedRoute` — du kan inte nå dem utan att vara inloggad. Det är inte något komponenterna själva hanterar; det sköts ett steg upp i `app.tsx`.

## Hur det fungerar

### Routing i `app.tsx`

```tsx
// apps/recipes-frontend/src/app/app.tsx
<Route path="/*" element={<ProtectedRoute><Home /></ProtectedRoute>} />
<Route path="/recipes/:id" element={<ProtectedRoute><RecipeDetail /></ProtectedRoute>} />
```

`Home` är en liten wrapper-komponent i `app.tsx` som innehåller headern och `RecipeList`. `RecipeDetail` är en egen route.

Flödet ser ut så här:

```
/ (eller /*) → Home → RecipeList
/recipes/42  → RecipeDetail
```

### RecipeList

```tsx
// apps/recipes-frontend/src/app/recipes/RecipeList.tsx
export function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Recipe[]>(`${API_URL}/recipes`, { withCredentials: true })
      .then((r) => setRecipes(r.data))
      .finally(() => setLoading(false));
  }, []);
  ...
}
```

Komponenten hämtar recepten direkt i `useEffect` med axios. Den hanterar tre tillstånd:

1. **Laddar** — visar `"Laddar recept..."` medan anropet pågår
2. **Tom lista** — visar `"Inga recept hittades"` om API:t returnerar `[]`
3. **Fylld lista** — renderar ett `<article>` per recept med namn, beskrivning och metadata

Varje receptnamn är en `<Link>` till `/recipes/${r.id}`, vilket är det enda sättet man navigerar till `RecipeDetail`.

`cook_time_minutes` och `servings` är valfria (`number | null` i typen), så de renderas bara om de finns.

### RecipeDetail

```tsx
// apps/recipes-frontend/src/app/recipes/RecipeDetail.tsx
export function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    axios
      .get<Recipe>(`${API_URL}/recipes/${id}`, { withCredentials: true })
      .then((r) => setRecipe(r.data));
  }, [id]);
  ...
}
```

`useParams` läser ut `:id` ur URL:en. Det är en sträng (URL:er är alltid strängar), men backend förväntar sig ett heltal — det funkar ändå för axios skickar det rätt i URL:en och Postgres kastar det.

Komponenten renderar receptet i ordning:
1. Tillbaka-länk till `/`
2. Titel
3. Metablock (tid + portioner) — visas bara om minst ett av fälten finns
4. Beskrivning
5. Ingredienslista `<ul>` — visas bara om `ingredients.length > 0`
6. Steg `<ol>` — visas bara om `steps.length > 0`

### Typen Recipe

```ts
// apps/recipes-frontend/src/app/recipes/types.ts
export type Ingredient = {
  name: string;
  quantity: number; // alltid number, aldrig sträng
  unit: string;
};

export type Recipe = {
  id: number;
  name: string;
  description: string | null;
  cook_time_minutes: number | null;
  servings: number | null;
  steps: string[];
  ingredients: Ingredient[];
};
```

`quantity` är `number` — inte `string`. PostgreSQL returnerar NUMERIC-fält som strängar, men backend-repositoryt kör `parseFloat()` innan det skickar vidare, så kontraktet hålls konsekvent.

### Styling

All styling är global SCSS i `src/styles.scss` — inga CSS-moduler används ännu. Klassnamnen följer BEM-namngivning: `.recipe-card__name`, `.recipe-detail__meta-label`, osv.

CSS-reseten i `styles.scss` nollställer `padding: 0` globalt. Det innebär att `<ul>` och `<ol>` inte får sin defaultindrag automatiskt. Ingredienslistan och stegen har därför explicit `padding-left: 1.5rem` i sina SCSS-regler.

## Varför det är gjort så här

**Ingen React Query ännu.** Båda komponenterna hanterar datahämtning med `useState` + `useEffect` + axios direkt. CLAUDE.md nämner React Query som ett mål, men det är inte implementerat. Det funkar, men det ger inget caching, ingen automatisk refetch, och ingen separation mellan server-state och UI-state.

**Global SCSS istf CSS-moduler.** Målet är CSS-moduler, men nu ligger allt i en enda stor `styles.scss`. Det fungerar för en liten app, men skalas dåligt.

## Arbeta med detta

**Lägga till ett nytt fält i receptlistan:**
1. Lägg till fältet i `Recipe`-typen i `types.ts`
2. Rendera det i `RecipeList.tsx` (glöm inte null-checken om fältet är valfritt)
3. Uppdatera testet i `RecipeList.spec.tsx` — lägg till fältet i fixture-objektet

**Lägga till ett nytt fält i detaljvyn:**
Samma process, men i `RecipeDetail.tsx` och `RecipeDetail.spec.tsx`. Testet använder `baseRecipe`-fixturet och `renderRecipeDetail()`-hjälparen — spread `{ ...baseRecipe, nyttFält: värde }` för att testa det nya fältet utan att upprepa all data.

## Gotchas

**`ingredients` och `steps` är aldrig `undefined` — de är alltid arrayer.** Typen garanterar `Ingredient[]` och `string[]`. Backend returnerar alltid arrayer (tomma om inga finns). Koden gör `length > 0`-kontroll, inte null-kontroll — det är korrekt.

**RecipeDetail har ingen felhantering.** Om API-anropet misslyckas händer ingenting — `setRecipe` anropas aldrig och laddningsindikatorn visas för alltid.

**På mobil (≤600px) göms `.recipe-card__meta`** (tid och portioner) via en media query i `styles.scss`. Det syns inte i komponenten.

**`key={i}` i ingredienser och steg använder index som nyckel.** Det funkar bra när listan aldrig ändras i realtid, men om du lägger till drag-to-reorder eller dynamisk redigering måste du byta till ett stabilt ID.

---
*Last updated: 2026-05-19*
