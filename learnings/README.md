# Learnings

Kunskapsdokument för Recipes-projektet. Skrivet för att hjälpa dig förstå *varför* koden ser ut som den gör, inte bara *vad* den gör.

## Komponenter

- [RecipeList och RecipeDetail](recipe-list-and-detail.md) — Hur receptlistan och detaljvyn fungerar, routing, dataflöde och gotchas
- [Toast-komponenten](toast-component.md) — Tillfälliga felmeddelanden med auto-dismiss: useEffect, setTimeout och cleanup

## React Hooks

- [useState, useEffect och useParams](react-hooks-usestate-useeffect-useparams.md) — Vad dessa tre hooks gör, hur de används i projektet, och hur de samverkar

## Routing

- [React Router](react-router.md) — Hur routing fungerar i appen: BrowserRouter, Routes, ProtectedRoute, Link, useParams och hur man testar
- [Express Routing](express-routing.md) — Middleware-kedjan, Router-moduler, fabriksfunktionsmönstret, asyncHandler och URL-parametrar

## För Angular-utvecklare

- [React för Angular-utvecklare — det mentala skiftet](react-for-angular-devs.md) — Angular-till-React ordbok: komponenter, props, lifecycle, ngIf/ngFor, DI, RxJS och rendering-modellen
- [Controlled Forms](controlled-forms.md) — Kontrollerade inputfält som ersättning för Angular Reactive Forms och ngModel
- [Context API och Dependency Injection](context-and-dependency-injection.md) — AuthContext som ersättning för Angular Services och DI-containern
- [Testa med React Testing Library](testing-with-rtl.md) — RTL vs Angular TestBed: render, screen, findBy, fireEvent och axios-mocking
- [Styling: global SCSS med BEM](styling-with-global-scss.md) — Global CSS med BEM-namngivning och CSS custom properties för teman (ingen ViewEncapsulation)
