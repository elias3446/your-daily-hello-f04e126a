import { User, Role, AuditLog, ALL_PERMISSIONS } from './types';

const KEYS = {
  USERS: 'hrnexus_users',
  ROLES: 'hrnexus_roles',
  AUDIT: 'hrnexus_audit',
  SESSION: 'hrnexus_session',
} as const;

// Simple hash function for passwords (not cryptographically secure, but sufficient for localStorage demo)
export function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36) + '_' + btoa(password).slice(0, 8);
}

function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function getItem<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ===== ROLES =====
export function getRoles(): Role[] {
  return getItem<Role[]>(KEYS.ROLES, []);
}

export function getRoleById(id: string): Role | undefined {
  return getRoles().find(r => r.id === id);
}

export function createRole(data: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Role {
  const roles = getRoles();
  const role: Role = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  roles.push(role);
  setItem(KEYS.ROLES, roles);
  return role;
}

function initSuperadminRole(): Role {
  const existing = getRoles().find(r => r.name === 'Superadministrador');
  if (existing) return existing;
  return createRole({
    name: 'Superadministrador',
    description: 'Control total del sistema',
    permissions: [...ALL_PERMISSIONS],
    isSystem: true,
  });
}

// ===== USERS =====
export function getUsers(): User[] {
  return getItem<User[]>(KEYS.USERS, []);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(u => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function isFirstUser(): boolean {
  return getUsers().length === 0;
}

export function registerFirstUser(data: { email: string; password: string; fullName: string }): User {
  if (!isFirstUser()) throw new Error('El primer usuario ya fue registrado');
  
  const role = initSuperadminRole();
  const users = getUsers();
  const user: User = {
    id: generateId(),
    email: data.email,
    password: hashPassword(data.password),
    fullName: data.fullName,
    roleId: role.id,
    isActive: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users.push(user);
  setItem(KEYS.USERS, users);
  
  addAuditLog({
    userId: user.id,
    action: 'REGISTER',
    entity: 'user',
    entityId: user.id,
    details: `Primer usuario registrado como Superadministrador: ${user.fullName}`,
  });
  
  return user;
}

// ===== AUTH =====
export function login(email: string, password: string): User {
  const user = getUserByEmail(email);
  if (!user) throw new Error('Credenciales inválidas');
  if (!user.isActive) throw new Error('Usuario desactivado');
  if (user.password !== hashPassword(password)) throw new Error('Credenciales inválidas');
  
  // Update last login
  const users = getUsers();
  const idx = users.findIndex(u => u.id === user.id);
  users[idx] = { ...users[idx], lastLoginAt: new Date().toISOString() };
  setItem(KEYS.USERS, users);
  
  // Set session
  setItem(KEYS.SESSION, { userId: user.id, loginAt: new Date().toISOString() });
  
  addAuditLog({
    userId: user.id,
    action: 'LOGIN',
    entity: 'session',
    entityId: user.id,
    details: `Inicio de sesión: ${user.fullName}`,
  });
  
  return users[idx];
}

export function logout(): void {
  const session = getSession();
  if (session) {
    addAuditLog({
      userId: session.userId,
      action: 'LOGOUT',
      entity: 'session',
      entityId: session.userId,
      details: 'Cierre de sesión',
    });
  }
  localStorage.removeItem(KEYS.SESSION);
}

export function getSession(): { userId: string; loginAt: string } | null {
  return getItem(KEYS.SESSION, null);
}

export function getCurrentUser(): User | null {
  const session = getSession();
  if (!session) return null;
  return getUserById(session.userId) || null;
}

// ===== AUDIT =====
export function getAuditLogs(): AuditLog[] {
  return getItem<AuditLog[]>(KEYS.AUDIT, []);
}

export function addAuditLog(data: Omit<AuditLog, 'id' | 'timestamp'>): void {
  const logs = getAuditLogs();
  logs.unshift({
    ...data,
    id: generateId(),
    timestamp: new Date().toISOString(),
  });
  // Keep last 500 entries
  if (logs.length > 500) logs.length = 500;
  setItem(KEYS.AUDIT, logs);
}

// ===== RBAC =====
export function getUserPermissions(userId: string): string[] {
  const user = getUserById(userId);
  if (!user) return [];
  const role = getRoleById(user.roleId);
  if (!role) return [];
  return role.permissions;
}

export function hasPermission(userId: string, permission: string): boolean {
  return getUserPermissions(userId).includes(permission);
}
