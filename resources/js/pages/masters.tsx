import { Head, Link } from '@inertiajs/react';
import { Download, FileSpreadsheet, FileText, Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    DataTableCard,
    type DataTableBulkAction,
    type DataTableBulkActionGroup,
    type DataTableColumn,
    type DataTableFilter,
    type DataTableMenuOption,
    type DataTableRowAction,
} from '@/components/admin/data-table';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type MasterStatus = 'Active' | 'Draft' | 'Archived';

type MasterRecord = {
    id: number;
    name: string;
    type: string;
    code: string;
    status: MasterStatus;
    owner: string;
    updatedAt: string;
};

const initialRows: MasterRecord[] = [
    {
        id: 1,
        name: 'Business Category',
        type: 'Reference',
        code: 'BC-001',
        status: 'Active',
        owner: 'Admin',
        updatedAt: '2 hrs ago',
    },
    {
        id: 2,
        name: 'Languages',
        type: 'Reference',
        code: 'LAN-002',
        status: 'Active',
        owner: 'Ops Team',
        updatedAt: '1 day ago',
    },
    {
        id: 3,
        name: 'India',
        type: 'Country',
        code: 'IND',
        status: 'Draft',
        owner: 'Admin',
        updatedAt: '4 hrs ago',
    },
    {
        id: 4,
        name: 'Maharashtra',
        type: 'State',
        code: 'MH',
        status: 'Active',
        owner: 'Data Team',
        updatedAt: '5 hrs ago',
    },
    {
        id: 5,
        name: 'Mumbai',
        type: 'City',
        code: 'MUM',
        status: 'Archived',
        owner: 'Data Team',
        updatedAt: '1 week ago',
    },
    {
        id: 6,
        name: 'Andheri',
        type: 'Area',
        code: 'AND',
        status: 'Active',
        owner: 'Ops Team',
        updatedAt: '2 days ago',
    },
    {
        id: 7,
        name: 'Pro Plan',
        type: 'Plan',
        code: 'PLN-20',
        status: 'Active',
        owner: 'Finance',
        updatedAt: '3 hrs ago',
    },
    {
        id: 8,
        name: 'Enterprise Plan',
        type: 'Plan',
        code: 'PLN-40',
        status: 'Draft',
        owner: 'Finance',
        updatedAt: '1 hr ago',
    },
];

const statusClasses: Record<MasterStatus, string> = {
    Active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    Draft: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    Archived: 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300',
};

function escapeCsv(value: string | number): string {
    return `"${String(value).replaceAll('"', '""')}"`;
}

