import { Head } from '@inertiajs/react';

type Props = {
    stats: {
        companies: number;
        users: number;
        active_plans: number;
    };
};

export default function AdminDashboard({ stats }: Props) {
    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                        Super Admin Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Manage companies and assign products from the Companies menu.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Companies
                        </p>
                        <p className="mt-3 text-3xl font-black text-slate-950 dark:text-white">
                            {stats.companies}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Users
                        </p>
                        <p className="mt-3 text-3xl font-black text-slate-950 dark:text-white">
                            {stats.users}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Active plans
                        </p>
                        <p className="mt-3 text-3xl font-black text-slate-950 dark:text-white">
                            {stats.active_plans}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
