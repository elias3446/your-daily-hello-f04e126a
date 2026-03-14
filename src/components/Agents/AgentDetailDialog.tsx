import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Ticket, TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS } from '@/lib/types';
import { AgentMetrics } from '@/hooks/Agents/useAgents';
import { agentStyles as s } from '@/styles/Agents/agents.styles';
import { ticketStyles as ts } from '@/styles/Tickets/tickets.styles';
import { User, BarChart3, CheckCircle, XCircle, Clock, Inbox } from 'lucide-react';

interface AgentDetailDialogProps {
  open: boolean;
  onClose: () => void;
  agent: AgentMetrics | null;
  tickets: Ticket[];
}

export default function AgentDetailDialog({ open, onClose, agent, tickets }: AgentDetailDialogProps) {
  if (!agent) return null;

  const chartData = [
    { label: 'Creados', value: agent.created, color: 'bg-accent', icon: Inbox },
    { label: 'Asignados', value: agent.assigned, color: 'bg-warning', icon: Clock },
    { label: 'Resueltos', value: agent.resolved, color: 'bg-success', icon: CheckCircle },
    { label: 'Rechazados', value: agent.rejected, color: 'bg-destructive', icon: XCircle },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value), 1);

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className={s.dialogContent}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-accent/10">
              <User className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p>{agent.fullName}</p>
              <p className="text-sm font-normal text-muted-foreground">{agent.email} · {agent.roleName}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Performance Chart */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-accent" />
            Rendimiento
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {chartData.map(d => (
              <div key={d.label} className="rounded-lg border border-border p-3 text-center">
                <d.icon className={`h-5 w-5 mx-auto mb-1 ${d.color.replace('bg-', 'text-')}`} />
                <p className="text-2xl font-bold text-foreground">{d.value}</p>
                <p className="text-xs text-muted-foreground">{d.label}</p>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div className="space-y-2 pt-2">
            {chartData.map(d => (
              <div key={d.label} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-20 text-right">{d.label}</span>
                <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${d.color} rounded-full transition-all duration-500`}
                    style={{ width: `${(d.value / maxValue) * 100}%`, minWidth: d.value > 0 ? '8px' : '0' }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground w-8">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tickets list */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-semibold text-foreground">Historial de Tickets</h3>
          {tickets.length === 0 ? (
            <p className={s.emptyText}>No hay tickets relacionados con este agente.</p>
          ) : (
            <div className="max-h-[250px] overflow-y-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.slice(0, 50).map(ticket => (
                    <TableRow key={ticket.id}>
                      <TableCell className="text-sm font-medium text-foreground max-w-[200px] truncate">
                        {ticket.title}
                      </TableCell>
                      <TableCell>
                        <span className={ts.badgeStatus[ticket.status] || ''}>
                          {TICKET_STATUS_LABELS[ticket.status]}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={ts.badgePriority[ticket.priority] || ''}>
                          {TICKET_PRIORITY_LABELS[ticket.priority]}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(ticket.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
