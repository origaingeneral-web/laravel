import { Head, Link } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { emptyMasterFormValues, MasterRecordForm, type MasterFormValues } from '@/components/admin/master-record-form';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';

export default function MasterCreatePage() {
    const [form, setForm] = useState<MasterFormValues>(emptyMasterFormValues);

    const updateForm = (field: keyof MasterFormValues, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    return (
        <>
            <Head title="Create Master | NexLink" />
            <div className="space-y-6">
                <PageHeader
                    title="Create Master"
                    description="Add a new master reference and store it in the shared data catalogue."
                    actions={
                        <Button asChild variant="outline" className="rounded-full border-slate-200 bg-white dark:bg-white/5">
                            <Link href="/masters">Back to masters</Link>
                        </Button>
                    }
                />

                <section className="admin-card space-y-5 p-6">
                    <MasterRecordForm values={form} onChange={updateForm} idPrefix="page-create-master" />

                    <div className="flex flex-wrap gap-3">
                        <Button className="rounded-full bg-nexlink-primary text-white hover:bg-nexlink-primary-dark">
                            <PlusCircle className="size-4" aria-hidden="true" />
                            Save master
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
