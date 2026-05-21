import { useState, useEffect } from 'react';
import { Route, Routes, useParams, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { LoginPage } from './auth/LoginPage';
import { RecipeList } from './recipes/RecipeList';
import { RecipeDetail } from './recipes/RecipeDetail';
import { ShoppingListDetail } from './shopping-lists/ShoppingListDetail';
import { ShoppingListForm } from './shopping-lists/ShoppingListForm';
import { RecipeForm } from './recipes/RecipeForm';
import { BottomNav } from './shared/BottomNav';
import { CalendarPage } from './calendar/CalendarPage';
import { SettingsPage, getPreferredListId } from './settings/SettingsPage';
import { API_URL } from '../config';

type Theme = 'default' | 'nord-dark' | 'nord-light';
const THEMES: Theme[] = ['default', 'nord-dark', 'nord-light'];
const STORAGE_KEY = 'recipes-theme';

function getStoredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY) ?? '';
  return THEMES.includes(stored as Theme) ? (stored as Theme) : 'default';
}

function applyTheme(theme: Theme) {
  if (theme === 'default') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

const ROUTE_TITLES: { pattern: RegExp; title: string }[] = [
  { pattern: /^\/shopping-lists/, title: 'Inköpslista' },
  { pattern: /^\/calendar/, title: 'Kalender' },
  { pattern: /^\/settings/, title: 'Inställningar' },
  { pattern: /^\/recipes\/new/, title: 'Nytt recept' },
  { pattern: /^\/recipes\/\d+\/edit/, title: 'Redigera recept' },
  { pattern: /^\/recipes/, title: 'Recept' },
  { pattern: /^\//, title: 'Recept' },
];

function routeTitle(pathname: string): string {
  return ROUTE_TITLES.find(({ pattern }) => pattern.test(pathname))?.title ?? 'Recept';
}

function Home() {
  return (
    <div data-testid="home-page" className="home-page">
      <RecipeList />
    </div>
  );
}

function RecipeEditPage() {
  const { id } = useParams<{ id: string }>();
  return <RecipeForm recipeId={id} />;
}

function ShoppingListEditPage() {
  const { id } = useParams<{ id: string }>();
  return <ShoppingListForm listId={id} />;
}

function ShoppingListLanding() {
  const [targetId, setTargetId] = useState<number | null>(null);
  useEffect(() => {
    axios
      .get<{ id: number }[]>(`${API_URL}/shopping-lists`, { withCredentials: true })
      .then((r) => {
        if (!Array.isArray(r.data) || !r.data.length) return;
        const preferred = getPreferredListId();
        const match = preferred ? r.data.find((l) => l.id === preferred) : null;
        setTargetId(match ? match.id : r.data[0].id);
      })
      .catch(() => {});
  }, []);
  if (!targetId) return null;
  return <Navigate to={`/shopping-lists/${targetId}`} replace />;
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  function cycleTheme() {
    setTheme((prev) => THEMES[(THEMES.indexOf(prev) + 1) % THEMES.length]);
  }

  return (
    <ProtectedRoute>
      <header data-testid="app-header" className="app-header">
        <span className="app-header__brand">{routeTitle(pathname)}</span>
        <div className="app-header__right">
          <button data-testid="theme-toggle" type="button" onClick={cycleTheme} className="app-header__theme-toggle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          </button>
          <span className="app-header__user">{user?.name}</span>
          <button onClick={logout} className="app-header__logout">Logga ut</button>
        </div>
      </header>
      {children}
      <BottomNav />
    </ProtectedRoute>
  );
}

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/shopping-lists"
          element={
            <AuthenticatedLayout>
              <ShoppingListLanding />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/shopping-lists/new"
          element={
            <AuthenticatedLayout>
              <ShoppingListForm />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/shopping-lists/:id/edit"
          element={
            <AuthenticatedLayout>
              <ShoppingListEditPage />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/shopping-lists/:id"
          element={
            <AuthenticatedLayout>
              <ShoppingListDetail />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/recipes/new"
          element={
            <AuthenticatedLayout>
              <RecipeForm />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/recipes/:id/edit"
          element={
            <AuthenticatedLayout>
              <RecipeEditPage />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/recipes/:id"
          element={
            <AuthenticatedLayout>
              <RecipeDetail />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/calendar"
          element={
            <AuthenticatedLayout>
              <CalendarPage />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <AuthenticatedLayout>
              <SettingsPage />
            </AuthenticatedLayout>
          }
        />
        <Route
          path="/*"
          element={
            <AuthenticatedLayout>
              <Home />
            </AuthenticatedLayout>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
