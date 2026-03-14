import { useAuth } from '@/contexts/AuthContext';
import { getUsers, getRoles, getAuditLogs } from '@/lib/storage';
import { Users, Tag, ScrollText } from 'lucide-react';

export function useDashboard() {
  const { user, role } = useAuth();
  const users = getUsers();
  const roles = getRoles();
  const logs = getAuditLogs();

  const stats = [
    { label: 'Usuarios', value: users.length, icon: Users, color: 'text-accent' },
    { label: 'Roles', value: roles.length, icon: Tag, color: 'text-success' },
    { label: 'Eventos de Auditoría', value: logs.length, icon: ScrollText, color: 'text-muted-foreground' },
  ];

  const recentLogs = logs.slice(0, 5);

  return {
    user,
    role,
    stats,
    logs: recentLogs,
    hasLogs: logs.length > 0,
  };
}
