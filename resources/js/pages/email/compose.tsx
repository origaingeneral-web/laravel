import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Send } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';

export default function Compose() {
    return (
        <>
            <Head title="Compose Email | NexLink" />
            <div className="space-y-6">
                <PageHeader
                    title="Compose Email"
                    description="Prepare customer updates and internal messages with accessible Tailwind form controls."
                    actions={
                        <Button asChild variant="outline" className="rounded-full bg-white dark:bg-white/5">
                            <Link href="/email/inbox">
                                <ArrowLeft className="size-4" aria-hidden="true" />
                                Back to inbox
                            </Link>
                        </Button>
                    }
                />
                <form className="admin-card space-y-5 p-6">
                    <div className="grid gap-2">
                        <label htmlFor="to" className="text-sm font-black text-slate-700 dark:text-slate-200">To</label>
                        <input id="to" type="email" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-nexlink-primary focus:ring-4 focus:ring-nexlink-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white" placeholder="customer@example.com" />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="subject" className="text-sm font-black text-slate-700 dark:text-slate-200">Subject</label>
                        <input id="subject" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-nexlink-primary focus:ring-4 focus:ring-nexlink-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white" placeholder="Message subject" />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="message" className="text-sm font-black text-slate-700 dark:text-slate-200">Message</label>
                        <textarea id="message" rows={10} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-nexlink-primary focus:ring-4 focus:ring-nexlink-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white" placeholder="Write your message..." />
                    </div>
                    <div className="flex justify-end">
                        <Button type="button" className="rounded-full bg-nexlink-primary text-white hover:bg-nexlink-primary-dark">
                            <Send className="size-4" aria-hidden="true" />
                            Send message
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
