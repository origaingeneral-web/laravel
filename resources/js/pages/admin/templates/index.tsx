import { Link, Head, router } from '@inertiajs/react';
import { Plus, Mail, MessageSquare, Phone, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { Toolbar, ToolbarHeading, ToolbarActions } from '@/layouts/demo1/components/toolbar';
import { DynamicTable } from '@/components/common/dynamic-table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function Index({ templates, filters }: any) {
    const indexUrl = filters.channel ? `/admin/templates/${filters.channel}` : '/admin/templates';

    const handleSearch = (search: string) => {
        router.get(indexUrl, { search }, { preserveState: true, replace: true });
    };

    const deleteTemplate = (id: number) => {
        if (confirm('Are you sure you want to delete this template?')) {
            router.delete(`/admin/templates/${id}`);
        }
    };

    const columns = [
        { key: 'name', header: 'Template Name' },
        { 
            key: 'purpose', 
            header: 'Purpose',
            cell: (item: any) => <Badge variant="secondary" className="capitalize">{item.purpose.replace('_', ' ')}</Badge>
        },
        {
            key: 'channels',
            header: 'Active Channels',
            cell: (item: any) => (
                <div className="flex gap-2">
                    {item.is_email_active && <Badge variant="outline" className="gap-1"><Mail className="size-3"/> Email</Badge>}
                    {item.is_sms_active && <Badge variant="outline" className="gap-1"><MessageSquare className="size-3"/> SMS</Badge>}
                    {item.is_whatsapp_active && <Badge variant="outline" className="gap-1"><Phone className="size-3"/> WhatsApp</Badge>}
                </div>
            )
        },
        {
            key: 'actions',
            header: '',
            cell: (item: any) => {
                const id = item.id;
                return (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={`/admin/templates/${id}/edit`} className="flex items-center cursor-pointer">
                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => deleteTemplate(id)} className="text-red-600 focus:text-red-600 cursor-pointer">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            }
        }
    ];

    return (
        <>
            <Head title="Notification Templates | Admin" />

            <Container>
                <Toolbar>
                    <ToolbarHeading title="Notification Templates" description="Manage unified dynamic messages for email, SMS, and WhatsApp." />
                    <ToolbarActions>
                        <Button asChild className="gap-2">
                            <Link href="/admin/templates/create">
                                <Plus className="size-4" />
                                Add Template
                            </Link>
                        </Button>
                    </ToolbarActions>
                </Toolbar>
            </Container>

            <Container className="pb-10">
                <DynamicTable
                    columns={columns}
                    data={templates.data}
                    pageCount={templates.last_page}
                    onSearch={handleSearch}
                    searchPlaceholder="Search templates by name or purpose..."
                />
            </Container>
        </>
    );
}
