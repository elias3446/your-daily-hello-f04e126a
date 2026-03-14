import React, { createContext, useContext, useState, useCallback } from 'react';
import { User } from '@/lib/types';
import * as storage from '@/lib/storage';

interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  roleId: string;
}

interface UpdateUserData {
  email?: string;
  fullName?: string;
  roleId?: string;
  password?: string;
}

interface UsersContextType {
  users: User[];
  createUser: (data: CreateUserData) => User;
  updateUser: (id: string, data: UpdateUserData) => void;
  toggleUserActive: (id: string) => void;
  softDeleteUser: (id: string) => void;
  restoreUser: (id: string) => void;
  refresh: () => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => storage.getUsers());

  const refresh = useCallback(() => {
    setUsers(storage.getUsers());
  }, []);

  const audit = (action: string, entityId: string, details: string) => {
    const session = storage.getSession();
    if (session) {
      storage.addAuditLog({ userId: session.userId, action, entity: 'user', entityId, details });
    }
  };

  const saveUsers = (updated: User[]) => {
    localStorage.setItem('hrnexus_users', JSON.stringify(updated));
    setUsers(updated);
  };

  const createUser = useCallback((data: CreateUserData): User => {
    const existing = storage.getUserByEmail(data.email);
    if (existing) throw new Error('Ya existe un usuario con ese correo');

    const all = storage.getUsers();
    const user: User = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2),
      email: data.email,
      password: storage.hashPassword(data.password),
      fullName: data.fullName,
      roleId: data.roleId,
      isActive: true,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    all.push(user);
    saveUsers(all);
    audit('CREATE_USER', user.id, `Usuario creado: ${user.fullName}`);
    return user;
  }, []);

  const updateUser = useCallback((id: string, data: UpdateUserData) => {
    const all = storage.getUsers();
    const idx = all.findIndex(u => u.id === id);
    if (idx === -1) throw new Error('Usuario no encontrado');

    if (data.email && data.email !== all[idx].email) {
      const dup = all.find(u => u.email.toLowerCase() === data.email!.toLowerCase() && u.id !== id);
      if (dup) throw new Error('Ya existe un usuario con ese correo');
    }

    all[idx] = {
      ...all[idx],
      ...data,
      ...(data.password ? { password: storage.hashPassword(data.password) } : {}),
      updatedAt: new Date().toISOString(),
    };
    // Remove raw password if accidentally spread
    delete (all[idx] as any).password_raw;
    saveUsers(all);
    audit('UPDATE_USER', id, `Usuario actualizado: ${all[idx].fullName}`);
  }, []);

  const toggleUserActive = useCallback((id: string) => {
    const all = storage.getUsers();
    const idx = all.findIndex(u => u.id === id);
    if (idx === -1) throw new Error('Usuario no encontrado');
    const session = storage.getSession();
    if (session?.userId === id) throw new Error('No puedes desactivarte a ti mismo');

    all[idx] = { ...all[idx], isActive: !all[idx].isActive, updatedAt: new Date().toISOString() };
    saveUsers(all);
    audit(all[idx].isActive ? 'ACTIVATE_USER' : 'DEACTIVATE_USER', id, `Usuario ${all[idx].isActive ? 'activado' : 'desactivado'}: ${all[idx].fullName}`);
  }, []);

  const softDeleteUser = useCallback((id: string) => {
    const all = storage.getUsers();
    const idx = all.findIndex(u => u.id === id);
    if (idx === -1) throw new Error('Usuario no encontrado');
    const session = storage.getSession();
    if (session?.userId === id) throw new Error('No puedes eliminarte a ti mismo');

    all[idx] = { ...all[idx], isDeleted: true, isActive: false, deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    saveUsers(all);
    audit('DELETE_USER', id, `Usuario eliminado (soft): ${all[idx].fullName}`);
  }, []);

  const restoreUser = useCallback((id: string) => {
    const all = storage.getUsers();
    const idx = all.findIndex(u => u.id === id);
    if (idx === -1) throw new Error('Usuario no encontrado');

    all[idx] = { ...all[idx], isDeleted: false, isActive: true, deletedAt: undefined, updatedAt: new Date().toISOString() };
    saveUsers(all);
    audit('RESTORE_USER', id, `Usuario restaurado: ${all[idx].fullName}`);
  }, []);

  return (
    <UsersContext.Provider value={{ users, createUser, updateUser, toggleUserActive, softDeleteUser, restoreUser, refresh }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error('useUsers must be used within UsersProvider');
  return ctx;
}
