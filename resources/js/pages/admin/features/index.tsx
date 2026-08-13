import { Head, Link } from '@inertiajs/react';
import { Plus, SquarePen, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/components/toolbar';
import { DynamicTable } from '@/components/common/dynamic-table';

export default function Index({ features, filters }: any) {
    const columns = [
        {
            key: 'id',
            header: '#',
            align: 'center',
            sortable: true,
            cell: (_item: any, index: number) => <span className="text-muted-foreground font-medium">{index + 1}</span>,
        },
        { key: 'code', header: 'Code', sortable: true },
        { key: 'name', header: 'Name', sortable: true },
        { 
            key: 'product', 
            header: 'Product',
            cell: (item: any) => item.product?.name || '-'
        },
        { 
            key: 'is_addon', 
            header: 'Is Addon',
            cell: (item: any) => item.is_addon ? 'Yes' : 'No'
        },
        { 
            key: 'is_active', 
            header: 'Status',
            cell: (item: any) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.is_active ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            key: 'actions',
            header: 'Action',
            align: 'right',
            hideable: false,
            cell: (item: any) => (
                <div className="flex justify-end gap-2">
                    <Button asChild mode="icon" variant="ghost" className="size-8 text-primary">
                        <Link href={`/admin/features/${item.id}/edit`}>
                            <SquarePen className="size-4" />
                        </Link>
                    </Button>
                    <Link
                        href={`/admin/features/${item.id}`}
                        method="delete"
                        as="button"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 text-destructive"
                        preserveScroll
                        onBefore={() => confirm('Are you sure you want to delete this feature?')}
                    >
                        <Trash2 className="size-4" />
                    </Link>
                </div>
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
                        description="Manage global product features and addons."
                    />
                    <ToolbarActions>
                        <Button asChild className="gap-2 shadow-xs">
                            <Link href="/admin/features/create">
                                <Plus className="size-4" />
                                Add Feature
                            </Link>
                        </Button>
                    </ToolbarActions>
                </Toolbar>
            </Container>

            <Container>
                <DynamicTable
                    data={features?.data || []}
                    columns={columns}
                    searchPlaceholder="Search features..."
                    exportFilename="features"
                />
            </Container>
        </>
    );
}
