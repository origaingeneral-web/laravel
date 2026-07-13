import { Head } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/admin/page-header';
import { StatCard } from '@/components/admin/stat-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ModuleStat = {
    label: string;
    value: string;
    trend?: string;
    icon: LucideIcon;
    tone?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
};

export type ModuleRow = {
    name: string;
    meta: string;
    owner: string;
    value: string;
    status: 'Active' | 'Pending' | 'Completed' | 'In Progress' | 'Disabled' | 'Review';
};

export type ModulePageConfig = {
    title: string;
    description: string;
    ctaLabel: string;
    stats: ModuleStat[];
    rows: ModuleRow[];
};

const statusClasses: Record<ModuleRow['status'], string> = {
    Active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    Pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    Completed: 'bg-nexlink-primary/10 text-nexlink-primary dark:bg-white/10 dark:text-white',
    'In Progress': 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
    Disabled: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
    Review: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300',
};

export function ModulePage({ config }: { config: ModulePageConfig }) {
    const [query, setQuery] = useState('');
    const filteredRows = useMemo(
        () =>
            config.rows.filter((row) =>
                [row.name, row.meta, row.owner, row.status].join(' ').toLowerCase().includes(query.toLowerCase())
            ),
        [config.rows, query]
    );

    return (
        <>
            <Head title={`${config.title} | NexLink`} />
            <div className="space-y-6">
                <PageHeader
                    title={config.title}
                    description={config.description}
                    actions={
                        <>
                            <Button variant="outline" className="rounded-full border-slate-200 bg-white dark:bg-white/5">
                                Export
                            </Button>
                            <Button className="rounded-full bg-nexlink-primary px-5 text-white hover:bg-nexlink-primary-dark">
                                <Plus className="size-4" aria-hidden="true" />
                                {config.ctaLabel}
                            </Button>
                        </>
                    }
                />

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {config.stats.map((stat) => (
                        <StatCard key={stat.label} {...stat} />
                    ))}
                </section>

                <section className="admin-card overflow-hidden">
                    <div className="flex flex-col gap-4 border-b border-slate-100 p-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-black text-slate-950 dark:text-white">Recent records</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Search, review, and act on the latest module activity.</p>
                        </div>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-nexlink-primary focus:ring-4 focus:ring-nexlink-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                                placeholder="Search records"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left">
                            <thead>
                                <tr className="bg-slate-50 text-xs font-black uppercase tracking-[0.18em] text-slate-400 dark:bg-white/5">
                                    <th className="px-5 py-4">Name</th>
                                    <th className="px-5 py-4">Owner</th>
                                    <th className="px-5 py-4">Value</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                                {filteredRows.map((row) => (
                                    <tr key={`${row.name}-${row.owner}`} className="transition hover:bg-slate-50/80 dark:hover:bg-white/5">
                                        <td className="px-5 py-4">
                                            <p className="font-black text-slate-950 dark:text-white">{row.name}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{row.meta}</p>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">{row.owner}</td>
                                        <td className="px-5 py-4 text-sm font-black text-slate-950 dark:text-white">{row.value}</td>
                                        <td className="px-5 py-4">
                                            <span className={cn('rounded-full px-3 py-1 text-xs font-black', statusClasses[row.status])}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                type="button"
                                                className="rounded-full px-3 py-1.5 text-sm font-black text-nexlink-primary transition hover:bg-nexlink-primary/10 dark:text-white dark:hover:bg-white/10"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredRows.length === 0 && (
                        <div className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">
                            No records match your search.
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
