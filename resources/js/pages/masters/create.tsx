import { Head, Link } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function MasterCreatePage() {
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
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Master name</label>
                            <Input placeholder="Business category" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Code</label>
                            <Input placeholder="BC-001" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Type</label>
                            <Input placeholder="Reference" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Owner</label>
                            <Input placeholder="Ops Team" />
                        </div>
                    </div>

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
