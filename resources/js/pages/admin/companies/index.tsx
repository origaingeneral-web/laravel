import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Plus, Search } from 'lucide-react';
import type { FormEvent } from 'react';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type CompanyRow = {
    id: number;
    company_name: string;
    company_code: string;
    email: string;
    mobile: string;
    status: number;
    company_products_count: number;
    created_at: string;
};

type PaginatedCompanies = {
    data: CompanyRow[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
};

type Props = {
    companies: PaginatedCompanies;
    filters: { search: string; status: string | number | null };
    statusOptions: Array<{ value: number; label: string }>;
};

function statusLabel(status: number, options: Props['statusOptions']): string {
    return options.find((option) => option.value === status)?.label ?? String(status);
}

export default function AdminCompaniesIndex({ companies, filters, statusOptions }: Props) {
    const page = usePage<{ flash?: { success?: string } }>();
    const form = useForm({
        search: filters.search ?? '',
        status: filters.status?.toString() ?? '',
    });

    const submitSearch = (event: FormEvent) => {
        event.preventDefault();
        form.get('/admin/companies', {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <>
            <Head title="Companies" />

            <div className="space-y-6">
                <PageHeader
                    title="Companies"
                    description="Create tenants and assign products (modules) to each company."
                    actions={
                        <Button asChild className="rounded-full bg-nexlink-primary text-white hover:bg-nexlink-primary-dark">
                            <Link href="/admin/companies/create">
                                <Plus className="size-4" />
                                Add company
                            </Link>
                        </Button>
                    }
                />

                {page.props.flash?.success && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                        {page.props.flash.success}
                    </div>
                )}

                <form onSubmit={submitSearch} className="admin-card grid gap-4 p-4 sm:grid-cols-[1fr_180px_auto]">
                    <div className="space-y-2">
                        <Label htmlFor="search">Search</Label>
                        <div className="relative">
                            <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-slate-400" />
                            <Input
                                id="search"
                                className="pl-9"
                                value={form.data.search}
                                onChange={(event) => form.setData('search', event.target.value)}
                                placeholder="Name, code, or email"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                            value={form.data.status}
                            onChange={(event) => form.setData('status', event.target.value)}
                        >
                            <option value="">All</option>
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <Button type="submit" variant="outline" className="w-full rounded-full">
                            Filter
                        </Button>
                    </div>
                </form>

                <div className="admin-card overflow-hidden">
                    <table className="min-w-full text-left text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-white/5">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Company</th>
                                <th className="px-4 py-3 font-semibold">Code</th>
                                <th className="px-4 py-3 font-semibold">Email</th>
                                <th className="px-4 py-3 font-semibold">Products</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold" />
                            </tr>
                        </thead>
                        <tbody>
                            {companies.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                        No companies found.
                                    </td>
                                </tr>
                            )}
                            {companies.data.map((company) => (
                                <tr key={company.id} className="border-b border-slate-100 dark:border-white/5">
                                    <td className="px-4 py-3 font-medium text-slate-950 dark:text-white">
                                        {company.company_name}
                                    </td>
                                    <td className="px-4 py-3">{company.company_code}</td>
                                    <td className="px-4 py-3">{company.email}</td>
                                    <td className="px-4 py-3">{company.company_products_count}</td>
                                    <td className="px-4 py-3">{statusLabel(company.status, statusOptions)}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href={`/admin/companies/${company.id}`}>View</Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {companies.last_page > 1 && (
                    <div className="flex flex-wrap gap-2">
                        {companies.links.map((link, index) => (
                            <Button
                                key={`${link.label}-${index}`}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
