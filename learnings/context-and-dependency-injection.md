# Context API — Reacts ersättning för Dependency Injection

> **TL;DR** React har inget DI-system. Context är Reacts sätt att dela state nedåt i komponentträdet utan att manuellt skicka props genom varje lager. I det här projektet används det för autentiseringsstatus.

## Context

I Angular är det självklart att skapa en `AuthService` som injiceras via konstruktorn i vilken komponent som helst. React har inget sådant. Utan Context måste du skicka data som props från förälder till barn, lager för lager — ett problem som kallas "prop drilling".

Context API löser det: du placerar data i ett kontextlager högt upp i trädet, och vilken komponent som helst under det kan läsa datan utan att föräldrarna behöver veta om det.

---

## AuthContext — projektet i detalj

```tsx
// apps/recipes-frontend/src/app/auth/AuthContext.tsx

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';

type User = { id: number; email: string; name: string };
type AuthCtx = { user: User | null; loading: boolean; logout: () => void };

// 1. Skapa kontexten med ett defaultvärde
const AuthContext = createContext<AuthCtx>({
  user: null,
  loading: true,
  logout: () => {},
});

// 2. Provider-komponenten håller state och exponerar det
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<User>(`${API}/auth/me`, { withCredentials: true })
      .then((r) => setUser(r.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const logout = () =>
    axios.post(`${API}/auth/logout`, {}, { withCredentials: true })
      .then(() => setUser(null));

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom hook för att konsumera kontexten
export const useAuth = () => useContext(AuthContext);
```

Tre delar samarbetar:
1. `createContext` definierar formen på datan (med ett fallback-defaultvärde)
2. `AuthProvider` är en komponent som håller faktisk state och omsluter barnkomponenterna
3. `useAuth` är en convenience-hook — den gömmer `useContext(AuthContext)` bakom ett vänligare API

---

## Hur det kopplas in i applikationen

`AuthProvider` placeras högt upp i komponentträdet i `App.tsx`:

```tsx
// apps/recipes-frontend/src/app/App.tsx
export function App() {
  return (
    <AuthProvider>    {/* <-- omsluter hela appen */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<AuthenticatedLayout><Home /></AuthenticatedLayout>} />
      </Routes>
    </AuthProvider>
  );
}
```

Nu kan vilken komponent som helst inuti `<AuthProvider>` konsumera autentiseringsstatus:

```tsx
// apps/recipes-frontend/src/app/auth/ProtectedRoute.tsx
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();  // <-- läser från kontexten

  if (loading) return <p>Laddar...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```

```tsx
// apps/recipes-frontend/src/app/App.tsx — inne i AuthenticatedLayout
function AuthenticatedLayout({ children }) {
  const { user, logout } = useAuth();  // <-- samma kontext, annan komponent

  return (
    <ProtectedRoute>
      <header>
        <span>{user?.name}</span>
        <button onClick={logout}>Logga ut</button>
      </header>
      {children}
    </ProtectedRoute>
  );
}
```

Varken `AuthenticatedLayout` eller `ProtectedRoute` fick `user` som prop från sin förälder — de hämtar det direkt från kontexten.

---

## Angular-jämförelse

```typescript
// Angular
@Injectable({ providedIn: 'root' })
export class AuthService {
  user$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {
    this.http.get<User>('/api/auth/me').subscribe(
      user => this.user$.next(user),
      () => this.user$.next(null)
    );
  }

  logout() { return this.http.post('/api/auth/logout', {}); }
}

// Komponent
@Component(...)
export class HeaderComponent {
  constructor(private auth: AuthService) {}
  get user() { return this.auth.user$.value; }
}
```

```tsx
// React-ekvivalenten i det här projektet
// AuthProvider (= @Injectable service-klassen + BehaviorSubject)
// useAuth()    (= constructor(private auth: AuthService))
```

Den stora skillnaden: Angular's DI-container är global och singleton automatiskt. React's Context är explicit — du måste placera `<AuthProvider>` i trädet. Komponenter *utanför* providern får defaultvärdet från `createContext`.

---

## Stateless utilities — alternativet till DI

Inte all "service-kod" behöver Context. Rena hjälpfunktioner utan state är bara vanliga TypeScript-moduler:

```tsx
// apps/recipes-frontend/src/app/settings/preferences.ts
const PREF_LIST_KEY = 'recipes-preferred-list-id';

export function getPreferredListId(): number | null {
  const v = localStorage.getItem(PREF_LIST_KEY);
  return v ? parseInt(v, 10) : null;
}

export function setPreferredListId(id: number): void {
  localStorage.setItem(PREF_LIST_KEY, String(id));
}
```

Importeras direkt var de behövs, utan injektion:

```tsx
import { getPreferredListId } from '../settings/preferences';

function ShoppingListLanding() {
  useEffect(() => {
    const preferred = getPreferredListId();  // <-- direkt anrop
    // ...
  }, []);
}
```

Det är Reacts "stateless service"-ekvivalent. Eftersom det inte finns state behövs ingen Context, ingen Provider och ingen DI-mekanism.

---

## Varför Context istället för ett state-bibliotek?

Projektet har bara *en* Context — `AuthContext`. Det finns inget Redux, Zustand eller liknande. Motiveringen:

- Appens globala state är minimal: bara vem som är inloggad
- All annan state är lokal till enskilda komponenter (`useState`)
- Att lägga till Redux för en enda global state-bit vore överkomplicerat

I Angular är Services + DI-containern det naturliga sättet att dela allt. I React delar du bara state som faktiskt behöver delas — resten stannar lokalt i komponenten.

---

## Gotchas

**Alla komponenter under en Provider renderas om när kontextvärdet ändras.** Om du lägger för mycket state i en Context kan det orsaka onödiga re-renders. `AuthContext` är liten och ändras sällan (bara vid login/logout), så det är inte ett problem här.

**`createContext` kräver ett defaultvärde.** Det används bara om en komponent konsumerar kontexten *utan* att en Provider finns ovanför den. I det här projektet är defaultvärdet `{ user: null, loading: true, logout: () => {} }` — ett rimligt "oinloggad" state.

**Custom hook = bättre felmeddelanden.** Du *kan* använda `useContext(AuthContext)` direkt, men `useAuth()` är tydligare och du kan lägga till en guard om kontexten används utanför Provider:
```tsx
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth måste användas inuti AuthProvider');
  return ctx;
}
```

---
*Last updated: 2026-05-22*
