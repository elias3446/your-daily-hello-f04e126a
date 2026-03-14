import { useState, useMemo } from 'react';
import { getUsers, getRoleById, getUserPermissions } from '@/lib/storage';
import { Ticket } from '@/lib/types';

const TICKETS_KEY = 'hrnexus_tickets';
const ITEMS_PER_PAGE = 10;

function getTickets(): Ticket[] {
  try {
    const data = localStorage.getItem(TICKETS_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export interface AgentMetrics {
  userId: string;
  fullName: string;
  email: string;
  roleName: string;
  isActive: boolean;
  created: number;
  assigned: number;
  resolved: number;
  rejected: number;
  closed: number;
  open: number;
  inProgress: number;
}

export function useAgents() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const allTickets = useMemo(() => getTickets(), []);

  // Agents = active users with ticket permissions
  const agents = useMemo(() => {
    const users = getUsers().filter(u => !u.isDeleted && u.isActive);
    return users.filter(u => {
      const perms = getUserPermissions(u.id);
      return perms.some(p => p.startsWith('tickets.'));
    });
  }, []);

  const agentMetrics: AgentMetrics[] = useMemo(() => {
    return agents.map(agent => {
      const role = getRoleById(agent.roleId);

      // Filter tickets by date range
      const tickets = allTickets.filter(t => {
        if (dateFrom && new Date(t.createdAt) < dateFrom) return false;
        if (dateTo) {
          const end = new Date(dateTo);
          end.setHours(23, 59, 59, 999);
          if (new Date(t.createdAt) > end) return false;
        }
        return true;
      });

      const created = tickets.filter(t => t.createdBy === agent.id).length;
      const assigned = tickets.filter(t => t.assignedTo === agent.id).length;
      const resolved = tickets.filter(t => t.assignedTo === agent.id && t.status === 'resolved').length;
      const rejected = tickets.filter(t => t.assignedTo === agent.id && t.status === 'rejected').length;
      const closed = tickets.filter(t => t.assignedTo === agent.id && t.status === 'closed').length;
      const open = tickets.filter(t => t.assignedTo === agent.id && t.status === 'open').length;
      const inProgress = tickets.filter(t => t.assignedTo === agent.id && t.status === 'in_progress').length;

      return {
        userId: agent.id,
        fullName: agent.fullName,
        email: agent.email,
        roleName: role?.name || 'Sin rol',
        isActive: agent.isActive,
        created,
        assigned,
        resolved,
        rejected,
        closed,
        open,
        inProgress,
      };
    });
  }, [agents, allTickets, dateFrom, dateTo]);

  const filtered = useMemo(() => {
    return agentMetrics.filter(a => {
      const matchesSearch = !search ||
        a.fullName.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && a.isActive) ||
        (statusFilter === 'inactive' && !a.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [agentMetrics, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const globalStats = useMemo(() => ({
    totalAgents: agents.length,
    totalCreated: agentMetrics.reduce((s, a) => s + a.created, 0),
    totalAssigned: agentMetrics.reduce((s, a) => s + a.assigned, 0),
    totalResolved: agentMetrics.reduce((s, a) => s + a.resolved, 0),
    totalRejected: agentMetrics.reduce((s, a) => s + a.rejected, 0),
  }), [agentMetrics, agents]);

  // Get tickets for a specific agent (for detail view)
  const getAgentTickets = (agentId: string) => {
    return allTickets.filter(t => {
      const isRelated = t.assignedTo === agentId || t.createdBy === agentId;
      if (!isRelated) return false;
      if (dateFrom && new Date(t.createdAt) < dateFrom) return false;
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        if (new Date(t.createdAt) > end) return false;
      }
      return true;
    });
  };

  return {
    search, setSearch,
    statusFilter, setStatusFilter,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    page: currentPage, setPage, totalPages,
    agents: paginated,
    allFiltered: filtered,
    globalStats,
    getAgentTickets,
  };
}
