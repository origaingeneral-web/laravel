import { Head, Link } from '@inertiajs/react';
import { Edit3, MailOpen } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';

const messages = [
    { from: 'Emma Smith', subject: 'Need to update the deal details', time: '7 hr ago', unread: true },
    { from: 'Finance Team', subject: 'Invoice payment confirmation', time: 'Yesterday', unread: false },
    { from: 'LayoutDrop Labs', subject: 'NexLink implementation notes', time: 'Jul 12', unread: false },
];

export default function Inbox() {
    return (
        <>
            <Head title="Inbox | NexLink" />
            <div className="space-y-6">
                <PageHeader
                    title="Inbox"
                    description="Review customer communication and team messages from a responsive Tailwind inbox."
                    actions={
                        <Button asChild className="rounded-full bg-nexlink-primary text-white hover:bg-nexlink-primary-dark">
                            <Link href="/email/compose">
                                <Edit3 className="size-4" aria-hidden="true" />
                                Compose
                            </Link>
                        </Button>
                    }
                />
                <section className="admin-card overflow-hidden">
                    <div className="border-b border-slate-100 p-5 dark:border-white/10">
                        <h2 className="text-lg font-black text-slate-950 dark:text-white">Primary inbox</h2>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-white/10">
                        {messages.map((message) => (
                            <Link
                                key={message.subject}
                                href="/email/read-email"
                                className="flex items-center gap-4 p-5 transition hover:bg-slate-50 dark:hover:bg-white/5"
                            >
                                <span className="flex size-11 items-center justify-center rounded-2xl bg-nexlink-primary/10 text-nexlink-primary dark:bg-white/10 dark:text-white">
                                    <MailOpen className="size-5" aria-hidden="true" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="flex items-center gap-2">
                                        <span className="font-black text-slate-950 dark:text-white">{message.from}</span>
                                        {message.unread && <span className="size-2 rounded-full bg-nexlink-primary" />}
                                    </span>
                                    <span className="block truncate text-sm text-slate-500 dark:text-slate-400">{message.subject}</span>
                                </span>
                                <span className="text-xs font-bold text-slate-400">{message.time}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
