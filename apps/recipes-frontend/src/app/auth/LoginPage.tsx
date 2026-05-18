import { API_URL as API } from '../../config';

export function LoginPage() {
  return (
    <div data-testid="login-page">
      <h1>Recept</h1>
      <a href={`${API}/auth/google`}>Logga in med Google</a>
    </div>
  );
}
