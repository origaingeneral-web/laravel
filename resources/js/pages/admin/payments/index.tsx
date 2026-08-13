import { Head } from '@inertiajs/react';
import { CreditCard } from 'lucide-react';
import { Container } from '@/components/common/container';
import { Toolbar, ToolbarHeading } from '@/layouts/demo1/components/toolbar';
import { DynamicTable } from '@/components/common/dynamic-table';

export default function Index({ payments, filters }: any) {
    const columns = [
        {
            key: 'id',
            header: '#',
            align: 'center',
            sortable: true,
            cell: (_item: any, index: number) => <span className="text-muted-foreground font-medium">{index + 1}</span>,
        },
        { 
            key: 'transaction_id', 
            header: 'Transaction ID',
            cell: (item: any) => <span className="font-mono text-xs">{item.transaction_id || 'N/A'}</span>
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
            key: 'amount', 
            header: 'Amount',
            cell: (item: any) => <span className="font-semibold">{item.currency} {item.amount}</span>
        },
        { 
            key: 'status', 
            header: 'Status',
            cell: (item: any) => {
                let colorClass = 'bg-slate-100 text-slate-800';
                if (item.status === 'completed') colorClass = 'bg-green-100 text-green-800';
                else if (item.status === 'pending') colorClass = 'bg-amber-100 text-amber-800';
                else if (item.status === 'failed') colorClass = 'bg-red-100 text-red-800';
                
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${colorClass}`}>
                        {item.status}
                    </span>
                );
            }
        },
        { key: 'payment_method', header: 'Method', sortable: true },
        { 
            key: 'created_at', 
            header: 'Date', 
            cell: (item: any) => new Date(item.created_at).toLocaleString()
        }
    ];

    return (
        <>
            <Head title="Payments | Admin" />
            
            <Container>
                <Toolbar>
                    <ToolbarHeading
                        title="Payments"
                        description="View all transaction records and payment history."
                    />
                </Toolbar>
            </Container>

            <Container>
                <DynamicTable
                    data={payments?.data || []}
                    columns={columns}
                    searchPlaceholder="Search by transaction ID or company..."
                    exportFilename="payments"
                />
            </Container>
        </>
    );
}
