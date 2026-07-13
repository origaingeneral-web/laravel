import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { TablePagination } from '@/components/admin/table-pagination';
import { DataTableRowActions } from './data-table-row-actions';
import type { DataTableColumn, DataTablePaginationState, DataTableRowAction, RowId } from './types';

type DataTableProps<T> = {
    data: T[];
    columns: DataTableColumn<T>[];
    getRowId: (row: T) => RowId;
    getRowLabel?: (row: T) => string;
    selectable?: boolean;
    selectedIds?: RowId[];
    selectAllChecked?: boolean;
    onToggleSelection?: (id: RowId) => void;
    onToggleSelectAll?: () => void;
    rowActions?: DataTableRowAction<T>[];
    emptyMessage?: string;
    minWidth?: string;
    pagination?: DataTablePaginationState;
};

export function DataTable<T>({
    data,
    columns,
    getRowId,
    getRowLabel,
    selectable = false,
    selectedIds = [],
    selectAllChecked = false,
    onToggleSelection,
    onToggleSelectAll,
    rowActions = [],
    emptyMessage = 'No records found.',
    minWidth = '760px',
    pagination,
}: DataTableProps<T>) {
    const hasRowActions = rowActions.length > 0;

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full text-left" style={{ minWidth }}>
                    <thead>
                        <tr className="bg-slate-50 text-xs font-black uppercase tracking-[0.18em] text-slate-400 dark:bg-white/5">
                            {selectable && (
                                <th className="px-5 py-4">
                                    <Checkbox
                                        checked={selectAllChecked}
                                        onCheckedChange={onToggleSelectAll}
                                        aria-label="Select all rows"
                                    />
                                </th>
                            )}
                            {columns.map((column) => (
                                <th key={column.id} className={cn('px-5 py-4', column.headerClassName)}>
                                    {column.header}
                                </th>
                            ))}
                            {hasRowActions && <th className="px-5 py-4 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                        {data.map((row) => {
                            const rowId = getRowId(row);
                            const rowLabel = getRowLabel?.(row) ?? String(rowId);

                            return (
                                <tr key={rowId} className="transition hover:bg-slate-50/80 dark:hover:bg-white/5">
                                    {selectable && (
                                        <td className="px-5 py-4">
                                            <Checkbox
                                                checked={selectedIds.includes(rowId)}
                                                onCheckedChange={() => onToggleSelection?.(rowId)}
                                                aria-label={`Select ${rowLabel}`}
                                            />
                                        </td>
                                    )}
                                    {columns.map((column) => (
                                        <td key={column.id} className={cn('px-5 py-4', column.className)}>
                                            {column.cell(row)}
                                        </td>
                                    ))}
                                    {hasRowActions && (
                                        <td className="px-5 py-4 text-right">
                                            <DataTableRowActions row={row} actions={rowActions} rowLabel={rowLabel} />
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {data.length === 0 && (
                <div className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">{emptyMessage}</div>
            )}

            {pagination && (
                <TablePagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    pageSize={pagination.pageSize}
                    totalItems={pagination.totalItems}
                    onPageChange={pagination.onPageChange}
                    onPageSizeChange={pagination.onPageSizeChange}
                    pageSizeOptions={pagination.pageSizeOptions}
                />
            )}
        </>
    );
}
