import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import {
    AlertCircle,
    Calendar,
    Check,
    CheckCircle2,
    ChevronDown,
    Clock,
    Download,
    EllipsisVertical,
    FileSpreadsheet,
    FolderPlus,
    Loader2,
    Package,
    Plus,
    RefreshCw,
    SquarePen,
    Trash2,
    Upload,
    UploadCloud,
    Users,
    X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Container } from '@/components/common/container';
import { DynamicColumn, DynamicTable } from '@/components/common/dynamic-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Demo1Layout from '@/layouts/demo1/layout';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/components/toolbar';
import * as XLSX from 'xlsx';

type CountryLookup = { id: number; country: string };
type StateLookup = { id: number; state: string; country_id: number };
type CityLookup = { id: number; city: string; state_id: number };
type ProductLookup = { id: number; name: string; code: string; description?: string };

type Lookups = {
    countries?: CountryLookup[];
    states?: StateLookup[];
    cities?: CityLookup[];
    products?: ProductLookup[];
};

type MasterRecord = Record<string, any>;

const entityTitles: Record<string, string> = {
    'business-categories': 'Business Categories',
    languages: 'Languages',
    countries: 'Countries',
    states: 'States',
    cities: 'Cities',
    areas: 'Areas',
    plans: 'Plans',
};

const entitySingular: Record<string, string> = {
    'business-categories': 'Business Category',
    languages: 'Language',
    countries: 'Country',
    states: 'State',
    cities: 'City',
    areas: 'Area',
    plans: 'Plan',
};

const entityDescriptions: Record<string, string> = {
    'business-categories': 'Manage business categories for client companies and system classification.',
    languages: 'Manage supported system and client languages.',
    countries: 'Manage geographic country locations and dialing codes.',
    states: 'Manage states and provinces linked to countries.',
    cities: 'Manage cities and top city highlights linked to states.',
    areas: 'Manage local areas and postal zip codes linked to cities.',
    plans: 'Manage subscription plans, pricing, staff limits, and tracking limits.',
};

