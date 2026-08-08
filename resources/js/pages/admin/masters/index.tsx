import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import Demo1Layout from '@/layouts/demo1/layout';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@inertiajs/react';

const entityTitles: Record<string, string> = {
    'business-categories': 'Business Categories',
    languages: 'Languages',
    countries: 'Countries',
    states: 'States',
    cities: 'Cities',
    areas: 'Areas',
    plans: 'Plans',
};

export default function MasterIndex() {
    const { props, url } = usePage();
    const { entity, items, lookups } = props as {
        entity: string;
        items: Array<Record<string, unknown>>;
        lookups: Record<string, unknown>;
    };

    const [search, setSearch] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editRecord, setEditRecord] = useState<Record<string, unknown> | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const title = entityTitles[entity] ?? 'Masters';

    const filteredItems = useMemo(
        () =>
            items.filter((item) =>
                Object.values(item)
                    .map((value) => String(value).toLowerCase())
                    .some((value) => value.includes(search.toLowerCase()))
            ),
        [items, search]
    );

    const fields = useMemo(() => {
        switch (entity) {
            case 'business-categories':
                return ['category'];
            case 'languages':
                return ['language', 'code'];
            case 'countries':
                return ['country', 'iso3', 'phone_code'];
            case 'states':
                return ['country', 'state', 'code'];
            case 'cities':
                return ['state', 'city', 'is_top_city'];
            case 'areas':
                return ['city', 'area', 'zipcode'];
            case 'plans':
                return ['plan_name', 'price', 'duration_in_days', 'staff_limit', 'tracking_duration'];
            default:
                return [];
        }
    }, [entity]);

    const columns = fields;

    return (
        <>
            <Head title={`${title} | Admin`} />
            <div className="space-y-6">
                <PageHeader
                    title={title}
                    description={`Manage ${title.toLowerCase()} from a single admin page.`}
                    actions={
                        <Button onClick={() => setIsCreateOpen(true)}>
                            <Plus className="size-4" />
                            Add New
                        </Button>
                    }
                />

                <section className="admin-card overflow-hidden">
                    <div className="flex flex-col gap-4 border-b border-slate-100 p-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-black text-slate-950 dark:text-white">Records</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Search, edit, or delete individual master records.</p>
                        </div>
                        <div className="w-full sm:w-72">
                            <Label htmlFor="search" className="sr-only">
                                Search records
                            </Label>
                            <Input
                                id="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search records"
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left">
                            <thead>
                                <tr className="bg-slate-50 text-xs font-black uppercase tracking-[0.18em] text-slate-400 dark:bg-white/5">
                                    {columns.map((column) => (
                                        <th key={column} className="px-5 py-4 capitalize">
                                            {column.replace(/_/g, ' ')}
                                        </th>
                                    ))}
                                    <th className="px-5 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                                {filteredItems.map((item) => (
                                    <tr key={String(item.id)} className="transition hover:bg-slate-50/80 dark:hover:bg-white/5">
                                        {columns.map((column) => (
                                            <td key={column} className="px-5 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">
                                                {String(item[column] ?? '')}
                                            </td>
                                        ))}
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setEditRecord(item)}
                                                >
                                                    <Edit3 className="size-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        setEditRecord(item);
                                                        setIsDeleteOpen(true);
                                                    }}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredItems.length === 0 && (
                                    <tr>
                                        <td colSpan={columns.length + 1} className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                                            No records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            <CreateModal
                entity={entity}
                isOpen={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                lookups={lookups}
            />

            {editRecord && (
                <EditModal
                    entity={entity}
                    record={editRecord}
                    isOpen={Boolean(editRecord)}
                    onOpenChange={() => setEditRecord(null)}
                    lookups={lookups}
                />
            )}

            {editRecord && (
                <DeleteDialog
                    entity={entity}
                    record={editRecord}
                    isOpen={isDeleteOpen}
                    onOpenChange={setIsDeleteOpen}
                />
            )}
        </>
    );
}

const CreateModal = ({
    entity,
    isOpen,
    onOpenChange,
    lookups,
}: {
    entity: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    lookups: Record<string, unknown>;
}) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl rounded-2xl">
            <DialogHeader>
                <DialogTitle>Add New Record</DialogTitle>
                <DialogDescription>Provide details for a new master record.</DialogDescription>
            </DialogHeader>

            <Form action={`/admin/master/${entity}`} method="post" className="space-y-4">
                <input type="hidden" name="_token" value="" />
                <MasterFields entity={entity} lookups={lookups} />
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="submit">Create</Button>
                </div>
            </Form>
        </DialogContent>
    </Dialog>
);

const EditModal = ({
    entity,
    record,
    isOpen,
    onOpenChange,
    lookups,
}: {
    entity: string;
    record: Record<string, unknown>;
    isOpen: boolean;
    onOpenChange: () => void;
    lookups: Record<string, unknown>;
}) => (
    <Dialog open={isOpen} onOpenChange={() => onOpenChange()}>
        <DialogContent className="sm:max-w-2xl rounded-2xl">
            <DialogHeader>
                <DialogTitle>Edit Record</DialogTitle>
                <DialogDescription>Update the selected master record.</DialogDescription>
            </DialogHeader>

            <Form action={`/admin/master/${entity}/${record.id}`} method="post" className="space-y-4">
                <input type="hidden" name="_method" value="put" />
                <input type="hidden" name="_token" value="" />
                <MasterFields entity={entity} lookups={lookups} record={record} />
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" type="button" onClick={() => onOpenChange()}>
                        Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                </div>
            </Form>
        </DialogContent>
    </Dialog>
);

