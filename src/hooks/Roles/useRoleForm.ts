import { useState } from 'react';
import { Permission, Role } from '@/lib/types';
import { useRoles } from '@/contexts/RolesContext';
import { useToast } from '@/hooks/use-toast';

interface RoleFormData {
  name: string;
  description: string;
  permissions: Permission[];
}

export function useRoleForm(onSuccess?: () => void) {
  const { createRole, updateRole } = useRoles();
  const { toast } = useToast();
  const [form, setForm] = useState<RoleFormData>({ name: '', description: '', permissions: [] });
  const [loading, setLoading] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const updateField = (field: 'name' | 'description', value: string) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const togglePermission = (permission: Permission) => {
    setForm(f => ({
      ...f,
      permissions: f.permissions.includes(permission)
        ? f.permissions.filter(p => p !== permission)
        : [...f.permissions, permission],
    }));
  };

  const toggleGroupPermissions = (permissions: Permission[]) => {
    const allSelected = permissions.every(p => form.permissions.includes(p));
    setForm(f => ({
      ...f,
      permissions: allSelected
        ? f.permissions.filter(p => !permissions.includes(p))
        : [...new Set([...f.permissions, ...permissions])],
    }));
  };

  const resetForm = () => {
    setForm({ name: '', description: '', permissions: [] });
    setEditingRole(null);
  };

  const loadRole = (role: Role) => {
    setEditingRole(role);
    setForm({ name: role.name, description: role.description, permissions: [...role.permissions] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({ title: 'Error', description: 'El nombre del rol es requerido', variant: 'destructive' });
      return;
    }
    if (form.permissions.length === 0) {
      toast({ title: 'Error', description: 'Selecciona al menos un permiso', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      if (editingRole) {
        updateRole(editingRole.id, { name: form.name, description: form.description, permissions: form.permissions });
        toast({ title: 'Rol actualizado', description: `${form.name} se actualizó correctamente.` });
      } else {
        createRole({ name: form.name, description: form.description, permissions: form.permissions });
        toast({ title: 'Rol creado', description: `${form.name} se creó correctamente.` });
      }
      resetForm();
      onSuccess?.();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    editingRole,
    updateField,
    togglePermission,
    toggleGroupPermissions,
    resetForm,
    loadRole,
    handleSubmit,
  };
}
