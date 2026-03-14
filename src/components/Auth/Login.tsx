import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { authStyles as s } from '@/styles/Auth/auth.styles';
import { useLogin } from '@/hooks/Auth/useLogin';

export default function Login() {
  const { form, loading, isAuthenticated, isFirstUser, updateField, handleSubmit } = useLogin();

  if (isFirstUser) return <Navigate to="/register" replace />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className={s.page}>
      <Card className={s.card}>
        <CardHeader className={s.cardHeader}>
          <div className={s.logoIcon}>
            <Shield className={s.logoSvg} />
          </div>
          <CardTitle className={s.title}>HR Nexus</CardTitle>
          <CardDescription>Inicia sesión para acceder al sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className={s.form}>
            <div className={s.fieldGroup}>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" placeholder="tu@empresa.com" value={form.email} onChange={e => updateField('email', e.target.value)} required />
            </div>
            <div className={s.fieldGroup}>
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" placeholder="Tu contraseña" value={form.password} onChange={e => updateField('password', e.target.value)} required />
            </div>
            <Button type="submit" className={s.submitButton} disabled={loading}>
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
