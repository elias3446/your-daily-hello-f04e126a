export const auditStyles = {
  page: 'space-y-6',
  header: 'flex items-center justify-between',
  heading: 'text-2xl font-bold text-foreground',
  subheading: 'text-muted-foreground mt-1',

  card: 'border shadow-sm',
  statsRow: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
  statValue: 'text-2xl font-bold text-foreground',
  statLabel: 'text-xs text-muted-foreground',

  filterRow: 'flex flex-wrap items-center gap-3',
  searchInput: 'max-w-sm',

  tableRow: 'hover:bg-muted/50 transition-snappy',
  tableCell: 'text-sm text-foreground',
  tableCellMuted: 'text-sm text-muted-foreground',

  badgeAction: {
    LOGIN: 'inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success',
    LOGOUT: 'inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground',
    CREATE: 'inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent',
    UPDATE: 'inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent',
    DELETE: 'inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive',
    REGISTER: 'inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success',
    DEFAULT: 'inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground',
  },

  emptyText: 'text-sm text-muted-foreground text-center py-8',
  paginationRow: 'flex items-center justify-between pt-4',
  paginationInfo: 'text-sm text-muted-foreground',
} as const;
