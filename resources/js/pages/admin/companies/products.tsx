import { Head, Link, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AssignedRow = {
    product_id: number;
    plan_id: number | null;
    status: string;
    starts_at: string | null;
    expires_at: string | null;
    staff_limit: number | null;
    notes: string | null;
};

type CatalogProduct = {
    id: number;
    name: string;
    code: string;
    description: string | null;
    plans: Array<{
        id: number;
        plan_name: string;
        duration_in_days: number | null;
        staff_limit: number | null;
        price: string | number | null;
    }>;
    features: Array<{
        id: number;
        code: string;
        name: string;
        is_addon: boolean;
        is_enabled: boolean;
    }>;
};

type ProductFormRow = {
    product_id: number;
    plan_id: string;
    status: string;
    starts_at: string;
    expires_at: string;
    staff_limit: string;
    notes: string;
    enable_default_features: boolean;
};

type Props = {
    company: { id: number; company_name: string; company_code: string };
    assigned: AssignedRow[];
    catalog: CatalogProduct[];
};

function toFormRows(assigned: AssignedRow[], catalog: CatalogProduct[]): ProductFormRow[] {
    if (assigned.length > 0) {
        return assigned.map((row) => ({
            product_id: row.product_id,
            plan_id: row.plan_id ? String(row.plan_id) : '',
            status: row.status,
            starts_at: row.starts_at ?? '',
            expires_at: row.expires_at ?? '',
            staff_limit: row.staff_limit ? String(row.staff_limit) : '',
            notes: row.notes ?? '',
            enable_default_features: false,
        }));
    }

    return [];
}

export default function AdminCompanyProducts({ company, assigned, catalog }: Props) {
    const page = usePage<{ flash?: { success?: string } }>();
    const form = useForm<{ products: ProductFormRow[] }>({
        products: toFormRows(assigned, catalog),
    });

    const [featureProductId, setFeatureProductId] = useState<number | null>(
        assigned[0]?.product_id ?? null,
    );

    const selectedIds = useMemo(
        () => new Set(form.data.products.map((row) => row.product_id)),
        [form.data.products],
    );

    const featureProduct = catalog.find((product) => product.id === featureProductId) ?? null;

    const featureForm = useForm({
        features: (featureProduct?.features ?? []).map((feature) => ({
            feature_id: feature.id,
            is_enabled: feature.is_enabled,
        })),
    });

    const toggleProduct = (product: CatalogProduct, checked: boolean) => {
        if (checked) {
            form.setData('products', [
                ...form.data.products,
                {
                    product_id: product.id,
                    plan_id: product.plans[0] ? String(product.plans[0].id) : '',
                    status: 'active',
                    starts_at: new Date().toISOString().slice(0, 10),
                    expires_at: '',
                    staff_limit: product.plans[0]?.staff_limit
                        ? String(product.plans[0].staff_limit)
                        : '',
                    notes: '',
                    enable_default_features: true,
                },
            ]);
            setFeatureProductId(product.id);
            return;
        }

        form.setData(
            'products',
            form.data.products.filter((row) => row.product_id !== product.id),
        );
    };

    const updateRow = (productId: number, patch: Partial<ProductFormRow>) => {
        form.setData(
            'products',
            form.data.products.map((row) =>
                row.product_id === productId ? { ...row, ...patch } : row,
            ),
        );
    };

    const submitProducts = (event: FormEvent) => {
        event.preventDefault();
        form.put(`/admin/companies/${company.id}/products`, {
            transform: (data) => ({
                products: data.products.map((row) => ({
                    product_id: row.product_id,
                    plan_id: row.plan_id ? Number(row.plan_id) : null,
                    status: row.status,
                    starts_at: row.starts_at || null,
                    expires_at: row.expires_at || null,
                    staff_limit: row.staff_limit ? Number(row.staff_limit) : null,
                    notes: row.notes || null,
                    enable_default_features: row.enable_default_features,
                })),
            }),
        });
    };

    const loadFeatures = (productId: number) => {
        const product = catalog.find((item) => item.id === productId);
        setFeatureProductId(productId);
        featureForm.setData(
            'features',
            (product?.features ?? []).map((feature) => ({
                feature_id: feature.id,
                is_enabled: feature.is_enabled,
            })),
        );
        featureForm.clearErrors();
    };

    const submitFeatures = (event: FormEvent) => {
        event.preventDefault();
        if (!featureProductId) {
            return;
        }

        featureForm.put(`/admin/companies/${company.id}/products/${featureProductId}/features`);
    };

    return (
        <>
            <Head title={`Products · ${company.company_name}`} />

            <div className="space-y-6">
                <PageHeader
                    title="Assign products"
                    description={`${company.company_name} (${company.company_code}) — one company can have many products.`}
                    actions={
                        <Button asChild variant="outline" className="rounded-full">
                            <Link href={`/admin/companies/${company.id}`}>Back to company</Link>
                        </Button>
                    }
                />

                {page.props.flash?.success && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                        {page.props.flash.success}
                    </div>
                )}

                <form onSubmit={submitProducts} className="space-y-4">
                    {catalog.map((product) => {
                        const checked = selectedIds.has(product.id);
                        const row = form.data.products.find((item) => item.product_id === product.id);

                        return (
                            <section key={product.id} className="admin-card space-y-4 p-5">
                                <label className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        className="mt-1"
                                        checked={checked}
                                        onChange={(e) => toggleProduct(product, e.target.checked)}
                                    />
                                    <div>
                                        <p className="font-semibold text-slate-950 dark:text-white">
                                            {product.name}{' '}
                                            <span className="text-slate-400">({product.code})</span>
                                        </p>
                                        {product.description && (
                                            <p className="text-sm text-slate-500">{product.description}</p>
                                        )}
                                    </div>
                                </label>

                                {checked && row && (
                                    <div className="grid gap-4 border-t border-slate-100 pt-4 md:grid-cols-3 dark:border-white/10">
                                        <div className="space-y-2">
                                            <Label>Plan</Label>
                                            <select
                                                className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                                                value={row.plan_id}
                                                onChange={(e) =>
                                                    updateRow(product.id, { plan_id: e.target.value })
                                                }
                                            >
                                                <option value="">No plan</option>
                                                {product.plans.map((plan) => (
                                                    <option key={plan.id} value={plan.id}>
                                                        {plan.plan_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Status</Label>
                                            <select
                                                className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                                                value={row.status}
                                                onChange={(e) =>
                                                    updateRow(product.id, { status: e.target.value })
                                                }
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="expired">Expired</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Staff limit</Label>
                                            <Input
                                                type="number"
                                                value={row.staff_limit}
                                                onChange={(e) =>
                                                    updateRow(product.id, {
                                                        staff_limit: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Starts at</Label>
                                            <Input
                                                type="date"
                                                value={row.starts_at}
                                                onChange={(e) =>
                                                    updateRow(product.id, { starts_at: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Expires at</Label>
                                            <Input
                                                type="date"
                                                value={row.expires_at}
                                                onChange={(e) =>
                                                    updateRow(product.id, {
                                                        expires_at: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Notes</Label>
                                            <Input
                                                value={row.notes}
                                                onChange={(e) =>
                                                    updateRow(product.id, { notes: e.target.value })
                                                }
                                            />
                                        </div>
                                        <label className="flex items-center gap-2 text-sm md:col-span-3">
                                            <input
                                                type="checkbox"
                                                checked={row.enable_default_features}
                                                onChange={(e) =>
                                                    updateRow(product.id, {
                                                        enable_default_features: e.target.checked,
                                                    })
                                                }
                                            />
                                            Enable default (non-addon) features on save
                                        </label>
                                        <div className="md:col-span-3">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => loadFeatures(product.id)}
                                            >
                                                Edit features for this product
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </section>
                        );
                    })}

                    {form.errors.products && (
                        <p className="text-sm text-red-600">{form.errors.products}</p>
                    )}

                    <Button
                        type="submit"
                        disabled={form.processing}
                        className="rounded-full bg-nexlink-primary text-white hover:bg-nexlink-primary-dark"
                    >
                        Save product assignments
                    </Button>
                </form>

                {featureProduct && (
                    <form onSubmit={submitFeatures} className="admin-card space-y-4 p-5">
                        <h3 className="font-semibold text-slate-950 dark:text-white">
                            Features · {featureProduct.name}
                        </h3>
                        <div className="space-y-2">
                            {featureForm.data.features.map((feature, index) => {
                                const meta = featureProduct.features.find(
                                    (item) => item.id === feature.feature_id,
                                );

                                return (
                                    <label
                                        key={feature.feature_id}
                                        className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2 text-sm dark:border-white/10"
                                    >
                                        <span>
                                            {meta?.name ?? feature.feature_id}
                                            {meta?.is_addon ? (
                                                <span className="ml-2 text-xs text-slate-400">addon</span>
                                            ) : null}
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={feature.is_enabled}
                                            onChange={(e) => {
                                                const next = [...featureForm.data.features];
                                                next[index] = {
                                                    ...next[index],
                                                    is_enabled: e.target.checked,
                                                };
                                                featureForm.setData('features', next);
                                            }}
                                        />
                                    </label>
                                );
                            })}
                        </div>
                        <Button type="submit" disabled={featureForm.processing} variant="outline">
                            Save features
                        </Button>
                    </form>
                )}
            </div>
        </>
    );
}
