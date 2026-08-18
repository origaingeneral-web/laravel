import { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    EllipsisVertical,
    Filter,
    FolderPlus,
    KeyRound,
    Loader2,
    Plus,
    Save,
    Shield,
    SquarePen,
    Trash2,
    X,
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
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/components/toolbar';

type FeatureLookup = { id: number; name: string; code: string; product_id: number; product?: { id: number; name: string } };

type PermissionRecord = {
    id: number;
    name: string;
    guard_name: string;
    feature_id: number | null;
    feature?: FeatureLookup | null;
};

export default function PermissionsIndex({ permissions, features, filters }: {
    permissions: { data: PermissionRecord[]; total?: number };
    features: FeatureLookup[];
    filters: Record<string, any>;
}) {
    const [selectedFeatureFilter, setSelectedFeatureFilter] = useState(filters?.feature_id ? String(filters.feature_id) : 'all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPermission, setEditingPermission] = useState<PermissionRecord | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        feature_id: '',
        name: '',
        guards: ['web', 'super_admin'],
    });

    const handleFeatureFilterChange = (val: string) => {
        setSelectedFeatureFilter(val);
        router.get('/admin/permissions', {
            ...filters,
            feature_id: val === 'all' ? undefined : val,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const openCreateModal = (preselectedFeatureId?: string) => {
        setEditingPermission(null);
        reset();
        clearErrors();
        
        let initialFeatId = preselectedFeatureId || '';
        if (!initialFeatId && selectedFeatureFilter !== 'all') {
            initialFeatId = selectedFeatureFilter;
        } else if (!initialFeatId && features.length > 0) {
            initialFeatId = features[0].id.toString();
        }

        setData({
            feature_id: initialFeatId,
            name: '',
            guards: ['web', 'super_admin'],
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item: PermissionRecord) => {
        setEditingPermission(item);
        clearErrors();

        const rawName = item.name || '';
        const featureCode = item.feature?.code;
        const displayName = featureCode && rawName.startsWith(`${featureCode}.`)
            ? rawName.substring(featureCode.length + 1).replace(/_/g, ' ')
            : rawName.replace(/_/g, ' ');

        setData({
            feature_id: item.feature_id?.toString() || (features.length > 0 ? features[0].id.toString() : ''),
            name: displayName,
            guards: [item.guard_name || 'web'],
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPermission(null);
        reset();
        clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPermission) {
            put(`/admin/permissions/${editingPermission.id}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/admin/permissions', {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (item: PermissionRecord) => {
        if (confirm(`Are you sure you want to delete permission "${item.name}"?`)) {
            router.delete(`/admin/permissions/${item.id}`, {
                preserveScroll: true,
            });
        }
    };

    const selectedFeatureObj = features.find((f) => f.id.toString() === data.feature_id);

    const suggestions = ['Job Opening', 'Candidates', 'Interview', 'View', 'Create', 'Edit', 'Delete', 'Manage', 'Export'];

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
            header: 'Permission Key', 
            sortable: true,
            cell: (item: PermissionRecord) => (
                <span className="font-mono text-xs font-semibold text-foreground tracking-tight">{item.name}</span>
            )
        },
        { 
            key: 'feature', 
            header: 'Feature',
            sortable: true,
            cell: (item: PermissionRecord) => item.feature ? (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground text-sm">{item.feature.name}</span>
                    {item.feature.product && (
                        <span className="text-xs text-muted-foreground">{item.feature.product.name}</span>
                    )}
                </div>
            ) : (
                <span className="text-muted-foreground italic text-xs">Global / No Feature</span>
            )
        },
        { 
            key: 'guard_name', 
            header: 'Guard',
            sortable: true,
            cell: (item: PermissionRecord) => (
                <Badge variant={item.guard_name === 'super_admin' ? 'default' : 'secondary'} className="font-mono text-xs capitalize">
                    {item.guard_name}
                </Badge>
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            align: 'right' as const,
            hideable: false,
            cell: (item: PermissionRecord) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button mode="icon" variant="ghost" className="size-8">
                            <EllipsisVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                            onClick={() => openEditModal(item)}
                            className="gap-2 cursor-pointer"
                        >
                            <SquarePen className="size-4" />
                            Edit Permission
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => handleDelete(item)}
                            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                        >
                            <Trash2 className="size-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <>
            <Head title="Permissions | Admin" />
            
            <Container>
                <Toolbar>
                    <ToolbarHeading
                        title="Permissions"
                        description="Manage access permissions categorized under features."
                    />
                    <ToolbarActions className="gap-2.5">
                        <Button asChild variant="outline" className="gap-2 shadow-xs">
                            <Link href="/admin/features">
                                <Shield className="size-4 text-primary" />
                                View Features
                            </Link>
                        </Button>
                        <Button onClick={() => openCreateModal()} className="gap-2 shadow-xs bg-primary text-primary-foreground hover:bg-primary/90">
                            <Plus className="size-4" />
                            Add Permission
                        </Button>
                    </ToolbarActions>
                </Toolbar>
            </Container>

            <Container className="space-y-4 pb-12">
                {/* Filter Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-border/60 bg-card/60 shadow-2xs">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            <Filter className="size-3.5" />
                            Filter by Feature:
                        </div>
                        <Select value={selectedFeatureFilter} onValueChange={handleFeatureFilterChange}>
                            <SelectTrigger className="w-64 h-9 text-xs rounded-lg">
                                <SelectValue placeholder="All Features" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Features</SelectItem>
                                {features.map((f) => (
                                    <SelectItem key={f.id} value={f.id.toString()}>
                                        {f.name} {f.product ? `(${f.product.name})` : ''}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {selectedFeatureFilter !== 'all' && (
                            <Button
                                variant="ghost"
                                size="xs"
                                onClick={() => handleFeatureFilterChange('all')}
                                className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
                            >
                                <X className="size-3" />
                                Clear Filter
                            </Button>
                        )}
                    </div>

                    <span className="text-xs text-muted-foreground">
                        Showing <span className="font-semibold text-foreground">{permissions?.data?.length || 0}</span> permissions
                    </span>
                </div>

                <DynamicTable
                    data={permissions?.data || []}
                    columns={columns}
                    searchPlaceholder="Search permissions by key or feature..."
                    exportFilename="permissions"
                />
            </Container>

            {/* Add / Edit Permission Modal */}
            <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
                <DialogContent className="rounded-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto sm:max-w-lg [&>button[data-slot=dialog-close]]:text-white [&>button[data-slot=dialog-close]]:opacity-80 [&>button[data-slot=dialog-close]]:hover:opacity-100 [&>button[data-slot=dialog-close]]:top-4 [&>button[data-slot=dialog-close]]:end-4">
                    <DialogHeader className="p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-primary text-white flex flex-row items-center gap-3 space-y-0 shadow-xs">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-xs">
                            {editingPermission ? <SquarePen className="size-5" /> : <FolderPlus className="size-5" />}
                        </div>
                        <div className="pr-6">
                            <DialogTitle className="text-base font-bold text-white leading-tight">
                                {editingPermission ? 'Edit Permission' : 'Add Permission'}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-blue-100/90 leading-normal">
                                {editingPermission ? `Update permission "${editingPermission.name}"` : 'Create a permission under a feature.'}
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                        <div className="p-5 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="modal_feature_id" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Feature Module</Label>
                                <Select 
                                    onValueChange={(val) => setData('feature_id', val)}
                                    value={data.feature_id}
                                >
                                    <SelectTrigger id="modal_feature_id" className="h-10 rounded-lg">
                                        <SelectValue placeholder="Select Feature (e.g. Recruitment)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {features.map((f) => (
                                            <SelectItem key={f.id} value={f.id.toString()}>
                                                {f.name} {f.product ? `(${f.product.name})` : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.feature_id && <p className="text-xs text-destructive">{errors.feature_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="modal_perm_name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Permission Name</Label>
                                <Input
                                    id="modal_perm_name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Job Opening, Candidates, Interview"
                                    className="h-10 rounded-lg"
                                />
                                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                            </div>

                            {/* Suggestions */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                <span className="text-xs text-muted-foreground mr-1">Suggestions:</span>
                                {suggestions.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setData('name', s)}
                                        className="text-xs px-2 py-0.5 rounded-md border border-border/70 hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                        + {s}
                                    </button>
                                ))}
                            </div>

                            {selectedFeatureObj && data.name && (
                                <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 text-xs text-muted-foreground flex items-center justify-between">
                                    <span>Generated Key:</span>
                                    <span className="font-mono text-primary font-bold">
                                        {selectedFeatureObj.code}.{data.name.trim().toLowerCase().replace(/\s+/g, '_')}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-border/60 bg-muted/20">
                            <Button type="button" variant="outline" onClick={closeModal} className="rounded-lg h-9">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing} className="rounded-lg h-9 gap-2 shadow-xs bg-primary hover:bg-primary/90 text-primary-foreground">
                                {processing && <Loader2 className="size-4 animate-spin" />}
                                <Save className="size-4" />
                                {editingPermission ? 'Update Permission' : 'Create Permission'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
