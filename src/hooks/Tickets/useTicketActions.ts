import { useState, useMemo } from 'react';
import { useTickets } from '@/contexts/TicketsContext';
import { TicketStatus } from '@/lib/types';
import { getUsers } from '@/lib/storage';

const ITEMS_PER_PAGE = 10;

export function useTicketActions() {
  const { tickets, changeStatus, closeTicket, assignTicket, addComment } = useTickets();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const users = getUsers().filter(u => !u.isDeleted && u.isActive);
  const userMap = useMemo(() => {
    const map: Record<string, string> = {};
    users.forEach(u => { map[u.id] = u.fullName; });
    return map;
  }, [users]);

  const filtered = useMemo(() => {
    return tickets.filter(t => {
      const matchesSearch = !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        (userMap[t.createdBy] || '').toLowerCase().includes(search.toLowerCase()) ||
        (t.assignedTo && (userMap[t.assignedTo] || '').toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, search, statusFilter, priorityFilter, userMap]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    closed: tickets.filter(t => t.status === 'closed').length,
  }), [tickets]);

  return {
    search, setSearch,
    statusFilter, setStatusFilter,
    priorityFilter, setPriorityFilter,
    page: currentPage, setPage, totalPages,
    tickets: paginated,
    allFiltered: filtered,
    stats,
    users,
    userMap,
    changeStatus,
    closeTicket,
    assignTicket,
    addComment,
  };
}
