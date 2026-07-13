import { Head } from '@inertiajs/react';
import { CalendarDays, Plus } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';

const days = Array.from({ length: 35 }, (_, index) => index + 1);
const events = [
    { day: 4, title: 'Sales review', tone: 'bg-nexlink-primary text-white' },
    { day: 12, title: 'Customer demo', tone: 'bg-emerald-500 text-white' },
    { day: 18, title: 'Finance sync', tone: 'bg-amber-500 text-white' },
    { day: 25, title: 'Team retro', tone: 'bg-sky-500 text-white' },
];

export default function Calendar() {
    return (
        <>
            <Head title="Calendar | NexLink" />
            <div className="space-y-6">
                <PageHeader
                    title="Calendar"
                    description="Plan follow-ups, demos, reviews, and internal CRM work with a responsive monthly view."
                    actions={
                        <Button className="rounded-full bg-nexlink-primary text-white hover:bg-nexlink-primary-dark">
                            <Plus className="size-4" aria-hidden="true" />
                            New event
                        </Button>
                    }
                />

                <section className="grid gap-6 xl:grid-cols-[320px_1fr]">
                    <aside className="admin-card p-5">
                        <h2 className="text-lg font-black text-slate-950 dark:text-white">Upcoming</h2>
                        <div className="mt-4 space-y-3">
                            {events.map((event) => (
                                <div key={event.title} className="rounded-2xl border border-slate-100 p-4 dark:border-white/10">
                                    <p className="text-sm font-black text-slate-950 dark:text-white">{event.title}</p>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">July {event.day}, 2026</p>
                                </div>
                            ))}
                        </div>
                    </aside>

                    <section className="admin-card overflow-hidden">
                        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-white/10">
                            <div className="flex items-center gap-3">
                                <span className="flex size-11 items-center justify-center rounded-2xl bg-nexlink-primary/10 text-nexlink-primary dark:bg-white/10 dark:text-white">
                                    <CalendarDays className="size-5" aria-hidden="true" />
                                </span>
                                <div>
                                    <h2 className="text-xl font-black text-slate-950 dark:text-white">July 2026</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Monthly CRM schedule</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 border-b border-slate-100 text-center text-xs font-black uppercase tracking-[0.18em] text-slate-400 dark:border-white/10">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day} className="p-4">{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7">
                            {days.map((day) => {
                                const event = events.find((item) => item.day === day);

                                return (
                                    <div key={day} className="min-h-28 border-b border-r border-slate-100 p-3 dark:border-white/10">
                                        <p className="text-sm font-black text-slate-700 dark:text-slate-200">{day}</p>
                                        {event && (
                                            <p className={`mt-3 truncate rounded-full px-2 py-1 text-xs font-black ${event.tone}`}>
                                                {event.title}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </section>
            </div>
        </>
    );
}
