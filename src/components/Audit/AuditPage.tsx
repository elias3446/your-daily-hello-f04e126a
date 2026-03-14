import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollText, Download, Calendar, Users, Zap, Filter } from 'lucide-react';
import { useAudit, useAuditExport } from '@/hooks/Audit/useAudit';
import AuditTable from '@/components/Audit/AuditTable';
import { auditStyles } from '@/styles/Audit/audit.styles';

export default function AuditPage() {
  const {
    search, setSearch,
    actionFilter, setActionFilter,
    entityFilter, setEntityFilter,
    page, setPage, totalPages,
    logs, allLogs, stats,
    actions, entities, userMap,
  } = useAudit();

  const { exportCSV } = useAuditExport();

  return (
    <div className={auditStyles.page}>
      {/* Header */}
      <div className={auditStyles.header}>
        <div>
          <h1 className={auditStyles.heading}>Auditoría del Sistema</h1>
          <p className={auditStyles.subheading}>Registro de todas las acciones realizadas en el sistema.</p>
        </div>
        <Button onClick={() => exportCSV(allLogs, userMap)} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Stats */}
      <div className={auditStyles.statsRow}>
        {[
          { label: 'Total eventos', value: stats.total, icon: ScrollText, color: 'text-accent' },
          { label: 'Hoy', value: stats.today, icon: Calendar, color: 'text-success' },
          { label: 'Usuarios únicos', value: stats.uniqueUsers, icon: Users, color: 'text-accent' },
          { label: 'Tipos de acción', value: stats.uniqueActions, icon: Zap, color: 'text-muted-foreground' },
        ].map(s => (
          <Card key={s.label} className={auditStyles.card}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`rounded-lg bg-muted p-2.5 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className={auditStyles.statValue}>{s.value}</p>
                <p className={auditStyles.statLabel}>{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className={auditStyles.card}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={auditStyles.filterRow}>
            <Input
              placeholder="Buscar por usuario, acción o detalles..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className={auditStyles.searchInput}
            />
            <Select value={actionFilter} onValueChange={v => { setActionFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Acción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las acciones</SelectItem>
                {actions.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={entityFilter} onValueChange={v => { setEntityFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Entidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las entidades</SelectItem>
                {entities.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className={auditStyles.card}>
        <CardContent className="p-0">
          <AuditTable logs={logs} userMap={userMap} />
        </CardContent>
        {totalPages > 1 && (
          <div className={auditStyles.paginationRow + ' px-6 pb-4'}>
            <p className={auditStyles.paginationInfo}>
              Página {page} de {totalPages} ({allLogs.length} registros)
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Anterior
              </Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
