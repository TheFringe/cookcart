# Styling: global SCSS med BEM och CSS-variabler

> **TL;DR** Det här projektet använder *inte* Angular-style component-scoped CSS. Istället: en global SCSS-fil med BEM-namngivning och CSS custom properties för teman. Det är enklare och tillräckligt för en app av den här storleken.

## Context

Angular's `ViewEncapsulation.Emulated` scopar stilar till komponenten automatiskt via attributselektorer. React har inget inbyggt stil-scope. De vanligaste alternativen är CSS Modules (scoped), styled-components (CSS-in-JS) eller global CSS.

Det här projektet väljer global SCSS med BEM-namngivning. Inga CSS Modules (`*.module.scss`), inga CSS-in-JS.

---

## Filstruktur

```
src/
  styles.scss          ← en enda global fil med alla stilar
  app/
    recipes/
      RecipeList.tsx   ← className="recipe-list", "recipe-card" etc.
    shared/
      BottomNav.tsx    ← className="bottom-nav", "bottom-nav__item" etc.
```

Det finns ingen `RecipeList.module.scss` bredvid `RecipeList.tsx`. Alla stilar bor i `styles.scss`.

---

## BEM-namngivning

BEM (Block, Element, Modifier) är konventionen som ersätter style-encapsulation:

```scss
// styles.scss

// Block — komponenten själv
.recipe-list { ... }

// Element — en del av blocket (dubbelt underscore)
.recipe-list__tags { display: flex; gap: 0.5rem; }
.recipe-list__tag { background: var(--c-surface); }
.recipe-list__new-btn { ... }

// Modifier — ett alternativt utseende (dubbelt bindestreck)
.recipe-list__tag--active { background: var(--c-accent); }
```

Komponenten använder klassernamnen direkt:

```tsx
// RecipeList.tsx
<div className="recipe-list">
  <button
    className={`recipe-list__tag${activeTag === tag ? ' recipe-list__tag--active' : ''}`}
    onClick={() => setActiveTag(tag)}
  >
    {tag}
  </button>
</div>
```

BEM-prefixet (`recipe-list__`) ersätter Angular's automatiska scope — klassernamnen är unika nog att inte krocka.

---

## CSS Custom Properties (variabler) för teman

Tre teman definieras i `:root` och `[data-theme]`-selektorer:

```scss
// src/styles.scss

:root {
  /* Standard-tema (mörkt) */
  --c-bg:       #0D1117;
  --c-surface:  #131920;
  --c-border:   #1C2433;
  --c-text:     #EDE5D8;
  --c-accent:   #C8904A;

  --f-display: 'Fraunces', 'Georgia', serif;
  --f-ui:      'DM Sans', system-ui, sans-serif;
}

[data-theme='nord-dark'] {
  --c-bg:     #2E3440;
  --c-text:   #ECEFF4;
  --c-accent: #88C0D0;
  /* alla variabler skrivs om */
}

[data-theme='nord-light'] {
  --c-bg:     #ECEFF4;
  --c-text:   #2E3440;
  --c-accent: #2E5880;
}
```

Alla komponenter använder variablerna:

```scss
.recipe-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  color: var(--c-text);
}
```

Temat byts genom att sätta `data-theme`-attributet på `document.documentElement`:

```tsx
// App.tsx
function applyTheme(theme: Theme) {
  if (theme === 'default') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);  // <html data-theme="nord-dark">
  }
}
```

CSS-kaskaden gör resten — när `<html data-theme="nord-dark">`, matchar `[data-theme='nord-dark']`-selektorn och skriver om alla variabler för hela sidan.

---

## Angular-jämförelse

| Angular | Det här projektet |
|---------|-------------------|
| `component.scss` bredvid `component.ts` | En enda `styles.scss` |
| `ViewEncapsulation.Emulated` — auto-scoping | BEM-prefix — manuell scoping |
| `:host { ... }` — stila host-elementet | `.recipe-list { ... }` — stila root-elementet |
| `::ng-deep` — bryt encapsulation | Ingen encapsulation att bryta |
| Angular Material theming | CSS custom properties |
| `[class.active]="isActive"` | `` className={`btn${isActive ? ' btn--active' : ''}`} `` |

---

## Villkorliga klasser

Angular: `[class.active]="isActive"` eller `[ngClass]="{ 'active': isActive }"`

React — template literal med ternär:
```tsx
className={`recipe-list__tag${activeTag === tag ? ' recipe-list__tag--active' : ''}`}
```

React — för mer komplexa fall, `clsx`-biblioteket (används inte i detta projekt men är vanligt):
```tsx
import clsx from 'clsx';
className={clsx('recipe-list__tag', { 'recipe-list__tag--active': activeTag === tag })}
```

---

## Varför global SCSS och inte CSS Modules?

CSS Modules hade gett bättre encapsulation (auto-genererade unika klassnamn). Anledningarna till att inte använda det:

1. **Enkelhet** — en fil att hålla koll på istället för en per komponent
2. **BEM skyddar tillräckligt** — med konsekventa prefixer krockar stilar inte i ett projekt av den här storleken
3. **Enklare temahantering** — globala CSS-variabler fungerar sömlöst med global CSS; med CSS Modules hade variabler behövt importeras separat

För ett större projekt med ett större team hade CSS Modules (eller Tailwind) varit bättre val.

---

## Gotchas

**`className`, inte `class`.** I JSX är `class` ett reserverat JavaScript-ord. Skriv alltid `className`.

**Stila baserat på state, inte direkt DOM-manipulation.** Undvik `document.querySelector('.recipe-card').style.color = 'red'`. Låt state styra vilka klasser som sätts — React sköter DOM-uppdateringen.

**Global CSS påverkar allt.** Utan encapsulation kan en stil i `styles.scss` oavsiktligt påverka en helt annan komponent. BEM-prefixet minskar risken men eliminerar den inte — var noga med namngivning.

**Tillståndet `data-theme` synkroniseras inte automatiskt.** Det finns en känd bugg i projektet: `SettingsPage` och `AuthenticatedLayout` kan desynchroniseras om temat byts från ett av dem — `localStorage` är den enda sanningskällan, och båda läser från den. Se `settings.md` i features-dokumentationen.

---
*Last updated: 2026-05-22*
