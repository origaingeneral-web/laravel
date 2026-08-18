import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    EllipsisVertical,
    FolderPlus,
    KeyRound,
    Loader2,
    Plus,
    Save,
    SquarePen,
    Star,
    Trash2,
} from 'lucide-react';
import { Container } from '@/components/common/container';
import { DynamicTable } from '@/components/common/dynamic-table';
import { Badge } from '@/components/ui/badge';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/components/toolbar';

type ProductLookup = { id: number; name: string };

type FeatureRecord = {
    id: number;
    product_id: number;
    name: string;
    code: string;
    description: string | null;
    is_addon: boolean;
    is_active: boolean;
    sort_order: number;
    permissions_count?: number;
    permissions?: any[];
    product?: { id: number; name: string };
};

export default function FeaturesIndex({ features, products, filters }: {
    features: { data: FeatureRecord[]; total?: number };
    products: ProductLookup[];
    filters: Record<string, any>;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFeature, setEditingFeature] = useState<FeatureRecord | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        product_id: '',
        name: '',
        description: '',
        is_addon: false,
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingFeature(null);
        reset();
        clearErrors();
        setData({
            product_id: products.length > 0 ? products[0].id.toString() : '',
            name: '',
            description: '',
            is_addon: false,
            is_active: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item: FeatureRecord) => {
        setEditingFeature(item);
        clearErrors();
        setData({
            product_id: item.product_id?.toString() || '',
            name: item.name || '',
            description: item.description || '',
            is_addon: !!item.is_addon,
            is_active: !!item.is_active,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingFeature(null);
        reset();
        clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingFeature) {
            put(`/admin/features/${editingFeature.id}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/admin/features', {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (item: FeatureRecord) => {
        if (confirm(`Are you sure you want to delete feature "${item.name}"?`)) {
            router.delete(`/admin/features/${item.id}`, {
                preserveScroll: true,
            });
        }
    };

    const columns = [
        {
            key: 'id',
            header: '#',
            align: 'center' as const,
            sortable: true,
            cell: (_item: any, index: number) => <span className="text-muted-foreground font-medium">{index + 1}</span>,
        },
        { 
            key: 'name', 
            header: 'Feature Name', 
            sortable: true,
            cell: (item: FeatureRecord) => (
                <div>
                    <span className="font-semibold text-foreground text-sm">{item.name}</span>
                    {item.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-sm">{item.description}</p>
                    )}
                </div>
            )
        },
        { 
            key: 'product', 
            header: 'Product',
            sortable: true,
            cell: (item: FeatureRecord) => (
                <Badge variant="secondary" className="font-medium">
                    {item.product?.name || '-'}
                </Badge>
            )
        },
        {
            key: 'permissions',
            header: 'Permissions',
            cell: (item: FeatureRecord) => {
                const count = item.permissions_count ?? item.permissions?.length ?? 0;
                return (
                    <div className="flex items-center gap-2">
                        <Link href={`/admin/permissions?feature_id=${item.id}`}>
                            <Badge variant="outline" className="text-xs font-normal hover:bg-accent transition-colors cursor-pointer border-border/80">
                                <span className="font-medium text-foreground">{count}</span> {count === 1 ? 'permission' : 'permissions'}
                            </Badge>
                        </Link>
                    </div>
                );
            }
        },
        { 
            key: 'is_addon', 
            header: 'Type',
            cell: (item: FeatureRecord) => item.is_addon ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    Add-on
                </span>
            ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    Core Feature
                </span>
            )
        },
        { 
            key: 'is_active', 
            header: 'Status',
            cell: (item: FeatureRecord) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.is_active ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                    {item.is_active ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            align: 'right' as const,
            hideable: false,
            cell: (item: FeatureRecord) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button mode="icon" variant="ghost" className="size-8">
                            <EllipsisVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                            onClick={() => openEditModal(item)}
                            className="gap-2 cursor-pointer"
                        >
                            <SquarePen className="size-4" />
                            Edit Feature
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                            <Link href={`/admin/permissions?feature_id=${item.id}`}>
                                <KeyRound className="size-4" />
                                Manage Permissions
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => handleDelete(item)}
                            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                        >
                            <Trash2 className="size-4" />
                            Delete Feature
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <>
            <Head title="Features | Admin" />
            
            <Container>
                <Toolbar>
                    <ToolbarHeading
                        title="Features"
                        description="Manage core system modules and addons across products."
                    />
                    <ToolbarActions className="gap-2.5">
                        <Button asChild variant="outline" className="gap-2 shadow-xs">
                            <Link href="/admin/permissions">
                                <KeyRound className="size-4 text-primary" />
                                Manage Permissions
                            </Link>
                        </Button>
                        <Button onClick={openCreateModal} className="gap-2 shadow-xs bg-primary text-primary-foreground hover:bg-primary/90">
                            <Plus className="size-4" />
                            Add Feature
                        </Button>
                    </ToolbarActions>
                </Toolbar>
            </Container>

            <Container className="space-y-4 pb-12">
                <DynamicTable
                    data={features?.data || []}
                    columns={columns}
                    searchPlaceholder="Search features by name or description..."
                    exportFilename="features"
                />
            </Container>

            {/* Add / Edit Feature Modal */}
            <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent className="rounded-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto sm:max-w-lg [&>button[data-slot=dialog-close]]:text-white [&>button[data-slot=dialog-close]]:opacity-80 [&>button[data-slot=dialog-close]]:hover:opacity-100 [&>button[data-slot=dialog-close]]:top-4 [&>button[data-slot=dialog-close]]:end-4">
                    <DialogHeader className="p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-primary text-white flex flex-row items-center gap-3 space-y-0 shadow-xs">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-xs">
                            {editingFeature ? <SquarePen className="size-5" /> : <FolderPlus className="size-5" />}
                        </div>
                        <div className="pr-6">
                            <DialogTitle className="text-base font-bold text-white leading-tight">
                                {editingFeature ? 'Edit Feature' : 'Add Feature'}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-blue-100/90 leading-normal">
                                {editingFeature ? `Update properties for "${editingFeature.name}"` : 'Create a new feature entry.'}
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                        <div className="p-5 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="modal_product_id" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</Label>
                                <Select 
                                    onValueChange={(val) => setData('product_id', val)}
                                    value={data.product_id}
                                >
                                    <SelectTrigger id="modal_product_id" className="h-10 rounded-lg">
                                        <SelectValue placeholder="Select Product" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((p) => (
                                            <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.product_id && <p className="text-xs text-destructive">{errors.product_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="modal_name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Feature Name</Label>
                                <Input
                                    id="modal_name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Recruitment, Payroll, Attendance"
                                    className="h-10 rounded-lg"
                                />
                                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="modal_description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</Label>
                                <Textarea
                                    id="modal_description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Brief overview of what this feature handles..."
                                    rows={3}
                                    className="rounded-lg resize-none"
                                />
                                {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                            </div>

                            <div className="flex items-center gap-6 pt-1 p-3 rounded-lg border border-border/50 bg-muted/20">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="modal_is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(c) => setData('is_active', c)}
                                    />
                                    <Label htmlFor="modal_is_active" className="text-sm font-medium cursor-pointer">Active Status</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="modal_is_addon"
                                        checked={data.is_addon}
                                        onCheckedChange={(c) => setData('is_addon', c)}
                                    />
                                    <Label htmlFor="modal_is_addon" className="text-sm font-medium cursor-pointer">Is Add-on</Label>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-border/60 bg-muted/20">
                            <Button type="button" variant="outline" onClick={closeModal} className="rounded-lg h-9">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing} className="rounded-lg h-9 gap-2 shadow-xs bg-primary hover:bg-primary/90 text-primary-foreground">
                                {processing && <Loader2 className="size-4 animate-spin" />}
                                <Save className="size-4" />
                                {editingFeature ? 'Update Feature' : 'Create Feature'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
