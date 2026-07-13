import type { ReactNode } from 'react';

export type RowId = string | number;

export type DataTableColumn<T> = {
    id: string;
    header: string;
    cell: (row: T) => ReactNode;
    className?: string;
    headerClassName?: string;
};

export type DataTableFilter = {
    id: string;
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (value: string) => void;
    className?: string;
};

export type DataTableBulkAction = {
    id: string;
    label: string;
    onClick: (selectedIds: RowId[]) => void;
    variant?: 'default' | 'destructive';
    icon?: ReactNode;
};

export type DataTableBulkActionGroup = {
    id: string;
    label: string;
    options: Array<{ value: string; label: string }>;
    onSelect: (value: string, selectedIds: RowId[]) => void;
};

export type DataTableRowAction<T> = {
    id: string;
    label: string;
    icon?: ReactNode;
    onClick?: (row: T) => void;
    href?: (row: T) => string;
    variant?: 'default' | 'destructive';
};

export type DataTableMenuOption = {
    id: string;
    label: string;
    icon?: ReactNode;
    onClick: () => void;
};

export type DataTablePaginationState = {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    pageSizeOptions?: number[];
};
