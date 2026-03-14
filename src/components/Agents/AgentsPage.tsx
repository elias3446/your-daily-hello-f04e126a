import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Users, Inbox, CheckCircle, XCircle, ClipboardList,
  Filter, CalendarIcon, User,
} from 'lucide-react';
import { useAgents, AgentMetrics } from '@/hooks/Agents/useAgents';
import AgentDetailDialog from './AgentDetailDialog';
import { agentStyles as s } from '@/styles/Agents/agents.styles';

export default function AgentsPage() {
  const {
    search, setSearch,
    statusFilter, setStatusFilter,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    page, setPage, totalPages,
    agents, globalStats,
    getAgentTickets,
  } = useAgents();

  const [selectedAgent, setSelectedAgent] = useState<AgentMetrics | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const openDetail = (agent: AgentMetrics) => {
    setSelectedAgent(agent);
    setDetailOpen(true);
  };

  const statCards = [
    { label: 'Total Agentes', value: globalStats.totalAgents, icon: Users, color: 'text-accent' },
    { label: 'Creados', value: globalStats.totalCreated, icon: Inbox, color: 'text-accent' },
    { label: 'Asignados', value: globalStats.totalAssigned, icon: ClipboardList, color: 'text-warning' },
    { label: 'Resueltos', value: globalStats.totalResolved, icon: CheckCircle, color: 'text-success' },
    { label: 'Rechazados', value: globalStats.totalRejected, icon: XCircle, color: 'text-destructive' },
  ];

  return (
    <div className={s.page}>
      {/* Header */}
      <div className={s.header}>
        <div>
          <h1 className={s.heading}>Gestión de Agentes</h1>
          <p className={s.subheading}>Métricas de desempeño y carga de trabajo de agentes.</p>
        </div>
      </div>

      {/* Stats */}
      <div className={s.statsRow}>
        {statCards.map(st => (
          <Card key={st.label} className={s.card}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`rounded-lg bg-muted p-2.5 ${st.color}`}>
                <st.icon className="h-5 w-5" />
              </div>
              <div>
                <p className={s.statValue}>{st.value}</p>
                <p className={s.statLabel}>{st.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className={s.card}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={s.filterRow}>
            <Input
              placeholder="Buscar agente..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className={s.searchInput}
            />
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>

            {/* Date from */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-[150px] justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, 'dd MMM yyyy', { locale: es }) : 'Desde'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>

            {/* Date to */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-[150px] justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, 'dd MMM yyyy', { locale: es }) : 'Hasta'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>

            {(dateFrom || dateTo) && (
              <Button variant="ghost" size="sm" onClick={() => { setDateFrom(undefined); setDateTo(undefined); }}>
                Limpiar fechas
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className={s.card}>
        <CardContent className="p-0">
          {agents.length === 0 ? (
            <p className={s.emptyText}>No se encontraron agentes.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agente</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="text-center">Creados</TableHead>
                  <TableHead className="text-center">Asignados</TableHead>
                  <TableHead className="text-center">En Progreso</TableHead>
                  <TableHead className="text-center">Resueltos</TableHead>
                  <TableHead className="text-center">Rechazados</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map(agent => (
                  <TableRow key={agent.userId} className={s.tableRow} onClick={() => openDetail(agent)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent/10">
                          <User className="h-4 w-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{agent.fullName}</p>
                          <p className="text-xs text-muted-foreground">{agent.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className={s.tableCellMuted}>{agent.roleName}</TableCell>
                    <TableCell className="text-center">
                      <span className={`${s.metricBadge} bg-accent/10 text-accent`}>{agent.created}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`${s.metricBadge} bg-warning/10 text-warning`}>{agent.assigned}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`${s.metricBadge} bg-accent/10 text-accent`}>{agent.inProgress}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`${s.metricBadge} bg-success/10 text-success`}>{agent.resolved}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`${s.metricBadge} bg-destructive/10 text-destructive`}>{agent.rejected}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {totalPages > 1 && (
          <div className={s.paginationRow + ' px-6 pb-4'}>
            <p className={s.paginationInfo}>Página {page} de {totalPages}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Siguiente</Button>
            </div>
          </div>
        )}
      </Card>

      {/* Detail Dialog */}
      <AgentDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        agent={selectedAgent}
        tickets={selectedAgent ? getAgentTickets(selectedAgent.userId) : []}
      />
    </div>
  );
}
