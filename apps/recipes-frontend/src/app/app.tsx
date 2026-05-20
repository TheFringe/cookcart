import { Route, Routes, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { LoginPage } from './auth/LoginPage';
import { RecipeList } from './recipes/RecipeList';
import { RecipeDetail } from './recipes/RecipeDetail';
import { ShoppingListPage } from './shopping-lists/ShoppingListPage';
import { ShoppingListDetail } from './shopping-lists/ShoppingListDetail';
import { ShoppingListForm } from './shopping-lists/ShoppingListForm';
import { RecipeForm } from './recipes/RecipeForm';
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

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
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
              <ShoppingListPage />
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