export default function MasterIndex() {
    const { props } = usePage();
    const { entity } = props as unknown as {
        entity: string;
    };

    const [items, setItems] = useState<MasterRecord[]>([]);
    const [lookups, setLookups] = useState<Lookups>({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Artificial delay to test Shimmer UI
            const res = await fetch(`/api/v1/admin/master/${entity}`);
            const data = await res.json();
            if (data.data) {
                setItems(data.data);
            }
            
            const neededLookups: Lookups = {};
            if (entity === 'states') {
                const cRes = await fetch('/api/v1/admin/master/countries');
                const cData = await cRes.json();
                neededLookups.countries = cData.data;
            } else if (entity === 'cities') {
                const sRes = await fetch('/api/v1/admin/master/states');
                const sData = await sRes.json();
                neededLookups.states = sData.data;
            } else if (entity === 'areas') {
                const ciRes = await fetch('/api/v1/admin/master/cities');
                const ciData = await ciRes.json();
                neededLookups.cities = ciData.data;
            } else if (entity === 'plans') {
                const pRes = await fetch('/api/v1/admin/master/products');
                const pData = await pRes.json();
                neededLookups.products = pData.data;
            }
            setLookups(neededLookups);
            
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [entity]);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<MasterRecord | null>(null);
    const [deletingRecord, setDeletingRecord] = useState<MasterRecord | null>(null);

    const title = entityTitles[entity] ?? 'Masters';
    const singularName = entitySingular[entity] ?? 'Record';
    const description = entityDescriptions[entity] ?? `Manage ${title.toLowerCase()} from a single admin interface.`;

    const columns = useMemo<DynamicColumn<MasterRecord>[]>(() => {
        const baseColumns: DynamicColumn<MasterRecord>[] = [
            {
                key: 'id',
                header: '#',
                align: 'center',
                sortable: true,
                cell: (_item, index) => <span className="text-muted-foreground font-medium">{index + 1}</span>,
            },
        ];

        switch (entity) {
            case 'business-categories':
                baseColumns.push({
                    key: 'category',
                    header: 'Category Name',
                    sortable: true,
                    cell: (item) => <span className="font-semibold text-foreground">{item.category}</span>,
                });
                break;
            case 'languages':
                baseColumns.push(
                    {
                        key: 'language',
                        header: 'Language Name',
                        sortable: true,
                        cell: (item) => <span className="font-semibold text-foreground">{item.language}</span>,
                    },
                    {
                        key: 'code',
                        header: 'Language Code',
                        sortable: true,
                        cell: (item) => <span className="font-medium text-muted-foreground">{item.code || '-'}</span>,
                    }
                );
                break;
            case 'countries':
                baseColumns.push(
                    {
                        key: 'country',
                        header: 'Country Name',
                        sortable: true,
                        cell: (item) => <span className="font-semibold text-foreground">{item.country}</span>,
                    },
                    {
                        key: 'iso3',
                        header: 'ISO3 Code',
                        sortable: true,
                        cell: (item) => <span className="font-medium text-muted-foreground">{item.iso3 || '-'}</span>,
                    },
                    {
                        key: 'phone_code',
                        header: 'Phone Code',
                        sortable: true,
                        cell: (item) => (
                            <span className="font-medium text-muted-foreground">
                                {item.phone_code
                                    ? item.phone_code.startsWith('+')
                                        ? item.phone_code
                                        : `+${item.phone_code}`
                                    : '-'}
                            </span>
                        ),
                    }
                );
                break;
            case 'states':
                baseColumns.push(
                    {
                        key: 'state',
                        header: 'State Name',
                        sortable: true,
                        cell: (item) => <span className="font-semibold text-foreground">{item.state}</span>,
                    },
                    {
                        key: 'country',
                        header: 'Country',
                        sortable: true,
                        cell: (item) => <span className="font-medium text-foreground">{item.country || '-'}</span>,
                    },
                    {
                        key: 'code',
                        header: 'State Code',
                        sortable: true,
                        cell: (item) => <span className="font-medium text-muted-foreground">{item.code || '-'}</span>,
                    }
                );
                break;
            case 'cities':
                baseColumns.push(
                    {
                        key: 'city',
                        header: 'City Name',
                        sortable: true,
                        cell: (item) => <span className="font-semibold text-foreground">{item.city}</span>,
                    },
                    {
                        key: 'state',
                        header: 'State',
                        sortable: true,
                        cell: (item) => <span className="font-medium text-foreground">{item.state || '-'}</span>,
                    },
                    {
                        key: 'is_top_city',
                        header: 'Top City',
                        sortable: true,
                        cell: (item) =>
                            item.is_top_city ? (
                                <Badge className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20 font-semibold">
                                    Top City
                                </Badge>
                            ) : (
                                <span className="text-xs text-muted-foreground font-medium">Standard</span>
                            ),
                    }
                );
                break;
            case 'areas':
                baseColumns.push(
                    {
                        key: 'area',
                        header: 'Area Name',
                        sortable: true,
                        cell: (item) => <span className="font-semibold text-foreground">{item.area}</span>,
                    },
                    {
                        key: 'city',
                        header: 'City',
                        sortable: true,
                        cell: (item) => <span className="font-medium text-foreground">{item.city || '-'}</span>,
                    },
                    {
                        key: 'zipcode',
                        header: 'Zip Code',
                        sortable: true,
                        cell: (item) => <span className="font-medium text-muted-foreground">{item.zipcode || '-'}</span>,
                    }
                );
                break;
            case 'plans':
                baseColumns.push(
                    {
                        key: 'plan_name',
                        header: 'Plan Name',
                        sortable: true,
                        cell: (item) => (
                            <div>
                                <span className="font-semibold text-foreground">{item.plan_name}</span>
                                {item.remarks && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.remarks}</p>}
                            </div>
                        ),
                    },
                    {
                        key: 'products',
                        header: 'Products, Pricing & Limits',
                        cell: (item) => {
                            const products = item.products || [];
                            if (products.length > 0) {
                                return (
                                    <div className="flex flex-wrap gap-1.5 max-w-md">
                                        {products.map((p: any) => (
                                            <Badge
                                                key={p.id}
                                                variant="outline"
                                                className="bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 py-1 px-2 text-xs flex items-center gap-1.5 rounded-lg shadow-2xs"
                                            >
                                                <Package className="size-3 text-blue-500 shrink-0" />
                                                <span className="font-semibold">{p.name}</span>
                                                <span className="bg-blue-600/10 dark:bg-blue-400/20 px-1.5 py-0.5 rounded text-[11px] font-bold text-blue-800 dark:text-blue-200">
                                                    ₹{Number(p.pivot?.price_per_user ?? 0).toFixed(2)}/user
                                                </span>
                                                <span className="text-[10px] text-muted-foreground font-medium bg-muted/60 px-1 py-0.5 rounded">
                                                    {p.pivot?.staff_limit ?? item.staff_limit ?? 10} users
                                                </span>
                                            </Badge>
                                        ))}
                                    </div>
                                );
                            }
                            return (
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                                    ₹{Number(item.price ?? 0).toFixed(2)}
                                </span>
                            );
                        },
                    },
                    {
                        key: 'duration_in_days',
                        header: 'Duration',
                        sortable: true,
                        cell: (item) => (
                            <span className="font-medium text-foreground flex items-center gap-1.5 text-xs">
                                <Calendar className="size-3.5 text-muted-foreground" />
                                {item.duration_in_days} days
                            </span>
                        ),
                    },
                    {
                        key: 'tracking_duration',
                        header: 'Tracking Duration (Hours/day)',
                        sortable: true,
                        cell: (item) => (
                            <span className="font-medium text-foreground flex items-center gap-1.5 text-xs">
                                <Clock className="size-3.5 text-muted-foreground" />
                                {item.tracking_duration} hrs/day
                            </span>
                        ),
                    }
                );
                break;
        }

        baseColumns.push({
            key: 'actions',
            header: 'Actions',
            align: 'right',
            hideable: false,
            cell: (item) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button mode="icon" variant="ghost" className="size-8">
                            <EllipsisVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem onClick={() => setEditingRecord(item)} className="gap-2 cursor-pointer">
                            <SquarePen className="size-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setDeletingRecord(item)}
                            className="gap-2 cursor-pointer text-destructive"
                        >
                            <Trash2 className="size-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        });

        return baseColumns;
    }, [entity]);

    return (
        <>
            <Head title={`${title} | Admin`} />
            <Container>
                <Toolbar>
                    <ToolbarHeading title={title} description={description} />
                    <ToolbarActions>
                        <Button variant="outline" onClick={() => setIsImportOpen(true)} className="gap-2 shadow-xs">
                            <Upload className="size-4" />
                            Import
                        </Button>
                        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 shadow-xs">
                            <Plus className="size-4" />
                            Add {singularName}
                        </Button>
                    </ToolbarActions>
                </Toolbar>
            </Container>

            <Container>
                <DynamicTable
                    data={items}
                    columns={columns}
                    searchPlaceholder={`Search ${title.toLowerCase()}...`}
                    exportFilename={entity}
                    defaultPageSize={5}
                    isLoading={isLoading}
                />
            </Container>

            <CreateRecordModal
                entity={entity}
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                    onSuccess={fetchData}
                lookups={lookups}
            />

            <ImportRecordModal
                entity={entity}
                isOpen={isImportOpen}
                onClose={() => setIsImportOpen(false)}
                    onSuccess={fetchData}
                lookups={lookups}
                items={items}
            />

            {editingRecord && (
                <EditRecordModal
                    entity={entity}
                    record={editingRecord}
                    isOpen={Boolean(editingRecord)}
                    onClose={() => setEditingRecord(null)}
                    onSuccess={fetchData}
                    lookups={lookups}
                />
            )}

            {deletingRecord && (
                <DeleteRecordModal
                    entity={entity}
                    record={deletingRecord}
                    isOpen={Boolean(deletingRecord)}
                    onClose={() => setDeletingRecord(null)}
                    onSuccess={fetchData}
                />
            )}
        </>
    );
}

function CreateRecordModal({
    entity,
    isOpen,
    onClose,
    lookups,
    onSuccess,
}: {
    entity: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    lookups: Lookups;
}) {
    const singularName = entitySingular[entity] || 'Record';

    const getInitialFormData = () => {
        switch (entity) {
            case 'business-categories':
                return { category: '' };
            case 'languages':
                return { language: '', code: '' };
            case 'countries':
                return { country: '', iso3: '', phone_code: '' };
            case 'states':
                return {
                    country_id: lookups.countries?.[0]?.id ? String(lookups.countries[0].id) : '',
                    state: '',
                    code: '',
                };
            case 'cities':
                return {
                    state_id: lookups.states?.[0]?.id ? String(lookups.states[0].id) : '',
                    city: '',
                    is_top_city: false,
                };
            case 'areas':
                return {
                    city_id: lookups.cities?.[0]?.id ? String(lookups.cities[0].id) : '',
                    area: '',
                    zipcode: '',
                };
            case 'plans':
                return {
                    plan_name: '',
                    duration_in_days: 30,
                    staff_limit: 10,
                    tracking_duration: 24,
                    remarks: '',
                    products: [],
                };
            default:
                return {};
        }
    };

    const [data, setData] = useState<Record<string, any>>(getInitialFormData());
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleFieldChange = (key: string, value: any) => {
        setData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        try {
            const res = await fetch(`/api/v1/admin/master/${entity}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                setData(getInitialFormData());
                onSuccess();
                onClose();
            } else if (res.status === 422) {
                const errData = await res.json();
                setErrors(errData.errors || {});
            }
        } catch (error) {
            console.error(error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={`rounded-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto [&>button[data-slot=dialog-close]]:text-white [&>button[data-slot=dialog-close]]:opacity-80 [&>button[data-slot=dialog-close]]:hover:opacity-100 [&>button[data-slot=dialog-close]]:top-4 [&>button[data-slot=dialog-close]]:end-4 ${entity === 'plans' ? 'sm:max-w-2xl' : 'sm:max-w-md'}`}>
                <DialogHeader className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-row items-center gap-3 space-y-0 shadow-xs">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-xs">
                        <FolderPlus className="size-5" />
                    </div>
                    <div className="pr-6">
                        <DialogTitle className="text-base font-bold text-white leading-tight">Add {singularName}</DialogTitle>
                        <DialogDescription className="text-xs text-blue-100/90 leading-normal">
                            Create a new {singularName.toLowerCase()} entry.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="p-4 space-y-3.5">
                        <MasterFormFields
                            entity={entity}
                            data={data}
                            setData={handleFieldChange}
                            errors={errors as Record<string, string>}
                            lookups={lookups}
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2.5 px-4 py-3 border-t border-border/60 bg-muted/20">
                        <Button type="button" variant="outline" onClick={onClose} className="rounded-lg h-9">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="rounded-lg h-9 gap-2 shadow-xs bg-blue-600 hover:bg-blue-700 text-white">
                            {processing && <Loader2 className="size-4 animate-spin" />}
                            Create {singularName}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

type ParsedRow = {
    raw: Record<string, any>;
    errors: string[];
    isValid: boolean;
};

function ImportRecordModal({
    entity,
    isOpen,
    onClose,
    lookups,
    items,
}: {
    entity: string;
    isOpen: boolean;
    onClose: () => void;
    lookups: Lookups;
    items: MasterRecord[];
}) {
    const title = entityTitles[entity] || 'Records';
    const [fileName, setFileName] = useState<string | null>(null);
    const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toTitleCase = (str: string): string => {
        return str
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const validateRow = (row: Record<string, any>, seenNames?: Set<string>): ParsedRow => {
        const errors: string[] = [];

        // Identify the name field name
        let nameFieldKey = '';
        switch (entity) {
            case 'states': nameFieldKey = 'state'; break;
            case 'cities': nameFieldKey = 'city'; break;
            case 'areas': nameFieldKey = 'area'; break;
            case 'languages': nameFieldKey = 'language'; break;
            case 'countries': nameFieldKey = 'country'; break;
            case 'plans': nameFieldKey = 'plan_name'; break;
            case 'business-categories': nameFieldKey = 'category'; break;
        }

        // Get the trimmed name value
        const nameVal = nameFieldKey ? String(row[nameFieldKey] || '').trim() : '';

        // Uniqueness validation in import file
        if (nameVal && seenNames) {
            const nameLower = nameVal.toLowerCase();
            if (seenNames.has(nameLower)) {
                errors.push(`Duplicate name "${nameVal}" in the import file`);
            } else {
                seenNames.add(nameLower);
            }
        }

        // Uniqueness validation against database records
        if (nameVal && nameFieldKey && items) {
            const isDuplicateInDb = items.some(
                (item) => String(item[nameFieldKey] || '').trim().toLowerCase() === nameVal.toLowerCase()
            );
            if (isDuplicateInDb) {
                errors.push(`"${nameVal}" already exists in the system`);
            }
        }

        switch (entity) {
            case 'states': {
                const state = String(row.state || row.State || '').trim();
                const country = String(row.country || row.Country || row.country_id || '').trim();

                if (!state) {
                    errors.push('State name is required');
                }

                if (!country) {
                    errors.push('Country is required');
                } else {
                    const found = lookups.countries?.some(
                        (c) =>
                            String(c.id) === country ||
                            c.country.toLowerCase() === country.toLowerCase()
                    );
                    if (!found) {
                        errors.push(`Country "${country}" not found in system`);
                    }
                }
                break;
            }
            case 'cities': {
                const city = String(row.city || row.City || '').trim();
                const state = String(row.state || row.State || row.state_id || '').trim();

                if (!city) {
                    errors.push('City name is required');
                }

                if (!state) {
                    errors.push('State is required');
                } else {
                    const found = lookups.states?.some(
                        (s) =>
                            String(s.id) === state ||
                            s.state.toLowerCase() === state.toLowerCase()
                    );
                    if (!found) {
                        errors.push(`State "${state}" not found in system`);
                    }
                }
                break;
            }
            case 'areas': {
                const area = String(row.area || row.Area || '').trim();
                const city = String(row.city || row.City || row.city_id || '').trim();

                if (!area) {
                    errors.push('Area name is required');
                }

                if (!city) {
                    errors.push('City is required');
                } else {
                    const found = lookups.cities?.some(
                        (c) =>
                            String(c.id) === city ||
                            c.city.toLowerCase() === city.toLowerCase()
                    );
                    if (!found) {
                        errors.push(`City "${city}" not found in system`);
                    }
                }
                break;
            }
            case 'languages': {
                const lang = String(row.language || row.Language || '').trim();
                if (!lang) {
                    errors.push('Language name is required');
                }
                break;
            }
            case 'countries': {
                const c = String(row.country || row.Country || '').trim();
                if (!c) {
                    errors.push('Country name is required');
                }
                break;
            }
            case 'plans': {
                const plan = String(row.plan_name || row.PlanName || row.plan || '').trim();
                if (!plan) {
                    errors.push('Plan name is required');
                }
                break;
            }
            case 'business-categories': {
                const cat = String(row.category || row.Category || '').trim();
                if (!cat) {
                    errors.push('Category name is required');
                }
                break;
            }
        }

        return {
            raw: row,
            errors,
            isValid: errors.length === 0,
        };
    };

    const normalizeRowKeys = (row: Record<string, any>): Record<string, any> => {
        const clean: Record<string, any> = {};
        for (const key of Object.keys(row)) {
            const cleanKey = key.trim().replace(/\*$/, '').trim();
            clean[cleanKey] = row[key];
        }
        return clean;
    };

    const handleFileParse = (file: File) => {
        setFileName(file.name);

        const seenNames = new Set<string>();

        if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                const normalized = (json as Record<string, any>[]).map(normalizeRowKeys);

                let nameFieldKey = '';
                switch (entity) {
                    case 'states': nameFieldKey = 'state'; break;
                    case 'cities': nameFieldKey = 'city'; break;
                    case 'areas': nameFieldKey = 'area'; break;
                    case 'languages': nameFieldKey = 'language'; break;
                    case 'countries': nameFieldKey = 'country'; break;
                    case 'plans': nameFieldKey = 'plan_name'; break;
                    case 'business-categories': nameFieldKey = 'category'; break;
                }
                const formatted = normalized.map(r => {
                    if (nameFieldKey && r[nameFieldKey]) {
                        r[nameFieldKey] = toTitleCase(String(r[nameFieldKey]));
                    }
                    return r;
                });

                const validated = formatted.map((r) => validateRow(r, seenNames));
                setParsedRows(validated);
            };
            reader.readAsArrayBuffer(file);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            if (!content) return;

            let rows: Record<string, any>[] = [];

            if (file.name.endsWith('.json')) {
                try {
                    const parsed = JSON.parse(content);
                    const rawRows = Array.isArray(parsed) ? parsed : [parsed];
                    rows = rawRows.map(normalizeRowKeys);
                } catch {
                    alert('Invalid JSON file format.');
                    return;
                }
            } else {
                // Parse CSV
                const lines = content
                    .split(/\r\n|\n/)
                    .map((l) => l.trim())
                    .filter(Boolean);

                if (lines.length > 1) {
                    const headers = lines[0]
                        .split(',')
                        .map((h) => h.replace(/^"(.*)"$/, '$1').trim().replace(/\*$/, '').trim());

                    rows = lines.slice(1).map((line) => {
                        const values = line
                            .split(',')
                            .map((v) => v.replace(/^"(.*)"$/, '$1').trim());
                        const rowObj: Record<string, any> = {};
                        headers.forEach((h, i) => {
                            rowObj[h] = values[i] ?? '';
                        });
                        return rowObj;
                    });
                }
            }

            let nameFieldKey = '';
            switch (entity) {
                case 'states': nameFieldKey = 'state'; break;
                case 'cities': nameFieldKey = 'city'; break;
                case 'areas': nameFieldKey = 'area'; break;
                case 'languages': nameFieldKey = 'language'; break;
                case 'countries': nameFieldKey = 'country'; break;
                case 'plans': nameFieldKey = 'plan_name'; break;
                case 'business-categories': nameFieldKey = 'category'; break;
            }
            const formatted = rows.map(r => {
                if (nameFieldKey && r[nameFieldKey]) {
                    r[nameFieldKey] = toTitleCase(String(r[nameFieldKey]));
                }
                return r;
            });

            const validated = formatted.map((r) => validateRow(r, seenNames));
            setParsedRows(validated);
        };

        reader.readAsText(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileParse(e.dataTransfer.files[0]);
        }
    };

    const handleDownloadTemplate = () => {
        let headers: string[] = [];
        let sampleData: Record<string, any>[] = [];

        switch (entity) {
            case 'states':
                headers = ['state*', 'country*', 'code'];
                sampleData = [
                    { 'state*': 'California', 'country*': 'United States', code: 'CA' },
                    { 'state*': 'Ontario', 'country*': 'Canada', code: 'ON' }
                ];
                break;
            case 'cities':
                headers = ['city*', 'state*', 'is_top_city'];
                sampleData = [
                    { 'city*': 'Los Angeles', 'state*': 'California', is_top_city: 'true' },
                    { 'city*': 'Toronto', 'state*': 'Ontario', is_top_city: 'false' }
                ];
                break;
            case 'areas':
                headers = ['area*', 'city*', 'zipcode'];
                sampleData = [
                    { 'area*': 'Downtown', 'city*': 'Los Angeles', zipcode: '90001' },
                    { 'area*': 'Westside', 'city*': 'Los Angeles', zipcode: '90025' }
                ];
                break;
            case 'languages':
                headers = ['language*', 'code'];
                sampleData = [
                    { 'language*': 'English', code: 'en' },
                    { 'language*': 'Spanish', code: 'es' }
                ];
                break;
            case 'countries':
                headers = ['country*', 'iso3', 'phone_code'];
                sampleData = [
                    { 'country*': 'United States', iso3: 'USA', phone_code: '+1' },
                    { 'country*': 'India', iso3: 'IND', phone_code: '+91' }
                ];
                break;
            case 'plans':
                headers = ['plan_name*', 'price', 'duration_in_days', 'staff_limit', 'tracking_duration', 'remarks'];
                sampleData = [
                    { 'plan_name*': 'Basic Plan', price: '29.99', duration_in_days: '30', staff_limit: '5', tracking_duration: '30', remarks: 'Standard basic tier' }
                ];
                break;
            case 'business-categories':
                headers = ['category*'];
                sampleData = [
                    { 'category*': 'Retail' },
                    { 'category*': 'Healthcare' },
                    { 'category*': 'Technology' }
                ];
                break;
        }

        const worksheet = XLSX.utils.json_to_sheet(sampleData, { header: headers });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, entity);

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${entity}-sample-template.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const validRowsCount = useMemo(() => parsedRows.filter((r) => r.isValid).length, [parsedRows]);
    const invalidRowsCount = useMemo(() => parsedRows.filter((r) => !r.isValid).length, [parsedRows]);

    const handleImportSubmit = () => {
        const validPayload = parsedRows.filter((r) => r.isValid).map((r) => r.raw);
        if (validPayload.length === 0) return;

        setIsSubmitting(true);
        router.post(
            `/admin/master/${entity}/import`,
            { rows: validPayload },
            {
                onFinish: () => {
                    setIsSubmitting(false);
                    setFileName(null);
                    setParsedRows([]);
                    onClose();
                },
            }
        );
    };

    const headers = parsedRows.length > 0 ? Object.keys(parsedRows[0].raw) : [];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-5xl rounded-2xl p-0 overflow-hidden max-h-[90vh] flex flex-col [&>button[data-slot=dialog-close]]:text-white [&>button[data-slot=dialog-close]]:opacity-80 [&>button[data-slot=dialog-close]]:hover:opacity-100 [&>button[data-slot=dialog-close]]:top-4 [&>button[data-slot=dialog-close]]:end-4">
                <DialogHeader className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-row items-center gap-3 space-y-0 shadow-xs shrink-0">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-xs">
                        <FileSpreadsheet className="size-5" />
                    </div>
                    <div className="pr-6">
                        <DialogTitle className="text-base font-bold text-white leading-tight">Import {title}</DialogTitle>
                        <DialogDescription className="text-xs text-blue-100/90 leading-normal">
                            Upload a CSV, JSON, or Excel file to bulk import {title.toLowerCase()}.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="p-4 space-y-4 overflow-y-auto flex-1">
                    {/* Drag and Drop Zone */}
                    <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${isDragging
                                ? 'border-primary bg-primary/5'
                                : 'border-border/80 bg-muted/10 hover:border-primary/60 hover:bg-muted/20'
                            }`}
                    >
                        <input
                            type="file"
                            accept=".csv, .json, .xlsx, .xls, .txt"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    handleFileParse(e.target.files[0]);
                                }
                            }}
                            className="absolute inset-0 cursor-pointer opacity-0"
                        />
                        <UploadCloud className="size-9 text-muted-foreground/80 mb-2" />
                        <p className="text-sm font-semibold text-foreground">
                            {fileName ? fileName : 'Drag & drop file here, or click to browse'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Supports .CSV, .JSON, .XLSX, .XLS files</p>

                        <div className="mt-3 flex items-center gap-2 relative z-10">
                            <Button
                                type="button"
                                variant="outline"
                                mode="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadTemplate();
                                }}
                                className="rounded-lg text-xs gap-1.5 h-8"
                            >
                                <Download className="size-3.5" />
                                Download Sample Excel
                            </Button>
                        </div>
                    </div>

                    {/* Preview & Validation Table */}
                    {parsedRows.length > 0 && (
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Validation Result
                                </span>
                                <div className="flex items-center gap-2 text-xs">
                                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20 font-semibold gap-1">
                                        <CheckCircle2 className="size-3" />
                                        {validRowsCount} Valid
                                    </Badge>
                                    {invalidRowsCount > 0 && (
                                        <Badge variant="outline" className="bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border-rose-500/20 font-semibold gap-1">
                                            <AlertCircle className="size-3" />
                                            {invalidRowsCount} Errors
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="max-h-64 overflow-y-auto rounded-xl border border-border/60">
                                <table className="w-full text-left text-xs">
                                    <thead className="sticky top-0 bg-muted/90 text-muted-foreground border-b border-border/60 font-semibold backdrop-blur-xs">
                                        <tr>
                                            <th className="p-2.5 w-10 text-center">#</th>
                                            {headers.map(h => (
                                                <th key={h} className="p-2.5 capitalize">{h.replace(/_/g, ' ')}</th>
                                            ))}
                                            <th className="p-2.5 text-right">Errors</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {invalidRowsCount > 0 ? (
                                            parsedRows.filter(r => !r.isValid).map((row, idx) => (
                                                <tr key={idx} className="bg-rose-500/5">
                                                    <td className="p-2.5 text-center text-muted-foreground font-medium">{idx + 1}</td>
                                                    {headers.map(h => (
                                                        <td key={h} className="p-2.5 font-medium text-foreground">{String(row.raw[h] ?? '-')}</td>
                                                    ))}
                                                    <td className="p-2.5 text-right font-semibold text-rose-600 dark:text-rose-400">
                                                        {row.errors.join(', ')}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={headers.length + 2} className="p-8 text-center text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/5">
                                                    All {validRowsCount} records are valid! Ready to import.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-2.5 px-4 py-3 border-t border-border/60 bg-muted/20 shrink-0">
                    <Button type="button" variant="outline" onClick={onClose} className="rounded-lg h-9">
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        disabled={validRowsCount === 0 || isSubmitting}
                        onClick={handleImportSubmit}
                        className="rounded-lg h-9 gap-2 shadow-xs bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                        Import {validRowsCount} Record(s)
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function EditRecordModal({
    entity,
    record,
    isOpen,
    onClose,
    lookups,
    onSuccess,
}: {
    entity: string;
    record: MasterRecord;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    lookups: Lookups;
}) {
    const singularName = entitySingular[entity] || 'Record';

    const getFormData = () => {
        switch (entity) {
            case 'business-categories':
                return { category: record.category ?? '' };
            case 'languages':
                return { language: record.language ?? '', code: record.code ?? '' };
            case 'countries':
                return { country: record.country ?? '', iso3: record.iso3 ?? '', phone_code: record.phone_code ?? '' };
            case 'states':
                return {
                    country_id: String(
                        record.country_id ??
                        lookups.countries?.find((c) => c.country === record.country)?.id ??
                        lookups.countries?.[0]?.id ??
                        ''
                    ),
                    state: record.state ?? '',
                    code: record.code ?? '',
                };
            case 'cities':
                return {
                    state_id: String(
                        record.state_id ??
                        lookups.states?.find((s) => s.state === record.state)?.id ??
                        lookups.states?.[0]?.id ??
                        ''
                    ),
                    city: record.city ?? '',
                    is_top_city: Boolean(record.is_top_city),
                };
            case 'areas':
                return {
                    city_id: String(
                        record.city_id ??
                        lookups.cities?.find((c) => c.city === record.city)?.id ??
                        lookups.cities?.[0]?.id ??
                        ''
                    ),
                    area: record.area ?? '',
                    zipcode: record.zipcode ?? '',
                };
            case 'plans':
                return {
                    plan_name: record.plan_name ?? '',
                    duration_in_days: record.duration_in_days ?? '',
                    staff_limit: record.staff_limit ?? '',
                    tracking_duration: record.tracking_duration ?? '',
                    remarks: record.remarks ?? '',
                    products: record.products?.map((p: any) => ({
                        product_id: p.id,
                        name: p.name,
                        code: p.code,
                        price_per_user: p.pivot?.price_per_user ?? 0,
                        staff_limit: p.pivot?.staff_limit ?? record.staff_limit ?? 10,
                    })) || (record.product_id ? [{
                        product_id: record.product_id,
                        name: record.product?.name ?? 'Product',
                        code: record.product?.code ?? '',
                        price_per_user: record.price ?? 0,
                        staff_limit: record.staff_limit ?? 10,
                    }] : []),
                };
            default:
                return {};
        }
    };

    const [data, setData] = useState<Record<string, any>>(getFormData());
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleFieldChange = (key: string, value: any) => {
        setData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        try {
            const res = await fetch(`/api/v1/admin/master/${entity}/${record.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                onSuccess();
                onClose();
            } else if (res.status === 422) {
                const errData = await res.json();
                setErrors(errData.errors || {});
            }
        } catch (error) {
            console.error(error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={`rounded-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto [&>button[data-slot=dialog-close]]:text-white [&>button[data-slot=dialog-close]]:opacity-80 [&>button[data-slot=dialog-close]]:hover:opacity-100 [&>button[data-slot=dialog-close]]:top-4 [&>button[data-slot=dialog-close]]:end-4 ${entity === 'plans' ? 'sm:max-w-2xl' : 'sm:max-w-md'}`}>
                <DialogHeader className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-row items-center gap-3 space-y-0 shadow-xs">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-xs">
                        <SquarePen className="size-5" />
                    </div>
                    <div className="pr-6">
                        <DialogTitle className="text-base font-bold text-white leading-tight">Edit {singularName}</DialogTitle>
                        <DialogDescription className="text-xs text-blue-100/90 leading-normal">
                            Update details for this {singularName.toLowerCase()}.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="p-4 space-y-3.5">
                        <MasterFormFields
                            entity={entity}
                            data={data}
                            setData={handleFieldChange}
                            errors={errors as Record<string, string>}
                            lookups={lookups}
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2.5 px-4 py-3 border-t border-border/60 bg-muted/20">
                        <Button type="button" variant="outline" onClick={onClose} className="rounded-lg h-9">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="rounded-lg h-9 gap-2 shadow-xs bg-amber-600 hover:bg-amber-700 text-white">
                            {processing && <Loader2 className="size-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteRecordModal({
    entity,
    record,
    isOpen,
    onClose,
    onSuccess,
}: {
    entity: string;
    record: MasterRecord;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [deleting, setDeleting] = useState(false);
    const singularName = entitySingular[entity] || 'Record';

    const recordDisplayName =
        record.category ||
        record.language ||
        record.country ||
        record.state ||
        record.city ||
        record.area ||
        record.plan_name ||
        `Record #${record.id}`;

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/v1/admin/master/${entity}/${record.id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                },
            });
            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                const err = await res.json().catch(() => ({}));
                alert(err.message || 'Failed to delete record.');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('An unexpected error occurred while deleting.');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden [&>button[data-slot=dialog-close]]:text-white [&>button[data-slot=dialog-close]]:opacity-80 [&>button[data-slot=dialog-close]]:hover:opacity-100 [&>button[data-slot=dialog-close]]:top-4 [&>button[data-slot=dialog-close]]:end-4">
                <DialogHeader className="p-4 bg-gradient-to-r from-rose-600 to-red-600 text-white flex flex-row items-center gap-3 space-y-0 shadow-xs">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-xs">
                        <Trash2 className="size-5" />
                    </div>
                    <div className="pr-6">
                        <DialogTitle className="text-base font-bold text-white leading-tight">Delete {singularName}</DialogTitle>
                        <DialogDescription className="text-xs text-rose-100/90 leading-normal">
                            This action cannot be undone.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="p-4">
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete <span className="font-semibold text-foreground">"{recordDisplayName}"</span>?
                    </p>
                </div>

                <div className="flex items-center justify-end gap-2.5 px-4 py-3 border-t border-border/60 bg-muted/20">
                    <Button type="button" variant="outline" onClick={onClose} className="rounded-lg h-9">
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={deleting}
                        onClick={handleDelete}
                        className="rounded-lg h-9 gap-2 shadow-xs"
                    >
                        {deleting && <Loader2 className="size-4 animate-spin" />}
                        Delete {singularName}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function MasterFormFields({
    entity,
    data,
    setData,
    errors,
    lookups,
}: {
    entity: string;
    data: Record<string, any>;
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
    lookups: Lookups;
}) {
    return (
        <div className="space-y-3.5">
            {entity === 'business-categories' && (
                <div>
                    <Label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Category Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="category"
                        value={data.category || ''}
                        onChange={(e) => setData('category', e.target.value)}
                        placeholder="e.g. Retail, Healthcare, IT"
                        className="mt-1.5 h-10 rounded-lg bg-muted/20 focus:bg-background"
                        required
                    />
                    {errors.category && <p className="mt-1.5 text-xs font-medium text-destructive">{errors.category}</p>}
                </div>
            )}

            {entity === 'languages' && (
                <>
                    <div>
                        <Label htmlFor="language" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Language Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="language"
                            value={data.language || ''}
                            onChange={(e) => setData('language', e.target.value)}
                            placeholder="e.g. English, Spanish"
                            className="mt-1.5 h-10 rounded-lg bg-muted/20 focus:bg-background"
                            required
                        />
                        {errors.language && <p className="mt-1.5 text-xs font-medium text-destructive">{errors.language}</p>}
                    </div>
                    <div>
                        <Label htmlFor="code" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Language Code
                        </Label>
                        <Input
                            id="code"
                            value={data.code || ''}
                            onChange={(e) => setData('code', e.target.value)}
                            placeholder="e.g. en, es"
                            className="mt-1.5 h-10 rounded-lg bg-muted/20 focus:bg-background"
                        />
                        {errors.code && <p className="mt-1.5 text-xs font-medium text-destructive">{errors.code}</p>}
                    </div>
                </>
            )}

            {entity === 'countries' && (
                <>
                    <div>
                        <Label htmlFor="country" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Country Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="country"
                            value={data.country || ''}
                            onChange={(e) => setData('country', e.target.value)}
                            placeholder="e.g. United States, India"
                            className="mt-1.5 h-10 rounded-lg bg-muted/20 focus:bg-background"
                            required
                        />
                        {errors.country && <p className="mt-1.5 text-xs font-medium text-destructive">{errors.country}</p>}
                    </div>
                    <div>
                        <Label htmlFor="iso3" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            ISO3 Code
                        </Label>
                        <Input
                            id="iso3"
                            value={data.iso3 || ''}
                            onChange={(e) => setData('iso3', e.target.value)}
                            placeholder="e.g. USA, IND"
                            className="mt-1.5 h-10 rounded-lg bg-muted/20 focus:bg-background"
                        />
                        {errors.iso3 && <p className="mt-1.5 text-xs font-medium text-destructive">{errors.iso3}</p>}
                    </div>
                    <div>
                        <Label htmlFor="phone_code" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Phone Code
                        </Label>
                        <Input
                            id="phone_code"
                            value={data.phone_code || ''}
                            onChange={(e) => setData('phone_code', e.target.value)}
                            placeholder="e.g. +1, +91"
                            className="mt-1.5 h-10 rounded-lg bg-muted/20 focus:bg-background"
                        />
                        {errors.phone_code && <p className="mt-1.5 text-xs font-medium text-destructive">{errors.phone_code}</p>}
                    </div>
                </>
            )}

            {entity === 'states' && (
                <>
                    <div>
                        <Label htmlFor="country_id" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Country <span className="text-destructive">*</span>
                        </Label>
                        <select
                            id="country_id"
                            value={data.country_id || ''}
                            onChange={(e) => setData('country_id', e.target.value)}
                            className="mt-1.5 h-10 w-full rounded-lg border border-input bg-muted/20 px-3.5 text-sm transition-all focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                            required
                        >
                            <option value="">Select Country</option>
                            {lookups.countries?.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.country}
                                </option>
                            ))}
                        </select>
                        {errors.country_id && <p className="mt-1.5 text-xs font-medium text-destructive">{errors.country_id}</p>}
                    </div>
                    <div>
                        <Label htmlFor="state" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            State Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="state"
                            value={data.state || ''}
                            onChange={(e) => setData('state', e.target.value)}
                            placeholder="e.g. California, New York"
                            className="mt-1.5 h-10 rounded-lg bg-muted/20 focus:bg-background"
                            required
                        />
                        {errors.state && <p className="mt-1.5 text-xs font-medium text-destructive">{errors.state}</p>}
                    </div>
                    <div>
                        <Label htmlFor="code" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            State Code
                        </Label>
                        <Input
                            id="code"
                            value={data.code || ''}
                            onChange={(e) => setData('code', e.target.value)}
                            placeholder="e.g. CA, NY"
                            className="mt-1.5 h-10 rounded-lg bg-muted/20 focus:bg-background"
                        />
                        {errors.code && <p className="mt-1.5 text-xs font-medium text-destructive">{errors.code}</p>}
                    </div>
                </>
            )}

            {entity === 'cities' && (
                <>
                    <div>
                        <Label htmlFor="state_id" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            State <span className="text-destructive">*</span>
                        </Label>
                        <select
                            id="state_id"
                            value={data.state_id || ''}
                            onChange={(e) => setData('state_id', e.target.value)}
                            className="mt-1.5 h-10 w-full rounded-lg border border-input bg-muted/20 px-3.5 text-sm transition-all focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                            required
                        >
                            <option value="">Select State</option>
                            {lookups.states?.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.state}
                                </option>
                            ))}
                        </select>
                        {errors.state_id && <p className="mt-1.5 text-xs font-medium text-destructive">{errors.state_id}</p>}
                    </div>
                    <div>
                        <Label htmlFor="city" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            City Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="city"
                            value={data.city || ''}
                            onChange={(e) => setData('city', e.target.value)}
                            placeholder="e.g. Los Angeles, New York City"
                            className="mt-1.5 h-10 rounded-lg bg-muted/20 focus:bg-background"
                            required
                        />
                        {errors.city && <p className="mt-1.5 text-xs font-medium text-destructive">{errors.city}</p>}
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-input bg-muted/20 p-3 mt-1">
                        <div>
                            <Label htmlFor="is_top_city" className="cursor-pointer text-sm font-semibold text-foreground">
                                Mark as Top City
                            </Label>
                            <p className="text-xs text-muted-foreground">Featured city highlight in location filters</p>
                        </div>
                        <input
                            type="checkbox"
                            id="is_top_city"
                            checked={Boolean(data.is_top_city)}
                            onChange={(e) => setData('is_top_city', e.target.checked)}
                            className="size-5 rounded border-input text-primary focus:ring-primary cursor-pointer"
                        />
                    </div>
                </>
            )}

            {entity === 'areas' && (
                <>
                    <div>
                        <Label htmlFor="city_id" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            City <span className="text-destructive">*</span>
                        </Label>
                        <select
                            id="city_id"
                            value={data.city_id || ''}
                            onChange={(e) => setData('city_id', e.target.value)}
                            className="mt-1.5 h-10 w-full rounded-lg border border-input bg-muted/20 px-3.5 text-sm transition-all focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                            required
                        >
                            <option value="">Select City</option>
                            {lookups.cities?.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.city}
                                </option>
                            ))}
                        </select>
                        {errors.city_id && <p className="mt-1.5 text-xs font-medium text-destructive">{errors.city_id}</p>}
                    </div>
                    <div>
                        <Label htmlFor="area" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Area Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="area"
                            value={data.area || ''}
                            onChange={(e) => setData('area', e.target.value)}
                            placeholder="e.g. Downtown, Westside"
                            className="mt-1.5 h-10 rounded-lg bg-muted/20 focus:bg-background"
                            required
                        />
                        {errors.area && <p className="mt-1.5 text-xs font-medium text-destructive">{errors.area}</p>}
                    </div>
                    <div>
                        <Label htmlFor="zipcode" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Zip Code
                        </Label>
                        <Input
                            id="zipcode"
                            value={data.zipcode || ''}
                            onChange={(e) => setData('zipcode', e.target.value)}
                            placeholder="e.g. 90001"
                            className="mt-1.5 h-10 rounded-lg bg-muted/20 focus:bg-background"
                        />
                        {errors.zipcode && <p className="mt-1.5 text-xs font-medium text-destructive">{errors.zipcode}</p>}
                    </div>
                </>
            )}

            {entity === 'plans' && (
                <>
                    <div>
                        <Label htmlFor="plan_name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Plan Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="plan_name"
                            value={data.plan_name || ''}
                            onChange={(e) => setData('plan_name', e.target.value)}
                            placeholder="e.g. Starter Pack, Growth Suite, Enterprise Unlimited"
                            className="mt-1.5 h-10 rounded-lg bg-muted/20 focus:bg-background"
                            required
                        />
                        {errors.plan_name && <p className="mt-1.5 text-xs font-medium text-destructive">{errors.plan_name}</p>}
                    </div>

                    <PlanProductsSection
                        productsLookup={lookups.products}
                        selectedProducts={data.products || []}
                        onChange={(prods) => setData('products', prods)}
                        errors={errors}
                    />

                    <div className="pt-1 border-t border-border/60">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                            Shared Plan Settings (Applies to all products)
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label htmlFor="duration_in_days" className="text-xs font-medium text-muted-foreground">
                                    Duration (Days) <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative mt-1">
                                    <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                                    <Input
                                        id="duration_in_days"
                                        type="number"
                                        min="1"
                                        value={data.duration_in_days ?? ''}
                                        onChange={(e) => setData('duration_in_days', e.target.value)}
                                        placeholder="30"
                                        className="h-9 pl-8 rounded-lg bg-muted/20 focus:bg-background text-xs"
                                        required
                                    />
                                </div>
                                {errors.duration_in_days && (
                                    <p className="mt-1 text-[11px] font-medium text-destructive">{errors.duration_in_days}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="tracking_duration" className="text-xs font-medium text-muted-foreground">
                                    Tracking Duration (Hours/day) <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative mt-1">
                                    <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                                    <Input
                                        id="tracking_duration"
                                        type="number"
                                        min="1"
                                        max="24"
                                        value={data.tracking_duration ?? ''}
                                        onChange={(e) => setData('tracking_duration', e.target.value)}
                                        placeholder="24"
                                        className="h-9 pl-8 rounded-lg bg-muted/20 focus:bg-background text-xs"
                                        required
                                    />
                                </div>
                                <span className="text-[10px] text-muted-foreground mt-0.5 block">Max 24 hrs/day</span>
                                {errors.tracking_duration && (
                                    <p className="mt-1 text-[11px] font-medium text-destructive">{errors.tracking_duration}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="remarks" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Remarks / Notes
                        </Label>
                        <Input
                            id="remarks"
                            value={data.remarks || ''}
                            onChange={(e) => setData('remarks', e.target.value)}
                            placeholder="Optional notes or plan features summary"
                            className="mt-1.5 h-9 rounded-lg bg-muted/20 focus:bg-background text-xs"
                        />
                        {errors.remarks && <p className="mt-1 text-xs font-medium text-destructive">{errors.remarks}</p>}
                    </div>
                </>
            )}
        </div>
    );
}

function PlanProductsSection({
    productsLookup,
    selectedProducts,
    onChange,
    errors,
}: {
    productsLookup?: ProductLookup[];
    selectedProducts: Array<{ product_id: number; name: string; code: string; price_per_user: number | string; staff_limit?: number | string }>;
    onChange: (products: Array<{ product_id: number; name: string; code: string; price_per_user: number | string; staff_limit?: number | string }>) => void;
    errors: Record<string, string>;
}) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filtered = (productsLookup || []).filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase())
    );

    const toggleProduct = (product: ProductLookup) => {
        const exists = selectedProducts.some((p) => p.product_id === product.id);
        if (exists) {
            onChange(selectedProducts.filter((p) => p.product_id !== product.id));
        } else {
            onChange([...selectedProducts, { product_id: product.id, name: product.name, code: product.code, price_per_user: 0, staff_limit: 10 }]);
        }
    };

    const updatePrice = (productId: number, price: string) => {
        onChange(
            selectedProducts.map((p) =>
                p.product_id === productId ? { ...p, price_per_user: price } : p
            )
        );
    };

    const updateStaffLimit = (productId: number, limit: string) => {
        onChange(
            selectedProducts.map((p) =>
                p.product_id === productId ? { ...p, staff_limit: limit } : p
            )
        );
    };

    const removeProduct = (productId: number) => {
        onChange(selectedProducts.filter((p) => p.product_id !== productId));
    };

    const selectAll = () => {
        const all = (productsLookup || []).map((p) => {
            const existing = selectedProducts.find((sp) => sp.product_id === p.id);
            return existing || { product_id: p.id, name: p.name, code: p.code, price_per_user: 0, staff_limit: 10 };
        });
        onChange(all);
    };

    const clearAll = () => {
        onChange([]);
    };

    const totalPerUser = selectedProducts.reduce((sum, p) => sum + (Number(p.price_per_user) || 0), 0);

    return (
        <div className="space-y-3">
            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Package className="size-3.5 text-blue-500" />
                        <span>Select Products</span>
                        <span className="text-destructive">*</span>
                    </Label>
                    {productsLookup && productsLookup.length > 0 && (
                        <div className="flex items-center gap-2 text-xs">
                            <button
                                type="button"
                                onClick={selectAll}
                                className="text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer text-[11px]"
                            >
                                Select All
                            </button>
                            <span className="text-muted-foreground text-[11px]">•</span>
                            <button
                                type="button"
                                onClick={clearAll}
                                className="text-muted-foreground hover:text-destructive font-medium cursor-pointer text-[11px]"
                            >
                                Clear
                            </button>
                        </div>
                    )}
                </div>

                {/* Multi-select Dropdown Trigger */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className="flex h-10 w-full items-center justify-between rounded-lg border border-input bg-muted/20 px-3 py-2 text-sm transition-all hover:bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    >
                        <div className="flex items-center gap-2 overflow-hidden text-left">
                            <Package className="size-4 text-muted-foreground shrink-0" />
                            {selectedProducts.length === 0 ? (
                                <span className="text-muted-foreground text-xs">Choose products for this plan (multi-select)...</span>
                            ) : (
                                <div className="flex items-center gap-1.5 overflow-hidden">
                                    <span className="font-semibold text-xs text-blue-600 dark:text-blue-400 shrink-0">
                                        {selectedProducts.length} selected:
                                    </span>
                                    <span className="font-medium text-xs text-foreground truncate">
                                        {selectedProducts.map((p) => p.name).join(', ')}
                                    </span>
                                </div>
                            )}
                        </div>
                        <ChevronDown className={`size-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-2 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-popover p-2 shadow-xl backdrop-blur-md">
                            <Input
                                placeholder="Search products by name or code..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-8 text-xs mb-2 bg-muted/30"
                                autoFocus
                            />
                            <div className="max-h-48 overflow-y-auto space-y-1">
                                {filtered.length === 0 ? (
                                    <p className="text-xs text-muted-foreground text-center py-3">No products found.</p>
                                ) : (
                                    filtered.map((prod) => {
                                        const isSelected = selectedProducts.some((p) => p.product_id === prod.id);
                                        return (
                                            <div
                                                key={prod.id}
                                                onClick={() => toggleProduct(prod)}
                                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                                                    isSelected
                                                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium'
                                                        : 'hover:bg-muted/50 text-foreground'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <div
                                                        className={`size-4 rounded flex items-center justify-center border transition-colors ${
                                                            isSelected
                                                                ? 'bg-blue-600 border-blue-600 text-white'
                                                                : 'border-muted-foreground/30'
                                                        }`}
                                                    >
                                                        {isSelected && <Check className="size-3 stroke-[3]" />}
                                                    </div>
                                                    <span className="font-medium">{prod.name}</span>
                                                </div>
                                                <span className="text-[10px] text-muted-foreground font-mono bg-muted/50 px-1.5 py-0.5 rounded">
                                                    {prod.code}
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>
                {errors.products && <p className="mt-1 text-xs font-medium text-destructive">{errors.products}</p>}
            </div>

            {/* Product-wise Per User Pricing & Staff Limits */}
            {selectedProducts.length > 0 ? (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <span>Product-wise Pricing & User Limits</span>
                        </Label>
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            Total Per User: ₹{totalPerUser.toFixed(2)}
                        </span>
                    </div>
                    <div className="divide-y divide-border/60 rounded-xl border border-border/80 bg-muted/10 overflow-hidden shadow-2xs">
                        {selectedProducts.map((sp) => (
                            <div key={sp.product_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-3 bg-card/60 hover:bg-muted/20 transition-colors">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                        <Package className="size-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-xs font-semibold text-foreground truncate">{sp.name}</div>
                                        <div className="text-[10px] text-muted-foreground font-mono">{sp.code}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    {/* Per user cost in INR */}
                                    <div className="flex items-center gap-1.5">
                                        <Label className="text-[11px] text-muted-foreground whitespace-nowrap">Price:</Label>
                                        <div className="relative w-28">
                                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">₹</span>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={sp.price_per_user ?? ''}
                                                onChange={(e) => updatePrice(sp.product_id, e.target.value)}
                                                placeholder="0.00"
                                                className="h-8 pl-6 pr-2 text-xs font-semibold text-right rounded-lg bg-background"
                                                required
                                            />
                                        </div>
                                        <span className="text-[11px] text-muted-foreground font-medium">/user</span>
                                    </div>

                                    {/* Product-wise Staff Limit */}
                                    <div className="flex items-center gap-1.5">
                                        <Label className="text-[11px] text-muted-foreground whitespace-nowrap">Limit:</Label>
                                        <div className="relative w-24">
                                            <Users className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
                                            <Input
                                                type="number"
                                                min="1"
                                                value={sp.staff_limit ?? ''}
                                                onChange={(e) => updateStaffLimit(sp.product_id, e.target.value)}
                                                placeholder="10"
                                                className="h-8 pl-6 pr-2 text-xs font-semibold text-right rounded-lg bg-background"
                                                required
                                            />
                                        </div>
                                        <span className="text-[11px] text-muted-foreground font-medium">users</span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeProduct(sp.product_id)}
                                        className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer ml-1"
                                        title="Remove product"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-border/80 p-4 text-center bg-muted/10">
                    <Package className="size-6 text-muted-foreground mx-auto mb-1.5 opacity-50" />
                    <p className="text-xs text-muted-foreground">Select one or more products above to configure product-wise per-user pricing and user limits.</p>
                </div>
            )}
        </div>
    );
}

MasterIndex.layout = (page: React.ReactNode) => <Demo1Layout>{page}</Demo1Layout>;
