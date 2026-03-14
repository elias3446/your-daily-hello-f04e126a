import React, { createContext, useContext, useState, useCallback } from 'react';
import { Role, Permission } from '@/lib/types';
import * as storage from '@/lib/storage';

interface RolesContextType {
  roles: Role[];
  selectedRole: Role | null;
  selectRole: (role: Role | null) => void;
  createRole: (data: { name: string; description: string; permissions: Permission[] }) => Role;
  updateRole: (id: string, data: { name?: string; description?: string; permissions?: Permission[] }) => void;
  deleteRole: (id: string) => void;
  refresh: () => void;
}

const RolesContext = createContext<RolesContextType | undefined>(undefined);

export function RolesProvider({ children }: { children: React.ReactNode }) {
  const [roles, setRoles] = useState<Role[]>(() => storage.getRoles());
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const refresh = useCallback(() => {
    setRoles(storage.getRoles());
  }, []);

  const selectRole = useCallback((role: Role | null) => {
    setSelectedRole(role);
  }, []);

  const createRoleFn = useCallback((data: { name: string; description: string; permissions: Permission[] }) => {
    const role = storage.createRole({
      name: data.name,
      description: data.description,
      permissions: data.permissions,
      isSystem: false,
    });
    const session = storage.getSession();
    if (session) {
      storage.addAuditLog({
        userId: session.userId,
        action: 'CREATE_ROLE',
        entity: 'role',
        entityId: role.id,
        details: `Rol creado: ${role.name}`,
      });
    }
    refresh();
    return role;
  }, [refresh]);

  const updateRole = useCallback((id: string, data: { name?: string; description?: string; permissions?: Permission[] }) => {
    const roles = storage.getRoles();
    const idx = roles.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Rol no encontrado');
    if (roles[idx].isSystem && data.name && data.name !== roles[idx].name) {
      throw new Error('No se puede renombrar un rol del sistema');
    }
    roles[idx] = {
      ...roles[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('hrnexus_roles', JSON.stringify(roles));
    const session = storage.getSession();
    if (session) {
      storage.addAuditLog({
        userId: session.userId,
        action: 'UPDATE_ROLE',
        entity: 'role',
        entityId: id,
        details: `Rol actualizado: ${roles[idx].name}`,
      });
    }
    refresh();
    setSelectedRole(roles[idx]);
  }, [refresh]);

  const deleteRole = useCallback((id: string) => {
    const roles = storage.getRoles();
    const role = roles.find(r => r.id === id);
    if (!role) throw new Error('Rol no encontrado');
    if (role.isSystem) throw new Error('No se puede eliminar un rol del sistema');
    // Check if any user uses this role
    const users = storage.getUsers();
    if (users.some(u => u.roleId === id)) {
      throw new Error('No se puede eliminar un rol asignado a usuarios');
    }
    const filtered = roles.filter(r => r.id !== id);
    localStorage.setItem('hrnexus_roles', JSON.stringify(filtered));
    const session = storage.getSession();
    if (session) {
      storage.addAuditLog({
        userId: session.userId,
        action: 'DELETE_ROLE',
        entity: 'role',
        entityId: id,
        details: `Rol eliminado: ${role.name}`,
      });
    }
    refresh();
    if (selectedRole?.id === id) setSelectedRole(null);
  }, [refresh, selectedRole]);

  return (
    <RolesContext.Provider value={{
      roles,
      selectedRole,
      selectRole,
      createRole: createRoleFn,
      updateRole,
      deleteRole,
      refresh,
    }}>
      {children}
    </RolesContext.Provider>
  );
}

export function useRoles() {
  const ctx = useContext(RolesContext);
  if (!ctx) throw new Error('useRoles must be used within RolesProvider');
  return ctx;
}
