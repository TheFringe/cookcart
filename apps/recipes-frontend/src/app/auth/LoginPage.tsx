const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export function LoginPage() {
  return (
    <div data-testid="login-page">
      <h1>Recept</h1>
      <a href={`${API}/auth/google`}>Logga in med Google</a>
    </div>
  );
}
