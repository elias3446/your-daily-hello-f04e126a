import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PERMISSION_GROUPS, PERMISSION_LABELS, Permission, Role } from '@/lib/types';
import { useRoleForm } from '@/hooks/Roles/useRoleForm';
import { rolesStyles as s } from '@/styles/Roles/roles.styles';
import { useEffect } from 'react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: Role | null;
}

export default function RoleFormDialog({ open, onOpenChange, role }: Props) {
  const {
    form, loading, editingRole, updateField,
    togglePermission, toggleGroupPermissions,
    resetForm, loadRole, handleSubmit,
  } = useRoleForm(() => onOpenChange(false));

  useEffect(() => {
    if (open && role) loadRole(role);
    else if (open && !role) resetForm();
  }, [open, role]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={s.dialogContent}>
        <DialogHeader>
          <DialogTitle>{editingRole ? 'Editar Rol' : 'Crear Nuevo Rol'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className={s.form}>
          <div className={s.fieldGroup}>
            <Label htmlFor="roleName">Nombre del Rol</Label>
            <Input
              id="roleName"
              placeholder="Ej: Supervisor"
              value={form.name}
              onChange={e => updateField('name', e.target.value)}
              disabled={editingRole?.isSystem}
              required
            />
          </div>
          <div className={s.fieldGroup}>
            <Label htmlFor="roleDesc">Descripción</Label>
            <Input
              id="roleDesc"
              placeholder="Descripción breve del rol"
              value={form.description}
              onChange={e => updateField('description', e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Permisos</Label>
            {Object.entries(PERMISSION_GROUPS).map(([group, permissions]) => {
              const allSelected = permissions.every(p => form.permissions.includes(p));
              const someSelected = permissions.some(p => form.permissions.includes(p));
              return (
                <div key={group} className={s.permissionGroup}>
                  <div className={s.permissionItem}>
                    <Checkbox
                      checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                      onCheckedChange={() => toggleGroupPermissions(permissions)}
                    />
                    <span className={s.permissionGroupTitle}>{group}</span>
                  </div>
                  <div className="ml-6 space-y-1">
                    {permissions.map(perm => (
                      <div key={perm} className={s.permissionItem}>
                        <Checkbox
                          checked={form.permissions.includes(perm)}
                          onCheckedChange={() => togglePermission(perm)}
                        />
                        <span className={s.permissionLabel}>{PERMISSION_LABELS[perm]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className={s.dialogFooter}>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : editingRole ? 'Actualizar Rol' : 'Crear Rol'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
