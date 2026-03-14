import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { dashboardStyles as s } from '@/styles/Dashboard/dashboard.styles';
import { useDashboard } from '@/hooks/Dashboard/useDashboard';

export default function Dashboard() {
  const { user, role, stats, logs, hasLogs } = useDashboard();

  return (
    <div className={s.page}>
      <div>
        <h1 className={s.heading}>Bienvenido, {user?.fullName}</h1>
        <p className={s.subheading}>Panel de administración del sistema HR Nexus</p>
      </div>

      <div className={s.statsGrid}>
        {stats.map(stat => (
          <Card key={stat.label} className={s.card}>
            <CardHeader className={s.cardHeaderRow}>
              <CardTitle className={s.statLabel}>{stat.label}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={s.statValue}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {role && (
        <Card className={s.card}>
          <CardHeader>
            <CardTitle className={s.sectionTitle}>
              <Shield className={s.sectionIcon} />
              Tu Rol: {role.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={s.cardDescription}>{role.description}</p>
            <div className={s.badgeContainer}>
              {role.permissions.map(p => (
                <span key={p} className={s.badge}>{p}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className={s.card}>
        <CardHeader>
          <CardTitle className={s.sectionTitle}>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasLogs ? (
            <p className={s.emptyText}>No hay actividad registrada.</p>
          ) : (
            <div className="space-y-3">
              {logs.map(log => (
                <div key={log.id} className={s.activityItem}>
                  <div className={s.activityDot} />
                  <div className="flex-1">
                    <p className={s.activityText}>{log.details}</p>
                    <p className={s.activityTime}>{new Date(log.timestamp).toLocaleString('es')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
