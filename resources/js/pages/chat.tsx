import { Head } from '@inertiajs/react';
import { SendHorizontal } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/admin/page-header';

const contacts = ['Emma Smith', 'David Miller', 'Olivia Brown', 'Noah Wilson'];

export default function Chat() {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'Emma Smith', body: 'Can you review the latest NexLink proposal?', mine: false },
        { id: 2, sender: 'You', body: 'Yes, I will send notes before the client call.', mine: true },
    ]);
    const [message, setMessage] = useState('');

    const sendMessage = (event: React.FormEvent) => {
        event.preventDefault();

        if (!message.trim()) {
            return;
        }

        setMessages((items) => [...items, { id: Date.now(), sender: 'You', body: message.trim(), mine: true }]);

        setMessage('');
    };

    return (
        <>
            <Head title="Chat | NexLink" />
            <div className="space-y-6">
                <PageHeader title="Chat" description="Collaborate with team members and keep CRM conversations close to the work." />

                <section className="admin-card grid min-h-[640px] overflow-hidden lg:grid-cols-[320px_1fr]">
                    <aside className="border-b border-slate-100 p-4 dark:border-white/10 lg:border-b-0 lg:border-r">
                        <h2 className="px-2 text-sm font-black uppercase tracking-[0.2em] text-slate-400">Conversations</h2>
                        <div className="mt-4 space-y-2">
                            {contacts.map((contact, index) => (
                                <button
                                    key={contact}
                                    type="button"
                                    className="flex w-full items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-slate-50 dark:hover:bg-white/5"
                                >
                                    <span className="flex size-11 items-center justify-center rounded-2xl bg-nexlink-primary/10 text-sm font-black text-nexlink-primary dark:bg-white/10 dark:text-white">
                                        {contact.split(' ').map((part) => part[0]).join('')}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block truncate font-black text-slate-950 dark:text-white">{contact}</span>
                                        <span className="block truncate text-sm text-slate-500 dark:text-slate-400">
                                            {index === 0 ? 'Latest proposal notes' : 'No new messages'}
                                        </span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </aside>

                    <div className="flex flex-col">
                        <div className="border-b border-slate-100 p-5 dark:border-white/10">
                            <h2 className="text-lg font-black text-slate-950 dark:text-white">Emma Smith</h2>
                            <p className="text-sm text-emerald-600 dark:text-emerald-300">Online</p>
                        </div>
                        <div className="flex-1 space-y-4 overflow-y-auto p-5">
                            {messages.map((item) => (
                                <div key={item.id} className={`flex ${item.mine ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] rounded-3xl px-4 py-3 text-sm shadow-sm ${item.mine ? 'bg-nexlink-primary text-white' : 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white'}`}>
                                        <p className="font-semibold">{item.body}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={sendMessage} className="flex gap-3 border-t border-slate-100 p-4 dark:border-white/10">
                            <input
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-nexlink-primary focus:ring-4 focus:ring-nexlink-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                                placeholder="Write a message..."
                            />
                            <button
                                type="submit"
                                className="inline-flex size-12 items-center justify-center rounded-full bg-nexlink-primary text-white transition hover:bg-nexlink-primary-dark"
                                aria-label="Send message"
                            >
                                <SendHorizontal className="size-5" aria-hidden="true" />
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </>
    );
}
