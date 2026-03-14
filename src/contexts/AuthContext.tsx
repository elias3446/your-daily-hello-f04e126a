import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, Role, Permission } from '@/lib/types';
import * as storage from '@/lib/storage';

interface AuthContextType {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  isFirstUser: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  registerFirstUser: (data: { email: string; password: string; fullName: string }) => void;
  hasPermission: (permission: Permission) => boolean;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => storage.getCurrentUser());
  const [firstUser, setFirstUser] = useState<boolean>(() => storage.isFirstUser());
  const [role, setRole] = useState<Role | null>(() => {
    const u = storage.getCurrentUser();
    return u ? storage.getRoleById(u.roleId) ?? null : null;
  });

  const refresh = useCallback(() => {
    const u = storage.getCurrentUser();
    setUser(u);
    setRole(u ? storage.getRoleById(u.roleId) ?? null : null);
  }, []);

  useEffect(() => {
    // Sync on storage events (multi-tab)
    const handler = () => refresh();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [refresh]);

  const login = useCallback((email: string, password: string) => {
    const u = storage.login(email, password);
    setUser(u);
    setRole(storage.getRoleById(u.roleId) ?? null);
  }, []);

  const logout = useCallback(() => {
    storage.logout();
    setUser(null);
    setRole(null);
  }, []);

  const registerFirstUser = useCallback((data: { email: string; password: string; fullName: string }) => {
    storage.registerFirstUser(data);
    setFirstUser(false);
  }, []);

  const hasPermission = useCallback((permission: Permission) => {
    if (!user) return false;
    return storage.hasPermission(user.id, permission);
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      role,
      isAuthenticated: !!user,
      isFirstUser: firstUser,
      login,
      logout,
      registerFirstUser,
      hasPermission,
      refresh,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
