import { useState } from 'react';
import { TicketPriority } from '@/lib/types';
import { useTickets } from '@/contexts/TicketsContext';
import { toast } from 'sonner';

interface TicketFormData {
  title: string;
  description: string;
  priority: TicketPriority;
  assignedTo: string;
  categoryId: string;
  subcategoryId: string;
}

export function useTicketForm(onSuccess?: () => void) {
  const { createTicket, updateTicket } = useTickets();
  const [form, setForm] = useState<TicketFormData>({
    title: '', description: '', priority: 'medium', assignedTo: '', categoryId: '', subcategoryId: '',
  });

  const setField = <K extends keyof TicketFormData>(key: K, value: TicketFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const reset = () => setForm({ title: '', description: '', priority: 'medium', assignedTo: '', categoryId: '', subcategoryId: '' });

  const loadTicket = (ticket: { title: string; description: string; priority: TicketPriority; assignedTo?: string; categoryId?: string; subcategoryId?: string }) => {
    setForm({
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      assignedTo: ticket.assignedTo || '',
      categoryId: ticket.categoryId || '',
      subcategoryId: ticket.subcategoryId || '',
    });
  };

  const validate = (): string | null => {
    if (!form.title.trim()) return 'El título es obligatorio';
    if (form.title.trim().length < 3) return 'El título debe tener al menos 3 caracteres';
    if (!form.description.trim()) return 'La descripción es obligatoria';
    return null;
  };

  const handleCreate = () => {
    const error = validate();
    if (error) { toast.error(error); return false; }
    try {
      createTicket({
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        assignedTo: form.assignedTo || undefined,
        categoryId: form.subcategoryId || form.categoryId || undefined,
      });
      toast.success('Ticket creado exitosamente');
      reset();
      onSuccess?.();
      return true;
    } catch (e: any) {
      toast.error(e.message);
      return false;
    }
  };

  const handleUpdate = (id: string) => {
    const error = validate();
    if (error) { toast.error(error); return false; }
    try {
      updateTicket(id, {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        assignedTo: form.assignedTo || undefined,
        categoryId: form.subcategoryId || form.categoryId || undefined,
      });
      toast.success('Ticket actualizado');
      onSuccess?.();
      return true;
    } catch (e: any) {
      toast.error(e.message);
      return false;
    }
  };

  return { form, setField, reset, loadTicket, handleCreate, handleUpdate };
}
