import { Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { LoginPage } from './auth/LoginPage';
import { RecipeList } from './recipes/RecipeList';
import { RecipeDetail } from './recipes/RecipeDetail';
import { ShoppingListPage } from './shopping-lists/ShoppingListPage';
import { BottomNav } from './shared/BottomNav';

function Home() {
  const { user, logout } = useAuth();
  return (
    <div data-testid="home-page" className="home-page">
      <header className="app-header">
        <span className="app-header__brand">Recept</span>
        <div className="app-header__right">
          <span className="app-header__user">{user?.name}</span>
          <button onClick={logout} className="app-header__logout">Logga ut</button>
        </div>
      </header>
      <RecipeList />
      <BottomNav />
    </div>
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
            <ProtectedRoute>
              <ShoppingListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipes/:id"
          element={
            <ProtectedRoute>
              <RecipeDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
