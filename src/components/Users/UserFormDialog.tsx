import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserForm } from '@/hooks/Users/useUserForm';
import { usersStyles as s } from '@/styles/Users/users.styles';
import { User } from '@/lib/types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editUser?: User | null;
}

export default function UserFormDialog({ open, onOpenChange, editUser }: Props) {
  const { form, setField, handleSubmit, resetForm, loadUser, isEditing, roles } = useUserForm(() => onOpenChange(false));

  useEffect(() => {
    if (open && editUser) loadUser(editUser);
    if (!open) resetForm();
  }, [open, editUser]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={s.dialogContent}>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar usuario' : 'Crear usuario'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className={s.form}>
          <div className={s.fieldGroup}>
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input id="fullName" value={form.fullName} onChange={e => setField('fullName', e.target.value)} placeholder="Juan Pérez" />
          </div>
          <div className={s.fieldGroup}>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" value={form.email} onChange={e => setField('email', e.target.value)} placeholder="usuario@empresa.com" />
          </div>
          <div className={s.fieldGroup}>
            <Label htmlFor="password">{isEditing ? 'Nueva contraseña (dejar vacío para mantener)' : 'Contraseña'}</Label>
            <Input id="password" type="password" value={form.password} onChange={e => setField('password', e.target.value)} placeholder={isEditing ? '••••••' : 'Mínimo 6 caracteres'} />
          </div>
          <div className={s.fieldGroup}>
            <Label>Rol</Label>
            <Select value={form.roleId} onValueChange={v => setField('roleId', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                {roles.map(r => (
                  <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className={s.dialogFooter}>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">{isEditing ? 'Guardar cambios' : 'Crear usuario'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
