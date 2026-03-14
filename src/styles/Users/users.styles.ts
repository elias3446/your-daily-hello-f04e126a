export const usersStyles = {
  page: 'space-y-6',
  header: 'flex items-center justify-between',
  heading: 'text-2xl font-bold text-foreground',
  subheading: 'text-muted-foreground mt-1',

  card: 'border shadow-sm',
  statsRow: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
  statValue: 'text-2xl font-bold text-foreground',
  statLabel: 'text-xs text-muted-foreground',

  tableRow: 'hover:bg-muted/50 transition-snappy',
  tableCell: 'text-sm text-foreground',
  tableCellMuted: 'text-sm text-muted-foreground',

  userAvatar: 'flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent',
  userInfo: 'flex items-center gap-3',
  userName: 'text-sm font-medium text-foreground',
  userEmail: 'text-xs text-muted-foreground',

  badgeActive: 'inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success',
  badgeInactive: 'inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive',
  badgeDeleted: 'inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground line-through',
  badgeRole: 'inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent',

  dialogContent: 'sm:max-w-lg',
  dialogFooter: 'flex justify-end gap-2 pt-4',
  form: 'space-y-4',
  fieldGroup: 'space-y-2',

  actionsRow: 'flex items-center gap-1',
  emptyText: 'text-sm text-muted-foreground text-center py-8',

  filterRow: 'flex items-center gap-3',
  searchInput: 'max-w-sm',
  tabsList: 'grid w-full grid-cols-3',
} as const;
