export const ticketStyles = {
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

  tableRow: 'hover:bg-muted/50 transition-snappy cursor-pointer',
  tableCell: 'text-sm text-foreground',
  tableCellMuted: 'text-sm text-muted-foreground',

  badgeStatus: {
    open: 'inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent',
    in_progress: 'inline-flex items-center rounded-full bg-warning/10 px-2 py-0.5 text-xs font-semibold text-warning',
    resolved: 'inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success',
    rejected: 'inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive',
    closed: 'inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground',
  } as Record<string, string>,

  badgePriority: {
    low: 'inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground',
    medium: 'inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent',
    high: 'inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive',
    critical: 'inline-flex items-center rounded-full bg-destructive px-2 py-0.5 text-xs font-semibold text-destructive-foreground',
  } as Record<string, string>,

  dialogContent: 'sm:max-w-lg',
  dialogFooter: 'flex justify-end gap-2 pt-4',
  form: 'space-y-4',
  fieldGroup: 'space-y-2',

  detailContent: 'sm:max-w-2xl max-h-[80vh] overflow-y-auto',
  commentsList: 'space-y-3 mt-4',
  commentItem: 'rounded-lg bg-muted/50 p-3',
  commentAuthor: 'text-sm font-medium text-foreground',
  commentDate: 'text-xs text-muted-foreground',
  commentText: 'text-sm text-foreground mt-1',
  commentInput: 'flex gap-2 mt-4',

  emptyText: 'text-sm text-muted-foreground text-center py-8',
  paginationRow: 'flex items-center justify-between pt-4',
  paginationInfo: 'text-sm text-muted-foreground',
} as const;
