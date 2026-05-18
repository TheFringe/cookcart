import { Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { LoginPage } from './auth/LoginPage';
import { RecipeList } from './recipes/RecipeList';

function Home() {
  const { user, logout } = useAuth();
  return (
    <div data-testid="home-page">
      <header>
        <span>Välkommen, {user?.name}!</span>
        <button onClick={logout}>Logga ut</button>
      </header>
      <RecipeList />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
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
