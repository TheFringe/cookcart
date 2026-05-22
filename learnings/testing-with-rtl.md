# Testa React-komponenter med React Testing Library

> **TL;DR** React Testing Library (RTL) ersätter Angular's TestBed. Du renderar en komponent med `render()`, hittar element med `screen.getBy*`, simulerar interaktion med `fireEvent`, och testar asynkron data med `findBy*`. Axel mockas med `jest.mock('axios')`.

## Context

Angular-testning bygger på `TestBed.configureTestingModule()`, `ComponentFixture` och `detectChanges()`. RTL har ett fundamentalt annorlunda synsätt: testa komponenter som en användare ser dem, inte som en utvecklare implementerade dem. Det finns inga fixture-objekt, ingen komponent-instans, och du testar aldrig implementationsdetaljer som metodnamn eller privata variabler.

---

## Grundmönstret

```tsx
// apps/recipes-frontend/src/app/recipes/RecipeList.spec.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { RecipeList } from './RecipeList';

jest.mock('axios');                          // mocka hela axios-modulen
const mockedAxios = jest.mocked(axios);

beforeEach(() => jest.clearAllMocks());     // nollställ mocks mellan tester

describe('RecipeList', () => {
  it('visar laddningsindikator medan recept hämtas', () => {
    mockedAxios.get.mockReturnValue(new Promise(() => {}));  // promise som aldrig resolvar

    render(<MemoryRouter><RecipeList /></MemoryRouter>);

    expect(screen.getByText('Laddar recept...')).toBeInTheDocument();
  });
});
```

Fyra byggstenar:
1. `jest.mock('axios')` — ersätter axios med en mock-version
2. `render(<MemoryRouter>...)` — renderar komponenten i ett virtuellt DOM
3. `screen.getBy*` — hittar element
4. `expect(...).toBeInTheDocument()` — assertar

---

## Routing i tester — MemoryRouter

Komponenter som använder `<Link>`, `useNavigate`, `useParams` eller `NavLink` kräver en router. `MemoryRouter` simulerar routing utan en faktisk browser-URL:

```tsx
render(
  <MemoryRouter initialEntries={['/shopping-lists/1']}>
    <Routes>
      <Route path="/shopping-lists/:id" element={<ShoppingListDetail />} />
    </Routes>
  </MemoryRouter>
);
```

`initialEntries` sätter start-URL:en. `<Routes><Route>` behövs om komponenten använder `useParams` — utan rätt route-definition ger `useParams` `undefined`.

**Angular-ekvivalenten:**
```typescript
TestBed.configureTestingModule({
  imports: [RouterTestingModule.withRoutes([
    { path: 'shopping-lists/:id', component: ShoppingListDetail }
  ])]
});
```

---

## Asynkron data — findBy vs getBy

RTL har tre varianter av queries:

| Query | Beteende |
|-------|----------|
| `getBy*` | Synkron — kastar om elementet inte finns just nu |
| `queryBy*` | Synkron — returnerar `null` om elementet inte finns (använd för att testa frånvaro) |
| `findBy*` | Asynkron — väntar tills elementet finns (max ~1 sekund) |

Använd `findBy*` när du testar något som visas *efter* ett API-anrop:

```tsx
it('visar receptlistan när data returneras', async () => {
  mockedAxios.get.mockResolvedValue({
    data: [
      { id: 1, name: 'Pasta Carbonara', description: 'Klassisk', cook_time_minutes: 25, servings: 4 },
    ],
  });

  render(<MemoryRouter><RecipeList /></MemoryRouter>);

  // findAllByTestId väntar tills useEffect kört och state uppdaterats
  const items = await screen.findAllByTestId('recipe-item');
  expect(items).toHaveLength(1);
  expect(screen.getByText('Pasta Carbonara')).toBeInTheDocument();
});
```

**Angular-ekvivalenten:**
```typescript
fixture.detectChanges();          // trigga ngOnInit
tick();                           // vänta på asynkrona operationer (fakeAsync)
fixture.detectChanges();          // uppdatera vyn
expect(el.textContent).toContain('Pasta Carbonara');
```

RTL gör detta automatiskt via `findBy*`. Ingen `detectChanges()` eller `tick()` behövs.

---

## Axios-mocking

```tsx
jest.mock('axios');
const mockedAxios = jest.mocked(axios);
```

**Simulera ett lyckat svar:**
```tsx
mockedAxios.get.mockResolvedValue({ data: listData });
```

**Simulera ett misslyckat svar:**
```tsx
mockedAxios.get.mockRejectedValue(new Error('Network error'));
```

**Simulera ett promise som aldrig resolvar** (för att testa laddningsstatus):
```tsx
mockedAxios.get.mockReturnValue(new Promise(() => {}));
```

**Simulera olika svar för olika URLs** (ShoppingListDetail hämtar tre endpoints):
```tsx
mockedAxios.get.mockImplementation((url: string) => {
  if (url.includes('/ingredients')) return Promise.resolve({ data: [] });
  if (/\/shopping-lists\/\d+$/.test(url)) return Promise.resolve({ data: listData });
  return Promise.resolve({ data: [{ id: 1, name: 'ICA' }] }); // /shopping-lists
});
```

**Angular-ekvivalenten:**
```typescript
const httpMock = TestBed.inject(HttpTestingController);
httpMock.expectOne('/api/recipes').flush([{ id: 1, name: 'Pasta' }]);
```

---

## Interaktionstestning

