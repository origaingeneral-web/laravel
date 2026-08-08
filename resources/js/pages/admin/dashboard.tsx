import { Head } from '@inertiajs/react';
import { Building2, CreditCard, Users } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { StatCard } from '@/components/admin/stat-card';
import AdminLayout from '@/layouts/admin-layout';

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
                <PageHeader
                    title="Admin Dashboard"
                    description="Monitor companies, users, and active product subscriptions."
                />

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <StatCard
                        label="Companies"
                        value={stats.companies.toLocaleString()}
                        icon={Building2}
                        tone="primary"
                    />
                    <StatCard
                        label="Users"
                        value={stats.users.toLocaleString()}
                        icon={Users}
                        tone="success"
                    />
                    <StatCard
                        label="Active Plans"
                        value={stats.active_plans.toLocaleString()}
                        icon={CreditCard}
                        tone="info"
                    />
                </section>
            </div>
        </>
    );
}

AdminDashboard.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
