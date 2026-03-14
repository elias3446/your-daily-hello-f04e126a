import { useState, useCallback } from 'react';
import { useUsers } from '@/contexts/UsersContext';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/lib/types';
import { getRoles } from '@/lib/storage';

interface UserFormState {
  fullName: string;
  email: string;
  password: string;
  roleId: string;
}

const emptyForm: UserFormState = { fullName: '', email: '', password: '', roleId: '' };

export function useUserForm(onSuccess?: () => void) {
  const { createUser, updateUser } = useUsers();
  const { toast } = useToast();
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const roles = getRoles();

  const resetForm = useCallback(() => {
    setForm(emptyForm);
    setEditingUser(null);
  }, []);

  const loadUser = useCallback((user: User) => {
    setEditingUser(user);
    setForm({ fullName: user.fullName, email: user.email, password: '', roleId: user.roleId });
  }, []);

  const setField = useCallback((field: keyof UserFormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const validate = (): string | null => {
    if (!form.fullName.trim()) return 'El nombre es requerido';
    if (!form.email.trim()) return 'El correo es requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Correo inválido';
    if (!editingUser && !form.password) return 'La contraseña es requerida';
    if (form.password && form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    if (!form.roleId) return 'Debe asignar un rol';
    return null;
  };

  const handleSubmit = useCallback(() => {
    const error = validate();
    if (error) {
      toast({ title: 'Error de validación', description: error, variant: 'destructive' });
      return false;
    }

    try {
      if (editingUser) {
        const data: any = { fullName: form.fullName, email: form.email, roleId: form.roleId };
        if (form.password) data.password = form.password;
        updateUser(editingUser.id, data);
        toast({ title: 'Usuario actualizado', description: form.fullName });
      } else {
        createUser({ fullName: form.fullName, email: form.email, password: form.password, roleId: form.roleId });
        toast({ title: 'Usuario creado', description: form.fullName });
      }
      resetForm();
      onSuccess?.();
      return true;
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      return false;
    }
  }, [form, editingUser, createUser, updateUser, toast, resetForm, onSuccess]);

  return { form, setField, handleSubmit, resetForm, loadUser, editingUser, roles, isEditing: !!editingUser };
}
