import { Head, Link } from '@inertiajs/react';
import { PencilLine } from 'lucide-react';
import { useState } from 'react';
import { MasterRecordForm, type MasterFormValues } from '@/components/admin/master-record-form';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';

const defaultValues: MasterFormValues = {
    name: 'Business Category',
    code: 'BC-001',
    type: 'Reference',
    owner: 'Admin',
    status: 'Active',
};

export default function MasterEditPage() {
    const [form, setForm] = useState<MasterFormValues>(defaultValues);

    const updateForm = (field: keyof MasterFormValues, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    return (
        <>
            <Head title="Edit Master | NexLink" />
            <div className="space-y-6">
                <PageHeader
                    title="Edit Master"
                    description="Update the selected master record and keep your reference catalog in sync."
                    actions={
                        <Button asChild variant="outline" className="rounded-full border-slate-200 bg-white dark:bg-white/5">
                            <Link href="/masters">Back to masters</Link>
                        </Button>
                    }
                />

                <section className="admin-card space-y-5 p-6">
                    <MasterRecordForm values={form} onChange={updateForm} idPrefix="page-edit-master" />

                    <div className="flex flex-wrap gap-3">
                        <Button className="rounded-full bg-nexlink-primary text-white hover:bg-nexlink-primary-dark">
                            <PencilLine className="size-4" aria-hidden="true" />
                            Update master
                        </Button>
                        <Button asChild variant="outline" className="rounded-full border-slate-200 bg-white dark:bg-white/5">
                            <Link href="/masters">Cancel</Link>
                        </Button>
                    </div>
                </section>
            </div>
        </>
    );
}
