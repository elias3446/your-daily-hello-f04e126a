import React, { createContext, useContext, useState, useCallback } from 'react';
import { Category } from '@/lib/types';
import * as storage from '@/lib/storage';

const CATEGORIES_KEY = 'hrnexus_categories';

function getCategories(): Category[] {
  try {
    const data = localStorage.getItem(CATEGORIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function saveCategories(categories: Category[]) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

function genId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
}

interface CreateCategoryData {
  name: string;
  description: string;
  color: string;
  icon: string;
  parentId?: string;
}

interface UpdateCategoryData {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
  isActive?: boolean;
}

interface CategoriesContextType {
  categories: Category[];
  createCategory: (data: CreateCategoryData) => Category;
  updateCategory: (id: string, data: UpdateCategoryData) => void;
  deleteCategory: (id: string) => void;
  toggleActive: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;
  getParentCategories: () => Category[];
  getSubcategories: (parentId: string) => Category[];
  refresh: () => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(() => getCategories());

  const refresh = useCallback(() => setCategories(getCategories()), []);

  const persist = (updated: Category[]) => {
    saveCategories(updated);
    setCategories(updated);
  };

  const audit = (action: string, entityId: string, details: string) => {
    const session = storage.getSession();
    if (session) {
      storage.addAuditLog({ userId: session.userId, action, entity: 'category', entityId, details });
    }
  };

  const createCategory = useCallback((data: CreateCategoryData): Category => {
    const all = getCategories();
    const category: Category = {
      id: genId(),
      name: data.name,
      description: data.description,
      color: data.color,
      icon: data.icon,
      parentId: data.parentId || undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    all.unshift(category);
    persist(all);
    audit('CREATE_CATEGORY', category.id, `Categoría creada: ${category.name}`);
    return category;
  }, []);

  const updateCategory = useCallback((id: string, data: UpdateCategoryData) => {
    const all = getCategories();
    const idx = all.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Categoría no encontrada');
    all[idx] = { ...all[idx], ...data, updatedAt: new Date().toISOString() };
    persist(all);
    audit('UPDATE_CATEGORY', id, `Categoría actualizada: ${all[idx].name}`);
  }, []);

  const deleteCategory = useCallback((id: string) => {
    const all = getCategories();
    const cat = all.find(c => c.id === id);
    if (!cat) throw new Error('Categoría no encontrada');
    // Also remove subcategories
    const filtered = all.filter(c => c.id !== id && c.parentId !== id);
    persist(filtered);
    audit('DELETE_CATEGORY', id, `Categoría eliminada: ${cat.name}`);
  }, []);

  const toggleActive = useCallback((id: string) => {
    const all = getCategories();
    const idx = all.findIndex(c => c.id === id);
    if (idx === -1) return;
    const newActive = !all[idx].isActive;
    const now = new Date().toISOString();
    all[idx] = { ...all[idx], isActive: newActive, updatedAt: now };

    // If toggling a parent category, propagate to all subcategories
    if (!all[idx].parentId) {
      all.forEach((c, i) => {
        if (c.parentId === id) {
          all[i] = { ...all[i], isActive: newActive, updatedAt: now };
        }
      });
    }

    persist(all);
    audit('TOGGLE_CATEGORY', id, `Categoría ${newActive ? 'activada' : 'desactivada'}: ${all[idx].name}`);
  }, []);

  const getCategoryById = useCallback((id: string) => {
    return getCategories().find(c => c.id === id);
  }, []);

  const getParentCategories = useCallback(() => {
    return categories.filter(c => !c.parentId);
  }, [categories]);

  const getSubcategories = useCallback((parentId: string) => {
    return categories.filter(c => c.parentId === parentId);
  }, [categories]);

  return (
    <CategoriesContext.Provider value={{
      categories, createCategory, updateCategory, deleteCategory,
      toggleActive, getCategoryById, getParentCategories, getSubcategories, refresh,
    }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error('useCategories must be used within CategoriesProvider');
  return ctx;
}
