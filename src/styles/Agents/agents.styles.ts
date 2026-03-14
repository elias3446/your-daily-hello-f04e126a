export const agentStyles = {
  page: 'space-y-6',
  header: 'flex items-center justify-between',
  heading: 'text-2xl font-bold text-foreground',
  subheading: 'text-muted-foreground mt-1',

  card: 'border shadow-sm',
  statsRow: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-5',
  statValue: 'text-2xl font-bold text-foreground',
  statLabel: 'text-xs text-muted-foreground',

  filterRow: 'flex flex-wrap items-center gap-3',
  searchInput: 'max-w-sm',

  tableRow: 'hover:bg-muted/50 transition-snappy cursor-pointer',
  tableCell: 'text-sm text-foreground',
  tableCellMuted: 'text-sm text-muted-foreground',

  metricBadge: 'inline-flex items-center justify-center min-w-[28px] rounded-full px-2 py-0.5 text-xs font-semibold',

  dialogContent: 'sm:max-w-3xl max-h-[85vh] overflow-y-auto',
  chartContainer: 'h-[200px] w-full',

  emptyText: 'text-sm text-muted-foreground text-center py-8',
  paginationRow: 'flex items-center justify-between pt-4',
  paginationInfo: 'text-sm text-muted-foreground',
} as const;
