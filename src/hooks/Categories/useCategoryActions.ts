import { useState, useMemo } from 'react';
import { useCategories } from '@/contexts/CategoriesContext';

const ITEMS_PER_PAGE = 10;

export function useCategoryActions() {
  const { categories, deleteCategory, toggleActive } = useCategories();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all'); // 'all' | 'parent' | 'sub'
  const [statusFilter, setStatusFilter] = useState<string>('all'); // 'all' | 'active' | 'inactive'
  const [page, setPage] = useState(1);

  const parentMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach(c => { if (!c.parentId) map[c.id] = c.name; });
    return map;
  }, [categories]);

  // Only show parent categories in the main list (subcategories are managed within the parent modal)
  const parentCategories = useMemo(() => categories.filter(c => !c.parentId), [categories]);

  const filtered = useMemo(() => {
    return parentCategories.filter(c => {
      const matchesSearch = !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'active' && c.isActive) ||
        (statusFilter === 'inactive' && !c.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [parentCategories, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const stats = useMemo(() => ({
    total: categories.length,
    parents: categories.filter(c => !c.parentId).length,
    subs: categories.filter(c => !!c.parentId).length,
    active: categories.filter(c => c.isActive).length,
    inactive: categories.filter(c => !c.isActive).length,
  }), [categories]);

  return {
    search, setSearch,
    typeFilter, setTypeFilter,
    statusFilter, setStatusFilter,
    page: currentPage, setPage, totalPages,
    categories: paginated,
    allFiltered: filtered,
    stats,
    parentMap,
    deleteCategory,
    toggleActive,
  };
}
