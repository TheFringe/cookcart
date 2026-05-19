import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import App from './app';
import { useAuth } from './auth/AuthContext';

jest.mock('axios');
const mockedAxios = jest.mocked(axios);

jest.mock('./auth/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: jest.fn(),
}));

const mockUseAuth = jest.mocked(useAuth);

beforeEach(() => {
  mockUseAuth.mockReturnValue({ user: null, loading: false, logout: jest.fn() });
  mockedAxios.get.mockResolvedValue({ data: [] });
});

describe('App', () => {
  it('renderar utan fel', () => {
    const { baseElement } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(baseElement).toBeTruthy();
  });

  it('visar inloggningssidan när ingen användare är inloggad', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    screen.getByTestId('login-page');
  });

  it('visar startsidan när användaren är inloggad', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, email: 'test@example.com', name: 'Test' },
      loading: false,
      logout: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    screen.getByTestId('home-page');
  });

  it('visar inköpslistesidan på /shopping-lists', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, email: 'test@example.com', name: 'Test' },
      loading: false,
      logout: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/shopping-lists']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('shopping-list-page')).toBeInTheDocument();
  });

  it('visar navigationsmenyn på /shopping-lists', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, email: 'test@example.com', name: 'Test' },
      loading: false,
      logout: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/shopping-lists']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('visar navigationsmenyn när användaren är inloggad', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, email: 'test@example.com', name: 'Test' },
      loading: false,
      logout: jest.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('visar inköpslistans detaljsida på /shopping-lists/:id', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, email: 'test@example.com', name: 'Test' },
      loading: false,
      logout: jest.fn(),
    });
    mockedAxios.get.mockResolvedValue({ data: { id: 1, name: 'ICA', items: [] } });

    render(
      <MemoryRouter initialEntries={['/shopping-lists/1']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByTestId('shopping-list-detail')).toBeInTheDocument();
  });
});