```tsx
it('filtrerar recepten när en tagg väljs', async () => {
  mockedAxios.get.mockResolvedValue({
    data: [
      { id: 1, name: 'Pasta', tags: ['vegetariskt'] },
      { id: 2, name: 'Köttbullar', tags: ['kött'] },
    ],
  });

  render(<MemoryRouter><RecipeList /></MemoryRouter>);
  await screen.findAllByTestId('recipe-item'); // vänta tills data laddats

  fireEvent.click(screen.getByTestId('tag-filter-vegetariskt'));

  expect(screen.getAllByTestId('recipe-item')).toHaveLength(1);
  expect(screen.getByText('Pasta')).toBeInTheDocument();
  expect(screen.queryByText('Köttbullar')).not.toBeInTheDocument();
});
```

`fireEvent.click()` triggar ett klick-event. React uppdaterar state synkront (ingen extra `detectChanges()` behövs). `queryByText` (inte `getBy`) används för att testa att elementet *inte* finns — `getBy` kastar ett fel om elementet saknas.

**Angular-ekvivalenten:**
```typescript
const btn = fixture.debugElement.query(By.css('[data-testid="tag-filter-vegetariskt"]'));
btn.nativeElement.click();
fixture.detectChanges();
```

---

## Selektorer — data-testid

Projektet använder `data-testid` attribut istället för CSS-klasser eller text för att hitta element:

```tsx
// I komponenten
<div data-testid="shopping-list-detail">...</div>
<button data-testid="add-item-btn">Lägg till</button>

// I testet
expect(screen.getByTestId('shopping-list-detail')).toBeInTheDocument();
fireEvent.click(screen.getByTestId('add-item-btn'));
```

Varför `data-testid` och inte CSS-klasser?
- CSS-klasser är implementationsdetaljer — de kan ändras utan att beteendet ändras
- `data-testid` kommunicerar tydligt att detta element är avsett att testas
- Det är stabilt mot styling-refaktoreringar

För semantiska element (knappar, formulärfält, navigeringslänkar) används roller:
```tsx
screen.getByRole('link', { name: /recept/i })   // länk med texten "Recept"
screen.getByRole('button', { name: /spara/i })   // knapp med texten "Spara"
screen.getByRole('option', { name: 'ICA' })      // select-option
```

---

## useNavigate-mocking

Navigeringstestning kräver extra setup eftersom `useNavigate` måste mockas:

```tsx
// apps/recipes-frontend/src/app/shopping-lists/ShoppingListDetail.spec.tsx

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),  // behåll allt utom useNavigate
  useNavigate: jest.fn(),
}));

const mockedNavigate = jest.mocked(useNavigate);
const navigateMock = jest.fn();

beforeEach(() => {
  mockedNavigate.mockReturnValue(navigateMock);
});

it('navigerar tillbaka vid framgångsrik radering', async () => {
  // ... testa interaktion ...
  expect(navigateMock).toHaveBeenCalledWith('/');
});
```

**Angular-ekvivalenten:**
```typescript
const router = TestBed.inject(Router);
spyOn(router, 'navigate');
expect(router.navigate).toHaveBeenCalledWith(['/']);
```

---

## within() — scoped queries

`within()` begränsar en query till ett specifikt element — användbart när samma text eller testid förekommer flera gånger:

```tsx
// BottomNav.spec.tsx
const link = screen.getByRole('link', { name: /recept/i });
expect(within(link).getByTestId('nav-icon-recept')).toBeInTheDocument();
```

Utan `within()` skulle `getByTestId('nav-icon-recept')` söka i hela dokumentet. Med `within(link)` söks bara inuti länkelementet.

---

## Angular-till-RTL ordbok

| Angular TestBed | React Testing Library |
|-----------------|----------------------|
| `TestBed.createComponent(MyComp)` | `render(<MyComp />)` |
| `fixture.detectChanges()` | Automatiskt (eller `await findBy*`) |
| `fixture.debugElement.query(By.css(...))` | `screen.getByTestId(...)` |
| `el.nativeElement.click()` | `fireEvent.click(el)` |
| `expect(el.textContent).toBe(...)` | `expect(el).toHaveTextContent(...)` |
| `HttpTestingController.flush(data)` | `mockedAxios.get.mockResolvedValue({ data })` |
| `tick()` i fakeAsync | `await screen.findBy*(...)` |
| `spyOn(router, 'navigate')` | `jest.fn()` + mock av `useNavigate` |
| `By.css('.class')` | `screen.getByTestId(...)` |
| `componentInstance.property` | Testa aldrig intern state — testa vad som renderas |

---

## Gotchas

**Testa aldrig React-state direkt.** Angulars `componentInstance.recipes` har ingen motsvarighet i RTL. Du ska testa vad som *visas*, inte vad som *lagras*. Om listan renderar rätt antal element spelar det ingen roll hur state är strukturerat.

**`getBy` kastar, `queryBy` returnerar null.** Blanda inte ihop dem. Använd `queryBy` + `not.toBeInTheDocument()` för att bekräfta att något inte finns.

**Glöm inte `await` på `findBy*`-queries.** Det är lätt att skriva `screen.findByText(...)` utan `await` — du får då ett Promise-objekt, inte ett DOM-element, och testet passerar felaktigt.

**`beforeEach(() => jest.clearAllMocks())`** är viktigt. Utan det kan mocks från ett test läcka in i nästa och ge falska positiva eller negativa resultat.

**`act()`-varningar.** Om du ser varningar om att state-uppdateringar ska wrappas i `act()`, beror det nästan alltid på att du gör assertions innan asynkrona operationer slutfört sig. Använd `await findBy*` istället för `getBy`.

---
*Last updated: 2026-05-22*
