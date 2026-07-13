import { useEffect, useMemo, useState } from 'react';
import type { RowId } from './types';

type UseDataTableOptions<T> = {
    data: T[];
    getRowId: (row: T) => RowId;
    initialPage?: number;
    initialPageSize?: number;
    pageSizeOptions?: number[];
    resetPageOn?: ReadonlyArray<unknown>;
};

type UseDataTableResult<T> = {
    page: number;
    pageSize: number;
    selectedIds: RowId[];
    currentPage: number;
    totalPages: number;
    paginatedData: T[];
    selectAllChecked: boolean;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setSelectedIds: (ids: RowId[]) => void;
    toggleSelection: (id: RowId) => void;
    toggleSelectAll: () => void;
    clearSelection: () => void;
    pagination: {
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalItems: number;
        onPageChange: (page: number) => void;
        onPageSizeChange: (size: number) => void;
        pageSizeOptions: number[];
    };
};

export function useDataTable<T>({
    data,
    getRowId,
    initialPage = 1,
    initialPageSize = 5,
    pageSizeOptions = [5, 10, 20],
    resetPageOn = [],
}: UseDataTableOptions<T>): UseDataTableResult<T> {
    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [selectedIds, setSelectedIds] = useState<RowId[]>([]);

    useEffect(() => {
        setPage(1);
    }, resetPageOn);

    const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const paginatedData = useMemo(
        () => data.slice((currentPage - 1) * pageSize, currentPage * pageSize),
        [currentPage, data, pageSize],
    );

    const selectAllChecked =
        paginatedData.length > 0 && paginatedData.every((row) => selectedIds.includes(getRowId(row)));

    const toggleSelection = (id: RowId) => {
        setSelectedIds((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
    };

    const toggleSelectAll = () => {
        const ids = paginatedData.map(getRowId);

        setSelectedIds((current) => {
            const next = current.filter((id) => !ids.includes(id));

            return ids.every((id) => current.includes(id)) ? next : [...current, ...ids];
        });
    };

    const clearSelection = () => {
        setSelectedIds([]);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setPage(1);
    };

    return {
        page,
        pageSize,
        selectedIds,
        currentPage,
        totalPages,
        paginatedData,
        selectAllChecked,
        setPage,
        setPageSize,
        setSelectedIds,
        toggleSelection,
        toggleSelectAll,
        clearSelection,
        pagination: {
            currentPage,
            totalPages,
            pageSize,
            totalItems: data.length,
            onPageChange: setPage,
            onPageSizeChange: handlePageSizeChange,
            pageSizeOptions,
        },
    };
}
