import { Link } from '@inertiajs/react';
import { EllipsisVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { DataTableRowAction } from './types';

type DataTableRowActionsProps<T> = {
    row: T;
    actions: DataTableRowAction<T>[];
    rowLabel?: string;
};

export function DataTableRowActions<T>({ row, actions, rowLabel = 'row' }: DataTableRowActionsProps<T>) {
    if (actions.length === 0) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white"
                    aria-label={`Open actions for ${rowLabel}`}
                >
                    <EllipsisVertical className="size-4" aria-hidden="true" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40 rounded-2xl p-2">
                {actions.map((action) => {
                    const content = (
                        <>
                            {action.icon}
                            {action.label}
                        </>
                    );

                    if (action.href) {
                        return (
                            <DropdownMenuItem key={action.id} asChild className="rounded-xl px-3 py-2">
                                <Link href={action.href(row)}>{content}</Link>
                            </DropdownMenuItem>
                        );
                    }

                    return (
                        <DropdownMenuItem
                            key={action.id}
                            variant={action.variant === 'destructive' ? 'destructive' : 'default'}
                            className="rounded-xl px-3 py-2"
                            onClick={() => action.onClick?.(row)}
                        >
                            {content}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