export default function MastersPage() {
    const [rows, setRows] = useState(initialRows);
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | MasterStatus>('All');

    const filteredRows = useMemo(() => {
        const normalized = query.toLowerCase();

        return rows.filter((row) => {
            const matchesQuery = [row.name, row.type, row.code, row.owner, row.status]
                .join(' ')
                .toLowerCase()
                .includes(normalized);
            const matchesStatus = statusFilter === 'All' || row.status === statusFilter;

            return matchesQuery && matchesStatus;
        });
    }, [query, rows, statusFilter]);

    const deleteRow = (id: number) => {
        setRows((current) => current.filter((row) => row.id !== id));
    };

    const deleteSelected = (selectedIds: Array<string | number>) => {
        setRows((current) => current.filter((row) => !selectedIds.includes(row.id)));
    };

    const changeSelectedStatus = (status: MasterStatus, selectedIds: Array<string | number>) => {
        setRows((current) => current.map((row) => (selectedIds.includes(row.id) ? { ...row, status } : row)));
    };

    const downloadDemoImport = () => {
        const csv = [
            ['Name', 'Type', 'Code', 'Status', 'Owner', 'Updated At'].join(','),
            ['Business Category', 'Reference', 'BC-001', 'Active', 'Admin', 'Just now'].join(','),
            ['Languages', 'Reference', 'LAN-002', 'Draft', 'Admin', 'Just now'].join(','),
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'demo-import.csv';
        link.click();
        URL.revokeObjectURL(url);
    };

    const exportCsv = () => {
        const csv = [
            ['ID', 'Name', 'Type', 'Code', 'Status', 'Owner', 'Updated At'].join(','),
            ...rows.map((row) => [row.id, row.name, row.type, row.code, row.status, row.owner, row.updatedAt].map(escapeCsv).join(',')),
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'master-records.csv';
        link.click();
        URL.revokeObjectURL(url);
    };

    const importCsv = async (file: File) => {
        const text = await file.text();
        const lines = text
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean);

        if (lines.length < 2) {
            return;
        }

        const [, ...records] = lines;

        const importedRows = records.map((line, index) => {
            const [name, type, code, status, owner, updatedAt] = line.split(',').map((value) => value.trim());

            return {
                id: Date.now() + index,
                name: name || `Imported ${index + 1}`,
                type: type || 'Reference',
                code: code || `IMP-${index + 1}`,
                status: (status as MasterStatus) || 'Draft',
                owner: owner || 'Imported',
                updatedAt: updatedAt || 'Just now',
            };
        });

        setRows((current) => [...importedRows, ...current]);
    };

    const columns: DataTableColumn<MasterRecord>[] = [
        {
            id: 'name',
            header: 'Name',
            cell: (row) => (
                <>
                    <p className="font-black text-slate-950 dark:text-white">{row.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Master reference</p>
                </>
            ),
        },
        {
            id: 'type',
            header: 'Type',
            cell: (row) => <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{row.type}</span>,
        },
        {
            id: 'code',
            header: 'Code',
            cell: (row) => <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{row.code}</span>,
        },
        {
            id: 'owner',
            header: 'Owner',
            cell: (row) => <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{row.owner}</span>,
        },
        {
            id: 'status',
            header: 'Status',
            cell: (row) => (
                <span className={cn('rounded-full px-3 py-1 text-xs font-black', statusClasses[row.status])}>{row.status}</span>
            ),
        },
        {
            id: 'updatedAt',
            header: 'Updated',
            cell: (row) => <span className="text-sm text-slate-500 dark:text-slate-400">{row.updatedAt}</span>,
        },
    ];

    const filters: DataTableFilter[] = [
        {
            id: 'status',
            value: statusFilter,
            onChange: (value) => setStatusFilter(value as 'All' | MasterStatus),
            options: [
                { value: 'All', label: 'All statuses' },
                { value: 'Active', label: 'Active' },
                { value: 'Draft', label: 'Draft' },
                { value: 'Archived', label: 'Archived' },
            ],
        },
    ];

    const bulkActionGroups: DataTableBulkActionGroup[] = [
        {
            id: 'change-status',
            label: 'Change status',
            options: [
                { value: 'Active', label: 'Set Active' },
                { value: 'Draft', label: 'Set Draft' },
                { value: 'Archived', label: 'Set Archived' },
            ],
            onSelect: (value, selectedIds) => changeSelectedStatus(value as MasterStatus, selectedIds),
        },
    ];

    const bulkActions: DataTableBulkAction[] = [
        {
            id: 'delete',
            label: 'Delete',
            variant: 'destructive',
            icon: <Trash2 className="mr-1 size-4" />,
            onClick: deleteSelected,
        },
    ];

    const exportOptions: DataTableMenuOption[] = [
        {
            id: 'excel',
            label: 'Excel (.xlsx)',
            icon: <FileSpreadsheet className="size-4 text-green-600" />,
            onClick: exportCsv,
        },
        {
            id: 'csv',
            label: 'CSV (.csv)',
            icon: <FileText className="size-4 text-blue-600" />,
            onClick: exportCsv,
        },
        {
            id: 'pdf',
            label: 'PDF (.pdf)',
            icon: <FileText className="size-4 text-red-600" />,
            onClick: () => window.print(),
        },
    ];

    const importOptions: DataTableMenuOption[] = [
        {
            id: 'demo',
            label: 'Demo Import (Download)',
            icon: <Download className="size-4 text-blue-600" />,
            onClick: downloadDemoImport,
        },
    ];

    const rowActions: DataTableRowAction<MasterRecord>[] = [
        {
            id: 'edit',
            label: 'Edit',
            icon: <Pencil className="size-4" aria-hidden="true" />,
            href: (row) => `/masters/${row.id}/edit`,
        },
        {
            id: 'delete',
            label: 'Delete',
            icon: <Trash2 className="size-4" aria-hidden="true" />,
            variant: 'destructive',
            onClick: (row) => deleteRow(row.id),
        },
    ];

    return (
        <>
            <Head title="Master Records | NexLink" />
            <div className="space-y-6">
                <PageHeader
                    title="Master Records"
                    description="Manage shared reference records with import, export, pagination, and bulk actions."
                    actions={
                        <>
                            <Button asChild variant="outline" className="rounded-full border-slate-200 bg-white dark:bg-white/5">
                                <Link href="/dashboard">Back to dashboard</Link>
                            </Button>
                            <Button asChild className="rounded-full bg-nexlink-primary px-5 text-white hover:bg-nexlink-primary-dark">
                                <Link href="/masters/create">
                                    <Plus className="size-4" aria-hidden="true" />
                                    Create master
                                </Link>
                            </Button>
                        </>
                    }
                />

                <DataTableCard
                    data={filteredRows}
                    columns={columns}
                    getRowId={(row) => row.id}
                    getRowLabel={(row) => row.name}
                    searchValue={query}
                    onSearchChange={setQuery}
                    searchPlaceholder="Search rows"
                    filters={filters}
                    bulkActions={bulkActions}
                    bulkActionGroups={bulkActionGroups}
                    exportOptions={exportOptions}
                    importOptions={importOptions}
                    onImportFile={importCsv}
                    rowActions={rowActions}
                    emptyMessage="No master records match the current filters."
                    minWidth="860px"
                    resetPageOn={[query, statusFilter]}
                />
            </div>
        </>
    );
}
