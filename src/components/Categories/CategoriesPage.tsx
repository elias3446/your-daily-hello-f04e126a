import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Layers, FolderTree, ToggleLeft, Filter, Pencil, Trash2, Power, ChevronDown, ChevronRight } from 'lucide-react';
import { Category } from '@/lib/types';
import { useCategoryActions } from '@/hooks/Categories/useCategoryActions';
import { useCategories } from '@/contexts/CategoriesContext';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/lib/storage';
import CategoryFormDialog from '@/components/Categories/CategoryFormDialog';
import { categoryStyles as s } from '@/styles/Categories/categories.styles';
import { getIconByName } from './categoryIcons';

export default function CategoriesPage() {
  const { user } = useAuth();
  const { getSubcategories } = useCategories();
  const {
    search, setSearch,
    statusFilter, setStatusFilter,
    page, setPage, totalPages,
    categories, stats,
    deleteCategory, toggleActive,
  } = useCategoryActions();

  const [formOpen, setFormOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const canCreate = user ? hasPermission(user.id, 'categories.create') : false;
  const canEdit = user ? hasPermission(user.id, 'categories.edit') : false;
  const canDelete = user ? hasPermission(user.id, 'categories.delete') : false;

  const handleEdit = (cat: Category) => {
    setEditCategory(cat);
    setFormOpen(true);
  };

  return (
    <div className={s.page}>
      {/* Header */}
      <div className={s.header}>
        <div>
          <h1 className={s.heading}>Categorías</h1>
          <p className={s.subheading}>Gestión de categorías y subcategorías para tickets.</p>
        </div>
        {canCreate && (
          <Button onClick={() => { setEditCategory(null); setFormOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva categoría
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className={s.statsRow}>
        {[
          { label: 'Total', value: stats.total, icon: Layers, color: 'text-accent' },
          { label: 'Principales', value: stats.parents, icon: FolderTree, color: 'text-accent' },
          { label: 'Subcategorías', value: stats.subs, icon: FolderTree, color: 'text-muted-foreground' },
          { label: 'Activas', value: stats.active, icon: ToggleLeft, color: 'text-success' },
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
              placeholder="Buscar por nombre o descripción..."
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
                <SelectItem value="active">Activas</SelectItem>
                <SelectItem value="inactive">Inactivas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className={s.card}>
        <CardContent className="p-0">
          {categories.length === 0 ? (
            <p className={s.emptyText}>No se encontraron categorías.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Subcategorías</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map(cat => {
                  const IconComp = getIconByName(cat.icon);
                  const subs = getSubcategories(cat.id);
                  const isExpanded = expandedIds.has(cat.id);
                  return (
                    <>
                      <TableRow key={cat.id} className={s.tableRow}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {subs.length > 0 ? (
                              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => toggleExpand(cat.id)}>
                                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              </Button>
                            ) : (
                              <div className="h-6 w-6 shrink-0" />
                            )}
                            <div
                              className="flex items-center justify-center h-8 w-8 rounded-lg shrink-0"
                              style={{ backgroundColor: cat.color + '20', color: cat.color }}
                            >
                              <IconComp className="h-4 w-4" />
                            </div>
                            <div>
                              <p className={s.tableCell + ' font-medium'}>{cat.name}</p>
                              {cat.description && (
                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">{cat.description}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className={s.tableCellMuted}>
                          {subs.length || '—'}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${cat.isActive ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                            {cat.isActive ? 'Activa' : 'Inactiva'}
                          </span>
                        </TableCell>
                        <TableCell className={s.tableCellMuted}>
                          {new Date(cat.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            {canEdit && (
                              <>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleActive(cat.id)} title={cat.isActive ? 'Desactivar' : 'Activar'}>
                                  <Power className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(cat)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {canDelete && (
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteCategory(cat.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                      {isExpanded && subs.map(sub => {
                        const SubIcon = getIconByName(sub.icon);
                        return (
                          <TableRow key={sub.id} className="bg-muted/30">
                            <TableCell>
                              <div className="flex items-center gap-3 pl-12">
                                <div
                                  className="flex items-center justify-center h-6 w-6 rounded-md shrink-0"
                                  style={{ backgroundColor: sub.color + '20', color: sub.color }}
                                >
                                  <SubIcon className="h-3 w-3" />
                                </div>
                                <div>
                                  <p className="text-sm text-foreground">{sub.name}</p>
                                  {sub.description && (
                                    <p className="text-xs text-muted-foreground truncate max-w-[180px]">{sub.description}</p>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell />
                            <TableCell>
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${sub.isActive ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                                {sub.isActive ? 'Activa' : 'Inactiva'}
                              </span>
                            </TableCell>
                            <TableCell className={s.tableCellMuted}>
                              {new Date(sub.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                {canEdit && (
                                  <>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleActive(sub.id)} title={sub.isActive ? 'Desactivar' : 'Activar'}>
                                      <Power className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(sub)}>
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                {canDelete && (
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteCategory(sub.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </>
                  );
                })}
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

      {/* Dialog */}
      <CategoryFormDialog open={formOpen} onClose={() => setFormOpen(false)} editCategory={editCategory} />
    </div>
  );
}
