import type { ReactNode } from 'react';

type Props = {
    title: string;
    description?: string;
    actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: Props) {
    return (
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <h2  className="mt-1 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                    {title}
                </h2>
                {description && (
                    <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400 sm:text-base">{description}</p>
                )}
            </div>
            {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
        </header>
    );
}
