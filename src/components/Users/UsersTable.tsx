import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Power, RotateCcw } from 'lucide-react';
import { User } from '@/lib/types';
import { useUserActions } from '@/hooks/Users/useUserActions';
import { useAuth } from '@/contexts/AuthContext';
import { usersStyles as s } from '@/styles/Users/users.styles';

interface Props {
  filter: 'active' | 'inactive' | 'deleted';
  search: string;
  onEdit: (user: User) => void;
}

export default function UsersTable({ filter, search, onEdit }: Props) {
  const { users, handleToggleActive, handleSoftDelete, handleRestore, getRoleName } = useUserActions();
  const { user: currentUser, hasPermission } = useAuth();

  const filtered = users.filter(u => {
    if (filter === 'active') return u.isActive && !u.isDeleted;
    if (filter === 'inactive') return !u.isActive && !u.isDeleted;
    if (filter === 'deleted') return u.isDeleted;
    return true;
  }).filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const getInitials = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const isSelf = (u: User) => currentUser?.id === u.id;

  if (!filtered.length) {
    return <p className={s.emptyText}>No se encontraron usuarios.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuario</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Creado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filtered.map(u => (
          <TableRow key={u.id} className={s.tableRow}>
            <TableCell>
              <div className={s.userInfo}>
                <div className={s.userAvatar}>{getInitials(u.fullName)}</div>
                <div>
                  <p className={s.userName}>{u.fullName}</p>
                  <p className={s.userEmail}>{u.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className={s.badgeRole}>{getRoleName(u.roleId)}</span>
            </TableCell>
            <TableCell>
              {u.isDeleted ? (
                <span className={s.badgeDeleted}>Eliminado</span>
              ) : u.isActive ? (
                <span className={s.badgeActive}>Activo</span>
              ) : (
                <span className={s.badgeInactive}>Inactivo</span>
              )}
            </TableCell>
            <TableCell className={s.tableCellMuted}>
              {new Date(u.createdAt).toLocaleDateString('es-ES')}
            </TableCell>
            <TableCell>
              <div className={`${s.actionsRow} justify-end`}>
                {u.isDeleted ? (
                  hasPermission('users.edit') && (
                    <Button size="icon" variant="ghost" title="Restaurar" onClick={() => handleRestore(u)}>
                      <RotateCcw className="h-4 w-4 text-success" />
                    </Button>
                  )
                ) : (
                  <>
                    {hasPermission('users.edit') && (
                      <>
                        <Button size="icon" variant="ghost" title="Editar" onClick={() => onEdit(u)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {!isSelf(u) && (
                          <Button size="icon" variant="ghost" title={u.isActive ? 'Desactivar' : 'Activar'} onClick={() => handleToggleActive(u)}>
                            <Power className={`h-4 w-4 ${u.isActive ? 'text-destructive' : 'text-success'}`} />
                          </Button>
                        )}
                      </>
                    )}
                    {hasPermission('users.delete') && !isSelf(u) && (
                      <Button size="icon" variant="ghost" title="Eliminar" onClick={() => handleSoftDelete(u)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
