import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Role } from '@/lib/types';
import { Shield, Pencil, Trash2, Users } from 'lucide-react';
import { rolesStyles as s } from '@/styles/Roles/roles.styles';
import { cn } from '@/lib/utils';

interface Props {
  role: Role;
  userCount: number;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function RoleCard({ role, userCount, isSelected, onSelect, onEdit, onDelete }: Props) {
  return (
    <Card
      className={cn(s.roleCard, isSelected && s.roleCardActive)}
      onClick={onSelect}
    >
      <CardHeader className={s.roleCardHeader}>
        <h3 className={s.roleName}>{role.name}</h3>
        {role.isSystem ? (
          <span className={s.roleSystemBadge}>
            <Shield className="h-3 w-3" /> Sistema
          </span>
        ) : (
          <div className={s.actionsRow}>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); onEdit(); }}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={e => { e.stopPropagation(); onDelete(); }}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className={s.roleDescription}>{role.description}</p>
        <div className="flex items-center justify-between">
          <span className={s.permissionCount}>{role.permissions.length} permisos</span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" /> {userCount} usuarios
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
