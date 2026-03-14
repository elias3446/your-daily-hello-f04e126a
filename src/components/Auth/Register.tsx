import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';
import { authStyles as s } from '@/styles/Auth/auth.styles';
import { useRegister } from '@/hooks/Auth/useRegister';

export default function Register() {
  const { form, loading, isFirstUser, updateField, handleSubmit } = useRegister();

  if (!isFirstUser) return <Navigate to="/login" replace />;

  return (
    <div className={s.page}>
      <div className={s.wrapper}>
        <div className={s.infoBanner}>
          <AlertTriangle className={s.infoBannerIcon} />
          <div>
            <p className={s.infoBannerTitle}>Inicialización del Sistema</p>
            <p className={s.infoBannerDescription}>Este usuario recibirá privilegios de Superadministrador con control total.</p>
          </div>
        </div>

        <Card className={s.card}>
          <CardHeader className={s.cardHeader}>
            <div className={s.logoIcon}>
              <Shield className={s.logoSvg} />
            </div>
            <CardTitle className={s.title}>HR Nexus</CardTitle>
            <CardDescription>Registro del primer usuario del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className={s.form}>
              <div className={s.fieldGroup}>
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input id="fullName" placeholder="Ingresa tu nombre completo" value={form.fullName} onChange={e => updateField('fullName', e.target.value)} required />
              </div>
              <div className={s.fieldGroup}>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" type="email" placeholder="admin@empresa.com" value={form.email} onChange={e => updateField('email', e.target.value)} required />
              </div>
              <div className={s.fieldGroup}>
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={e => updateField('password', e.target.value)} required />
              </div>
              <div className={s.fieldGroup}>
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input id="confirmPassword" type="password" placeholder="Repite la contraseña" value={form.confirmPassword} onChange={e => updateField('confirmPassword', e.target.value)} required />
              </div>
              <Button type="submit" className={s.submitButton} disabled={loading}>
                {loading ? 'Registrando...' : 'Crear Superadministrador'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
