import { Head } from '@inertiajs/react';
import { useState } from 'react';

type Message = {
    id: number;
    sender: 'system' | 'me';
    senderName: string;
    avatarBg: string;
    text: string;
};

export default function Team() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            sender: 'system',
            senderName: 'Alexandra Deff',
            avatarBg: 'bg-primary/10',
            text: 'Hey everyone! Ready for the standup?',
        },
        {
            id: 2,
            sender: 'me',
            senderName: 'You',
            avatarBg: 'bg-secondary/10',
            text: 'Just finishing the PR reviews. 5 mins!',
        },
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setMessages((prev) => [
            ...prev,
            {
                id: Date.now(),
                sender: 'me',
                senderName: 'You',
                avatarBg: 'bg-secondary/10',
                text: newMessage,
            },
        ]);
        setNewMessage('');
    };

    return (
        <>
            <Head title="Team Collaboration | Enterprise Admin" />

            <div className="flex flex-col gap-gutter">
                {/* Header Section */}
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="font-display-lg text-display-lg text-primary dark:text-white mb-2">Team Collaboration</h2>
                        <p className="text-body-md text-on-surface-variant dark:text-on-primary-container">
                            Manage workspace permissions, active focus areas, and daily engineering standups.
                        </p>
                    </div>
                    <button className="bg-primary-container dark:bg-white text-on-primary dark:text-primary px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary-container/20 dark:shadow-none hover:shadow-xl transition-all active:scale-95 cursor-pointer">
                        <span className="material-symbols-outlined text-[20px]">person_add</span>
                        Invite Member
                    </button>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-12 gap-gutter">
                    {/* Team Member Profiles (Bento Style) */}
                    <div className="col-span-12 lg:col-span-8 grid grid-cols-2 gap-6">
                        {/* Member Card 1 */}
                        <div className="col-span-2 md:col-span-1 glass-card p-6 rounded-3xl group transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex justify-between items-start mb-6">
                                <div className="relative">
                                    <img className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-white/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDU0V6l2ci9s5ncH60UM1jX5nhCugTQxb6QUKQoRNQouu73k5rEoq0t9wsiElpB0QDLwXWE9-S4isahGuAYHW3gXa_4sym0O-TZynz5p2o0vQhqrRLzd7fsG4pGPKYmu_9L1QvcT9FuIcDSG7dZoXLtB81YJQGwjcstMBXOOoqHyHcwGlPIeSwoxDmM6Id0Uman-T2YO5m-YYvNMtv4eUVMfRqkfEw0ZB5RwQAsF8Oq0mblwYNSzoR23Q" alt="Alexandra Deff" />
                                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-primary-container rounded-full"></span>
                                </div>
                                <span className="bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-label-sm font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                                    Available
                                </span>
                            </div>
                            <div>
                                <h3 className="font-title-md text-title-md text-primary dark:text-white">Alexandra Deff</h3>
                                <p className="text-body-md text-on-surface-variant dark:text-on-primary-container text-sm mt-1">Senior Backend Engineer</p>
                            </div>
                            <div className="mt-6 pt-6 border-t border-primary/5 dark:border-white/5">
                                <p className="text-label-sm text-outline dark:text-on-primary-container mb-2 font-bold">Current Focus</p>
                                <div className="flex items-center gap-2 bg-surface-container dark:bg-white/5 rounded-lg p-3">
                                    <span className="material-symbols-outlined text-primary dark:text-white scale-90">terminal</span>
                                    <span className="text-body-md text-on-surface dark:text-white font-medium truncate">Github Project Repository</span>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-between items-center">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border-2 border-white dark:border-primary-container text-[10px] font-bold text-primary dark:text-white">AD</div>
                                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center border-2 border-white dark:border-primary-container text-[10px] font-bold text-secondary dark:text-white">DE</div>
                                </div>
                                <button className="w-10 h-10 rounded-full border border-outline-variant dark:border-white/10 flex items-center justify-center text-outline dark:text-on-primary-container hover:text-primary dark:hover:text-white hover:border-primary dark:hover:border-white transition-colors cursor-pointer">
                                    <span className="material-symbols-outlined">chat</span>
                                </button>
                            </div>
                        </div>

                        {/* Member Card 2 */}
                        <div className="col-span-2 md:col-span-1 glass-card p-6 rounded-3xl group transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                            <div className="flex justify-between items-start mb-6">
                                <div className="relative">
                                    <img className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-white/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqAtrGuaXfsb6ZoA6A_JFj_mGJd4efLqulb_vElT3CDvgmppWa460Xu7rLQ9QHERcX5YPs7RSNux2yRhegCYl8EDBYQA4RiKfI6fdaovO2ns-TpgI8nAqU-GWOR_4LgUcSYDvLYeXmQKdIHyCvgs_orppSLV6ho_pkYtkrcK3xLmfhaphPMcZZSZF3eWb5RnjKcIrGd9DcpdIyUdzpjXd68pQLIWimkbh2bo9fKv65aCdaxCAT02fxVA" alt="Edwin Adenike" />
                                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-500 border-2 border-white dark:border-primary-container rounded-full"></span>
                                </div>
                                <span className="bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 text-label-sm font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                                    In Meeting
                                </span>
                            </div>
                            <div>
                                <h3 className="font-title-md text-title-md text-primary dark:text-white">Edwin Adenike</h3>
                                <p className="text-body-md text-on-surface-variant dark:text-on-primary-container text-sm mt-1">Lead UI/UX Designer</p>
                            </div>
                            <div className="mt-6 pt-6 border-t border-primary/5 dark:border-white/5">
                                <p className="text-label-sm text-outline dark:text-on-primary-container mb-2 font-bold">Current Focus</p>
                                <div className="flex items-center gap-2 bg-surface-container dark:bg-white/5 rounded-lg p-3">
                                    <span className="material-symbols-outlined text-primary dark:text-white scale-90">draw</span>
                                    <span className="text-body-md text-on-surface dark:text-white font-medium truncate">Integrate Auth System UX</span>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-between items-center">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border-2 border-white dark:border-primary-container text-[10px] font-bold text-primary dark:text-white">EA</div>
                                    <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center border-2 border-white dark:border-primary-container text-[10px] font-bold text-error">+2</div>
                                </div>
                                <button className="w-10 h-10 rounded-full border border-outline-variant dark:border-white/10 flex items-center justify-center text-outline dark:text-on-primary-container hover:text-primary dark:hover:text-white hover:border-primary dark:hover:border-white transition-colors cursor-pointer">
                                    <span className="material-symbols-outlined">chat</span>
                                </button>
                            </div>
                        </div>

                        {/* Activity Feed Card */}
                        <div className="col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-title-md text-title-md text-primary dark:text-white">Recent Activity Feed</h3>
                                <button className="text-primary dark:text-white text-label-sm font-bold hover:underline cursor-pointer">View All</button>
                            </div>
                            <div className="space-y-6 relative z-10 text-on-surface dark:text-white">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 shrink-0 bg-primary/5 dark:bg-white/10 rounded-full flex items-center justify-center text-primary dark:text-white">
                                        <span className="material-symbols-outlined">cloud_upload</span>
                                    </div>
                                    <div>
                                        <p className="text-body-md"><strong>Alexandra</strong> pushed 12 commits to <code>main</code></p>
                                        <p className="text-label-sm text-outline dark:text-on-primary-container mt-1">24 minutes ago • Donezo Dashboard v2.0</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 shrink-0 bg-secondary/5 dark:bg-white/10 rounded-full flex items-center justify-center text-secondary dark:text-white">
                                        <span className="material-symbols-outlined">check_circle</span>
                                    </div>
                                    <div>
                                        <p className="text-body-md"><strong>Isaac</strong> completed task: <code>Search Filter Debug</code></p>
                                        <p className="text-label-sm text-outline dark:text-on-primary-container mt-1">1 hour ago • High Priority</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 shrink-0 bg-surface-variant dark:bg-white/10 rounded-full flex items-center justify-center text-primary dark:text-white">
                                        <span className="material-symbols-outlined">person_add</span>
                                    </div>
                                    <div>
                                        <p className="text-body-md"><strong>David Oshodi</strong> joined the <code>Design Squad</code></p>
                                        <p className="text-label-sm text-outline dark:text-on-primary-container mt-1">3 hours ago • Team Lead: Edwin</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Side Widgets */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                        {/* Real-time Workload Widget */}
                        <div className="glass-card rounded-3xl p-8 bg-gradient-to-br from-primary-container/5 to-white/50 border-primary/10">
                            <h3 className="font-title-md text-title-md text-primary dark:text-white mb-6">Team Workload</h3>
                            <div className="space-y-6">
                                <div className="space-y-2 text-on-surface dark:text-white">
                                    <div className="flex justify-between text-label-sm">
                                        <span className="font-bold">Engineering</span>
                                        <span className="text-outline dark:text-on-primary-container">82% Capacity</span>
                                    </div>
                                    <div className="h-2 w-full bg-surface-container dark:bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary dark:bg-white w-[82%] rounded-full"></div>
                                    </div>
                                </div>
                                <div className="space-y-2 text-on-surface dark:text-white">
                                    <div className="flex justify-between text-label-sm">
                                        <span className="font-bold">Design</span>
                                        <span className="text-outline dark:text-on-primary-container">45% Capacity</span>
                                    </div>
                                    <div className="h-2 w-full bg-surface-container dark:bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary w-[45%] rounded-full"></div>
                                    </div>
                                </div>
                                <div className="space-y-2 text-on-surface dark:text-white">
                                    <div className="flex justify-between text-label-sm">
                                        <span className="font-bold">Product</span>
                                        <span className="text-outline dark:text-on-primary-container">95% Capacity</span>
                                    </div>
                                    <div className="h-2 w-full bg-surface-container dark:bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-error w-[95%] rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Team Chat */}
                        <div className="glass-card rounded-3xl p-1 overflow-hidden relative min-h-[320px] flex flex-col">
                            <div className="p-6 pb-2 text-on-surface dark:text-white">
                                <h3 className="font-title-md text-title-md text-primary dark:text-white">Team Chat</h3>
                                <p className="text-label-sm text-outline dark:text-on-primary-container">General Channel</p>
                            </div>
                            
                            <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[200px] text-on-surface dark:text-white">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full ${msg.avatarBg} shrink-0 flex items-center justify-center font-bold text-[10px] text-primary dark:text-white border border-white/20`}>
                                            {msg.senderName.slice(0,2)}
                                        </div>
                                        <div className={`rounded-2xl p-3 text-sm ${msg.sender === 'me' ? 'bg-primary-container dark:bg-white/10 text-on-primary dark:text-white rounded-tr-none' : 'bg-surface-container dark:bg-white/5 text-on-surface-variant dark:text-white/80 rounded-tl-none'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleSendMessage} className="p-4 bg-white/50 dark:bg-white/5 border-t border-primary/5 dark:border-white/5">
                                <div className="flex items-center gap-2 bg-white dark:bg-white/10 rounded-full border border-outline-variant/30 dark:border-white/10 p-1 pl-4">
                                    <input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-1 border-none focus:ring-0 text-sm bg-transparent py-2 text-on-surface dark:text-white"
                                        placeholder="Type a message..."
                                        type="text"
                                    />
                                    <button type="submit" className="w-8 h-8 rounded-full bg-primary dark:bg-white text-white dark:text-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer">
                                        <span className="material-symbols-outlined text-sm">send</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Performance Trends Section */}
                <div className="mt-gutter grid grid-cols-12 gap-gutter">
                    <div className="col-span-12 glass-card rounded-3xl p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <div>
                                <h3 className="font-title-md text-title-md text-primary dark:text-white">Department Performance</h3>
                                <p className="text-label-sm text-outline dark:text-on-primary-container">KPI metrics across core teams over the last 30 days.</p>
                            </div>
                            <div className="flex bg-surface-container dark:bg-white/10 rounded-full p-1 text-on-surface dark:text-white">
                                <button className="px-4 py-2 bg-white dark:bg-white/20 rounded-full text-label-sm font-bold shadow-sm cursor-pointer">Monthly</button>
                                <button className="px-4 py-2 text-label-sm font-bold text-outline dark:text-white/60 hover:text-primary dark:hover:text-white cursor-pointer">Weekly</button>
                            </div>
                        </div>
                        <div className="h-64 w-full relative">
                            <div className="absolute inset-0 flex items-end justify-between px-4 pb-4 gap-4">
                                <div className="w-full bg-primary/20 dark:bg-white/10 rounded-t-xl hover:bg-primary/40 dark:hover:bg-white/30 transition-all cursor-pointer group relative" style={{ height: '60%' }}>
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary dark:bg-white text-white dark:text-primary text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">6.4k</div>
                                </div>
                                <div className="w-full bg-primary/40 dark:bg-white/20 rounded-t-xl hover:bg-primary/60 dark:hover:bg-white/40 transition-all cursor-pointer group relative" style={{ height: '85%' }}>
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary dark:bg-white text-white dark:text-primary text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">8.2k</div>
                                </div>
                                <div className="w-full bg-primary/30 dark:bg-white/15 rounded-t-xl hover:bg-primary/50 dark:hover:bg-white/30 transition-all cursor-pointer relative" style={{ height: '45%' }}></div>
                                <div className="w-full bg-primary/10 dark:bg-white/5 rounded-t-xl hover:bg-primary/30 dark:hover:bg-white/25 transition-all cursor-pointer relative" style={{ height: '70%' }}></div>
                                <div className="w-full bg-primary/60 dark:bg-white/30 rounded-t-xl hover:bg-primary/80 dark:hover:bg-white/50 transition-all cursor-pointer relative" style={{ height: '95%' }}></div>
                                <div className="w-full bg-primary/20 dark:bg-white/10 rounded-t-xl hover:bg-primary/40 dark:hover:bg-white/20 transition-all cursor-pointer relative" style={{ height: '55%' }}></div>
                                <div className="w-full bg-primary/15 dark:bg-white/10 rounded-t-xl hover:bg-primary/35 dark:hover:bg-white/20 transition-all cursor-pointer relative" style={{ height: '80%' }}></div>
                            </div>
                            <div className="absolute bottom-4 left-0 right-0 h-px bg-outline-variant/30 dark:bg-white/10"></div>
                        </div>
                        <div className="flex justify-between px-4 mt-2 text-on-surface dark:text-white">
                            <span className="text-label-sm text-outline dark:text-on-primary-container">WK 01</span>
                            <span className="text-label-sm text-outline dark:text-on-primary-container">WK 02</span>
                            <span className="text-label-sm text-outline dark:text-on-primary-container">WK 03</span>
                            <span className="text-label-sm text-outline dark:text-on-primary-container">WK 04</span>
                            <span className="text-label-sm text-outline dark:text-on-primary-container">WK 05</span>
                            <span className="text-label-sm text-outline dark:text-on-primary-container">WK 06</span>
                            <span className="text-label-sm text-outline dark:text-on-primary-container">WK 07</span>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}
