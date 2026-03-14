import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Permission } from '@/lib/types';

interface Props {
  children: React.ReactNode;
  permission?: Permission;
}

export function ProtectedRoute({ children, permission }: Props) {
  const { isAuthenticated, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Acceso denegado</h1>
          <p className="text-muted-foreground">No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
