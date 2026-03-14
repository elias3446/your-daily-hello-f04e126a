export const categoryStyles = {
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

  dialogContent: 'sm:max-w-lg',
  dialogFooter: 'flex justify-end gap-2 pt-4',
  form: 'space-y-4',
  fieldGroup: 'space-y-2',

  colorSwatch: 'h-6 w-6 rounded-full border border-border inline-block',
  iconPreview: 'flex items-center justify-center h-10 w-10 rounded-lg border border-border',
  categoryBadge: 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
  subBadge: 'inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground',

  emptyText: 'text-sm text-muted-foreground text-center py-8',
  paginationRow: 'flex items-center justify-between pt-4',
  paginationInfo: 'text-sm text-muted-foreground',
} as const;
