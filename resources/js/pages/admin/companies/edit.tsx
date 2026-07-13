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

type Company = {
    id: number;
    business_category_id: number;
    company_name: string;
    company_code: string;
    email: string;
    mobile: string;
    owner_name: string;
    owner_mobile: string;
    country_id: number;
    state_id: number;
    city_id: number;
    area_id: number | null;
    landline: string | null;
    pincode: string;
    address: string;
    status: number;
    disabled_reason: string | null;
};

type Props = {
    company: Company;
    lookups: Lookup;
    statusOptions: Array<{ value: number; label: string }>;
};

export default function AdminCompanyEdit({ company, lookups, statusOptions }: Props) {
    const form = useForm({
        business_category_id: String(company.business_category_id),
        company_name: company.company_name,
        company_code: company.company_code,
        email: company.email,
        mobile: company.mobile,
        owner_name: company.owner_name,
        owner_mobile: company.owner_mobile,
        country_id: String(company.country_id),
        state_id: String(company.state_id),
        city_id: String(company.city_id),
        pincode: company.pincode,
        address: company.address,
        landline: company.landline ?? '',
        status: String(company.status),
        disabled_reason: company.disabled_reason ?? '',
    });

    const states = lookups.states.filter(
        (state) => state.country_id === Number(form.data.country_id),
    );
    const cities = lookups.cities.filter((city) => city.state_id === Number(form.data.state_id));

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put(`/admin/companies/${company.id}`, {
            transform: (data) => ({
                ...data,
                business_category_id: Number(data.business_category_id),
                country_id: Number(data.country_id),
                state_id: Number(data.state_id),
                city_id: Number(data.city_id),
                status: Number(data.status),
                disabled_reason: data.disabled_reason || null,
            }),
        });
    };

    return (
        <>
            <Head title={`Edit ${company.company_name}`} />

            <div className="space-y-6">
                <PageHeader
                    title={`Edit ${company.company_name}`}
                    description="Update company profile and status."
                    actions={
                        <Button asChild variant="outline" className="rounded-full">
                            <Link href={`/admin/companies/${company.id}`}>Back</Link>
                        </Button>
                    }
                />

                <form onSubmit={submit} className="admin-card grid gap-4 p-6 md:grid-cols-2">
                    <Field label="Company name" error={form.errors.company_name}>
                        <Input
                            value={form.data.company_name}
                            onChange={(e) => form.setData('company_name', e.target.value)}
                            required
                        />
                    </Field>
                    <Field label="Company code" error={form.errors.company_code}>
                        <Input
                            maxLength={4}
                            value={form.data.company_code}
                            onChange={(e) => form.setData('company_code', e.target.value.toUpperCase())}
                            required
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
                        >
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
                        >
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
                        />
                    </Field>
                    <div className="md:col-span-2">
                        <Field label="Address" error={form.errors.address}>
                            <textarea
                                className="border-input min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                                value={form.data.address}
                                onChange={(e) => form.setData('address', e.target.value)}
                            />
                        </Field>
                    </div>
                    <div className="md:col-span-2">
                        <Field label="Disabled reason" error={form.errors.disabled_reason}>
                            <Input
                                value={form.data.disabled_reason}
                                onChange={(e) => form.setData('disabled_reason', e.target.value)}
                            />
                        </Field>
                    </div>

                    <div className="md:col-span-2 flex gap-3">
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-full bg-nexlink-primary text-white hover:bg-nexlink-primary-dark"
                        >
                            Save changes
                        </Button>
                        <Button asChild variant="outline" className="rounded-full">
                            <Link href={`/admin/companies/${company.id}`}>Cancel</Link>
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
