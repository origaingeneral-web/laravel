import type { ReactNode } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

/**
 * Change modal widths here. Pass `size` to <AdminModal /> or override with `contentClassName`.
 */
export const adminModalSizes = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    '3xl': 'sm:max-w-3xl',
    '4xl': 'sm:max-w-4xl',
    full: 'sm:max-w-[calc(100%-2rem)]',
} as const;

export type AdminModalSize = keyof typeof adminModalSizes;

type AdminModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    size?: AdminModalSize;
    contentClassName?: string;
    children: ReactNode;
    footer?: ReactNode;
};

export function AdminModal({
    open,
    onOpenChange,
    title,
    description,
    size = 'lg',
    contentClassName,
    children,
    footer,
}: AdminModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn('rounded-2xl', adminModalSizes[size], contentClassName)}>
                <DialogHeader>
                    <DialogTitle className="text-xl font-black text-slate-950 dark:text-white">{title}</DialogTitle>
                    {description ? (
                        <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
                            {description}
                        </DialogDescription>
                    ) : null}
                </DialogHeader>

                <div className="space-y-4">{children}</div>

                {footer ? <DialogFooter className="gap-2 sm:gap-2">{footer}</DialogFooter> : null}
            </DialogContent>
        </Dialog>
    );
}
