# React för Angular-utvecklare — det mentala skiftet

> **TL;DR** Angular är ett ramverk som berättar *hur* du ska strukturera allt. React är ett bibliotek som bara hanterar rendering — resten väljer du själv. Det låter friare, men kräver att du bygger upp ett mentalt model från grunden.

## Context

Du kan Angular. Du vet hur det fungerar med moduler, dekoratorer, services, DI-containern och Observables. React gör *allt* av detta annorlunda — inte nödvändigtvis bättre eller sämre, men annorlunda nog att du inte kan mappa din Angular-kunskap direkt.

Det här dokumentet är en Rosetta-sten. Varje central Angular-idé matchas mot dess React-motsvarighet med exempel från det här projektet.

---

## Angular-till-React ordbok

### Komponent

**Angular:**
```typescript
@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];

  ngOnInit() { /* hämta data */ }
}
```

**React (det här projektet):**
```tsx
// apps/recipes-frontend/src/app/recipes/RecipeList.tsx
export function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    axios.get<Recipe[]>(`${API_URL}/recipes`, { withCredentials: true })
      .then((r) => setRecipes(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div data-testid="recipe-list" className="recipe-list">
      {recipes.map((r) => (
        <article key={r.id} className="recipe-card">
          <h2><Link to={`/recipes/${r.id}`}>{r.name}</Link></h2>
        </article>
      ))}
    </div>
  );
}
```

Allt — logik, template, state — bor i *en enda funktion*. Det finns ingen klass, ingen dekorator, ingen separat HTML-fil. JSX är inte ett templatsystem; det är JavaScript som returnerar en beskrivning av vad som ska renderas.

---

### @Input() — props

**Angular:** `@Input() recipe: Recipe;`

**React:** Props är vanliga funktionsparametrar.

```tsx
// Komponent med props
function RecipeCard({ recipe, onDelete }: { recipe: Recipe; onDelete: (id: number) => void }) {
  return <div>{recipe.name} <button onClick={() => onDelete(recipe.id)}>Ta bort</button></div>;
}

// Användning
<RecipeCard recipe={r} onDelete={handleDelete} />
```

TypeScript-typen för props definieras antingen inline (som ovan) eller som ett interface:

```tsx
interface RecipeFormProps {
  recipeId?: string;  // ? = optional, precis som @Input() med defaultValue
}

export function RecipeForm({ recipeId }: RecipeFormProps) { ... }
```

---

### @Output() EventEmitter — callback-props

**Angular:** `@Output() deleted = new EventEmitter<number>();`

**React:** Du skickar en funktion som prop. Konventionen är att namnge den `onX`:

```tsx
// Förälder definierar handler
function ParentComponent() {
  function handleDelete(id: number) { /* ... */ }
  return <RecipeCard onDelete={handleDelete} />;
}

// Barn anropar den
function RecipeCard({ onDelete }: { onDelete: (id: number) => void }) {
  return <button onClick={() => onDelete(recipe.id)}>Ta bort</button>;
}
```

Ingen EventEmitter-infrastruktur behövs — det är bara funktionsanrop.

---

### ng-content — children-prop

**Angular:** `<ng-content>` för att projicera innehåll.

**React:**

```tsx
// AuthenticatedLayout i App.tsx
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <header className="app-header">...</header>
      {children}   {/* <-- projected content */}
      <BottomNav />
    </ProtectedRoute>
  );
}

// Användning
<AuthenticatedLayout>
  <RecipeList />   {/* hamnar i {children} */}
</AuthenticatedLayout>
```

`children` är en prop som React fyller automatiskt med det som du skriver mellan komponentens öppnings- och stängningstagg.

---

### Lifecycle-hooks

| Angular | React |
|---------|-------|
| `ngOnInit` | `useEffect(() => { ... }, [])` |
| `ngOnDestroy` | Return-funktion inuti useEffect |
| `ngOnChanges(changes)` | `useEffect(() => { ... }, [dep1, dep2])` |

**ngOnInit** — kör en gång vid mount:
```tsx
useEffect(() => {
  axios.get('/api/recipes').then(r => setRecipes(r.data));
}, []); // tom array = kör bara vid mount
```

**ngOnDestroy** — cleanup vid unmount:
```tsx
// Toast-komponenten i shared/Toast.tsx
useEffect(() => {
  const timer = setTimeout(onDismiss, duration);
  return () => clearTimeout(timer); // <-- detta kör vid unmount
}, [onDismiss, duration]);
```

Cleanup-funktionen är Reacts svar på `ngOnDestroy`. Den körs automatiskt när komponenten tas bort från DOM:en, eller precis innan effekten körs om (vid beroende-förändring).

**ngOnChanges** — kör när ett specifikt värde ändras:
```tsx
// CalendarPage: kör om när veckan (mondayStr) eller vyn (view) ändras
useEffect(() => {
  if (view === 'month') return;
  axios.get('/api/meal-plan', { params: { week: mondayStr } })
    .then(r => setEntries(r.data));
}, [mondayStr, view]); // lista av beroenden som Angular's ngOnChanges.changes
```

---

### *ngIf och *ngFor

**Angular:**
```html
<div *ngIf="loading">Laddar...</div>
<article *ngFor="let recipe of recipes; trackBy: trackById">{{ recipe.name }}</article>
```

