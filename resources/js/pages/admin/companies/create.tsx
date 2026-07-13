import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent, ReactNode } from 'react';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Lookup = {
    businessCategories: Array<{ id: number; category: string }>;
    countries: Array<{ id: number; country: string; iso3: string }>;
    states: Array<{ id: number; country_id: number; state: string; code: string }>;
    cities: Array<{ id: number; state_id: number; city: string }>;
};

type Props = {
    lookups: Lookup;
    statusOptions: Array<{ value: number; label: string }>;
};

export default function AdminCompanyCreate({ lookups, statusOptions }: Props) {
    const form = useForm({
        business_category_id: lookups.businessCategories[0]?.id?.toString() ?? '',
        company_name: '',
        company_code: '',
        email: '',
        mobile: '',
        owner_name: '',
        owner_mobile: '',
        country_id: lookups.countries[0]?.id?.toString() ?? '',
        state_id: '',
        city_id: '',
        pincode: '',
        address: '',
        landline: '',
        status: '1',
        create_admin: true,
        admin_name: '',
        admin_email: '',
        admin_password: '',
        admin_password_confirmation: '',
    });

    const states = lookups.states.filter(
        (state) => state.country_id === Number(form.data.country_id),
    );
    const cities = lookups.cities.filter((city) => city.state_id === Number(form.data.state_id));

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post('/admin/companies', {
            transform: (data) => ({
                ...data,
                business_category_id: Number(data.business_category_id),
                country_id: Number(data.country_id),
                state_id: Number(data.state_id),
                city_id: Number(data.city_id),
                status: Number(data.status),
                company_code: data.company_code || null,
                create_admin: Boolean(data.create_admin),
            }),
        });
    };

    return (
        <>
            <Head title="Add Company" />

            <div className="space-y-6">
                <PageHeader
                    title="Add company"
                    description="Create a tenant. You can assign products right after."
                    actions={
                        <Button asChild variant="outline" className="rounded-full">
                            <Link href="/admin/companies">Back</Link>
                        </Button>
                    }
                />

                <form onSubmit={submit} className="admin-card space-y-6 p-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Company name" error={form.errors.company_name}>
                            <Input
                                value={form.data.company_name}
                                onChange={(e) => form.setData('company_name', e.target.value)}
                                required
                            />
                        </Field>
                        <Field label="Company code (4 chars, optional)" error={form.errors.company_code}>
                            <Input
                                maxLength={4}
                                value={form.data.company_code}
                                onChange={(e) => form.setData('company_code', e.target.value.toUpperCase())}
                            />
                        </Field>
                        <Field label="Email" error={form.errors.email}>
                            <Input
                                type="email"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                required
                            />
                        </Field>
                        <Field label="Mobile" error={form.errors.mobile}>
                            <Input
                                value={form.data.mobile}
                                onChange={(e) => form.setData('mobile', e.target.value)}
                                required
                            />
                        </Field>
                        <Field label="Owner name" error={form.errors.owner_name}>
                            <Input
                                value={form.data.owner_name}
                                onChange={(e) => form.setData('owner_name', e.target.value)}
                                required
                            />
                        </Field>
                        <Field label="Owner mobile" error={form.errors.owner_mobile}>
                            <Input
                                value={form.data.owner_mobile}
                                onChange={(e) => form.setData('owner_mobile', e.target.value)}
                                required
                            />
                        </Field>
                        <Field label="Business category" error={form.errors.business_category_id}>
                            <select
                                className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                                value={form.data.business_category_id}
                                onChange={(e) => form.setData('business_category_id', e.target.value)}
                                required
                            >
                                {lookups.businessCategories.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.category}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Status" error={form.errors.status}>
                            <select
                                className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                                value={form.data.status}
                                onChange={(e) => form.setData('status', e.target.value)}
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Country" error={form.errors.country_id}>
                            <select
                                className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                                value={form.data.country_id}
                                onChange={(e) => {
                                    form.setData('country_id', e.target.value);
                                    form.setData('state_id', '');
                                    form.setData('city_id', '');
                                }}
                                required
                            >
                                {lookups.countries.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.country}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="State" error={form.errors.state_id}>
                            <select
                                className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                                value={form.data.state_id}
                                onChange={(e) => {
                                    form.setData('state_id', e.target.value);
                                    form.setData('city_id', '');
                                }}
                                required
                            >
                                <option value="">Select state</option>
                                {states.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.state}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="City" error={form.errors.city_id}>
                            <select
                                className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm"
                                value={form.data.city_id}
                                onChange={(e) => form.setData('city_id', e.target.value)}
                                required
                            >
                                <option value="">Select city</option>
                                {cities.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.city}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Pincode" error={form.errors.pincode}>
                            <Input
                                value={form.data.pincode}
                                onChange={(e) => form.setData('pincode', e.target.value)}
                                required
                            />
                        </Field>
                        <Field label="Landline" error={form.errors.landline}>
                            <Input
                                value={form.data.landline}
                                onChange={(e) => form.setData('landline', e.target.value)}
                            />
                        </Field>
                        <div className="md:col-span-2">
                            <Field label="Address" error={form.errors.address}>
                                <textarea
                                    className="border-input min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                                    value={form.data.address}
                                    onChange={(e) => form.setData('address', e.target.value)}
                                    required
                                />
                            </Field>
                        </div>
                    </div>

                    <div className="space-y-4 rounded-2xl border border-slate-200 p-4 dark:border-white/10">
                        <label className="flex items-center gap-2 text-sm font-medium">
                            <input
                                type="checkbox"
                                checked={form.data.create_admin}
                                onChange={(e) => form.setData('create_admin', e.target.checked)}
                            />
                            Create company admin user (API login)
                        </label>
                        {form.data.create_admin && (
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field label="Admin name" error={form.errors.admin_name}>
                                    <Input
                                        value={form.data.admin_name}
                                        onChange={(e) => form.setData('admin_name', e.target.value)}
                                    />
                                </Field>
                                <Field label="Admin email" error={form.errors.admin_email}>
                                    <Input
                                        type="email"
                                        value={form.data.admin_email}
                                        onChange={(e) => form.setData('admin_email', e.target.value)}
                                    />
                                </Field>
                                <Field label="Admin password" error={form.errors.admin_password}>
                                    <Input
                                        type="password"
                                        value={form.data.admin_password}
                                        onChange={(e) => form.setData('admin_password', e.target.value)}
                                    />
                                </Field>
                                <Field label="Confirm password" error={form.errors.admin_password_confirmation}>
                                    <Input
                                        type="password"
                                        value={form.data.admin_password_confirmation}
                                        onChange={(e) =>
                                            form.setData('admin_password_confirmation', e.target.value)
                                        }
                                    />
                                </Field>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-full bg-nexlink-primary text-white hover:bg-nexlink-primary-dark"
                        >
                            Create company
                        </Button>
                        <Button asChild variant="outline" className="rounded-full">
                            <Link href="/admin/companies">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            {children}
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}
