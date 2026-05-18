import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { API_URL as API } from '../../config';

type User = { id: number; email: string; name: string };
type AuthCtx = { user: User | null; loading: boolean; logout: () => void };

const AuthContext = createContext<AuthCtx>({
  user: null,
  loading: true,
  logout: () => {},
});

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
    axios
      .post(`${API}/auth/logout`, {}, { withCredentials: true })
      .then(() => setUser(null));

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
