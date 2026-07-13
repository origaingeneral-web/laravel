import type { ReactNode } from 'react';
import { DataTable } from './data-table';
import { DataTableToolbar } from './data-table-toolbar';
import type {
    DataTableBulkAction,
    DataTableBulkActionGroup,
    DataTableColumn,
    DataTableFilter,
    DataTableMenuOption,
    DataTableRowAction,
    RowId,
} from './types';
import { useDataTable } from './use-data-table';

type DataTableCardProps<T> = {
    data: T[];
    columns: DataTableColumn<T>[];
    getRowId: (row: T) => RowId;
    getRowLabel?: (row: T) => string;
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    filters?: DataTableFilter[];
    bulkActions?: DataTableBulkAction[];
    bulkActionGroups?: DataTableBulkActionGroup[];
    exportOptions?: DataTableMenuOption[];
    importOptions?: DataTableMenuOption[];
    onImportFile?: (file: File) => void;
    importAccept?: string;
    rowActions?: DataTableRowAction<T>[];
    emptyMessage?: string;
    minWidth?: string;
    selectable?: boolean;
    initialPageSize?: number;
    pageSizeOptions?: number[];
    resetPageOn?: ReadonlyArray<unknown>;
    showExport?: boolean;
    showImport?: boolean;
    toolbarTrailing?: ReactNode;
    className?: string;
};

export function DataTableCard<T>({
    data,
    columns,
    getRowId,
    getRowLabel,
    searchValue,
    onSearchChange,
    searchPlaceholder,
    filters,
    bulkActions,
    bulkActionGroups,
    exportOptions,
    importOptions,
    onImportFile,
    importAccept,
    rowActions,
    emptyMessage,
    minWidth,
    selectable = true,
    initialPageSize,
    pageSizeOptions,
    resetPageOn,
    showExport,
    showImport,
    toolbarTrailing,
    className,
}: DataTableCardProps<T>) {
    const table = useDataTable({
        data,
        getRowId,
        initialPageSize,
        pageSizeOptions,
        resetPageOn,
    });

    const wrappedBulkActions = bulkActions?.map((action) => ({
        ...action,
        onClick: (selectedIds: RowId[]) => {
            action.onClick(selectedIds);

            if (action.variant === 'destructive') {
                table.clearSelection();
            }
        },
    }));

    return (
        <section className={className ?? 'admin-card'}>
            <DataTableToolbar
                searchValue={searchValue}
                onSearchChange={onSearchChange}
                searchPlaceholder={searchPlaceholder}
                filters={filters}
                selectedCount={table.selectedIds.length}
                selectedIds={table.selectedIds}
                onClearSelection={table.clearSelection}
                bulkActions={wrappedBulkActions}
                bulkActionGroups={bulkActionGroups}
                exportOptions={exportOptions}
                importOptions={importOptions}
                onImportFile={onImportFile}
                importAccept={importAccept}
                showExport={showExport}
                showImport={showImport}
                trailing={toolbarTrailing}
            />

            <DataTable
                data={table.paginatedData}
                columns={columns}
                getRowId={getRowId}
                getRowLabel={getRowLabel}
                selectable={selectable}
                selectedIds={table.selectedIds}
                selectAllChecked={table.selectAllChecked}
                onToggleSelection={table.toggleSelection}
                onToggleSelectAll={table.toggleSelectAll}
                rowActions={rowActions}
                emptyMessage={emptyMessage}
                minWidth={minWidth}
                pagination={table.pagination}
            />
        </section>
    );
}
