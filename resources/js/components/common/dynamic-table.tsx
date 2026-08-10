import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Copy,
    Download,
    Eye,
    FileCode,
    FileSpreadsheet,
    FileText,
    Printer,
    Search,
    X,
} from 'lucide-react';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardHeading,
    CardTable,
    CardTitle,
    CardToolbar,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type DynamicColumn<T> = {
    key: string;
    header: string;
    cell?: (item: T, index: number) => ReactNode;
    sortable?: boolean;
    sortValue?: (item: T) => string | number;
    hideable?: boolean;
    align?: 'left' | 'center' | 'right';
    className?: string;
};

export type DynamicTableProps<T> = {
    data: T[];
    columns: DynamicColumn<T>[];
    title?: string;
    description?: string;
    searchPlaceholder?: string;
    searchFilter?: (item: T, query: string) => boolean;
    actions?: ReactNode;
    exportFilename?: string;
    defaultPageSize?: number;
    pageSizeOptions?: number[];
    emptyMessage?: string;
};

export function DynamicTable<T extends Record<string, any>>({
    data,
    columns,
    title,
    description,
    searchPlaceholder = 'Search records...',
    searchFilter,
    actions,
    exportFilename = 'export',
    defaultPageSize = 5,
    pageSizeOptions = [5, 10, 25, 50, 100, 500, 1000],
    emptyMessage = 'No records found.',
}: DynamicTableProps<T>) {
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(defaultPageSize);
    const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);

    // Reset pagination when search or sort changes
    useEffect(() => {
        setPageIndex(0);
    }, [search, sortKey, sortOrder]);

    // Visible Columns
    const visibleColumns = useMemo(
        () => columns.filter((col) => !hiddenColumns.includes(col.key)),
        [columns, hiddenColumns]
    );

    // Exportable Columns (excludes actions column)
    const exportableColumns = useMemo(
        () => visibleColumns.filter((col) => col.key !== 'actions'),
        [visibleColumns]
    );

    // Hideable Columns
    const hideableColumns = useMemo(
        () => columns.filter((col) => col.hideable !== false),
        [columns]
    );

    // Default search filter (searches all string/number fields of an object)
    const defaultSearchFilter = (item: T, query: string): boolean => {
        const q = query.toLowerCase();
        return Object.values(item).some((val) => {
            if (val === null || val === undefined) return false;
            return String(val).toLowerCase().includes(q);
        });
    };

    // Filtered Data
    const filteredData = useMemo(() => {
        if (!search.trim()) return data;
        const filterFn = searchFilter ?? defaultSearchFilter;
        return data.filter((item) => filterFn(item, search));
    }, [data, search, searchFilter]);

    // Sorted Data
    const sortedData = useMemo(() => {
        if (!sortKey) return filteredData;
        const targetColumn = columns.find((col) => col.key === sortKey);
        if (!targetColumn) return filteredData;

        return [...filteredData].sort((a, b) => {
            let valA = targetColumn.sortValue ? targetColumn.sortValue(a) : a[sortKey];
            let valB = targetColumn.sortValue ? targetColumn.sortValue(b) : b[sortKey];

            if (valA === null || valA === undefined) valA = '';
            if (valB === null || valB === undefined) valB = '';

            if (typeof valA === 'string' && typeof valB === 'string') {
                return sortOrder === 'asc'
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            }

            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortKey, sortOrder, columns]);

    // Pagination calculations
    const totalCount = sortedData.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const fromIndex = totalCount === 0 ? 0 : pageIndex * pageSize + 1;
    const toIndex = Math.min((pageIndex + 1) * pageSize, totalCount);

    const paginatedData = useMemo(() => {
        const start = pageIndex * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, pageIndex, pageSize]);

    // Handle column sorting toggle
    const handleSort = (key: string) => {
        if (sortKey === key) {
            if (sortOrder === 'asc') {
                setSortOrder('desc');
            } else {
                setSortKey(null);
                setSortOrder('asc');
            }
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    // Toggle column visibility
    const toggleColumnVisibility = (key: string) => {
        setHiddenColumns((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };

    // Export CSV
    const exportCSV = () => {
        const headers = exportableColumns.map((col) => col.header).join(',');
        const rows = sortedData.map((item) =>
            exportableColumns
                ? exportableColumns
                      .map((col) => {
                          const val = item[col.key] ?? '';
                          return `"${String(val).replace(/"/g, '""')}"`;
                      })
                      .join(',')
                : ''
        );

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${exportFilename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Export Excel (.xls HTML Spreadsheet)
    const exportExcel = () => {
        const headers = exportableColumns.map((col) => `<th style="background-color: #3b82f6; color: #ffffff; font-weight: bold; padding: 8px; border: 1px solid #d1d5db;">${col.header}</th>`).join('');
        const rows = sortedData
            .map(
                (item, idx) =>
                    `<tr>${exportableColumns
                        .map((col) => {
                            let val = col.key === 'id' ? idx + 1 : (item[col.key] ?? '');
                            if (typeof val === 'boolean') val = val ? 'Yes' : 'No';
                            return `<td style="padding: 8px; border: 1px solid #d1d5db;">${String(val).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>`;
                        })
                        .join('')}</tr>`
            )
            .join('');

        const excelContent = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="utf-8" />
                <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${exportFilename}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
                <style>
                    table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 13px; }
                </style>
            </head>
            <body>
                <table>
                    <thead><tr>${headers}</tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </body>
            </html>
        `;

        const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${exportFilename}.xls`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Print & PDF Export
    const handlePrint = (isPdf = false) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const headers = exportableColumns
            .map((col) => `<th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left; background-color: #f1f5f9; font-weight: 600;">${col.header}</th>`)
            .join('');

        const rows = sortedData
            .map(
                (item, idx) =>
                    `<tr style="border-bottom: 1px solid #e2e8f0;">${exportableColumns
                        .map((col) => {
                            let val = col.key === 'id' ? idx + 1 : (item[col.key] ?? '');
                            if (typeof val === 'boolean') val = val ? 'Yes' : 'No';
                            return `<td style="border: 1px solid #e2e8f0; padding: 8px;">${String(val)}</td>`;
                        })
                        .join('')}</tr>`
            )
            .join('');

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title || exportFilename}</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #0f172a; }
                    h1 { font-size: 20px; margin-bottom: 4px; font-weight: 700; }
                    p { font-size: 13px; color: #64748b; margin-bottom: 16px; }
                    table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 12px; }
                    @media print {
                        body { padding: 0; }
                    }
                </style>
            </head>
            <body>
                <h1>${title || exportFilename.toUpperCase()}</h1>
                <p>Export Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} | Total Records: ${sortedData.length}</p>
                <table>
                    <thead><tr>${headers}</tr></thead>
                    <tbody>${rows}</tbody>
                </table>
                <script>
                    window.onload = function() {
                        window.print();
                        ${isPdf ? '' : 'window.close();'}
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    // Export JSON
    const exportJSON = () => {
        const exportData = sortedData.map((item) => {
            const obj: Record<string, any> = {};
            visibleColumns.forEach((col) => {
                obj[col.header] = item[col.key];
            });
            return obj;
        });

        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(exportData, null, 2)
        )}`;
        const link = document.createElement('a');
        link.setAttribute('href', jsonString);
        link.setAttribute('download', `${exportFilename}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Copy to Clipboard
    const copyToClipboard = () => {
        const headers = visibleColumns.map((col) => col.header).join('\t');
        const rows = sortedData.map((item) =>
            visibleColumns.map((col) => String(item[col.key] ?? '')).join('\t')
        );
        const text = [headers, ...rows].join('\n');
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card>
            <CardHeader>
                <CardHeading>
                    {title && <CardTitle>{title}</CardTitle>}
                    {description && <CardDescription>{description}</CardDescription>}
                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={searchPlaceholder}
                                className="ps-9 pe-8 w-60"
                            />
                            {search.length > 0 && (
                                <Button
                                    mode="icon"
                                    variant="ghost"
                                    className="absolute end-1.5 top-1/2 -translate-y-1/2 size-6"
                                    onClick={() => setSearch('')}
                                >
                                    <X className="size-3.5" />
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeading>

                <CardToolbar className="flex-wrap gap-2">
                    {/* Action Slot (e.g. Add Button) */}
                    {actions}

                    {/* Column Visibility Popover (Right side column) */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Eye className="size-4" />
                                Columns
                                {hiddenColumns.length > 0 && (
                                    <Badge size="sm" variant="outline">
                                        {columns.length - hiddenColumns.length}/{columns.length}
                                    </Badge>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-3" align="end">
                            <div className="space-y-3">
                                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Toggle Columns
                                </div>
                                <div className="space-y-2">
                                    {hideableColumns.map((col) => {
                                        const isChecked = !hiddenColumns.includes(col.key);
                                        return (
                                            <div key={col.key} className="flex items-center gap-2.5">
                                                <Checkbox
                                                    id={`col-${col.key}`}
                                                    checked={isChecked}
                                                    onCheckedChange={() => toggleColumnVisibility(col.key)}
                                                />
                                                <Label
                                                    htmlFor={`col-${col.key}`}
                                                    className="text-xs font-medium cursor-pointer"
                                                >
                                                    {col.header}
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Export Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Download className="size-4" />
                                Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Export & Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={exportExcel} className="gap-2 cursor-pointer">
                                <FileSpreadsheet className="size-4 text-emerald-600 dark:text-emerald-400" />
                                Export Excel (.xls)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={exportCSV} className="gap-2 cursor-pointer">
                                <FileSpreadsheet className="size-4 text-blue-600 dark:text-blue-400" />
                                Export CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePrint(true)} className="gap-2 cursor-pointer">
                                <FileCode className="size-4 text-rose-600 dark:text-rose-400" />
                                Export PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={exportJSON} className="gap-2 cursor-pointer">
                                <FileText className="size-4 text-amber-600 dark:text-amber-400" />
                                Export JSON
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handlePrint(false)} className="gap-2 cursor-pointer">
                                <Printer className="size-4 text-slate-600 dark:text-slate-400" />
                                Print Table
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={copyToClipboard} className="gap-2 cursor-pointer">
                                <Copy className="size-4 text-purple-600 dark:text-purple-400" />
                                {copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardToolbar>
            </CardHeader>

            <CardTable>
                <div className="overflow-x-auto">
                    <table className="w-full text-left align-middle text-sm text-foreground">
                        <thead>
                            <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {visibleColumns.map((col) => (
                                    <th
                                        key={col.key}
                                        className={cn(
                                            'px-5 py-3.5',
                                            col.align === 'center' && 'text-center',
                                            col.align === 'right' && 'text-right',
                                            col.sortable && 'cursor-pointer select-none hover:bg-muted/60',
                                            col.className
                                        )}
                                        onClick={() => col.sortable && handleSort(col.key)}
                                    >
                                        <div
                                            className={cn(
                                                'inline-flex items-center gap-1.5',
                                                col.align === 'center' && 'justify-center',
                                                col.align === 'right' && 'justify-end'
                                            )}
                                        >
                                            <span>{col.header}</span>
                                            {col.sortable && (
                                                <span className="text-muted-foreground">
                                                    {sortKey === col.key ? (
                                                        sortOrder === 'asc' ? (
                                                            <ArrowUp className="size-3.5 text-primary" />
                                                        ) : (
                                                            <ArrowDown className="size-3.5 text-primary" />
                                                        )
                                                    ) : (
                                                        <ArrowUpDown className="size-3.5 opacity-40" />
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {paginatedData.map((item, index) => (
                                <tr key={item.id ?? index} className="transition-colors hover:bg-muted/30">
                                    {visibleColumns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={cn(
                                                'px-5 py-4',
                                                col.align === 'center' && 'text-center',
                                                col.align === 'right' && 'text-right',
                                                col.className
                                            )}
                                        >
                                            {col.cell
                                                ? col.cell(item, pageIndex * pageSize + index)
                                                : item[col.key] ?? '-'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {paginatedData.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={visibleColumns.length}
                                        className="px-5 py-10 text-center text-sm text-muted-foreground"
                                    >
                                        {emptyMessage}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardTable>

            {/* Pagination Footer */}
            <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-border px-5 py-3">
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                    <span>Rows per page</span>
                    <Select
                        value={String(pageSize)}
                        onValueChange={(val) => {
                            setPageSize(Number(val));
                            setPageIndex(0);
                        }}
                    >
                        <SelectTrigger size="sm" className="w-16">
                            <SelectValue placeholder={String(pageSize)} />
                        </SelectTrigger>
                        <SelectContent side="top" className="min-w-[70px]">
                            {pageSizeOptions.map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <span className="text-xs text-muted-foreground font-medium">
                        {fromIndex} - {toIndex} of {totalCount}
                    </span>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            mode="icon"
                            disabled={pageIndex === 0}
                            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                            className="size-7 p-0"
                        >
                            <ChevronLeft className="size-4" />
                        </Button>

                        {Array.from({ length: totalPages }, (_, i) => i).map((i) => (
                            <Button
                                key={i}
                                variant="ghost"
                                size="sm"
                                mode="icon"
                                onClick={() => setPageIndex(i)}
                                className={cn(
                                    'size-7 p-0 text-xs text-muted-foreground',
                                    pageIndex === i &&
                                        'bg-accent font-bold text-accent-foreground shadow-xs'
                                )}
                            >
                                {i + 1}
                            </Button>
                        ))}

                        <Button
                            variant="ghost"
                            size="sm"
                            mode="icon"
                            disabled={pageIndex >= totalPages - 1 || totalCount === 0}
                            onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
                            className="size-7 p-0"
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
