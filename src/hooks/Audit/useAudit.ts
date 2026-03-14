import { useState, useMemo } from 'react';
import { getAuditLogs, getUsers } from '@/lib/storage';
import { AuditLog } from '@/lib/types';

const ITEMS_PER_PAGE = 15;

export function useAudit() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const logs = getAuditLogs();
  const users = getUsers();

  const userMap = useMemo(() => {
    const map: Record<string, string> = {};
    users.forEach(u => { map[u.id] = u.fullName; });
    return map;
  }, [users]);

  const actions = useMemo(() => [...new Set(logs.map(l => l.action))], [logs]);
  const entities = useMemo(() => [...new Set(logs.map(l => l.entity))], [logs]);

  const filtered = useMemo(() => {
    return logs.filter(log => {
      const userName = userMap[log.userId] || '';
      const matchesSearch = !search ||
        userName.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.details.toLowerCase().includes(search.toLowerCase()) ||
        log.entity.toLowerCase().includes(search.toLowerCase());
      const matchesAction = actionFilter === 'all' || log.action === actionFilter;
      const matchesEntity = entityFilter === 'all' || log.entity === entityFilter;
      return matchesSearch && matchesAction && matchesEntity;
    });
  }, [logs, search, actionFilter, entityFilter, userMap]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const stats = useMemo(() => ({
    total: logs.length,
    today: logs.filter(l => l.timestamp.startsWith(new Date().toISOString().slice(0, 10))).length,
    uniqueUsers: new Set(logs.map(l => l.userId)).size,
    uniqueActions: actions.length,
  }), [logs, actions]);

  return {
    search, setSearch,
    actionFilter, setActionFilter,
    entityFilter, setEntityFilter,
    page: currentPage, setPage,
    totalPages,
    logs: paginated,
    allLogs: filtered,
    stats,
    actions,
    entities,
    userMap,
  };
}

export function useAuditExport() {
  function exportCSV(logs: AuditLog[], userMap: Record<string, string>) {
    const headers = ['Fecha', 'Usuario', 'Acción', 'Entidad', 'Detalles'];
    const rows = logs.map(l => [
      new Date(l.timestamp).toLocaleString('es-MX'),
      userMap[l.userId] || l.userId,
      l.action,
      l.entity,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return { exportCSV };
}
