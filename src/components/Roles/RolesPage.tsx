import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Role } from '@/lib/types';
import { useRoles } from '@/contexts/RolesContext';
import { useRoleActions } from '@/hooks/Roles/useRoleActions';
import { rolesStyles as s } from '@/styles/Roles/roles.styles';
import RoleCard from './RoleCard';
import RoleFormDialog from './RoleFormDialog';
import RolePermissionsPanel from './RolePermissionsPanel';

export default function RolesPage() {
  const { roles, selectedRole, selectRole } = useRoles();
  const { handleDelete, getUserCountForRole } = useRoleActions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const openCreate = () => { setEditingRole(null); setDialogOpen(true); };
  const openEdit = (role: Role) => { setEditingRole(role); setDialogOpen(true); };

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div>
          <h1 className={s.heading}>Roles y Permisos</h1>
          <p className={s.subheading}>Administra los roles del sistema y sus permisos</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Nuevo Rol
        </Button>
      </div>

      {roles.length === 0 ? (
        <p className={s.emptyText}>No hay roles creados. Crea el primero.</p>
      ) : (
        <div className={s.rolesGrid}>
          {roles.map(role => (
            <RoleCard
              key={role.id}
              role={role}
              userCount={getUserCountForRole(role.id)}
              isSelected={selectedRole?.id === role.id}
              onSelect={() => selectRole(selectedRole?.id === role.id ? null : role)}
              onEdit={() => openEdit(role)}
              onDelete={() => handleDelete(role)}
            />
          ))}
        </div>
      )}

      {selectedRole && <RolePermissionsPanel role={selectedRole} />}

      <RoleFormDialog open={dialogOpen} onOpenChange={setDialogOpen} role={editingRole} />
    </div>
  );
}
