import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from '@/lib/types';
import { useCategoryForm } from '@/hooks/Categories/useCategoryForm';
import { useCategories } from '@/contexts/CategoriesContext';
import { categoryStyles as s } from '@/styles/Categories/categories.styles';
import { CATEGORY_ICONS, getIconByName } from './categoryIcons';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

interface SubcategoryDraft {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

function genTempId() {
  return '_tmp_' + Date.now().toString(36) + Math.random().toString(36).slice(2);
}

interface CategoryFormDialogProps {
  open: boolean;
  onClose: () => void;
  editCategory?: Category | null;
}

export default function CategoryFormDialog({ open, onClose, editCategory }: CategoryFormDialogProps) {
  const { form, setField, reset, loadCategory, handleCreate, handleUpdate } = useCategoryForm();
  const { getParentCategories, getSubcategories, createCategory } = useCategories();
  const isEdit = !!editCategory;

  const [subcategories, setSubcategories] = useState<SubcategoryDraft[]>([]);
  const [showSubForm, setShowSubForm] = useState(false);
  const [expandedSubs, setExpandedSubs] = useState(true);

  useEffect(() => {
    if (open && editCategory) {
      loadCategory(editCategory);
      // Load existing subcategories for editing
      if (!editCategory.parentId) {
        const existingSubs = getSubcategories(editCategory.id);
        setSubcategories(existingSubs.map(sub => ({
          id: sub.id,
          name: sub.name,
          description: sub.description,
          color: sub.color,
          icon: sub.icon,
        })));
      } else {
        setSubcategories([]);
      }
    } else if (open) {
      reset();
      setSubcategories([]);
    }
    setShowSubForm(false);
  }, [open, editCategory]);

  const isParentCategory = true;

  const addSubcategory = () => {
    setSubcategories(prev => [...prev, {
      id: genTempId(),
      name: '',
      description: '',
      color: form.color,
      icon: form.icon,
    }]);
    setShowSubForm(true);
    setExpandedSubs(true);
  };

  const updateSub = (id: string, field: keyof SubcategoryDraft, value: string) => {
    setSubcategories(prev => prev.map(sub =>
      sub.id === id ? { ...sub, [field]: value } : sub
    ));
  };

  const removeSub = (id: string) => {
    setSubcategories(prev => prev.filter(sub => sub.id !== id));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate subcategories
    for (const sub of subcategories) {
      if (!sub.name.trim()) {
        toast.error('Todas las subcategorías deben tener un nombre');
        return;
      }
    }

    if (isEdit) {
      const success = handleUpdate(editCategory!.id);
      if (success) {
        // Create new subcategories (ones with temp IDs)
        subcategories.filter(sub => sub.id.startsWith('_tmp_')).forEach(sub => {
          createCategory({
            name: sub.name.trim(),
            description: sub.description.trim(),
            color: sub.color,
            icon: sub.icon,
            parentId: editCategory!.id,
          });
        });
        onClose();
      }
    } else {
      // For create: first create parent, then subcategories
      if (!form.name.trim()) {
        toast.error('El nombre es obligatorio');
        return;
      }
      if (form.name.trim().length < 2) {
        toast.error('El nombre debe tener al menos 2 caracteres');
        return;
      }

      try {
        const parent = createCategory({
          name: form.name.trim(),
          description: form.description.trim(),
          color: form.color,
          icon: form.icon,
          parentId: form.parentId || undefined,
        });

        // Create subcategories linked to the new parent
        if (isParentCategory) {
          subcategories.forEach(sub => {
            createCategory({
              name: sub.name.trim(),
              description: sub.description.trim(),
              color: sub.color,
              icon: sub.icon,
              parentId: parent.id,
            });
          });
        }

        toast.success('Categoría creada exitosamente');
        reset();
        onClose();
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Categoría' : 'Nueva Categoría'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className={s.form}>
          {/* Main category fields */}
          <div className={s.fieldGroup}>
            <Label htmlFor="cat-name">Nombre</Label>
            <Input id="cat-name" value={form.name} onChange={e => setField('name', e.target.value)} maxLength={100} />
          </div>
          <div className={s.fieldGroup}>
            <Label htmlFor="cat-desc">Descripción</Label>
            <Textarea id="cat-desc" value={form.description} onChange={e => setField('description', e.target.value)} rows={2} maxLength={500} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className={s.fieldGroup}>
              <Label>Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.color}
                  onChange={e => setField('color', e.target.value)}
                  className="h-9 w-12 rounded border border-input cursor-pointer"
                />
                <Input value={form.color} onChange={e => setField('color', e.target.value)} className="flex-1" maxLength={7} />
              </div>
            </div>
            <div className={s.fieldGroup}>
              <Label>Ícono</Label>
              <Select value={form.icon} onValueChange={v => setField('icon', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar ícono" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {CATEGORY_ICONS.map(({ name, Icon }) => (
                    <SelectItem key={name} value={name}>
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Subcategories section - only for parent categories */}
          {isParentCategory && (
            <div className="border border-border rounded-lg overflow-hidden">
              <button
                type="button"
                className="flex items-center justify-between w-full px-4 py-3 bg-muted/50 hover:bg-muted transition-colors text-sm font-medium text-foreground"
                onClick={() => setExpandedSubs(!expandedSubs)}
              >
                <span className="flex items-center gap-2">
                  Subcategorías
                  {subcategories.length > 0 && (
                    <span className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-primary/10 text-primary text-xs font-semibold px-1.5">
                      {subcategories.length}
                    </span>
                  )}
                </span>
                {expandedSubs ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </button>

              {expandedSubs && (
                <div className="p-4 space-y-3">
                  {subcategories.length === 0 && !showSubForm && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      No hay subcategorías. Agrega una para organizar mejor tus tickets.
                    </p>
                  )}

                  {subcategories.map((sub, index) => {
                    const SubIcon = getIconByName(sub.icon);
                    return (
                      <div key={sub.id} className="border border-border rounded-md p-3 space-y-2 bg-background">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">Subcategoría {index + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => removeSub(sub.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <Input
                          placeholder="Nombre de la subcategoría"
                          value={sub.name}
                          onChange={e => updateSub(sub.id, 'name', e.target.value)}
                          maxLength={100}
                          className="h-8 text-sm"
                        />
                        <Input
                          placeholder="Descripción (opcional)"
                          value={sub.description}
                          onChange={e => updateSub(sub.id, 'description', e.target.value)}
                          maxLength={500}
                          className="h-8 text-sm"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={sub.color}
                              onChange={e => updateSub(sub.id, 'color', e.target.value)}
                              className="h-7 w-9 rounded border border-input cursor-pointer"
                            />
                            <Input
                              value={sub.color}
                              onChange={e => updateSub(sub.id, 'color', e.target.value)}
                              className="h-8 text-sm flex-1"
                              maxLength={7}
                            />
                          </div>
                          <Select value={sub.icon} onValueChange={v => updateSub(sub.id, 'icon', v)}>
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                              {CATEGORY_ICONS.map(({ name, Icon }) => (
                                <SelectItem key={name} value={name}>
                                  <span className="flex items-center gap-2">
                                    <Icon className="h-3.5 w-3.5" />
                                    {name}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    );
                  })}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={addSubcategory}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Agregar subcategoría
                  </Button>
                </div>
              )}
            </div>
          )}

          <DialogFooter className={s.dialogFooter}>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">
              {isEdit ? 'Guardar cambios' : subcategories.length > 0 ? `Crear categoría y ${subcategories.length} subcategoría${subcategories.length > 1 ? 's' : ''}` : 'Crear categoría'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
