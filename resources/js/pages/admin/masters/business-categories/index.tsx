import { Head, router, useForm } from '@inertiajs/react';
import { EllipsisVertical, Plus, SquarePen, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
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

type Props = {
    categories: Category[];
    filters?: {
        search?: string;
    };
};

export default function BusinessCategoriesIndex({ categories }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

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
                        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                            <Plus className="size-4" />
                            Add Business Category
                        </Button>
                    </ToolbarActions>
                </Toolbar>
            </Container>

            <Container>
                <DynamicTable
                    data={categories}
                    columns={columns}
                    searchPlaceholder="Search categories..."
                    exportFilename="business-categories"
                    defaultPageSize={5}
                />
            </Container>

            <CreateCategoryModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

            {editingCategory && (
                <EditCategoryModal
                    category={editingCategory}
                    isOpen={Boolean(editingCategory)}
                    onClose={() => setEditingCategory(null)}
                />
            )}

            {deletingCategory && (
                <DeleteCategoryModal
                    category={deletingCategory}
                    isOpen={Boolean(deletingCategory)}
                    onClose={() => setDeletingCategory(null)}
                />
            )}
        </>
    );
}

function CreateCategoryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        category: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/master/business-categories', {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-xl">
                <DialogHeader>
                    <DialogTitle>Add Business Category</DialogTitle>
                    <DialogDescription>Create a new business category entry.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div>
                        <Label htmlFor="category">Category Name</Label>
                        <Input
                            id="category"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            placeholder="e.g. Retail, Healthcare, IT"
                            className="mt-1.5"
                            required
                        />
                        {errors.category && (
                            <p className="mt-1 text-xs text-red-500">{errors.category}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
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
}: {
    category: Category;
    isOpen: boolean;
    onClose: () => void;
}) {
    const { data, setData, put, processing, errors } = useForm({
        category: category.category,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/master/business-categories/${category.id}`, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-xl">
                <DialogHeader>
                    <DialogTitle>Edit Business Category</DialogTitle>
                    <DialogDescription>Update the category name.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div>
                        <Label htmlFor="edit-category">Category Name</Label>
                        <Input
                            id="edit-category"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="mt-1.5"
                            required
                        />
                        {errors.category && (
                            <p className="mt-1 text-xs text-red-500">{errors.category}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
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
}: {
    category: Category;
    isOpen: boolean;
    onClose: () => void;
}) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        setDeleting(true);
        router.delete(`/admin/master/business-categories/${category.id}`, {
            onFinish: () => {
                setDeleting(false);
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-xl">
                <DialogHeader>
                    <DialogTitle>Delete Business Category</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete <span className="font-bold text-foreground">"{category.category}"</span>?
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={deleting}
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

BusinessCategoriesIndex.layout = (page: React.ReactNode) => <Demo1Layout>{page}</Demo1Layout>;
