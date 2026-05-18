import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Laddar...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
