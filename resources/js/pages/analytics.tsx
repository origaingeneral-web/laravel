import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Analytics() {
    const [quarter, setQuarter] = useState('This Quarter');

    return (
        <>
            <Head title="Performance Analytics | Enterprise Admin" />

            <div className="flex flex-col gap-gutter">
                {/* Header Section */}
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="font-display-lg text-display-lg text-primary dark:text-white mb-2">Performance Analytics</h2>
                        <p className="text-body-md text-on-surface-variant dark:text-on-primary-container">
                            Real-time tracking of project health, team velocity, and resource distribution.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <select
                            value={quarter}
                            onChange={(e) => setQuarter(e.target.value)}
                            className="bg-secondary/10 dark:bg-white/10 text-on-secondary-container dark:text-white px-6 py-2.5 rounded-xl font-bold border-none focus:ring-2 focus:ring-secondary cursor-pointer font-body-md"
                        >
                            <option className="dark:text-black">This Quarter</option>
                            <option className="dark:text-black">Last Quarter</option>
                            <option className="dark:text-black">Full Year</option>
                        </select>
                        <button className="bg-primary-container dark:bg-white text-on-primary dark:text-primary px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary-container/20 dark:shadow-none hover:shadow-xl transition-all active:scale-95 cursor-pointer">
                            <span className="material-symbols-outlined text-[20px]">download</span>
                            Export Report
                        </button>
                    </div>
                </div>

                {/* Bento Analytics Grid */}
                <div className="bento-grid">
                    {/* KPI Glass Card 1 */}
                    <div className="col-span-12 md:col-span-3 glass-card p-6 rounded-3xl group transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-primary/5 dark:bg-white/10 rounded-2xl flex items-center justify-center text-primary dark:text-white">
                                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    speed
                                </span>
                            </div>
                            <span className="text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-lg text-[12px] flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                +12%
                            </span>
                        </div>
                        <p className="text-on-surface-variant dark:text-on-primary-container text-body-md mb-1">Velocity Score</p>
                        <h3 className="text-[42px] font-black text-on-surface dark:text-white leading-none">94.2</h3>
                        <p className="text-[12px] text-outline dark:text-on-primary-container mt-2 italic">Increased from last month (84.1)</p>
                    </div>

                    {/* KPI Glass Card 2 */}
                    <div className="col-span-12 md:col-span-3 glass-card p-6 rounded-3xl group transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-secondary/10 dark:bg-white/10 rounded-2xl flex items-center justify-center text-secondary dark:text-white">
                                <span className="material-symbols-outlined text-[28px]">account_tree</span>
                            </div>
                            <span className="text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-lg text-[12px] flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">trending_down</span>
                                -2.4%
                            </span>
                        </div>
                        <p className="text-on-surface-variant dark:text-on-primary-container text-body-md mb-1">Active Projects</p>
                        <h3 className="text-[42px] font-black text-on-surface dark:text-white leading-none">24</h3>
                        <p className="text-[12px] text-outline dark:text-on-primary-container mt-2 italic">4 scheduled for archive</p>
                    </div>

                    {/* Large Main Chart Card */}
                    <div className="col-span-12 md:col-span-6 row-span-2 glass-card p-8 rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h4 className="font-headline-lg text-[20px] text-on-surface dark:text-white">Resource Utilization</h4>
                                <p className="text-body-md text-on-surface-variant dark:text-on-primary-container">Team capacity across departments</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container dark:bg-white/10 rounded-full text-[12px] font-bold text-primary dark:text-white">
                                    <span className="w-2 h-2 rounded-full bg-primary dark:bg-white"></span> Core
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container dark:bg-white/10 rounded-full text-[12px] font-bold text-secondary dark:text-white">
                                    <span className="w-2 h-2 rounded-full bg-secondary"></span> Creative
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 flex items-end justify-between gap-4 px-4 min-h-[240px]">
                            {/* Simple Pure CSS Bar Chart */}
                            <div className="w-full flex items-end justify-between h-[180px] gap-2">
                                <div className="flex-1 space-y-1">
                                    <div className="bg-primary/20 dark:bg-white/10 rounded-t-lg w-full h-[60%] hover:bg-primary dark:hover:bg-white transition-colors cursor-pointer relative group">
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface dark:bg-white text-white dark:text-primary px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                            60%
                                        </div>
                                    </div>
                                    <div className="bg-secondary/40 dark:bg-[#9ccafe]/40 rounded-t-lg w-full h-[30%] hover:bg-secondary dark:hover:bg-[#9ccafe] transition-colors cursor-pointer relative group">
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface dark:bg-white text-white dark:text-primary px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                            30%
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="bg-primary/20 dark:bg-white/10 rounded-t-lg w-full h-[85%] hover:bg-primary dark:hover:bg-white transition-colors cursor-pointer relative group">
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface dark:bg-white text-white dark:text-primary px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                            85%
                                        </div>
                                    </div>
                                    <div className="bg-secondary/40 dark:bg-[#9ccafe]/40 rounded-t-lg w-full h-[45%] hover:bg-secondary dark:hover:bg-[#9ccafe] transition-colors cursor-pointer relative group">
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface dark:bg-white text-white dark:text-primary px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                            45%
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="bg-primary/20 dark:bg-white/10 rounded-t-lg w-full h-[40%] hover:bg-primary dark:hover:bg-white transition-colors cursor-pointer relative group">
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface dark:bg-white text-white dark:text-primary px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                            40%
                                        </div>
                                    </div>
                                    <div className="bg-secondary/40 dark:bg-[#9ccafe]/40 rounded-t-lg w-full h-[70%] hover:bg-secondary dark:hover:bg-[#9ccafe] transition-colors cursor-pointer relative group">
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface dark:bg-white text-white dark:text-primary px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                            70%
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="bg-primary/20 dark:bg-white/10 rounded-t-lg w-full h-[95%] hover:bg-primary dark:hover:bg-white transition-colors cursor-pointer relative group">
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface dark:bg-white text-white dark:text-primary px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                            95%
                                        </div>
                                    </div>
                                    <div className="bg-secondary/40 dark:bg-[#9ccafe]/40 rounded-t-lg w-full h-[20%] hover:bg-secondary dark:hover:bg-[#9ccafe] transition-colors cursor-pointer relative group">
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface dark:bg-white text-white dark:text-primary px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                            20%
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="bg-primary/20 dark:bg-white/10 rounded-t-lg w-full h-[75%] hover:bg-primary dark:hover:bg-white transition-colors cursor-pointer relative group">
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface dark:bg-white text-white dark:text-primary px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                            75%
                                        </div>
                                    </div>
                                    <div className="bg-secondary/40 dark:bg-[#9ccafe]/40 rounded-t-lg w-full h-[60%] hover:bg-secondary dark:hover:bg-[#9ccafe] transition-colors cursor-pointer relative group">
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface dark:bg-white text-white dark:text-primary px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                            60%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between px-2 text-[10px] font-bold text-outline dark:text-on-primary-container uppercase tracking-widest">
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                        </div>
                    </div>

                    {/* Comparison Widget Card */}
                    <div className="col-span-12 md:col-span-6 glass-card p-6 rounded-3xl flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <div>
                            <h4 className="font-headline-lg text-[18px] text-on-surface dark:text-white mb-1">Performance Index</h4>
                            <p className="text-body-md text-on-surface-variant dark:text-on-primary-container">Monthly comparison vs goals</p>
                        </div>
                        <div className="flex items-center gap-8 mt-4">
                            <div className="flex-1 relative h-4 bg-surface-container dark:bg-white/10 rounded-full overflow-hidden">
                                <div className="absolute left-0 top-0 h-full bg-primary-container dark:bg-white w-[78%] rounded-full"></div>
                            </div>
                            <div className="text-right">
                                <p className="text-[12px] text-outline dark:text-on-primary-container font-bold leading-none uppercase">This Month</p>
                                <p className="text-headline-lg text-[24px] font-black text-on-surface dark:text-white">78%</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-8 mt-4">
                            <div className="flex-1 relative h-4 bg-surface-container dark:bg-white/10 rounded-full overflow-hidden">
                                <div className="absolute left-0 top-0 h-full bg-secondary w-[62%] rounded-full opacity-50 dark:opacity-70"></div>
                            </div>
                            <div className="text-right">
                                <p className="text-[12px] text-outline dark:text-on-primary-container font-bold leading-none uppercase">Last Month</p>
                                <p className="text-headline-lg text-[24px] font-black text-on-surface-variant dark:text-white/60">62%</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Events Table Glass Card */}
                    <div className="col-span-12 md:col-span-8 glass-card p-6 rounded-3xl group transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-headline-lg text-[20px] text-on-surface dark:text-white">Critical Deliverables</h4>
                            <button className="text-primary dark:text-white font-bold text-[14px] hover:underline cursor-pointer">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-primary/5 dark:border-white/5">
                                    <tr className="text-label-sm text-outline dark:text-on-primary-container uppercase">
                                        <th className="py-3 px-2">Project</th>
                                        <th className="py-3 px-2">Owner</th>
                                        <th className="py-3 px-2">Due Date</th>
                                        <th className="py-3 px-2">Health</th>
                                        <th className="py-3 px-2 text-right">Progress</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-primary/5 dark:divide-white/5">
                                    <tr className="group/row hover:bg-primary/5 dark:hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 dark:bg-white/10 rounded-lg flex items-center justify-center text-blue-600 dark:text-white">
                                                    <span className="material-symbols-outlined text-[18px]">api</span>
                                                </div>
                                                <span className="font-bold text-on-surface dark:text-white">API Refactoring</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2 text-body-md text-on-surface dark:text-white">Alexandra Deff</td>
                                        <td className="py-4 px-2 text-body-md text-on-surface-variant dark:text-on-primary-container">Nov 28, 2024</td>
                                        <td className="py-4 px-2">
                                            <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-[10px] font-black uppercase">
                                                Stable
                                            </span>
                                        </td>
                                        <td className="py-4 px-2 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <span className="text-body-md font-bold text-on-surface dark:text-white">88%</span>
                                                <div className="w-16 h-1.5 bg-surface-container dark:bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary dark:bg-white w-[88%]"></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="group/row hover:bg-primary/5 dark:hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-teal-100 dark:bg-white/10 rounded-lg flex items-center justify-center text-teal-600 dark:text-white">
                                                    <span className="material-symbols-outlined text-[18px]">brush</span>
                                                </div>
                                                <span className="font-bold text-on-surface dark:text-white">UI Design Kit</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2 text-body-md text-on-surface dark:text-white">Edwin Adenike</td>
                                        <td className="py-4 px-2 text-body-md text-on-surface-variant dark:text-on-primary-container">Dec 05, 2024</td>
                                        <td className="py-4 px-2">
                                            <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 text-[10px] font-black uppercase">
                                                Review
                                            </span>
                                        </td>
                                        <td className="py-4 px-2 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <span className="text-body-md font-bold text-on-surface dark:text-white">42%</span>
                                                <div className="w-16 h-1.5 bg-surface-container dark:bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary dark:bg-white w-[42%]"></div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Secondary Metric / Gauge Card */}
                    <div className="col-span-12 md:col-span-4 glass-card p-6 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center text-center group transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                        <div className="absolute top-0 right-0 p-4">
                            <span className="material-symbols-outlined text-primary/10 dark:text-white/5 text-6xl rotate-12">trending_up</span>
                        </div>
                        <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle className="text-primary/5 dark:text-white/5" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12"></circle>
                                <circle className="text-primary dark:text-white transition-all duration-1000" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="132" strokeWidth="12"></circle>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-[32px] font-black text-on-surface dark:text-white">70%</span>
                                <span className="text-[10px] font-bold text-outline dark:text-on-primary-container uppercase tracking-wider">Goal Met</span>
                            </div>
                        </div>
                        <h4 className="font-headline-lg text-[18px] text-on-surface dark:text-white">Quarterly Sprint</h4>
                        <p className="text-body-md text-on-surface-variant dark:text-on-primary-container px-4">
                            You are 12% ahead of last quarter's average completion time.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
