import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Plus, EllipsisVertical, ShieldAlert, LifeBuoy, User, SquarePen, KeyRound, LogIn, Monitor, Trash2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/components/toolbar';
import { DynamicTable } from '@/components/common/dynamic-table';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Index({ companies, filters, statusOptions }: any) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(companies?.data?.map((c: any) => c.id) || []);
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelect = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds((prev) => [...prev, id]);
        } else {
            setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
        }
    };

    const isAllSelected = companies?.data?.length > 0 && selectedIds.length === companies?.data?.length;

    const columns = [
        {
            key: 'select',
            header: (
                <div className="flex items-center justify-center">
                    <Checkbox 
                        className="translate-y-[1px]" 
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                    />
                </div>
            ),
            align: 'center',
            hideable: false,
            cell: (item: any) => (
                <Checkbox 
                    className="translate-y-[2px]" 
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={(c: boolean) => handleSelect(item.id, c)}
                />
            ),
        },
        {
            key: 'id',
            header: '#',
            align: 'center',
            sortable: true,
            cell: (_item: any, index: number) => <span className="text-muted-foreground font-medium">{index + 1}</span>,
        },
        { key: 'company_code', header: 'Code', sortable: true },
        { key: 'company_name', header: 'Name', sortable: true },
        { key: 'email', header: 'Email', sortable: true },
        { key: 'mobile', header: 'Mobile', sortable: true },
        { 
            key: 'status', 
            header: 'Status',
            cell: (item: any) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.status === 1 ? 'Active' : 'Inactive'}
                </span>
            )
        },
        { key: 'created_at', header: 'Created At', sortable: true },
        {
            key: 'actions',
            header: 'Action',
            align: 'right',
            hideable: false,
            cell: (item: any) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button mode="icon" variant="ghost" className="size-8">
                            <EllipsisVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="cursor-pointer gap-2"><ShieldAlert className="size-4" /> Update Access</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2"><LifeBuoy className="size-4" /> Support Given</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2"><User className="size-4" /> Profile</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2"><SquarePen className="size-4" /> Update</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2"><KeyRound className="size-4" /> Reset Password</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2"><LogIn className="size-4" /> Login To Panel</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2"><Monitor className="size-4" /> With All Access Login</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer gap-2 text-destructive" variant="destructive">
                            <Trash2 className="size-4" /> Delete
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer gap-2"><Send className="size-4" /> Resend SMS</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <>
            <Head title="Companies | Admin" />
            
            <Container>
                <Toolbar>
                    <ToolbarHeading
                        title="Companies"
                        description="Manage all onboarded companies in the system."
                    />
                    <ToolbarActions>
                        <Button asChild className="gap-2 shadow-xs">
                            <Link href="/admin/companies/create">
                                <Plus className="size-4" />
                                Add Company
                            </Link>
                        </Button>
                    </ToolbarActions>
                </Toolbar>
            </Container>

            <Container>
                <DynamicTable
                    data={companies?.data || []}
                    columns={columns}
                    searchPlaceholder="Search companies..."
                    exportFilename="companies"
                />
            </Container>
        </>
    );
}
