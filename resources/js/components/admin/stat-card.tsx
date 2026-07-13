import type { LucideIcon } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
    label: string;
    value: string;
    trend?: string;
    icon: LucideIcon;
    tone?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
};

const toneClasses = {
    primary: 'bg-nexlink-primary/10 text-nexlink-primary dark:bg-white/10 dark:text-white',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    danger: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
    info: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
};

export function StatCard({ label, value, trend, icon: Icon, tone = 'primary' }: Props) {
    return (
        <article className="admin-card group p-5 transition duration-200 hover:-translate-y-1">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">{value}</p>
                </div>
                <span className={cn('flex size-11 items-center justify-center rounded-2xl', toneClasses[tone])}>
                    <Icon className="size-5" aria-hidden="true" />
                </span>
            </div>
            {trend && (
                <p className="mt-4 flex items-center gap-2 text-xs font-black text-nexlink-primary dark:text-white/80">
                    <TrendingUp className="size-3.5" aria-hidden="true" />
                    {trend}
                </p>
            )}
        </article>
    );
}
