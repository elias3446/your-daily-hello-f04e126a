import React, { createContext, useContext, useState, useCallback } from 'react';
import { Ticket, TicketPriority, TicketStatus, TicketComment } from '@/lib/types';
import * as storage from '@/lib/storage';

const TICKETS_KEY = 'hrnexus_tickets';

function getTickets(): Ticket[] {
  try {
    const data = localStorage.getItem(TICKETS_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function saveTickets(tickets: Ticket[]) {
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
}

function genId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
}

interface CreateTicketData {
  title: string;
  description: string;
  priority: TicketPriority;
  assignedTo?: string;
  categoryId?: string;
}

interface UpdateTicketData {
  title?: string;
  description?: string;
  priority?: TicketPriority;
  assignedTo?: string;
  categoryId?: string;
  status?: TicketStatus;
}

interface TicketsContextType {
  tickets: Ticket[];
  createTicket: (data: CreateTicketData) => Ticket;
  updateTicket: (id: string, data: UpdateTicketData) => void;
  assignTicket: (id: string, userId: string) => void;
  changeStatus: (id: string, status: TicketStatus) => void;
  closeTicket: (id: string) => void;
  addComment: (ticketId: string, text: string) => void;
  refresh: () => void;
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

export function TicketsProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(() => getTickets());

  const refresh = useCallback(() => setTickets(getTickets()), []);

  const persist = (updated: Ticket[]) => {
    saveTickets(updated);
    setTickets(updated);
  };

  const audit = (action: string, entityId: string, details: string) => {
    const session = storage.getSession();
    if (session) {
      storage.addAuditLog({ userId: session.userId, action, entity: 'ticket', entityId, details });
    }
  };

  const createTicket = useCallback((data: CreateTicketData): Ticket => {
    const session = storage.getSession();
    const all = getTickets();
    const ticket: Ticket = {
      id: genId(),
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: 'open',
      categoryId: data.categoryId || undefined,
      createdBy: session?.userId || '',
      assignedTo: data.assignedTo || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
    };
    all.unshift(ticket);
    persist(all);
    audit('CREATE_TICKET', ticket.id, `Ticket creado: ${ticket.title}`);
    return ticket;
  }, []);

  const updateTicket = useCallback((id: string, data: UpdateTicketData) => {
    const all = getTickets();
    const idx = all.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Ticket no encontrado');
    all[idx] = { ...all[idx], ...data, updatedAt: new Date().toISOString() };
    persist(all);
    audit('UPDATE_TICKET', id, `Ticket actualizado: ${all[idx].title}`);
  }, []);

  const assignTicket = useCallback((id: string, userId: string) => {
    const all = getTickets();
    const idx = all.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Ticket no encontrado');
    const user = storage.getUserById(userId);
    all[idx] = { ...all[idx], assignedTo: userId, updatedAt: new Date().toISOString() };
    persist(all);
    audit('ASSIGN_TICKET', id, `Ticket asignado a ${user?.fullName || userId}: ${all[idx].title}`);
  }, []);

  const changeStatus = useCallback((id: string, status: TicketStatus) => {
    const all = getTickets();
    const idx = all.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Ticket no encontrado');
    all[idx] = {
      ...all[idx],
      status,
      updatedAt: new Date().toISOString(),
      ...(status === 'closed' ? { closedAt: new Date().toISOString() } : {}),
    };
    persist(all);
    audit('CHANGE_STATUS_TICKET', id, `Ticket ${status}: ${all[idx].title}`);
  }, []);

  const closeTicket = useCallback((id: string) => {
    changeStatus(id, 'closed');
  }, [changeStatus]);

  const addComment = useCallback((ticketId: string, text: string) => {
    const session = storage.getSession();
    const all = getTickets();
    const idx = all.findIndex(t => t.id === ticketId);
    if (idx === -1) throw new Error('Ticket no encontrado');
    const comment: TicketComment = {
      id: genId(),
      userId: session?.userId || '',
      text,
      createdAt: new Date().toISOString(),
    };
    all[idx].comments.push(comment);
    all[idx].updatedAt = new Date().toISOString();
    persist(all);
    audit('COMMENT_TICKET', ticketId, `Comentario en ticket: ${all[idx].title}`);
  }, []);

  return (
    <TicketsContext.Provider value={{ tickets, createTicket, updateTicket, assignTicket, changeStatus, closeTicket, addComment, refresh }}>
      {children}
    </TicketsContext.Provider>
  );
}

export function useTickets() {
  const ctx = useContext(TicketsContext);
  if (!ctx) throw new Error('useTickets must be used within TicketsProvider');
  return ctx;
}
