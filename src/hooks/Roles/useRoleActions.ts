import { useRoles } from '@/contexts/RolesContext';
import { useToast } from '@/hooks/use-toast';
import { Role } from '@/lib/types';

export function useRoleActions() {
  const { deleteRole, roles } = useRoles();
  const { toast } = useToast();

  const handleDelete = (role: Role) => {
    try {
      deleteRole(role.id);
      toast({ title: 'Rol eliminado', description: `${role.name} fue eliminado.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const getUserCountForRole = (roleId: string): number => {
    try {
      const users = JSON.parse(localStorage.getItem('hrnexus_users') || '[]');
      return users.filter((u: any) => u.roleId === roleId).length;
    } catch {
      return 0;
    }
  };

  return {
    roles,
    handleDelete,
    getUserCountForRole,
  };
}
