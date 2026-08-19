import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    CheckCircle2,
    DollarSign,
    EllipsisVertical,
    FolderPlus,
    KeyRound,
    Layers,
    Loader2,
    Plus,
    Save,
    Sparkles,
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
    price: number | string;
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
        price: '0.00',
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
            price: '0.00',
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
            price: item.price ? Number(item.price).toFixed(2) : '0.00',
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
            key: 'is_addon', 
            header: 'Type & Pricing',
            cell: (item: FeatureRecord) => item.is_addon ? (
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 shadow-2xs">
                        <Sparkles className="size-3 text-amber-500" />
                        Add-on
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                        ₹{Number(item.price ?? 0).toFixed(2)}
                    </span>
                </div>
            ) : (
                <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 shadow-2xs">
                        <Layers className="size-3 text-blue-500" />
                        Core Feature
                    </span>
                    <span className="text-xs text-muted-foreground font-medium bg-muted/50 px-1.5 py-0.5 rounded">
                        Included / Free
                    </span>
                </div>
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
                <DialogContent className="rounded-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto sm:max-w-2xl [&>button[data-slot=dialog-close]]:text-white [&>button[data-slot=dialog-close]]:opacity-80 [&>button[data-slot=dialog-close]]:hover:opacity-100 [&>button[data-slot=dialog-close]]:top-4 [&>button[data-slot=dialog-close]]:end-4">
                    <DialogHeader className="p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-primary text-white flex flex-row items-center gap-3 space-y-0 shadow-xs">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-xs">
                            {editingFeature ? <SquarePen className="size-5" /> : <FolderPlus className="size-5" />}
                        </div>
                        <div className="pr-6">
                            <DialogTitle className="text-lg font-bold text-white leading-tight">
                                {editingFeature ? 'Edit Feature' : 'Add Feature'}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-blue-100/90 leading-normal">
                                {editingFeature ? `Update properties and addon pricing for "${editingFeature.name}"` : 'Create a new feature or addon module.'}
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="modal_product_id" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product <span className="text-destructive">*</span></Label>
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
                                    <Label htmlFor="modal_name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Feature Name <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="modal_name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. Recruitment, Attendance, AI Assistant"
                                        className="h-10 rounded-lg"
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="modal_description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</Label>
                                <Textarea
                                    id="modal_description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Brief overview of what this feature handles..."
                                    rows={2}
                                    className="rounded-lg resize-none"
                                />
                                {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                            </div>

                            {/* Feature Type Selector (Core Feature vs Add-on) */}
                            <div className="space-y-2 pt-1">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Feature Type <span className="text-destructive">*</span>
                                </Label>
                                <div className="grid grid-cols-2 gap-2.5 p-1 rounded-xl bg-muted/40 border border-border/60">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setData((prev) => ({ ...prev, is_addon: false, price: '0.00' }));
                                        }}
                                        className={`flex flex-col items-start gap-1 p-2.5 rounded-lg text-left transition-all cursor-pointer ${
                                            !data.is_addon
                                                ? 'bg-background text-foreground shadow-sm border border-blue-500/40 dark:border-blue-500/60'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-1.5 font-semibold text-xs text-blue-600 dark:text-blue-400">
                                            <Layers className="size-3.5" />
                                            <span>Core Feature</span>
                                        </div>
                                        <span className="text-[11px] text-muted-foreground leading-tight">
                                            Default / Free module included with product
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setData((prev) => ({ ...prev, is_addon: true }));
                                        }}
                                        className={`flex flex-col items-start gap-1 p-2.5 rounded-lg text-left transition-all cursor-pointer ${
                                            data.is_addon
                                                ? 'bg-background text-foreground shadow-sm border border-amber-500/50 dark:border-amber-500/70'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-1.5 font-semibold text-xs text-amber-600 dark:text-amber-400">
                                            <Sparkles className="size-3.5" />
                                            <span>Add-on (Paid)</span>
                                        </div>
                                        <span className="text-[11px] text-muted-foreground leading-tight">
                                            Optional paid addon with custom pricing
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Conditional Price Input if Add-on is selected */}
                            {data.is_addon && (
                                <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 space-y-1.5 transition-all">
                                    <Label htmlFor="modal_price" className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-200 flex items-center justify-between">
                                        <span>Add-on Price (INR) <span className="text-destructive">*</span></span>
                                        <span className="text-[10px] lowercase font-normal text-muted-foreground">cost in ₹ for activating this addon</span>
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">₹</span>
                                        <Input
                                            id="modal_price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            placeholder="0.00"
                                            className="h-10 pl-7 text-sm font-semibold rounded-lg bg-background"
                                            required={data.is_addon}
                                        />
                                    </div>
                                    {errors.price && <p className="text-xs font-medium text-destructive">{errors.price}</p>}
                                </div>
                            )}

                            {/* Active Status Switch */}
                            <div className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20">
                                <div>
                                    <Label htmlFor="modal_is_active" className="text-xs font-semibold cursor-pointer">Active Status</Label>
                                    <p className="text-[11px] text-muted-foreground">Disable to temporarily hide this feature across the system</p>
                                </div>
                                <Switch
                                    id="modal_is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(c) => setData('is_active', c)}
                                />
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
