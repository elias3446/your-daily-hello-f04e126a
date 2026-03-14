import { useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ticket, TICKET_PRIORITY_LABELS, TicketPriority } from '@/lib/types';
import { useTicketForm } from '@/hooks/Tickets/useTicketForm';
import { getUsers } from '@/lib/storage';
import { useCategories } from '@/contexts/CategoriesContext';
import { ticketStyles as s } from '@/styles/Tickets/tickets.styles';
import { getIconByName } from '@/components/Categories/categoryIcons';

interface TicketFormDialogProps {
  open: boolean;
  onClose: () => void;
  editTicket?: Ticket | null;
}

export default function TicketFormDialog({ open, onClose, editTicket }: TicketFormDialogProps) {
  const { form, setField, reset, loadTicket, handleCreate, handleUpdate } = useTicketForm(onClose);
  const users = getUsers().filter(u => !u.isDeleted && u.isActive);
  const { categories, getSubcategories } = useCategories();
  const parentCategories = categories.filter(c => c.isActive && !c.parentId);
  const isEdit = !!editTicket;

  const subcategories = useMemo(() => {
    if (!form.categoryId) return [];
    return getSubcategories(form.categoryId).filter(c => c.isActive);
  }, [form.categoryId, getSubcategories]);

  useEffect(() => {
    if (open && editTicket) {
      loadTicket(editTicket);
    } else if (open) {
      reset();
    }
  }, [open, editTicket]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) handleUpdate(editTicket!.id);
    else handleCreate();
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className={s.dialogContent}>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Ticket' : 'Nuevo Ticket'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className={s.form}>
          <div className={s.fieldGroup}>
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={form.title} onChange={e => setField('title', e.target.value)} maxLength={200} />
          </div>
          <div className={s.fieldGroup}>
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" value={form.description} onChange={e => setField('description', e.target.value)} rows={4} maxLength={2000} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className={s.fieldGroup}>
              <Label>Prioridad</Label>
              <Select value={form.priority} onValueChange={v => setField('priority', v as TicketPriority)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(TICKET_PRIORITY_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className={s.fieldGroup}>
              <Label>Categoría</Label>
              <Select value={form.categoryId || 'none'} onValueChange={v => {
                setField('categoryId', v === 'none' ? '' : v);
                setField('subcategoryId', '');
              }}>
                <SelectTrigger><SelectValue placeholder="Sin categoría" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin categoría</SelectItem>
                  {parentCategories.map(cat => {
                    const Icon = getIconByName(cat.icon);
                    return (
                      <SelectItem key={cat.id} value={cat.id}>
                        <span className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5" style={{ color: cat.color }} />
                          {cat.name}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          {subcategories.length > 0 && (
            <div className={s.fieldGroup}>
              <Label>Subcategoría</Label>
              <Select value={form.subcategoryId || 'none'} onValueChange={v => setField('subcategoryId', v === 'none' ? '' : v)}>
                <SelectTrigger><SelectValue placeholder="Sin subcategoría" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin subcategoría</SelectItem>
                  {subcategories.map(sub => {
                    const Icon = getIconByName(sub.icon);
                    return (
                      <SelectItem key={sub.id} value={sub.id}>
                        <span className="flex items-center gap-2">
                          <Icon className="h-3.5 w-3.5" style={{ color: sub.color }} />
                          {sub.name}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className={s.fieldGroup}>
            <Label>Asignar a</Label>
            <Select value={form.assignedTo || 'unassigned'} onValueChange={v => setField('assignedTo', v === 'unassigned' ? '' : v)}>
              <SelectTrigger><SelectValue placeholder="Sin asignar" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Sin asignar</SelectItem>
                {users.map(u => <SelectItem key={u.id} value={u.id}>{u.fullName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className={s.dialogFooter}>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">{isEdit ? 'Guardar cambios' : 'Crear ticket'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
