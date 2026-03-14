import { AuditLog } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { auditStyles } from '@/styles/Audit/audit.styles';

interface AuditTableProps {
  logs: AuditLog[];
  userMap: Record<string, string>;
}

function getActionBadgeClass(action: string) {
  const map = auditStyles.badgeAction as Record<string, string>;
  return map[action] || map.DEFAULT;
}

export default function AuditTable({ logs, userMap }: AuditTableProps) {
  if (logs.length === 0) {
    return <p className={auditStyles.emptyText}>No se encontraron registros de auditoría.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Usuario</TableHead>
          <TableHead>Acción</TableHead>
          <TableHead>Entidad</TableHead>
          <TableHead>Detalles</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map(log => (
          <TableRow key={log.id} className={auditStyles.tableRow}>
            <TableCell className={auditStyles.tableCellMuted}>
              {new Date(log.timestamp).toLocaleString('es-MX', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </TableCell>
            <TableCell className={auditStyles.tableCell}>
              {userMap[log.userId] || 'Sistema'}
            </TableCell>
            <TableCell>
              <span className={getActionBadgeClass(log.action)}>{log.action}</span>
            </TableCell>
            <TableCell className={auditStyles.tableCellMuted}>{log.entity}</TableCell>
            <TableCell className={auditStyles.tableCellMuted + ' max-w-xs truncate'}>{log.details}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
