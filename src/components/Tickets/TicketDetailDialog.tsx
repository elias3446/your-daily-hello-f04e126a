import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Ticket, TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS, TicketStatus } from '@/lib/types';
import { ticketStyles as s } from '@/styles/Tickets/tickets.styles';
import { Send, UserPlus } from 'lucide-react';
import { useCategories } from '@/contexts/CategoriesContext';
import { getIconByName } from '@/components/Categories/categoryIcons';

interface TicketDetailDialogProps {
  open: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  userMap: Record<string, string>;
  users: { id: string; fullName: string }[];
  onChangeStatus: (id: string, status: TicketStatus) => void;
  onAssign: (id: string, userId: string) => void;
  onAddComment: (ticketId: string, text: string) => void;
  canEdit: boolean;
  canAssign: boolean;
  canClose: boolean;
}

export default function TicketDetailDialog({
  open, onClose, ticket, userMap, users,
  onChangeStatus, onAssign, onAddComment,
  canEdit, canAssign, canClose,
}: TicketDetailDialogProps) {
  const [comment, setComment] = useState('');
  const { getCategoryById } = useCategories();

  if (!ticket) return null;

  const handleComment = () => {
    if (!comment.trim()) return;
    onAddComment(ticket.id, comment.trim());
    setComment('');
  };

  const isClosed = ticket.status === 'closed';

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className={s.detailContent}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="truncate">{ticket.title}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Estado:</span>{' '}
            <span className={s.badgeStatus[ticket.status]}>{TICKET_STATUS_LABELS[ticket.status]}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Prioridad:</span>{' '}
            <span className={s.badgePriority[ticket.priority]}>{TICKET_PRIORITY_LABELS[ticket.priority]}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Creado por:</span>{' '}
            <span className="text-foreground font-medium">{userMap[ticket.createdBy] || 'Sistema'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Asignado a:</span>{' '}
            <span className="text-foreground font-medium">{ticket.assignedTo ? userMap[ticket.assignedTo] || 'N/A' : 'Sin asignar'}</span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground">Categoría:</span>{' '}
            {ticket.categoryId ? (() => {
              const cat = getCategoryById(ticket.categoryId);
              if (!cat) return <span className="text-foreground">—</span>;
              const Icon = getIconByName(cat.icon);
              return (
                <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold" style={{ backgroundColor: cat.color + '15', color: cat.color }}>
                  <Icon className="h-3 w-3" />
                  {cat.name}
                </span>
              );
            })() : <span className="text-foreground">Sin categoría</span>}
          </div>
          <div>
            <span className="text-muted-foreground">Creado:</span>{' '}
            <span>{new Date(ticket.createdAt).toLocaleString('es-MX')}</span>
          </div>
          {ticket.closedAt && (
            <div>
              <span className="text-muted-foreground">Cerrado:</span>{' '}
              <span>{new Date(ticket.closedAt).toLocaleString('es-MX')}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mt-2">
          <h4 className="text-sm font-medium text-muted-foreground mb-1">Descripción</h4>
          <p className="text-sm text-foreground whitespace-pre-wrap">{ticket.description}</p>
        </div>

        {/* Actions */}
        {!isClosed && (
          <div className="flex flex-wrap gap-2 mt-4 border-t pt-4">
            {canEdit && (
              <Select value={ticket.status} onValueChange={v => onChangeStatus(ticket.id, v as TicketStatus)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Cambiar estado" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(TICKET_STATUS_LABELS) as TicketStatus[]).map(st => (
                    <SelectItem key={st} value={st}>{TICKET_STATUS_LABELS[st]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {canAssign && (
              <Select value={ticket.assignedTo || 'unassigned'} onValueChange={v => v !== 'unassigned' && onAssign(ticket.id, v)}>
                <SelectTrigger className="w-[180px]">
                  <UserPlus className="h-4 w-4 mr-1" />
                  <SelectValue placeholder="Asignar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Sin asignar</SelectItem>
                  {users.map(u => <SelectItem key={u.id} value={u.id}>{u.fullName}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
            {canClose && (
              <Button variant="destructive" size="sm" onClick={() => onChangeStatus(ticket.id, 'closed')}>
                Cerrar ticket
              </Button>
            )}
          </div>
        )}

        {/* Comments */}
        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-medium text-foreground">Comentarios ({ticket.comments.length})</h4>
          {ticket.comments.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">Sin comentarios aún.</p>
          )}
          <div className={s.commentsList}>
            {ticket.comments.map(c => (
              <div key={c.id} className={s.commentItem}>
                <div className="flex items-center justify-between">
                  <span className={s.commentAuthor}>{userMap[c.userId] || 'Sistema'}</span>
                  <span className={s.commentDate}>{new Date(c.createdAt).toLocaleString('es-MX')}</span>
                </div>
                <p className={s.commentText}>{c.text}</p>
              </div>
            ))}
          </div>
          {!isClosed && (
            <div className={s.commentInput}>
              <Input
                placeholder="Escribe un comentario..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                maxLength={500}
                onKeyDown={e => e.key === 'Enter' && handleComment()}
              />
              <Button size="icon" onClick={handleComment} disabled={!comment.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
