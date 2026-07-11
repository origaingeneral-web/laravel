import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Dashboard() {
    // Timer state for Time Tracker
    const [seconds, setSeconds] = useState(5048); // Start at 01:24:08
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        let interval: any = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const formatTime = (totalSecs: number) => {
        const h = Math.floor(totalSecs / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSecs % 3600) / 60).toString().padStart(2, '0');
        const s = (totalSecs % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return (
        <>
            <Head title="Dashboard | Enterprise Admin" />

            <div className="flex flex-col gap-gutter">
                {/* Welcome Header */}
                <header className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="font-display-lg text-display-lg text-primary dark:text-white">Dashboard</h2>
                        <p className="font-body-md text-body-md text-on-surface-variant dark:text-on-primary-container">
                            Plan, prioritize, and accomplish your tasks with ease.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 bg-secondary-container dark:bg-white text-on-secondary-container dark:text-primary px-6 py-3 rounded-full font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer">
                            <span className="material-symbols-outlined">add</span>
                            Add Project
                        </button>
                        <button className="flex items-center gap-2 border border-secondary dark:border-white text-secondary dark:text-white px-6 py-3 rounded-full font-bold hover:bg-secondary/5 dark:hover:bg-white/5 transition-all cursor-pointer">
                            <span className="material-symbols-outlined">upload_file</span>
                            Import Data
                        </button>
                    </div>
                </header>

                {/* Bento Grid Main */}
                <div className="bento-grid">
                    {/* Summary Stats */}
                    <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-gutter">
                        {/* Total Projects */}
                        <div className="glass-surface p-6 rounded-[32px] flex flex-col gap-4 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary-container dark:bg-white opacity-5 group-hover:opacity-10 transition-opacity"></div>
                            <div className="flex justify-between items-center relative z-10">
                                <span className="text-on-surface-variant dark:text-on-primary-container font-bold">Total Projects</span>
                                <div className="w-8 h-8 bg-white/80 dark:bg-white/10 rounded-full flex items-center justify-center shadow-sm">
                                    <span className="material-symbols-outlined text-primary dark:text-white text-sm">north_east</span>
                                </div>
                            </div>
                            <p className="text-5xl font-black text-primary dark:text-white relative z-10">24</p>
                            <div className="flex items-center gap-2 text-xs font-bold text-on-secondary-container dark:text-secondary-container relative z-10">
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    trending_up
                                </span>
                                Increased from last month
                            </div>
                        </div>

                        {/* Ended Projects */}
                        <div className="glass-surface p-6 rounded-[32px] flex flex-col gap-4 relative overflow-hidden group">
                            <div className="flex justify-between items-center">
                                <span className="text-on-surface-variant dark:text-on-primary-container font-bold">Ended Projects</span>
                                <div className="w-8 h-8 bg-surface-container dark:bg-white/10 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-outline dark:text-on-primary-container text-sm">north_east</span>
                                </div>
                            </div>
                            <p className="text-5xl font-black text-on-surface dark:text-white">10</p>
                            <div className="flex items-center gap-2 text-xs font-bold text-outline dark:text-on-primary-container">
                                <span className="material-symbols-outlined text-sm">schedule</span>
                                Increased from last month
                            </div>
                        </div>

                        {/* Running Projects */}
                        <div className="glass-surface p-6 rounded-[32px] flex flex-col gap-4 relative overflow-hidden group">
                            <div className="flex justify-between items-center">
                                <span className="text-on-surface-variant dark:text-on-primary-container font-bold">Running Projects</span>
                                <div className="w-8 h-8 bg-surface-container dark:bg-white/10 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-outline dark:text-on-primary-container text-sm">north_east</span>
                                </div>
                            </div>
                            <p className="text-5xl font-black text-on-surface dark:text-white">12</p>
                            <div className="flex items-center gap-2 text-xs font-bold text-outline dark:text-on-primary-container">
                                <span className="material-symbols-outlined text-sm">play_circle</span>
                                Increased from last month
                            </div>
                        </div>

                        {/* Pending Project */}
                        <div className="glass-surface p-6 rounded-[32px] flex flex-col gap-4 relative overflow-hidden group">
                            <div className="flex justify-between items-center">
                                <span className="text-on-surface-variant dark:text-on-primary-container font-bold">Pending Project</span>
                                <div className="w-8 h-8 bg-surface-container dark:bg-white/10 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-outline dark:text-on-primary-container text-sm">north_east</span>
                                </div>
                            </div>
                            <p className="text-5xl font-black text-on-surface dark:text-white">2</p>
                            <div className="flex items-center gap-2 text-xs font-bold text-primary dark:text-[#9ccafe]">
                                <span className="material-symbols-outlined text-sm">chat_bubble</span>
                                On Discuss
                            </div>
                        </div>
                    </div>

                    {/* Left Column: Analytics Chart, Reminders, Team Collaboration */}
                    <div className="col-span-12 lg:col-span-8 bento-grid gap-gutter">

                        {/* Analytics Chart */}
                        <div className="col-span-12 lg:col-span-9 glass-surface p-8 rounded-[32px] flex flex-col gap-6">
                            <div className="flex justify-between items-center">
                                <h3 className="font-title-md text-title-md text-on-surface dark:text-white">Project Analytics</h3>
                                <div className="flex items-center gap-2 bg-surface-container dark:bg-white/10 px-3 py-1.5 rounded-full text-xs font-bold text-on-surface dark:text-white">
                                    Weekly <span className="material-symbols-outlined text-sm">expand_more</span>
                                </div>
                            </div>
                            <div className="h-48 flex items-end justify-between gap-4 px-2">
                                <div className="flex flex-col items-center gap-3 w-full">
                                    <div className="w-full bg-primary/10 dark:bg-white/10 rounded-t-2xl relative h-24 group transition-all duration-500 hover:h-28">
                                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(0,18,52,0.1)_5px,rgba(0,18,52,0.1)_10px)] opacity-30 rounded-t-2xl"></div>
                                    </div>
                                    <span className="text-xs text-outline dark:text-on-primary-container font-bold">S</span>
                                </div>
                                <div className="flex flex-col items-center gap-3 w-full">
                                    <div className="w-full bg-primary/40 dark:bg-white/30 rounded-t-2xl relative h-32 group transition-all duration-500 hover:h-36"></div>
                                    <span className="text-xs text-outline dark:text-on-primary-container font-bold">M</span>
                                </div>
                                <div className="flex flex-col items-center gap-3 w-full relative">
                                    <div className="absolute -top-10 bg-primary dark:bg-white text-white dark:text-primary text-[10px] py-1 px-2 rounded font-bold shadow-lg">74%</div>
                                    <div className="w-full bg-secondary-container dark:bg-secondary rounded-t-2xl relative h-28 group transition-all duration-500 hover:h-32"></div>
                                    <span className="text-xs text-outline dark:text-on-primary-container font-bold">T</span>
                                </div>
                                <div className="flex flex-col items-center gap-3 w-full">
                                    <div className="w-full bg-primary-container dark:bg-secondary-container rounded-t-2xl relative h-40 group transition-all duration-500 hover:h-44"></div>
                                    <span className="text-xs text-outline dark:text-on-primary-container font-bold">W</span>
                                </div>
                                <div className="flex flex-col items-center gap-3 w-full">
                                    <div className="w-full bg-primary/5 dark:bg-white/5 rounded-t-2xl relative h-24 border border-primary/20 dark:border-white/20">
                                        <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_5px,rgba(0,18,52,0.1)_5px,rgba(0,18,52,0.1)_10px)] opacity-30 rounded-t-2xl"></div>
                                    </div>
                                    <span className="text-xs text-outline dark:text-on-primary-container font-bold">T</span>
                                </div>
                                <div className="flex flex-col items-center gap-3 w-full">
                                    <div className="w-full bg-primary/5 dark:bg-white/5 rounded-t-2xl relative h-20 border border-primary/20 dark:border-white/20">
                                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(0,18,52,0.1)_5px,rgba(0,18,52,0.1)_10px)] opacity-30 rounded-t-2xl"></div>
                                    </div>
                                    <span className="text-xs text-outline dark:text-on-primary-container font-bold">F</span>
                                </div>
                                <div className="flex flex-col items-center gap-3 w-full">
                                    <div className="w-full bg-primary/5 dark:bg-white/5 rounded-t-2xl relative h-28 border border-primary/20 dark:border-white/20">
                                        <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_5px,rgba(0,18,52,0.1)_5px,rgba(0,18,52,0.1)_10px)] opacity-30 rounded-t-2xl"></div>
                                    </div>
                                    <span className="text-xs text-outline dark:text-on-primary-container font-bold">S</span>
                                </div>
                            </div>
                        </div>

                        {/* Reminders Card */}
                        <div className="col-span-12 lg:col-span-3 glass-surface p-6 rounded-[32px] flex flex-col gap-4">
                            <h3 className="font-title-md text-sm font-bold text-on-surface dark:text-white">Reminders</h3>
                            <div className="flex flex-col gap-1">
                                <p className="font-bold text-primary dark:text-white leading-tight">Meeting with Arc Company</p>
                                <p className="text-xs text-outline dark:text-on-primary-container">Time: 02:00 pm - 04:00 pm</p>
                            </div>
                            <button className="mt-auto w-full bg-primary-container dark:bg-white/10 text-white py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm hover:shadow-lg transition-all active:scale-95 cursor-pointer">
                                <span className="material-symbols-outlined text-lg">videocam</span>
                                Start Meeting
                            </button>
                        </div>

                        {/* Team Collaboration */}
                        <div className="col-span-12 glass-surface p-8 rounded-[32px] flex flex-col gap-6">
                            <div className="flex justify-between items-center">
                                <h3 className="font-title-md text-title-md text-on-surface dark:text-white">Team Collaboration</h3>
                                <button className="border border-secondary dark:border-white text-secondary dark:text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-secondary/5 dark:hover:bg-white/5 transition-all cursor-pointer">
                                    + Add Member
                                </button>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <img className="w-12 h-12 rounded-full object-cover border border-white/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGtODkptzNFl5ZIceJzzhQLSj8_vEcudvmHTBYaKKl5_DEgDvzlWsI8Ugzjslujj77nZq2-F2SsAwCyw9GASzBQ9Gbmh54TjjfXoArUOpS_imBrAr6Oxv_PyAF58mxRhtRCDFCTfEVIYLSd73AxvpLocFX_CV-qu1ByypwIEm8QdbB7f4crLbr2mEVlkgSBy62cz7eTDUbcDlveSZl6yk9G_7ZaNMa9VHvYpUKTjNgdFbMm3r4XjuQ5g" alt="Alexandra Deff" />
                                        <div>
                                            <p className="font-bold text-on-surface dark:text-white">Alexandra Deff</p>
                                            <p className="text-xs text-outline dark:text-on-primary-container">
                                                Working on <span className="font-bold text-primary dark:text-white">Github Project Repository</span>
                                            </p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-on-tertiary-container/10 text-on-tertiary-container dark:bg-white/10 dark:text-white rounded-full text-[10px] font-bold">Completed</span>
                                </div>
                                <div className="h-px bg-outline-variant/10 dark:bg-white/10"></div>
                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <img className="w-12 h-12 rounded-full object-cover border border-white/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsiAsuWBzvcxbPign368OMlvvn0C960ZTvez6pYoJEO4YfeaX_FArInAgCJ1xTB60dzqNTfuuL93kSxZirpBpSe9RKjeY4-HRm1qozns3AH2uDSN3KadQ_i8zLErKzhgEchXgQqQl3qnD0QlivKtLolQ9Hmos23TxFYVAfSTa8CN07xIPd86tRm7RKjmednF0_1Pfvn3qnYKF0KcShglOXA4ZWxyeEBXoI1bfpZglDX2n83yF0c8ohtQ" alt="Edwin Adenike" />
                                        <div>
                                            <p className="font-bold text-on-surface dark:text-white">Edwin Adenike</p>
                                            <p className="text-xs text-outline dark:text-on-primary-container">
                                                Working on <span className="font-bold text-primary dark:text-white">Integrate User Authentication</span>
                                            </p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-secondary-container/20 text-on-secondary-container dark:bg-white/10 dark:text-white rounded-full text-[10px] font-bold">In Progress</span>
                                </div>
                                <div className="h-px bg-outline-variant/10 dark:bg-white/10"></div>
                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <img className="w-12 h-12 rounded-full object-cover border border-white/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU-uHyXCOsXmgaGABh_darhfx4qwD5Ugjb1FZMKChKjn_X5E54j93kQL0DLzCpctXG853Un4sKtAtEPntFdx_v3LjzIA8fFOmPANfEHHz3toVvAp-lGmL1KACbTrHiicBdOxth5WnWQd2hPJGJxo8jlIT6vs-PaR6Gkd034rjv8x9og4d2R4Ogfib70VsG4ONh3z8f13Z6D9L93X4yH8yCz21ACqHmJcmX_GfX3KVTz04NqNrHeIo5ww" alt="Isaac Oluwatemilorun" />
                                        <div>
                                            <p className="font-bold text-on-surface dark:text-white">Isaac Oluwatemilorun</p>
                                            <p className="text-xs text-outline dark:text-on-primary-container">
                                                Working on <span className="font-bold text-primary dark:text-white">Develop Search and Filter Functionality</span>
                                            </p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-error-container/20 text-on-error-container dark:bg-white/10 dark:text-white rounded-full text-[10px] font-bold">Pending</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Project Progress & Time Tracker */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">

                        {/* Projects List */}
                        <div className="glass-surface p-8 rounded-[32px] flex flex-col gap-6">
                            <div className="flex justify-between items-center">
                                <h3 className="font-title-md text-title-md text-on-surface dark:text-white">Projects</h3>
                                <button className="bg-surface-container dark:bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-on-surface dark:text-white cursor-pointer">
                                    + New
                                </button>
                            </div>
                            <div className="flex flex-col gap-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-primary/10 dark:bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-primary dark:text-white">
                                        <span className="material-symbols-outlined">code</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-on-surface dark:text-white leading-tight">Develop API Endpoints</p>
                                        <p className="text-[10px] text-outline dark:text-on-primary-container">Due date: Nov 26, 2024</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-on-tertiary-container/10 dark:bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-on-tertiary-container dark:text-white">
                                        <span className="material-symbols-outlined">water_drop</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-on-surface dark:text-white leading-tight">Onboarding Flow</p>
                                        <p className="text-[10px] text-outline dark:text-on-primary-container">Due date: Nov 30, 2024</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-secondary-container/20 dark:bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-on-secondary-container dark:text-white">
                                        <span className="material-symbols-outlined">palette</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-on-surface dark:text-white leading-tight">Build Dashboard UI</p>
                                        <p className="text-[10px] text-outline dark:text-on-primary-container">Due date: Dec 1, 2024</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Project Progress Gauge */}
                        <div className="glass-surface p-8 rounded-[32px] flex flex-col gap-6 items-center">
                            <div className="w-full flex justify-start">
                                <h3 className="font-title-md text-title-md text-on-surface dark:text-white">Project Progress</h3>
                            </div>
                            <div className="relative w-48 h-24 overflow-hidden flex items-end justify-center">
                                <svg className="w-48 h-48 absolute top-0" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" fill="none" r="45" stroke="#e7eeff" strokeDasharray="141.37" strokeDashoffset="0" strokeLinecap="round" strokeWidth="10" transform="rotate(-180, 50, 50)"></circle>
                                    <circle className="progress-ring" cx="50" cy="50" fill="none" r="45" stroke="#052659" strokeDasharray="141.37" strokeDashoffset="56.54" strokeLinecap="round" strokeWidth="10" transform="rotate(-180, 50, 50)"></circle>
                                </svg>
                                <div className="text-center z-10 pb-2">
                                    <p className="text-3xl font-black text-on-surface dark:text-white">41%</p>
                                    <p className="text-[10px] font-bold text-outline dark:text-on-primary-container uppercase tracking-widest">Project Ended</p>
                                </div>
                            </div>
                            <div className="w-full flex justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 bg-primary-container rounded-full"></div>
                                    <span className="text-[10px] font-bold text-outline dark:text-on-primary-container">Completed</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 bg-primary/40 rounded-full"></div>
                                    <span className="text-[10px] font-bold text-outline dark:text-on-primary-container">In Progress</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 bg-outline-variant/40 rounded-full"></div>
                                    <span className="text-[10px] font-bold text-outline dark:text-on-primary-container">Pending</span>
                                </div>
                            </div>
                        </div>

                        {/* Time Tracker Widget */}
                        <div className="relative p-8 rounded-[32px] overflow-hidden min-h-[160px] flex flex-col justify-center gap-4 bg-primary dark:bg-white/5 shadow-md">
                            <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent"></div>
                            <div className="relative z-10">
                                <h3 className="font-title-md text-sm font-bold text-white mb-2">Time Tracker</h3>
                                <div className="flex items-center justify-between">
                                    <p className="text-4xl font-black text-white tracking-tighter">{formatTime(seconds)}</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setIsActive(!isActive)}
                                            className="w-10 h-10 bg-white dark:bg-white/10 rounded-full flex items-center justify-center text-primary-container dark:text-white shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                {isActive ? 'pause' : 'play_arrow'}
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => { setSeconds(0); setIsActive(false); }}
                                            className="w-10 h-10 bg-error rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stop</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </>
    );
}

