import { Head, Link } from '@inertiajs/react';
import { Activity, BriefcaseBusiness, CheckCircle2, Clock, DollarSign, Plus, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { StatCard } from '@/components/admin/stat-card';
import { Button } from '@/components/ui/button';

const chartBars = [48, 68, 56, 82, 64, 74, 58];
const activities = [
    ['Emma Smith', 'created a new lead for Acme Studio', '7 hr ago'],
    ['David Miller', 'moved Enterprise CRM to review', '1 day ago'],
    ['Olivia Brown', 'closed a finance follow-up', '2 days ago'],
];

const quickMetrics: { label: string; value: string; icon: LucideIcon }[] = [
    { label: 'Leads captured', value: '312', icon: CheckCircle2 },
    { label: 'Activities logged', value: '156', icon: Activity },
    { label: 'Team members', value: '126', icon: Users },
];

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard | NexLink" />
            <div className="space-y-6">
                <PageHeader
                    title="Dashboard"
                    description="A Tailwind-powered CRM overview rebuilt from the NexLink Bootstrap theme."
                    actions={
                        <>
                            <Button asChild variant="outline" className="rounded-full bg-white dark:bg-white/5">
                                <Link href="/tasks">View tasks</Link>
                            </Button>
                            <Button asChild className="rounded-full bg-nexlink-primary text-white hover:bg-nexlink-primary-dark">
                                <Link href="/deals">
                                    <Plus className="size-4" aria-hidden="true" />
                                    New deal
                                </Link>
                            </Button>
                        </>
                    }
                />

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Total Revenue" value="$128.4k" trend="+18.2% this month" icon={DollarSign} />
                    <StatCard label="Active Customers" value="1,284" trend="+42 this week" icon={Users} tone="success" />
                    <StatCard label="Open Deals" value="74" trend="14 closing soon" icon={BriefcaseBusiness} tone="info" />
                    <StatCard label="Pending Tasks" value="28" trend="6 due today" icon={Clock} tone="warning" />
                </section>

                <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
                    <article className="admin-card p-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-xl font-black text-slate-950 dark:text-white">Revenue Analytics</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Weekly sales activity and conversion movement.</p>
                            </div>
                            <span className="rounded-full bg-nexlink-primary/10 px-3 py-1 text-xs font-black text-nexlink-primary dark:bg-white/10 dark:text-white">
                                Weekly
                            </span>
                        </div>
                        <div className="mt-8 flex h-72 items-end gap-3">
                            {chartBars.map((value, index) => (
                                <div key={index} className="flex flex-1 flex-col items-center gap-3">
                                    <div className="relative flex h-56 w-full items-end overflow-hidden rounded-t-3xl bg-slate-100 dark:bg-white/5">
                                        <div
                                            className="w-full rounded-t-3xl bg-nexlink-primary transition-all hover:bg-nexlink-primary-dark"
                                            style={{ height: `${value}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-black text-slate-400">{['S', 'M', 'T', 'W', 'T', 'F', 'S'][index]}</span>
                                </div>
                            ))}
                        </div>
                    </article>

                    <aside className="space-y-6">
                        <article className="admin-card p-6">
                            <h2 className="text-lg font-black text-slate-950 dark:text-white">Project Progress</h2>
                            <div className="mt-6 flex items-center justify-center">
                                <div className="relative size-44">
                                    <svg viewBox="0 0 120 120" className="size-full -rotate-90">
                                        <circle cx="60" cy="60" r="48" fill="none" stroke="currentColor" strokeWidth="14" className="text-slate-100 dark:text-white/10" />
                                        <circle cx="60" cy="60" r="48" fill="none" stroke="currentColor" strokeWidth="14" strokeDasharray="301.59" strokeDashoffset="96.5" strokeLinecap="round" className="text-nexlink-primary" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-black text-slate-950 dark:text-white">68%</span>
                                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Completed</span>
                                    </div>
                                </div>
                            </div>
                        </article>

                        <article className="admin-card p-6">
                            <h2 className="text-lg font-black text-slate-950 dark:text-white">Recent Activity</h2>
                            <div className="mt-5 space-y-4">
                                {activities.map(([name, description, time]) => (
                                    <div key={`${name}-${time}`} className="flex gap-3">
                                        <span className="mt-1 flex size-9 items-center justify-center rounded-2xl bg-nexlink-primary/10 text-nexlink-primary dark:bg-white/10 dark:text-white">
                                            <Activity className="size-4" aria-hidden="true" />
                                        </span>
                                        <div>
                                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                                <strong className="text-slate-950 dark:text-white">{name}</strong> {description}
                                            </p>
                                            <p className="mt-1 text-xs font-semibold text-slate-400">{time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </aside>
                </section>

                <section className="grid gap-6 lg:grid-cols-3">
                    {quickMetrics.map(({ label, value, icon: Icon }) => (
                        <article key={label} className="admin-card flex items-center gap-4 p-5">
                            <span className="flex size-12 items-center justify-center rounded-2xl bg-nexlink-primary/10 text-nexlink-primary dark:bg-white/10 dark:text-white">
                                <Icon className="size-5" aria-hidden="true" />
                            </span>
                            <div>
                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
                                <p className="text-2xl font-black text-slate-950 dark:text-white">{value}</p>
                            </div>
                        </article>
                    ))}
                </section>
            </div>
        </>
    );
}

