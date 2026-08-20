import { Head, router } from '@inertiajs/react';
import { Mail, MessageSquare, Phone, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Container } from '@/components/common/container';
import { Toolbar, ToolbarHeading } from '@/layouts/demo1/components/toolbar';
import { DynamicTable } from '@/components/common/dynamic-table';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function Logs({ logs, filters }: any) {
    const indexUrl = filters.type ? `/admin/communication/logs/${filters.type}` : '/admin/communication/logs';

    const handleSearch = (search: string) => {
        router.get(indexUrl, { search }, { preserveState: true, replace: true });
    };

    let title = "Communication Logs";
    let desc = "View all sent and received communication logs.";
    if (filters.type === 'email') { title = "Email History"; desc = "View all sent emails."; }
    else if (filters.type === 'sms') { title = "SMS History"; desc = "View all sent SMS messages."; }
    else if (filters.type === 'whatsapp') { title = "WhatsApp History"; desc = "View all sent WhatsApp messages."; }

    const columns = [
        {
            key: 'created_at',
            header: 'Date',
            cell: (item: any) => (
                <span className="text-sm font-medium whitespace-nowrap">
                    {new Date(item.created_at).toLocaleString()}
                </span>
            )
        },
        {
            key: 'recipient',
            header: 'Recipient',
            cell: (item: any) => (
                <div>
                    <div className="font-semibold">{item.recipient}</div>
                    {item.template_purpose && <div className="text-xs text-muted-foreground">{item.template_purpose}</div>}
                </div>
            )
        },
        {
            key: 'message',
            header: 'Message Details',
            cell: (item: any) => (
                <div className="max-w-xs md:max-w-md lg:max-w-lg">
                    {item.subject && <div className="font-semibold truncate text-sm">{item.subject}</div>}
                    <div className="text-xs text-muted-foreground truncate">{item.message}</div>
                </div>
            )
        },
        {
            key: 'status',
            header: 'Status',
            cell: (item: any) => {
                if (item.status === 'success' || item.status === 'sent' || item.status === 'delivered') {
                    return <Badge variant="success" className="gap-1"><CheckCircle className="size-3" /> {item.status}</Badge>;
                } else if (item.status === 'failed') {
                    return (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Badge variant="destructive" className="gap-1 cursor-pointer"><XCircle className="size-3" /> Failed</Badge>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm text-destructive">Error Details</h4>
                                    <p className="text-xs text-muted-foreground">{item.error_details || 'Unknown error occurred.'}</p>
                                </div>
                            </PopoverContent>
                        </Popover>
                    );
                }
                return <Badge variant="secondary" className="gap-1"><Clock className="size-3" /> Pending</Badge>;
            }
        },
    ];

    // Only show the "Type" column if we are not filtering by a specific type
    if (!filters.type) {
        columns.splice(1, 0, {
            key: 'type',
            header: 'Type',
            cell: (item: any) => {
                if (item.channel === 'email') return <Badge variant="outline" className="gap-1"><Mail className="size-3"/> Email</Badge>;
                if (item.channel === 'sms') return <Badge variant="outline" className="gap-1"><MessageSquare className="size-3"/> SMS</Badge>;
                return <Badge variant="outline" className="gap-1"><Phone className="size-3"/> WhatsApp</Badge>;
            }
        });
    }

    return (
        <>
            <Head title={`${title} | Admin`} />

            <Container>
                <Toolbar>
                    <ToolbarHeading title={title} description={desc} />
                </Toolbar>
            </Container>

            <Container className="pb-10">
                <DynamicTable
                    columns={columns}
                    data={logs.data}
                    pageCount={logs.last_page}
                    onSearch={handleSearch}
                    searchPlaceholder="Search by recipient or company..."
                />
            </Container>
        </>
    );
}
