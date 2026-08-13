import { Head, Link } from '@inertiajs/react';
import { Flame, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/components/toolbar';
import { DynamicTable } from '@/components/common/dynamic-table';

export default function FirebaseIndex({ notifications }: any) {
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
        { key: 'created_at', header: 'Sent At', sortable: true, cell: (item: any) => new Date(item.created_at).toLocaleString() },
    ];

    return (
        <>
            <Head title="Firebase Push Notifications | Admin" />
            
            <Container>
                <Toolbar>
                    <ToolbarHeading
                        title="Firebase Push Notifications"
                        description="View and manage push notifications sent to devices."
                    />
                    <ToolbarActions>
                        <Button asChild className="gap-2">
                            <Link href="/admin/communication/notifications/firebase/create">
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
                    searchPlaceholder="Search push notifications..."
                />
            </Container>
        </>
    );
}
