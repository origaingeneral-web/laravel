import { Head } from '@inertiajs/react';
import { EllipsisVertical, FolderPlus, Loader2, Plus, SquarePen, Trash2 } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { Container } from '@/components/common/container';
import { DynamicColumn, DynamicTable } from '@/components/common/dynamic-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Demo1Layout from '@/layouts/demo1/layout';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/components/toolbar';

type Category = {
    id: number;
    category: string;
    created_at?: string;
    updated_at?: string;
};

export default function BusinessCategoriesIndex() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/v1/admin/master/business-categories', {
                headers: {
                    'Accept': 'application/json',
                }
            });
            const data = await res.json();
            if (data.data) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const columns = useMemo<DynamicColumn<Category>[]>(
        () => [
            {
                key: 'id',
                header: '#',
                align: 'center',
                sortable: true,
                cell: (_item, index) => <span className="text-muted-foreground font-medium">{index + 1}</span>,
            },
            {
                key: 'category',
                header: 'Category Name',
                sortable: true,
                cell: (item) => <span className="font-semibold text-foreground">{item.category}</span>,
            },
            {
                key: 'created_at',
                header: 'Created At',
                sortable: true,
                cell: (item) => (
                    <span className="text-xs text-muted-foreground">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                ),
            },
            {
                key: 'actions',
                header: 'Actions',
                align: 'right',
                hideable: false,
                cell: (item) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button mode="icon" variant="ghost" className="size-8">
                                <EllipsisVertical className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem
                                onClick={() => setEditingCategory(item)}
                                className="gap-2 cursor-pointer"
                            >
                                <SquarePen className="size-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setDeletingCategory(item)}
                                className="gap-2 cursor-pointer text-destructive"
                            >
                                <Trash2 className="size-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ],
        []
    );

    return (
        <>
            <Head title="Business Categories | Admin" />
            <Container>
                <Toolbar>
                    <ToolbarHeading
                        title="Business Categories"
                        description="Manage business categories for client companies and system classification."
                    />
                    <ToolbarActions>
                        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 shadow-xs">
                            <Plus className="size-4" />
                            Add Business Category
                        </Button>
                    </ToolbarActions>
                </Toolbar>
            </Container>

            <Container>
                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="size-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <DynamicTable
                        data={categories}
                        columns={columns}
                        searchPlaceholder="Search categories..."
                        exportFilename="business-categories"
                        defaultPageSize={5}
                    />
                )}
            </Container>

            <CreateCategoryModal 
                isOpen={isCreateOpen} 
                onClose={() => setIsCreateOpen(false)} 
                onSuccess={fetchCategories} 
            />

            {editingCategory && (
                <EditCategoryModal
                    category={editingCategory}
                    isOpen={Boolean(editingCategory)}
                    onClose={() => setEditingCategory(null)}
                    onSuccess={fetchCategories}
                />
            )}

            {deletingCategory && (
                <DeleteCategoryModal
                    category={deletingCategory}
                    isOpen={Boolean(deletingCategory)}
                    onClose={() => setDeletingCategory(null)}
                    onSuccess={fetchCategories}
                />
            )}
        </>
    );
}

function CreateCategoryModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void, onSuccess: () => void }) {
    const [category, setCategory] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        
        try {
            const res = await fetch('/api/v1/admin/master/business-categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ category }),
            });
            
            if (res.ok) {
                setCategory('');
                onSuccess();
                onClose();
            } else if (res.status === 422) {
                const data = await res.json();
                setErrors(data.errors || {});
            }
        } catch (error) {
            console.error(error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden [&>button[data-slot=dialog-close]]:text-white [&>button[data-slot=dialog-close]]:opacity-80 [&>button[data-slot=dialog-close]]:hover:opacity-100 [&>button[data-slot=dialog-close]]:top-4 [&>button[data-slot=dialog-close]]:end-4">
                <DialogHeader className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-row items-center gap-3 space-y-0 shadow-xs">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-xs">
                        <FolderPlus className="size-5" />
                    </div>
                    <div className="pr-6">
                        <DialogTitle className="text-base font-bold text-white leading-tight">Add Business Category</DialogTitle>
                        <DialogDescription className="text-xs text-blue-100/90 leading-normal">
                            Create a new business category entry.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="p-4 space-y-3.5">
                        <div>
                            <Label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Category Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="e.g. Retail, Healthcare, IT"
                                className="mt-1.5 h-10 rounded-lg bg-muted/20 focus:bg-background"
                                required
                            />
                            {errors.category && (
                                <p className="mt-1.5 text-xs font-medium text-destructive">{errors.category[0]}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 px-4 py-3 border-t border-border/60 bg-muted/20">
                        <Button type="button" variant="outline" onClick={onClose} className="rounded-lg h-9">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="rounded-lg h-9 gap-2 shadow-xs bg-blue-600 hover:bg-blue-700 text-white">
                            {processing && <Loader2 className="size-4 animate-spin" />}
                            Create Category
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditCategoryModal({
    category,
    isOpen,
    onClose,
    onSuccess,
}: {
    category: Category;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [name, setName] = useState(category.category);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        
        try {
            const res = await fetch(`/api/v1/admin/master/business-categories/${category.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ category: name }),
            });
            
            if (res.ok) {
                onSuccess();
                onClose();
            } else if (res.status === 422) {
                const data = await res.json();
                setErrors(data.errors || {});
            }
        } catch (error) {
            console.error(error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden [&>button[data-slot=dialog-close]]:text-white [&>button[data-slot=dialog-close]]:opacity-80 [&>button[data-slot=dialog-close]]:hover:opacity-100 [&>button[data-slot=dialog-close]]:top-4 [&>button[data-slot=dialog-close]]:end-4">
                <DialogHeader className="p-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white flex flex-row items-center gap-3 space-y-0 shadow-xs">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-xs">
                        <SquarePen className="size-5" />
                    </div>
                    <div className="pr-6">
                        <DialogTitle className="text-base font-bold text-white leading-tight">Edit Business Category</DialogTitle>
                        <DialogDescription className="text-xs text-amber-100/90 leading-normal">
                            Update the category details.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="p-4 space-y-3.5">
                        <div>
                            <Label htmlFor="edit-category" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Category Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="edit-category"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1.5 h-10 rounded-lg bg-muted/20 focus:bg-background"
                                required
                            />
                            {errors.category && (
                                <p className="mt-1.5 text-xs font-medium text-destructive">{errors.category[0]}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 px-4 py-3 border-t border-border/60 bg-muted/20">
                        <Button type="button" variant="outline" onClick={onClose} className="rounded-lg h-9">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="rounded-lg h-9 gap-2 shadow-xs bg-amber-600 hover:bg-amber-700 text-white">
                            {processing && <Loader2 className="size-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteCategoryModal({
    category,
    isOpen,
    onClose,
    onSuccess,
}: {
    category: Category;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/v1/admin/master/business-categories/${category.id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                },
            });
            if (res.ok) {
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden [&>button[data-slot=dialog-close]]:text-white [&>button[data-slot=dialog-close]]:opacity-80 [&>button[data-slot=dialog-close]]:hover:opacity-100 [&>button[data-slot=dialog-close]]:top-4 [&>button[data-slot=dialog-close]]:end-4">
                <DialogHeader className="p-4 bg-gradient-to-r from-rose-600 to-red-600 text-white flex flex-row items-center gap-3 space-y-0 shadow-xs">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-xs">
                        <Trash2 className="size-5" />
                    </div>
                    <div className="pr-6">
                        <DialogTitle className="text-base font-bold text-white leading-tight">Delete Category</DialogTitle>
                        <DialogDescription className="text-xs text-rose-100/90 leading-normal">
                            This action cannot be undone.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="p-4">
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete <span className="font-semibold text-foreground">"{category.category}"</span>?
                    </p>
                </div>

                <div className="flex items-center justify-end gap-2.5 px-4 py-3 border-t border-border/60 bg-muted/20">
                    <Button type="button" variant="outline" onClick={onClose} className="rounded-lg h-9">
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={deleting}
                        onClick={handleDelete}
                        className="rounded-lg h-9 gap-2 shadow-xs"
                    >
                        {deleting && <Loader2 className="size-4 animate-spin" />}
                        Delete Category
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

BusinessCategoriesIndex.layout = (page: React.ReactNode) => <Demo1Layout>{page}</Demo1Layout>;
