import { Head } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { Container } from '@/components/common/container';
import { Toolbar, ToolbarHeading } from '@/layouts/demo1/components/toolbar';
import { DynamicTable } from '@/components/common/dynamic-table';

export default function Index({ subscriptions, filters }: any) {
    const columns = [
        {
            key: 'id',
            header: '#',
            align: 'center',
            sortable: true,
            cell: (_item: any, index: number) => <span className="text-muted-foreground font-medium">{index + 1}</span>,
        },
        { 
            key: 'company', 
            header: 'Company',
            cell: (item: any) => (
                <div>
                    <div className="font-semibold">{item.company?.company_name}</div>
                    <div className="text-xs text-muted-foreground">{item.company?.email}</div>
                </div>
            )
        },
        { 
            key: 'product', 
            header: 'Product & Plan',
            cell: (item: any) => (
                <div>
                    <div className="font-semibold">{item.product?.name}</div>
                    <div className="text-xs text-muted-foreground">{item.plan?.plan_name}</div>
                </div>
            )
        },
        { 
            key: 'status', 
            header: 'Status',
            cell: (item: any) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.status}
                </span>
            )
        },
        { key: 'staff_limit', header: 'Staff Limit', align: 'center' },
        { 
            key: 'starts_at', 
            header: 'Starts At', 
            cell: (item: any) => item.starts_at ? new Date(item.starts_at).toLocaleDateString() : '-'
        },
        { 
            key: 'expires_at', 
            header: 'Expires At', 
            cell: (item: any) => item.expires_at ? new Date(item.expires_at).toLocaleDateString() : '-'
        }
    ];

    return (
        <>
            <Head title="Subscriptions | Admin" />
            
            <Container>
                <Toolbar>
                    <ToolbarHeading
                        title="Subscriptions"
                        description="Monitor all active and expired product subscriptions across companies."
                    />
                </Toolbar>
            </Container>

            <Container>
                <DynamicTable
                    data={subscriptions?.data || []}
                    columns={columns}
                    searchPlaceholder="Search by company name or code..."
                    exportFilename="subscriptions"
                />
            </Container>
        </>
    );
}
