# Controlled Forms i React

> **TL;DR** React har inget inbyggt formulärsystem. Varje input-fält kopplas till ett `useState`-värde: state → `value`, event → setter. Det kallas ett *controlled component* och är standardmönstret i det här projektet.

## Context

Angular-utvecklare är vana vid antingen Template Driven Forms (`[(ngModel)]`) eller Reactive Forms (`FormGroup`, `FormControl`, `patchValue`). React har inget av detta inbyggt — formulärhantering är bara vanlig state + event handlers.

Det här projektet använder det enklaste möjliga formulärmönstret: ett `useState`-anrop per fält, utan ett formulärbibliotek.

---

## Hur det fungerar

```tsx
// apps/recipes-frontend/src/app/recipes/RecipeForm.tsx

export function RecipeForm({ recipeId }: { recipeId?: string }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [tagsText, setTagsText] = useState('');

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="recipe-name">Namn</label>
      <input
        id="recipe-name"
        data-testid="input-name"
        value={name}                              // state → DOM
        onChange={(e) => setName(e.target.value)} // DOM → state
      />

      <label htmlFor="recipe-cook-time">Tillagningstid (min)</label>
      <input
        id="recipe-cook-time"
        type="number"
        min="0"
        value={cookTime}
        onChange={(e) => setCookTime(e.target.value)}
      />

      <button type="submit">Spara</button>
    </form>
  );
}
```

Varje tangenttryckning triggar `onChange`, som anropar settern, vilket triggar en re-render, som uppdaterar `value` i input-fältet med det nya state-värdet. React kontrollerar alltid vad som visas.

---

## Fylla i ett befintligt värde (edit-läge)

`RecipeForm` används både för att skapa och redigera recept. Om `recipeId` skickas in som prop hämtas det befintliga receptet och state fylls i med `useState`-setters:

```tsx
useEffect(() => {
  if (!recipeId) return;
  axios
    .get<Recipe>(`${API_URL}/recipes/${recipeId}`, { withCredentials: true })
    .then((r) => {
      setName(r.data.name);
      setDescription(r.data.description ?? '');
      setCookTime(r.data.cook_time_minutes?.toString() ?? '');
      setServings(r.data.servings?.toString() ?? '');
      setTagsText(r.data.tags?.join(', ') ?? '');
    });
}, [recipeId]);
```

Det här är Reacts motsvarighet till `this.form.patchValue(data)` i Angular Reactive Forms — du anropar bara varje setter med det befintliga värdet. Eftersom state är kopplat till `value`-prop uppdateras fältet automatiskt i nästa render.

---

## Submit-hantering

```tsx
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();  // Hindrar sidladdning — precis som i vanilla JS

  const payload = {
    name,
    description,
    cook_time_minutes: cookTime ? parseInt(cookTime, 10) : null,
    servings: servings ? parseInt(servings, 10) : null,
    tags: tagsText ? tagsText.split(',').map(t => t.trim()) : [],
  };

  if (recipeId) {
    await axios.put(`${API_URL}/recipes/${recipeId}`, payload, { withCredentials: true });
  } else {
    await axios.post(`${API_URL}/recipes`, payload, { withCredentials: true });
  }
  navigate('/');
}
```

`e.preventDefault()` är obligatorisk — utan den laddar browsern om sidan vid submit. Observera konverteringen från string till number: alla `input`-värden är alltid strängar i JavaScript, oavsett `type="number"`.

---

## Dynamiska listor av fält

Ingrediens-listan i `RecipeForm` är ett array-state — användaren kan lägga till och ta bort rader:

```tsx
interface IngredientDraft { name: string; quantity: string; unit: string; }

const [ingredients, setIngredients] = useState<IngredientDraft[]>([]);

function addIngredient() {
  setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
}

function updateIngredient(index: number, field: keyof IngredientDraft, value: string) {
  setIngredients(ingredients.map((ing, i) =>
    i === index ? { ...ing, [field]: value } : ing
  ));
}

function removeIngredient(index: number) {
  setIngredients(ingredients.filter((_, i) => i !== index));
}
```

Observera att du aldrig muterar arrayen direkt — du skapar alltid en ny array med `map`, `filter` eller spread. Det är Reacts grundregel: state är immutabelt.

---

## Varför inget formulärbibliotek?

Det här projektet använder inte React Hook Form, Formik eller Zod för validering. Orsakerna:

1. **Lärande** — att se det underliggande mönstret är mer pedagogiskt än att gömma det bakom ett bibliotek
2. **Enkel validering** — valideringen som finns (required-attribut, type-begränsningar) hanteras av HTML natively
3. **Litet formulär** — `RecipeForm` har ~8 fält, vilket är hanterbart utan extrabibliotek

För en Angular-utvecklare kan React Hook Form vara bekant — det liknar Reactive Forms i konceptet med ett centralt formulär-objekt. Men i det här projektet ska du förstå det grundläggande kontrollerade komponent-mönstret.

---

## Angular-jämförelse

| Angular Reactive Forms | React controlled inputs |
|------------------------|------------------------|
| `new FormGroup({ name: new FormControl('') })` | `const [name, setName] = useState('')` |
| `this.form.patchValue(data)` | `setName(data.name)` |
| `[formControl]="form.get('name')"` | `value={name} onChange={e => setName(e.target.value)}` |
| `this.form.value` | Läs state-variablerna direkt |
| `this.form.valid` | Manuell validering eller HTML-attribut |
| `(ngSubmit)="onSubmit()"` | `onSubmit={handleSubmit}` |

---

## Gotchas

**`htmlFor`, inte `for`.** I JSX är `for` ett reserverat JavaScript-ord. Skriv `<label htmlFor="field-id">`.

**Alla input-värden är strängar.** Även `<input type="number">` ger dig en sträng i `e.target.value`. Konvertera alltid med `parseInt` eller `Number` innan du skickar till backend.

**Sifferfält visas tomma, inte `"0"`.** Om du initialiserar `cookTime` med `''` (tom sträng) visas ett tomt fält — rätt beteende. Om du initialiserar med `0` visas `"0"` — förmodligen fel. Använd tom sträng som default för numeriska fält i formulär.

**`e.preventDefault()` är manuellt.** Angular Reactive Forms hanterar detta åt dig. I React måste du alltid anropa det i `onSubmit`.

---
*Last updated: 2026-05-22*
