import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Reply } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';

export default function ReadEmail() {
    return (
        <>
            <Head title="Read Email | NexLink" />
            <div className="space-y-6">
                <PageHeader
                    title="Email Details"
                    description="Read and respond to customer communication with a clean Tailwind message layout."
                    actions={
                        <Button asChild variant="outline" className="rounded-full bg-white dark:bg-white/5">
                            <Link href="/email/inbox">
                                <ArrowLeft className="size-4" aria-hidden="true" />
                                Inbox
                            </Link>
                        </Button>
                    }
                />
                <article className="admin-card p-6">
                    <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-slate-950 dark:text-white">Need to update the deal details</h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Emma Smith &lt;emma@example.com&gt;</p>
                        </div>
                        <p className="text-sm font-semibold text-slate-400">Jul 13, 2026, 10:10 AM</p>
                    </div>
                    <div className="prose prose-slate mt-6 max-w-none dark:prose-invert">
                        <p>Hello team,</p>
                        <p>
                            Please update the latest proposal notes and next follow-up date for the NexLink CRM opportunity before
                            the client review call.
                        </p>
                        <p>Thanks,<br />Emma</p>
                    </div>
                    <div className="mt-8">
                        <Button asChild className="rounded-full bg-nexlink-primary text-white hover:bg-nexlink-primary-dark">
                            <Link href="/email/compose">
                                <Reply className="size-4" aria-hidden="true" />
                                Reply
                            </Link>
                        </Button>
                    </div>
                </article>
            </div>
        </>
    );
}
