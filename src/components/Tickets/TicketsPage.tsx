import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Ticket as TicketIcon, AlertCircle, Clock, CheckCircle2, Filter } from 'lucide-react';
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS, Ticket } from '@/lib/types';
import { useTicketActions } from '@/hooks/Tickets/useTicketActions';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/lib/storage';
import { useCategories } from '@/contexts/CategoriesContext';
import { getIconByName } from '@/components/Categories/categoryIcons';
import TicketFormDialog from '@/components/Tickets/TicketFormDialog';
import TicketDetailDialog from '@/components/Tickets/TicketDetailDialog';
import { ticketStyles as s } from '@/styles/Tickets/tickets.styles';

export default function TicketsPage() {
  const { user } = useAuth();
  const { getCategoryById } = useCategories();
  const {
    search, setSearch,
    statusFilter, setStatusFilter,
    priorityFilter, setPriorityFilter,
    page, setPage, totalPages,
    tickets, stats, users, userMap,
    changeStatus, closeTicket, assignTicket, addComment,
  } = useTicketActions();

  const [formOpen, setFormOpen] = useState(false);
  const [editTicket, setEditTicket] = useState<Ticket | null>(null);
  const [detailTicket, setDetailTicket] = useState<Ticket | null>(null);

  const canCreate = user ? hasPermission(user.id, 'tickets.create') : false;
  const canEdit = user ? hasPermission(user.id, 'tickets.edit') : false;
  const canAssign = user ? hasPermission(user.id, 'tickets.assign') : false;
  const canClose = user ? hasPermission(user.id, 'tickets.close') : false;

  const handleEdit = (ticket: Ticket) => {
    setEditTicket(ticket);
    setFormOpen(true);
  };

  return (
    <div className={s.page}>
      {/* Header */}
      <div className={s.header}>
        <div>
          <h1 className={s.heading}>Tickets</h1>
          <p className={s.subheading}>Gestión de tickets de soporte y solicitudes.</p>
        </div>
        {canCreate && (
          <Button onClick={() => { setEditTicket(null); setFormOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo ticket
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className={s.statsRow}>
        {[
          { label: 'Total', value: stats.total, icon: TicketIcon, color: 'text-accent' },
          { label: 'Abiertos', value: stats.open, icon: AlertCircle, color: 'text-accent' },
          { label: 'En progreso', value: stats.inProgress, icon: Clock, color: 'text-muted-foreground' },
          { label: 'Resueltos', value: stats.resolved, icon: CheckCircle2, color: 'text-success' },
        ].map(st => (
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
              placeholder="Buscar por título, descripción o usuario..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className={s.searchInput}
            />
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {Object.entries(TICKET_STATUS_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={v => { setPriorityFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las prioridades</SelectItem>
                {Object.entries(TICKET_PRIORITY_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className={s.card}>
        <CardContent className="p-0">
          {tickets.length === 0 ? (
            <p className={s.emptyText}>No se encontraron tickets.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Creado por</TableHead>
                  <TableHead>Asignado a</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map(ticket => (
                  <TableRow key={ticket.id} className={s.tableRow} onClick={() => setDetailTicket(ticket)}>
                    <TableCell className={s.tableCell + ' font-medium max-w-[200px] truncate'}>{ticket.title}</TableCell>
                    <TableCell>
                      {ticket.categoryId ? (() => {
                        const cat = getCategoryById(ticket.categoryId);
                        if (!cat) return <span className={s.tableCellMuted}>—</span>;
                        const Icon = getIconByName(cat.icon);
                        return (
                          <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold" style={{ backgroundColor: cat.color + '15', color: cat.color }}>
                            <Icon className="h-3 w-3" />
                            {cat.name}
                          </span>
                        );
                      })() : <span className={s.tableCellMuted}>—</span>}
                    </TableCell>
                    <TableCell><span className={s.badgeStatus[ticket.status]}>{TICKET_STATUS_LABELS[ticket.status]}</span></TableCell>
                    <TableCell><span className={s.badgePriority[ticket.priority]}>{TICKET_PRIORITY_LABELS[ticket.priority]}</span></TableCell>
                    <TableCell className={s.tableCellMuted}>{userMap[ticket.createdBy] || 'Sistema'}</TableCell>
                    <TableCell className={s.tableCellMuted}>{ticket.assignedTo ? userMap[ticket.assignedTo] || 'N/A' : '—'}</TableCell>
                    <TableCell className={s.tableCellMuted}>
                      {new Date(ticket.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1" onClick={e => e.stopPropagation()}>
                        {canEdit && ticket.status !== 'closed' && (
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(ticket)}>Editar</Button>
                        )}
                        {canClose && ticket.status !== 'closed' && (
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => closeTicket(ticket.id)}>Cerrar</Button>
                        )}
                      </div>
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

      {/* Dialogs */}
      <TicketFormDialog open={formOpen} onClose={() => setFormOpen(false)} editTicket={editTicket} />
      <TicketDetailDialog
        open={!!detailTicket}
        onClose={() => setDetailTicket(null)}
        ticket={detailTicket}
        userMap={userMap}
        users={users}
        onChangeStatus={changeStatus}
        onAssign={assignTicket}
        onAddComment={addComment}
        canEdit={canEdit}
        canAssign={canAssign}
        canClose={canClose}
      />
    </div>
  );
}
