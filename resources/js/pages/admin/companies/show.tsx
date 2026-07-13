import { Head, Link, usePage } from '@inertiajs/react';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';

type ProductRow = {
    id: number;
    subscription_id: number;
    name: string;
    code: string;
    status: string;
    is_accessible: boolean;
    plan_id: number | null;
    plan_name: string | null;
    starts_at: string | null;
    expires_at: string | null;
    staff_limit: number | null;
};

type Props = {
    company: {
        id: number;
        company_name: string;
        company_code: string;
        email: string;
        mobile: string;
        owner_name: string;
        owner_mobile: string;
        pincode: string;
        address: string;
        status: number;
        products: ProductRow[];
    };
    statusOptions: Array<{ value: number; label: string }>;
};

export default function AdminCompanyShow({ company, statusOptions }: Props) {
    const page = usePage<{ flash?: { success?: string } }>();
    const status = statusOptions.find((option) => option.value === company.status)?.label ?? company.status;

    return (
        <>
            <Head title={company.company_name} />

            <div className="space-y-6">
                <PageHeader
                    title={company.company_name}
                    description={`Code ${company.company_code} · ${status}`}
                    actions={
                        <>
                            <Button asChild variant="outline" className="rounded-full">
                                <Link href={`/admin/companies/${company.id}/edit`}>Edit</Link>
                            </Button>
                            <Button asChild className="rounded-full bg-nexlink-primary text-white hover:bg-nexlink-primary-dark">
                                <Link href={`/admin/companies/${company.id}/products`}>
                                    Assign products
                                </Link>
                            </Button>
                        </>
                    }
                />

                {page.props.flash?.success && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                        {page.props.flash.success}
                    </div>
                )}

                <section className="admin-card grid gap-4 p-6 md:grid-cols-2">
                    <Info label="Email" value={company.email} />
                    <Info label="Mobile" value={company.mobile} />
                    <Info label="Owner" value={`${company.owner_name} (${company.owner_mobile})`} />
                    <Info label="Pincode" value={company.pincode} />
                    <div className="md:col-span-2">
                        <Info label="Address" value={company.address} />
                    </div>
                </section>

                <section className="admin-card overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/10">
                        <h3 className="font-semibold text-slate-950 dark:text-white">Assigned products</h3>
                        <Button asChild size="sm" variant="outline">
                            <Link href={`/admin/companies/${company.id}/products`}>Manage</Link>
                        </Button>
                    </div>
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-white/5">
                            <tr>
                                <th className="px-4 py-3">Product</th>
                                <th className="px-4 py-3">Plan</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Expires</th>
                            </tr>
                        </thead>
                        <tbody>
                            {company.products.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                                        No products assigned yet.
                                    </td>
                                </tr>
                            )}
                            {company.products.map((product) => (
                                <tr key={product.subscription_id} className="border-t border-slate-100 dark:border-white/5">
                                    <td className="px-4 py-3 font-medium">
                                        {product.name}{' '}
                                        <span className="text-slate-400">({product.code})</span>
                                    </td>
                                    <td className="px-4 py-3">{product.plan_name ?? '—'}</td>
                                    <td className="px-4 py-3">{product.status}</td>
                                    <td className="px-4 py-3">
                                        {product.expires_at ? String(product.expires_at).slice(0, 10) : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <Button asChild variant="outline" className="rounded-full">
                    <Link href="/admin/companies">Back to companies</Link>
                </Button>
            </div>
        </>
    );
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-1 text-sm text-slate-950 dark:text-white">{value}</p>
        </div>
    );
}
