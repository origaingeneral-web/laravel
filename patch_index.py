import re

with open('resources/js/pages/admin/masters/index.tsx', 'r') as f:
    content = f.read()

# Replace usePage imports
content = content.replace("import { Head, router, useForm, usePage } from '@inertiajs/react';", "import { Head, router, usePage } from '@inertiajs/react';\nimport { useEffect } from 'react';")

# 1. Update MasterIndex props and state
master_index_pattern = r"""    const { props } = usePage\(\);
    const { entity, items, lookups } = props as unknown as {
        entity: string;
        items: MasterRecord\[\];
        lookups: Lookups;
    };"""

master_index_replacement = """    const { props } = usePage();
    const { entity } = props as unknown as {
        entity: string;
    };

    const [items, setItems] = useState<MasterRecord[]>([]);
    const [lookups, setLookups] = useState<Lookups>({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
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
    }, [entity]);"""

content = content.replace(master_index_pattern, master_index_replacement)

# Update the modal calls to pass onSuccess={fetchData}
content = content.replace("onClose={() => setIsCreateOpen(false)}", "onClose={() => setIsCreateOpen(false)}\n                    onSuccess={fetchData}")
content = content.replace("onClose={() => setEditingRecord(null)}", "onClose={() => setEditingRecord(null)}\n                    onSuccess={fetchData}")
content = content.replace("onClose={() => setDeletingRecord(null)}", "onClose={() => setDeletingRecord(null)}\n                    onSuccess={fetchData}")
content = content.replace("onClose={() => setIsImportOpen(false)}", "onClose={() => setIsImportOpen(false)}\n                    onSuccess={fetchData}")


# Update CreateRecordModal props
create_props = r"""    lookups,
}: {
    entity: string;
    isOpen: boolean;
    onClose: () => void;
    lookups: Lookups;
}) {"""
create_props_repl = """    lookups,
    onSuccess,
}: {
    entity: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    lookups: Lookups;
}) {"""
content = content.replace(create_props, create_props_repl)

create_form = r"""    const { data, setData, post, processing, errors, reset } = useForm<Record<string, any>>(getInitialFormData());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/master/${entity}`, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };"""

create_form_repl = """    const [data, setData] = useState<Record<string, any>>(getInitialFormData());
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

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
    };"""
content = content.replace(create_form, create_form_repl)

# Update EditRecordModal props
edit_props = r"""    lookups,
}: {
    entity: string;
    record: MasterRecord;
    isOpen: boolean;
    onClose: () => void;
    lookups: Lookups;
}) {"""
edit_props_repl = """    lookups,
    onSuccess,
}: {
    entity: string;
    record: MasterRecord;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    lookups: Lookups;
}) {"""
content = content.replace(edit_props, edit_props_repl)

edit_form = r"""    const { data, setData, put, processing, errors } = useForm<Record<string, any>>(getFormData());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/master/${entity}/${record.id}`, {
            onSuccess: () => onClose(),
        });
    };"""
edit_form_repl = """    const [data, setData] = useState<Record<string, any>>(getFormData());
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

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
    };"""
content = content.replace(edit_form, edit_form_repl)

# Update DeleteRecordModal props
delete_props = r"""    onClose,
}: {
    entity: string;
    record: MasterRecord;
    isOpen: boolean;
    onClose: () => void;
}) {"""
delete_props_repl = """    onClose,
    onSuccess,
}: {
    entity: string;
    record: MasterRecord;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}) {"""
content = content.replace(delete_props, delete_props_repl)

delete_form = r"""    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(`/admin/master/${entity}/${record.id}`, {
            onSuccess: () => onClose(),
        });
    };"""
delete_form_repl = """    const [processing, setProcessing] = useState(false);

    const handleDelete = async () => {
        setProcessing(true);
        try {
            const res = await fetch(`/api/v1/admin/master/${entity}/${record.id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json'
                }
            });
            if (res.ok) {
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setProcessing(false);
        }
    };"""
content = content.replace(delete_form, delete_form_repl)

with open('resources/js/pages/admin/masters/index.tsx', 'w') as f:
    f.write(content)
print("done")
