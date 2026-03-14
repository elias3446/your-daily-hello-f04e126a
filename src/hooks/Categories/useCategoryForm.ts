import { useState } from 'react';
import { Category } from '@/lib/types';
import { useCategories } from '@/contexts/CategoriesContext';
import { toast } from 'sonner';

interface CategoryFormData {
  name: string;
  description: string;
  color: string;
  icon: string;
  parentId: string;
}

const DEFAULT_FORM: CategoryFormData = {
  name: '', description: '', color: '#2563EB', icon: 'Tag', parentId: '',
};

export function useCategoryForm(onSuccess?: () => void) {
  const { createCategory, updateCategory } = useCategories();
  const [form, setForm] = useState<CategoryFormData>({ ...DEFAULT_FORM });

  const setField = <K extends keyof CategoryFormData>(key: K, value: CategoryFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const reset = () => setForm({ ...DEFAULT_FORM });

  const loadCategory = (cat: Category) => {
    setForm({
      name: cat.name,
      description: cat.description,
      color: cat.color,
      icon: cat.icon,
      parentId: cat.parentId || '',
    });
  };

  const validate = (): string | null => {
    if (!form.name.trim()) return 'El nombre es obligatorio';
    if (form.name.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
    return null;
  };

  const handleCreate = () => {
    const error = validate();
    if (error) { toast.error(error); return false; }
    try {
      createCategory({
        name: form.name.trim(),
        description: form.description.trim(),
        color: form.color,
        icon: form.icon,
        parentId: form.parentId || undefined,
      });
      toast.success('Categoría creada exitosamente');
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
      updateCategory(id, {
        name: form.name.trim(),
        description: form.description.trim(),
        color: form.color,
        icon: form.icon,
        parentId: form.parentId || undefined,
      });
      toast.success('Categoría actualizada');
      onSuccess?.();
      return true;
    } catch (e: any) {
      toast.error(e.message);
      return false;
    }
  };

  return { form, setField, reset, loadCategory, handleCreate, handleUpdate };
}
