import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './app';

jest.mock('./auth/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({ user: null, loading: false, logout: jest.fn() }),
}));

describe('App', () => {
  it('renderar utan fel', () => {
    const { baseElement } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(baseElement).toBeTruthy();
  });
});