**React — villkorlig rendering:**
```tsx
{loading && <p className="recipe-loading">Laddar recept...</p>}
{!loading && recipes.length === 0 && <p>Inga recept hittades</p>}

// Alternativt med ternär
{loading ? <p>Laddar...</p> : <RecipeList recipes={recipes} />}
```

**React — listor:**
```tsx
{recipes.map((r) => (
  <article key={r.id} data-testid="recipe-item" className="recipe-card">
    <h2><Link to={`/recipes/${r.id}`}>{r.name}</Link></h2>
  </article>
))}
```

`key` motsvarar `trackBy` — det är Reacts sätt att identifiera list-element mellan renders för att undvika onödig DOM-manipulering. Använd alltid ett stabilt, unikt värde (t.ex. databas-id), aldrig index.

---

### [(ngModel)] — controlled inputs

Angular använder two-way binding. React har inget sådant — istället kopplas input-elementets värde explicit till state, och varje tangenttryckning uppdaterar state:

```tsx
// apps/recipes-frontend/src/app/recipes/RecipeForm.tsx
const [name, setName] = useState('');

<input
  value={name}                           // state → DOM (som [ngModel])
  onChange={(e) => setName(e.target.value)} // DOM → state (som (ngModelChange))
/>
```

Det här kallas ett *controlled component*. React "äger" värdet — det som visas i input-fältet är alltid precis vad `name`-state innehåller. Utan `value`-prop blir det ett *uncontrolled component* (som hanteras av DOM:en), vilket nästan aldrig är vad du vill i React.

---

### Services och Dependency Injection

Angular använder ett DI-system för att dela kod och state. React har inget DI-system. Projektet löser detta på två sätt:

**1. Context API — för global state (som AuthService):**
```tsx
// auth/AuthContext.tsx
const AuthContext = createContext<AuthCtx>({ user: null, loading: true, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // ...
  return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
```

Vilken komponent som helst under `<AuthProvider>` i trädet kan anropa `useAuth()` och få `user`-objektet — ingen constructor-injection behövs.

**2. Vanliga modul-funktioner — för utilities (som en stateless service):**
```tsx
// settings/preferences.ts
export function getPreferredListId(): number | null { ... }
export function setPreferredListId(id: number): void { ... }
```

Importeras direkt utan injektion. Eftersom det inte finns någon state i dessa funktioner finns det heller inget skäl till DI.

---

### RxJS Observables → Promises + Axios

Angular's HttpClient returnerar Observables. Det här projektet använder Axios som returnerar Promises.

| Angular / RxJS | React / Axios |
|----------------|---------------|
| `http.get<T>(url).pipe(tap(...))` | `axios.get<T>(url).then(r => ...)` |
| `subscribe(data => ..., err => ...)` | `.then(r => ...).catch(err => ...)` |
| `takeUntil(this.destroy$)` | useEffect cleanup-funktion |
| `async pipe` i template | `await`/`.then()` + setState |

Det finns ingen RxJS i det här projektet. Allt är Promise-baserat och hanteras manuellt med `useState`.

---

## Rendering-modellen

Angular körs i NgZone och detekterar förändringar automatiskt (zone.js patchar browser-API:er). React är annorlunda:

**React renderar om en komponent när:**
1. Dess state ändras (via en setter-funktion)
2. Dess props ändras (föräldern renderar om)
3. En Context den konsumerar ändras

Det finns ingen automatisk change detection. Om du vill att UI:t ska uppdateras *måste* du anropa en setter: `setRecipes(ny)`, inte `recipes = ny`.

```
Render → state förändras → ny render → ny state förändras → ny render → ...
```

Varje render är ett anrop till komponenten som function. React jämför det nya JSX-trädet med det gamla och applicerar bara faktiska DOM-förändringar (reconciliation, ungefär som Angulars change detection men pull-baserat istället för push-baserat).

---

## Varför det är gjort så här

React valdes medvetet för att det är ett *bibliotek*, inte ett ramverk — det ger friheten att välja routing, datahämtning och state management separat. Det passar ett lär-projekt bra eftersom varje del syns tydligt; inget är "magic" bakom kulisserna.

Angular är bättre lämpat för store enterprise-applikationer med strikta konventioner och ett stort team. React är mer flexibelt men kräver att du fattar fler beslut själv.

---

## Gotchas för Angular-utvecklare

**Det finns ingen `this`.** Komponenter är funktioner. State lever i hooks, inte i klassattribut. Lär dig att läsa `const [x, setX] = useState(...)` som Angulars `x: T` + setter.

**JSX är JavaScript, inte HTML.** Du kan inte använda `class` (det är ett reserverat JS-ord) — du måste skriva `className`. Event handlers heter `onClick`, inte `(click)`. Alla attribut är camelCase.

**Props är read-only.** Precis som `@Input()` i Angular ska du aldrig modifiera props direkt. Skicka callbacks uppåt om barnet behöver påverka förälderns state.

**`key` på list-element är obligatorisk.** Om du glömmer den varnar React, och du riskerar konstiga rendering-buggar när listan förändras.

**Inga moduler i Angular-mening.** Det finns inga `NgModule`. Komponenter importeras direkt från varandra som TypeScript-moduler. Tree-shaking hanteras av bundlern (Vite/Webpack), inte av ett modul-system.

**Hooks får bara anropas på toppnivå.** Du kan inte anropa `useState` eller `useEffect` inuti if-satser, loopar eller nästlade funktioner. Det är en hårt enforced regel i React.

---
*Last updated: 2026-05-22*
