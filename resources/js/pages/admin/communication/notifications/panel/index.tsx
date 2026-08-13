import { Head, Link } from '@inertiajs/react';
import { Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/components/toolbar';
import { DynamicTable } from '@/components/common/dynamic-table';

export default function PanelIndex({ notifications }: any) {
    const columns = [
        { key: 'id', header: '#', sortable: true, cell: (_: any, idx: number) => idx + 1 },
        { key: 'title', header: 'Title', sortable: true },
        { 
            key: 'target_type', 
            header: 'Target',
            cell: (item: any) => (
                <span className="capitalize px-2 py-1 bg-secondary rounded text-xs">{item.target_type}</span>
            )
        },
        { 
            key: 'panel_display_style', 
            header: 'Style',
            cell: (item: any) => (
                <span className="capitalize">{item.panel_display_style}</span>
            )
        },
        { 
            key: 'expires_at', 
            header: 'Expires At', 
            sortable: true, 
            cell: (item: any) => item.expires_at ? new Date(item.expires_at).toLocaleString() : 'Never' 
        },
        { key: 'created_at', header: 'Created At', sortable: true, cell: (item: any) => new Date(item.created_at).toLocaleString() },
    ];

    return (
        <>
            <Head title="Panel Notifications | Admin" />
            
            <Container>
                <Toolbar>
                    <ToolbarHeading
                        title="Panel Announcements"
                        description="View and manage in-app panel notifications."
                    />
                    <ToolbarActions>
                        <Button asChild className="gap-2">
                            <Link href="/admin/communication/notifications/panel/create">
                                <Plus className="size-4" />
                                Add New
                            </Link>
                        </Button>
                    </ToolbarActions>
                </Toolbar>
            </Container>

            <Container>
                <DynamicTable
                    data={notifications?.data || []}
                    columns={columns}
                    searchPlaceholder="Search panel notifications..."
                />
            </Container>
        </>
    );
}
