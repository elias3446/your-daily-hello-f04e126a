// Estilos reutilizables para el Dashboard

export const dashboardStyles = {
  /** Contenedor principal con espaciado */
  page: 'space-y-8',

  /** Título de bienvenida */
  heading: 'text-2xl font-bold text-foreground',

  /** Subtítulo / descripción */
  subheading: 'text-muted-foreground mt-1',

  /** Grid de tarjetas de estadísticas */
  statsGrid: 'grid gap-4 sm:grid-cols-3',

  /** Tarjeta genérica */
  card: 'border shadow-sm',

  /** Header de tarjeta con contenido en fila */
  cardHeaderRow: 'flex flex-row items-center justify-between pb-2',

  /** Label de estadística */
  statLabel: 'text-sm font-medium text-muted-foreground',

  /** Valor numérico grande */
  statValue: 'text-3xl font-bold text-foreground',

  /** Título de sección con ícono */
  sectionTitle: 'text-base font-semibold flex items-center gap-2',
  sectionIcon: 'h-4 w-4 text-success',

  /** Descripción dentro de una card */
  cardDescription: 'text-sm text-muted-foreground mb-3',

  /** Contenedor de badges/tags */
  badgeContainer: 'flex flex-wrap gap-1.5',

  /** Badge de permiso */
  badge: 'rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground',

  /** Elemento de actividad reciente */
  activityItem: 'flex items-start gap-3 text-sm',
  activityDot: 'mt-0.5 h-2 w-2 rounded-full bg-accent shrink-0',
  activityText: 'text-foreground',
  activityTime: 'text-xs text-muted-foreground',

  /** Texto vacío */
  emptyText: 'text-sm text-muted-foreground',
} as const;
