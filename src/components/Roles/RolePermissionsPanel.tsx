import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Role, PERMISSION_GROUPS, PERMISSION_LABELS } from '@/lib/types';
import { Shield } from 'lucide-react';
import { rolesStyles as s } from '@/styles/Roles/roles.styles';

interface Props {
  role: Role;
}

export default function RolePermissionsPanel({ role }: Props) {
  return (
    <Card className={s.card}>
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Shield className="h-4 w-4 text-accent" />
          Permisos de: {role.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(PERMISSION_GROUPS).map(([group, permissions]) => {
            const active = permissions.filter(p => role.permissions.includes(p));
            if (active.length === 0) return null;
            return (
              <div key={group}>
                <h4 className={s.permissionGroupTitle}>{group}</h4>
                <div className={s.badgeContainer}>
                  {permissions.map(p => (
                    <span
                      key={p}
                      className={role.permissions.includes(p) ? s.badgeActive : s.badge}
                    >
                      {PERMISSION_LABELS[p]}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