const DeleteDialog = ({
    entity,
    record,
    isOpen,
    onOpenChange,
}: {
    entity: string;
    record: Record<string, unknown>;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
            <DialogHeader>
                <DialogTitle>Delete Record</DialogTitle>
                <DialogDescription>Are you sure you want to delete this record? This action cannot be undone.</DialogDescription>
            </DialogHeader>

            <Form action={`/admin/master/${entity}/${record.id}`} method="post" className="space-y-4">
                <input type="hidden" name="_method" value="delete" />
                <input type="hidden" name="_token" value="" />
                <div className="text-sm text-slate-600 dark:text-slate-300">
                    Record: <span className="font-semibold">{String(record.name ?? record.category ?? record.city ?? record.area ?? record.plan_name ?? record.country ?? record.state ?? '')}</span>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" type="submit">
                        Delete
                    </Button>
                </div>
            </Form>
        </DialogContent>
    </Dialog>
);

function MasterFields({
    entity,
    lookups,
    record,
}: {
    entity: string;
    lookups: Record<string, unknown>;
    record?: Record<string, unknown>;
}) {
    const row = record ?? {};
    const countries = lookups.countries as Array<Record<string, unknown>>;
    const states = lookups.states as Array<Record<string, unknown>>;
    const cities = lookups.cities as Array<Record<string, unknown>>;

    return (
        <div className="space-y-4">
            {entity === 'business-categories' && (
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" name="category" defaultValue={String(row.category ?? '')} />
                    </div>
                </div>
            )}
            {entity === 'languages' && (
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="language">Language</Label>
                        <Input id="language" name="language" defaultValue={String(row.language ?? '')} />
                    </div>
                    <div>
                        <Label htmlFor="code">Code</Label>
                        <Input id="code" name="code" defaultValue={String(row.code ?? '')} />
                    </div>
                </div>
            )}
            {entity === 'countries' && (
                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" name="country" defaultValue={String(row.country ?? '')} />
                    </div>
                    <div>
                        <Label htmlFor="iso3">ISO3</Label>
                        <Input id="iso3" name="iso3" defaultValue={String(row.iso3 ?? '')} />
                    </div>
                    <div>
                        <Label htmlFor="phone_code">Phone Code</Label>
                        <Input id="phone_code" name="phone_code" defaultValue={String(row.phone_code ?? '')} />
                    </div>
                </div>
            )}
            {entity === 'states' && (
                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <Label htmlFor="country_id">Country</Label>
                        <select id="country_id" name="country_id" className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
                            <option value="">Select country</option>
                            {countries.map((country) => (
                                <option key={country.id} value={country.id} selected={country.id === row.country_id}>
                                    {country.country}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor="state">State</Label>
                        <Input id="state" name="state" defaultValue={String(row.state ?? '')} />
                    </div>
                    <div>
                        <Label htmlFor="code">Code</Label>
                        <Input id="code" name="code" defaultValue={String(row.code ?? '')} />
                    </div>
                </div>
            )}
            {entity === 'cities' && (
                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <Label htmlFor="state_id">State</Label>
                        <select id="state_id" name="state_id" className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
                            <option value="">Select state</option>
                            {states.map((state) => (
                                <option key={state.id} value={state.id} selected={state.id === row.state_id}>
                                    {state.state}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" defaultValue={String(row.city ?? '')} />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                        <input id="is_top_city" name="is_top_city" type="checkbox" defaultChecked={Boolean(row.is_top_city)} />
                        <Label htmlFor="is_top_city">Top city</Label>
                    </div>
                </div>
            )}
            {entity === 'areas' && (
                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <Label htmlFor="city_id">City</Label>
                        <select id="city_id" name="city_id" className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
                            <option value="">Select city</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.id} selected={city.id === row.city_id}>
                                    {city.city}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <Label htmlFor="area">Area</Label>
                        <Input id="area" name="area" defaultValue={String(row.area ?? '')} />
                    </div>
                    <div>
                        <Label htmlFor="zipcode">Zipcode</Label>
                        <Input id="zipcode" name="zipcode" defaultValue={String(row.zipcode ?? '')} />
                    </div>
                </div>
            )}
            {entity === 'plans' && (
                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <Label htmlFor="plan_name">Plan Name</Label>
                        <Input id="plan_name" name="plan_name" defaultValue={String(row.plan_name ?? '')} />
                    </div>
                    <div>
                        <Label htmlFor="price">Price</Label>
                        <Input id="price" name="price" type="number" defaultValue={String(row.price ?? '')} />
                    </div>
                    <div>
                        <Label htmlFor="duration_in_days">Duration (days)</Label>
                        <Input id="duration_in_days" name="duration_in_days" type="number" defaultValue={String(row.duration_in_days ?? '')} />
                    </div>
                    <div>
                        <Label htmlFor="staff_limit">Staff Limit</Label>
                        <Input id="staff_limit" name="staff_limit" type="number" defaultValue={String(row.staff_limit ?? '')} />
                    </div>
                    <div>
                        <Label htmlFor="tracking_duration">Tracking Duration</Label>
                        <Input id="tracking_duration" name="tracking_duration" type="number" defaultValue={String(row.tracking_duration ?? '')} />
                    </div>
                    <div>
                        <Label htmlFor="remarks">Remarks</Label>
                        <Input id="remarks" name="remarks" defaultValue={String(row.remarks ?? '')} />
                    </div>
                </div>
            )}
        </div>
    );
}

MasterIndex.layout = (page: React.ReactNode) => <Demo1Layout>{page}</Demo1Layout>;
