// ===== Core Types for HR Nexus =====

export type Permission =
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
  | 'roles.view'
  | 'roles.create'
  | 'roles.edit'
  | 'roles.delete'
  | 'categories.view'
  | 'categories.create'
  | 'categories.edit'
  | 'categories.delete'
  | 'tickets.view'
  | 'tickets.create'
  | 'tickets.assign'
  | 'tickets.edit'
  | 'tickets.close'
  | 'reports.view'
  | 'reports.export'
  | 'settings.view'
  | 'settings.edit'
  | 'audit.view';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  roleId: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  deletedAt?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
}

// ===== CATEGORIES =====
export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  parentId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'rejected' | 'closed';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  categoryId?: string;
  createdBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  comments: TicketComment[];
}

export interface TicketComment {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
}

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  critical: 'Crítica',
};

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Abierto',
  in_progress: 'En progreso',
  resolved: 'Resuelto',
  rejected: 'Rechazado',
  closed: 'Cerrado',
};

export const ALL_PERMISSIONS: Permission[] = [
  'users.view', 'users.create', 'users.edit', 'users.delete',
  'roles.view', 'roles.create', 'roles.edit', 'roles.delete',
  'categories.view', 'categories.create', 'categories.edit', 'categories.delete',
  'tickets.view', 'tickets.create', 'tickets.assign', 'tickets.edit', 'tickets.close',
  'reports.view', 'reports.export',
  'settings.view', 'settings.edit',
  'audit.view',
];

export const PERMISSION_LABELS: Record<Permission, string> = {
  'users.view': 'Ver usuarios',
  'users.create': 'Crear usuarios',
  'users.edit': 'Editar usuarios',
  'users.delete': 'Eliminar usuarios',
  'roles.view': 'Ver roles',
  'roles.create': 'Crear roles',
  'roles.edit': 'Editar roles',
  'roles.delete': 'Eliminar roles',
  'categories.view': 'Ver categorías',
  'categories.create': 'Crear categorías',
  'categories.edit': 'Editar categorías',
  'categories.delete': 'Eliminar categorías',
  'tickets.view': 'Ver tickets',
  'tickets.create': 'Crear tickets',
  'tickets.assign': 'Asignar tickets',
  'tickets.edit': 'Editar tickets',
  'tickets.close': 'Cerrar tickets',
  'reports.view': 'Ver reportes',
  'reports.export': 'Exportar reportes',
  'settings.view': 'Ver configuración',
  'settings.edit': 'Editar configuración',
  'audit.view': 'Ver auditoría',
};

export const PERMISSION_GROUPS: Record<string, Permission[]> = {
  'Usuarios': ['users.view', 'users.create', 'users.edit', 'users.delete'],
  'Roles': ['roles.view', 'roles.create', 'roles.edit', 'roles.delete'],
  'Categorías': ['categories.view', 'categories.create', 'categories.edit', 'categories.delete'],
  'Tickets': ['tickets.view', 'tickets.create', 'tickets.assign', 'tickets.edit', 'tickets.close'],
  'Reportes': ['reports.view', 'reports.export'],
  'Configuración': ['settings.view', 'settings.edit'],
  'Auditoría': ['audit.view'],
};
