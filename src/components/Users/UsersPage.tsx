import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useUsers } from '@/contexts/UsersContext';
import UsersTable from './UsersTable';
import UserFormDialog from './UserFormDialog';
import { usersStyles as s } from '@/styles/Users/users.styles';
import { User } from '@/lib/types';

export default function UsersPage() {
  const { hasPermission } = useAuth();
  const { users } = useUsers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [filter, setFilter] = useState<'active' | 'inactive' | 'deleted'>('active');
  const [search, setSearch] = useState('');

  const activeCount = users.filter(u => u.isActive && !u.isDeleted).length;
  const inactiveCount = users.filter(u => !u.isActive && !u.isDeleted).length;
  const deletedCount = users.filter(u => u.isDeleted).length;

  const handleEdit = (user: User) => {
    setEditUser(user);
    setDialogOpen(true);
  };

  const handleOpenCreate = () => {
    setEditUser(null);
    setDialogOpen(true);
  };

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div>
          <h1 className={s.heading}>Gestión de Usuarios</h1>
          <p className={s.subheading}>Administra los usuarios del sistema</p>
        </div>
        {hasPermission('users.create') && (
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo usuario
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className={s.statsRow}>
        <Card className={s.card}>
          <CardContent className="pt-4 pb-4">
            <p className={s.statValue}>{users.length}</p>
            <p className={s.statLabel}>Total</p>
          </CardContent>
        </Card>
        <Card className={s.card}>
          <CardContent className="pt-4 pb-4">
            <p className={s.statValue}>{activeCount}</p>
            <p className={s.statLabel}>Activos</p>
          </CardContent>
        </Card>
        <Card className={s.card}>
          <CardContent className="pt-4 pb-4">
            <p className={s.statValue}>{inactiveCount}</p>
            <p className={s.statLabel}>Inactivos</p>
          </CardContent>
        </Card>
        <Card className={s.card}>
          <CardContent className="pt-4 pb-4">
            <p className={s.statValue}>{deletedCount}</p>
            <p className={s.statLabel}>Eliminados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className={s.filterRow}>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar por nombre o correo..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Tabs value={filter} onValueChange={v => setFilter(v as any)}>
          <TabsList className={s.tabsList}>
            <TabsTrigger value="active">Activos ({activeCount})</TabsTrigger>
            <TabsTrigger value="inactive">Inactivos ({inactiveCount})</TabsTrigger>
            <TabsTrigger value="deleted">Eliminados ({deletedCount})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Table */}
      <Card className={s.card}>
        <CardContent className="p-0">
          <UsersTable filter={filter} search={search} onEdit={handleEdit} />
        </CardContent>
      </Card>

      {/* Dialog */}
      <UserFormDialog open={dialogOpen} onOpenChange={setDialogOpen} editUser={editUser} />
    </div>
  );
}
