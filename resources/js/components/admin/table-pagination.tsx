import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useId, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TablePaginationProps = {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    pageSizeOptions?: number[];
};

function getVisiblePages(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages: Array<number | 'ellipsis'> = [1];

    if (currentPage > 3) {
        pages.push('ellipsis');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let page = start; page <= end; page += 1) {
        pages.push(page);
    }

    if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
    }

    pages.push(totalPages);

    return pages;
}

export function TablePagination({
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [5, 10, 20],
}: TablePaginationProps) {
    const gotoInputId = useId();
    const [gotoValue, setGotoValue] = useState(String(currentPage));
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
    const visiblePages = getVisiblePages(currentPage, totalPages);

    useEffect(() => {
        setGotoValue(String(currentPage));
    }, [currentPage]);

    const handleGotoSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextPage = Number(gotoValue);

        if (!Number.isFinite(nextPage)) {
            return;
        }

        onPageChange(Math.min(totalPages, Math.max(1, Math.trunc(nextPage))));
    };

    return (
        <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 dark:border-white/10 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:gap-4">
                <span>
                    Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{startItem}-{endItem}</span> of{' '}
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{totalItems}</span>
                </span>
                <div className="flex items-center gap-2">
                    <span>Rows per page</span>
                    <select
                        value={pageSize}
                        onChange={(event) => onPageSizeChange(Number(event.target.value))}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                    >
                        {pageSizeOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <div className="flex flex-wrap items-center gap-1">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-9 rounded-full border-slate-200 bg-white dark:bg-white/5"
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                    >
                        <ArrowLeft className="size-4" aria-hidden="true" />
                    </Button>

                    {visiblePages.map((page, index) =>
                        page === 'ellipsis' ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-sm font-semibold text-slate-400">
                                ...
                            </span>
                        ) : (
                            <Button
                                key={page}
                                type="button"
                                variant={page === currentPage ? 'default' : 'outline'}
                                className={cn(
                                    'size-9 rounded-full px-0 text-sm font-bold',
                                    page === currentPage
                                        ? 'bg-nexlink-primary text-white hover:bg-nexlink-primary-dark'
                                        : 'border-slate-200 bg-white dark:bg-white/5',
                                )}
                                onClick={() => onPageChange(page)}
                                aria-label={`Go to page ${page}`}
                                aria-current={page === currentPage ? 'page' : undefined}
                            >
                                {page}
                            </Button>
                        ),
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-9 rounded-full border-slate-200 bg-white dark:bg-white/5"
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                    >
                        <ArrowRight className="size-4" aria-hidden="true" />
                    </Button>
                </div>

                <form onSubmit={handleGotoSubmit} className="flex items-center gap-2">
                    <input
                        id={gotoInputId}
                        type="number"
                        min={1}
                        max={totalPages}
                        value={gotoValue}
                        onChange={(event) => setGotoValue(event.target.value)}
                        className="w-16 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-center text-sm text-slate-700 outline-none transition focus:border-nexlink-primary focus:ring-4 focus:ring-nexlink-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                    />
                    <Button type="submit" variant="outline" className="rounded-full border-slate-200 bg-white dark:bg-white/5">
                        Go
                    </Button>
                </form>
            </div>
        </div>
    );
}
