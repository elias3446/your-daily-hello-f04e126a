// Estilos reutilizables para el módulo de Roles y Permisos

export const rolesStyles = {
  /** Contenedor principal */
  page: 'space-y-6',

  /** Encabezado con título y botón */
  header: 'flex items-center justify-between',
  heading: 'text-2xl font-bold text-foreground',
  subheading: 'text-muted-foreground mt-1',

  /** Tarjeta genérica */
  card: 'border shadow-sm',

  /** Grid de roles */
  rolesGrid: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',

  /** Card de rol individual */
  roleCard: 'border shadow-sm hover:shadow-md transition-snappy cursor-pointer',
  roleCardActive: 'border-accent shadow-md ring-1 ring-accent',
  roleCardHeader: 'flex items-center justify-between pb-2',
  roleName: 'text-base font-semibold text-foreground',
  roleDescription: 'text-sm text-muted-foreground mb-3',
  roleMeta: 'text-xs text-muted-foreground',
  roleSystemBadge: 'inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent',

  /** Contador de permisos */
  permissionCount: 'text-xs font-medium text-muted-foreground',

  /** Contenedor de badges de permisos */
  badgeContainer: 'flex flex-wrap gap-1.5 mt-2',
  badge: 'rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground',
  badgeActive: 'rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent',

  /** Grupo de permisos */
  permissionGroup: 'space-y-3',
  permissionGroupTitle: 'text-sm font-semibold text-foreground',
  permissionItem: 'flex items-center gap-3 py-1',
  permissionLabel: 'text-sm text-foreground',

  /** Formulario de rol */
  form: 'space-y-4',
  fieldGroup: 'space-y-2',

  /** Diálogo */
  dialogContent: 'sm:max-w-lg max-h-[85vh] overflow-y-auto',
  dialogFooter: 'flex justify-end gap-2 pt-4',

  /** Acciones de rol */
  actionsRow: 'flex items-center gap-2',

  /** Texto vacío */
  emptyText: 'text-sm text-muted-foreground text-center py-8',

  /** Tabla */
  tableRow: 'hover:bg-muted/50 transition-snappy',
} as const;
