import { useUsers } from '@/contexts/UsersContext';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/lib/types';
import { getRoles } from '@/lib/storage';

export function useUserActions() {
  const { users, toggleUserActive, softDeleteUser, restoreUser } = useUsers();
  const { toast } = useToast();

  const handleToggleActive = (user: User) => {
    try {
      toggleUserActive(user.id);
      toast({ title: user.isActive ? 'Usuario desactivado' : 'Usuario activado', description: user.fullName });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleSoftDelete = (user: User) => {
    try {
      softDeleteUser(user.id);
      toast({ title: 'Usuario eliminado', description: `${user.fullName} fue eliminado.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleRestore = (user: User) => {
    try {
      restoreUser(user.id);
      toast({ title: 'Usuario restaurado', description: `${user.fullName} fue restaurado.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const getRoleName = (roleId: string): string => {
    const role = getRoles().find(r => r.id === roleId);
    return role?.name ?? 'Sin rol';
  };

  return { users, handleToggleActive, handleSoftDelete, handleRestore, getRoleName };
}
