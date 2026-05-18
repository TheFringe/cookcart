import { API_URL as API } from '../../config';

export function LoginPage() {
  return (
    <div data-testid="login-page" className="login-page">
      <p className="login-page__eyebrow">Din personliga kokbok</p>
      <h1 className="login-page__title">Recept</h1>
      <a href={`${API}/auth/google`} className="login-page__cta">
        Logga in med Google
      </a>
    </div>
  );
}
