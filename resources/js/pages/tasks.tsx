import { Head } from '@inertiajs/react';
import { useState } from 'react';

const initialTasks = [
    {
        id: 'DB-402',
        name: 'Optimize Database Queries',
        category: 'Performance',
        project: 'Cloud Migration',
        assignee: 'David Oshodi',
        assigneeAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9Y4xCO5AAbIL_K3rOFPZjm4-3iX7r5bFU3gzqGZP2BSxEutMUYbgRd9wYmIpXO76VAJ1ta-O8605QZlCRQnO0T57Tpy8pYvs1UZX9goo6NyhwpuqG5LUW1lEiIushEDlKRH2ukq589tyKcP3Flh1nBMMsd3lwfsp441zs2fHGOrOCeqj9fGdqaV0htM6q4A1NPWylezCaQquUzbid2q8R86yCJdFReiCYPYalpGhCPmATuV8GPG__zA',
        dueDate: 'Oct 24, 2023',
        status: 'In Progress',
        priority: 'High',
        completed: false,
    },
    {
        id: 'SEC-110',
        name: 'Security Audit Phase 1',
        category: 'Compliance',
        project: 'Enterprise Portal',
        assignee: 'Alexandra Deff',
        assigneeAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcm5l-kZeFSKGucHIquBbrkmORebh5wHKBU9fECsG02e2KEtS-_YDObdnh5-poZTNqyECbnsP-iDGG-C34DMNnKVCZs9T1Z0N-YRM8DTkuibs-86HD8PLgYtQ29fOVXP9I1KkAfjGAdMbunMsRrYR8RK_Z1CDpNUxKUTe8RBzfqguh1WYAUau533uW4qfx4Ux0Cj-Oqbgn6rnq83kx_yQdqCuh-ijVdSXoRPayUVhld-IWjD4QXALppw',
        dueDate: 'Oct 20, 2023',
        status: 'Completed',
        priority: 'Medium',
        completed: true,
    },
    {
        id: 'API-992',
        name: 'Refactor API Endpoints',
        category: 'Backend',
        project: 'Mobile App V2',
        assignee: 'Isaac Micheal',
        assigneeInitials: 'IM',
        dueDate: 'Nov 02, 2023',
        status: 'Pending',
        priority: 'Low',
        completed: false,
    },
    {
        id: 'DES-021',
        name: 'UX Research: User Flow',
        category: 'Research',
        project: 'Enterprise Portal',
        assignee: 'Edwin Adenike',
        assigneeAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFgetQ7vthmzksdJ0dKI2J9rsJMwPe6PF34PonKBWHsGxXI02vzBF9I9GlwbBnlAh8LD3Pl-hjukmZnbNGiC8MZFr7l247B02_nGu835UsfINN1hGklRGWQzmxHhOX4_mw_mr6NoAPKrmkjH02UASC_60H6Q7vln3GBSgWVfTgcfoxhk3JWlyLNDXxPYD9la_WQtj7WAGKc6nZpizRvXStf5gNgP2LydhJ2v_QFUbNAtMWwxc21kuAeg',
        dueDate: 'Oct 28, 2023',
        status: 'In Progress',
        priority: 'High',
        completed: false,
    },
];

export default function Tasks() {
    const [tasks, setTasks] = useState(initialTasks);
    const [filterProject, setFilterProject] = useState('All Projects');
    const [filterAssignee, setFilterAssignee] = useState('All Members');

    const toggleTaskCompleted = (id: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id
                    ? {
                          ...task,
                          completed: !task.completed,
                          status: !task.completed ? 'Completed' : 'In Progress',
                      }
                    : task
            )
        );
    };

    const filteredTasks = tasks.filter((task) => {
        const matchesProject = filterProject === 'All Projects' || task.project === filterProject;
        const matchesAssignee =
            filterAssignee === 'All Members' ||
            (filterAssignee === 'Me Only' && task.assignee === 'David Oshodi') ||
            (filterAssignee === 'Design Team' && task.category === 'Research') ||
            (filterAssignee === 'Dev Team' && (task.category === 'Backend' || task.category === 'Performance'));
        return matchesProject && matchesAssignee;
    });

    return (
        <>
            <Head title="Active Tasks | Enterprise Admin" />

            <div className="flex flex-col gap-gutter">
                {/* Page Header Area */}
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-white">Active Tasks</h1>
                        <p className="text-on-surface-variant dark:text-on-primary-container mt-1">
                            Manage and track your project milestones with real-time updates.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 border border-secondary dark:border-white text-secondary dark:text-white px-5 py-2.5 rounded-xl font-bold hover:bg-secondary/5 dark:hover:bg-white/5 transition-all active:scale-95 cursor-pointer">
                            <span className="material-symbols-outlined text-[20px]">file_upload</span>
                            Import Data
                        </button>
                        <button className="flex items-center gap-2 bg-primary-container dark:bg-white text-on-primary-container dark:text-primary px-6 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 cursor-pointer">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            New Task
                        </button>
                    </div>
                </div>

                {/* Dashboard Filtering & Utility */}
                <div className="glass-panel rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-low dark:bg-white/5 rounded-xl border border-outline-variant/30 dark:border-white/10 text-on-surface dark:text-white">
                            <span className="material-symbols-outlined text-[18px] text-outline">filter_list</span>
                            <span className="text-sm font-medium">Filter by Project:</span>
                            <select
                                value={filterProject}
                                onChange={(e) => setFilterProject(e.target.value)}
                                className="bg-transparent border-none text-sm font-bold p-0 focus:ring-0 cursor-pointer"
                            >
                                <option className="dark:text-black">All Projects</option>
                                <option className="dark:text-black">Acme Redesign</option>
                                <option className="dark:text-black">Cloud Migration</option>
                                <option className="dark:text-black">Marketing App</option>
                                <option className="dark:text-black">Enterprise Portal</option>
                                <option className="dark:text-black">Mobile App V2</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-surface-container-low dark:bg-white/5 rounded-xl border border-outline-variant/30 dark:border-white/10 text-on-surface dark:text-white">
                            <span className="material-symbols-outlined text-[18px] text-outline">person</span>
                            <span className="text-sm font-medium">Assignee:</span>
                            <select
                                value={filterAssignee}
                                onChange={(e) => setFilterAssignee(e.target.value)}
                                className="bg-transparent border-none text-sm font-bold p-0 focus:ring-0 cursor-pointer"
                            >
                                <option className="dark:text-black">All Members</option>
                                <option className="dark:text-black">Me Only</option>
                                <option className="dark:text-black">Design Team</option>
                                <option className="dark:text-black">Dev Team</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface dark:text-white">
                        <span className="text-sm text-outline dark:text-on-primary-container font-medium mr-2">Views:</span>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary dark:bg-white text-white dark:text-primary shadow-sm cursor-pointer">
                            <span className="material-symbols-outlined">format_list_bulleted</span>
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high dark:hover:bg-white/10 transition-colors cursor-pointer">
                            <span className="material-symbols-outlined">grid_view</span>
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container-high dark:hover:bg-white/10 transition-colors cursor-pointer">
                            <span className="material-symbols-outlined">calendar_month</span>
                        </button>
                    </div>
                </div>

                {/* Task Data Table */}
                <div className="glass-panel rounded-3xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-primary/5 dark:bg-white/5 text-on-surface-variant dark:text-on-primary-container">
                                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest border-b border-primary/10 dark:border-white/10">
                                        <div className="flex items-center gap-2">
                                            Task Name
                                            <span className="material-symbols-outlined text-[14px]">unfold_more</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest border-b border-primary/10 dark:border-white/10">
                                        Project
                                    </th>
                                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest border-b border-primary/10 dark:border-white/10">
                                        Assignee
                                    </th>
                                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest border-b border-primary/10 dark:border-white/10">
                                        Due Date
                                    </th>
                                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest border-b border-primary/10 dark:border-white/10">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest border-b border-primary/10 dark:border-white/10">
                                        Priority
                                    </th>
                                    <th className="px-6 py-4 border-b border-primary/10 dark:border-white/10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5 dark:divide-white/5">
                                {filteredTasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-primary/[0.02] dark:hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => toggleTaskCompleted(task.id)}
                                                    className={`w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer transition-colors ${
                                                        task.completed
                                                            ? 'border-primary/50 bg-primary/20 dark:border-white/50 dark:bg-white/20'
                                                            : 'border-outline-variant group-hover:border-primary dark:group-hover:border-white'
                                                    }`}
                                                >
                                                    {task.completed && (
                                                        <span className="material-symbols-outlined text-primary dark:text-white text-[14px] font-bold">
                                                            check
                                                        </span>
                                                    )}
                                                </button>
                                                <div>
                                                    <p
                                                        className={`font-bold text-on-surface dark:text-white ${
                                                            task.completed ? 'text-on-surface/50 dark:text-white/50 line-through' : ''
                                                        }`}
                                                    >
                                                        {task.name}
                                                    </p>
                                                    <p className="text-xs text-outline dark:text-on-primary-container">
                                                        {task.id} • {task.category}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-2.5 py-1 bg-surface-container dark:bg-white/10 text-secondary dark:text-white text-[11px] font-bold rounded-md">
                                                {task.project}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                {task.assigneeAvatar ? (
                                                    <img
                                                        className="w-7 h-7 rounded-full object-cover border border-white/20"
                                                        src={task.assigneeAvatar}
                                                        alt={task.assignee}
                                                    />
                                                ) : (
                                                    <div className="w-7 h-7 bg-primary-container dark:bg-white/10 text-on-primary-container dark:text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                                                        {task.assigneeInitials}
                                                    </div>
                                                )}
                                                <span className="text-sm font-medium text-on-surface dark:text-white">{task.assignee}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-on-surface dark:text-white">{task.dueDate}</td>
                                        <td className="px-6 py-5">
                                            {task.status === 'Completed' && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                    Completed
                                                </span>
                                            )}
                                            {task.status === 'In Progress' && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-on-secondary-container/10 dark:bg-[#9ccafe]/10 text-on-secondary-container dark:text-[#9ccafe] rounded-full text-xs font-bold">
                                                    <span className="w-1.5 h-1.5 bg-on-secondary-container dark:bg-[#9ccafe] rounded-full animate-pulse"></span>
                                                    In Progress
                                                </span>
                                            )}
                                            {task.status === 'Pending' && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-highest dark:bg-white/10 text-on-surface-variant dark:text-white/60 rounded-full text-xs font-bold">
                                                    <span className="w-1.5 h-1.5 bg-outline rounded-full"></span>
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            {task.priority === 'High' && (
                                                <span className="text-error font-bold text-xs flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[16px]">keyboard_double_arrow_up</span>
                                                    High
                                                </span>
                                            )}
                                            {task.priority === 'Medium' && (
                                                <span className="text-secondary dark:text-white/70 font-bold text-xs flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[16px]">remove</span>
                                                    Medium
                                                </span>
                                            )}
                                            {task.priority === 'Low' && (
                                                <span className="text-on-surface-variant dark:text-white/50 font-bold text-xs flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
                                                    Low
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="text-outline dark:text-on-primary-container hover:text-primary dark:hover:text-white transition-colors cursor-pointer">
                                                <span className="material-symbols-outlined">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer/Pagination */}
                    <div className="px-6 py-4 border-t border-primary/5 dark:border-white/10 flex items-center justify-between text-on-surface dark:text-white">
                        <p className="text-sm text-outline dark:text-on-primary-container">
                            Showing <span className="font-bold text-on-surface dark:text-white">1-{filteredTasks.length}</span> of{' '}
                            <span className="font-bold text-on-surface dark:text-white">{filteredTasks.length}</span> tasks
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 dark:border-white/10 text-outline dark:text-on-primary-container disabled:opacity-30" disabled>
                                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary dark:bg-white text-white dark:text-primary text-sm font-bold">
                                1
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high dark:hover:bg-white/10 text-sm font-bold cursor-pointer">
                                2
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high dark:hover:bg-white/10 text-sm font-bold cursor-pointer">
                                3
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/30 dark:border-white/10 text-outline dark:text-on-primary-container hover:bg-surface-container-high dark:hover:bg-white/10 cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Secondary Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                    <div className="glass-panel p-6 rounded-3xl group cursor-pointer hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-primary/10 dark:bg-white/10 rounded-2xl flex items-center justify-center text-primary dark:text-white group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">list_alt</span>
                            </div>
                            <span className="text-green-600 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-lg text-xs font-bold">+12%</span>
                        </div>
                        <p className="text-outline dark:text-on-primary-container text-sm font-medium">Total Tasks</p>
                        <h3 className="text-3xl font-black mt-1 text-on-surface dark:text-white">42</h3>
                    </div>

                    <div className="glass-panel p-6 rounded-3xl group cursor-pointer hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-on-secondary-container/10 dark:bg-white/10 rounded-2xl flex items-center justify-center text-on-secondary-container dark:text-white group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">sync</span>
                            </div>
                            <span className="text-on-secondary-container bg-blue-50 dark:bg-white/10 dark:text-white px-2 py-1 rounded-lg text-xs font-bold">Active</span>
                        </div>
                        <p className="text-outline dark:text-on-primary-container text-sm font-medium">In Progress</p>
                        <h3 className="text-3xl font-black mt-1 text-on-surface dark:text-white">12</h3>
                    </div>

                    <div className="glass-panel p-6 rounded-3xl group cursor-pointer hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 dark:bg-white/10 rounded-2xl flex items-center justify-center text-green-700 dark:text-green-400 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">check_circle</span>
                            </div>
                            <span className="text-green-700 bg-green-50 dark:bg-white/10 dark:text-white px-2 py-1 rounded-lg text-xs font-bold">High</span>
                        </div>
                        <p className="text-outline dark:text-on-primary-container text-sm font-medium">Completion Rate</p>
                        <h3 className="text-3xl font-black mt-1 text-on-surface dark:text-white">84%</h3>
                    </div>

                    <div className="glass-panel p-6 rounded-3xl group cursor-pointer hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-error/10 dark:bg-white/10 rounded-2xl flex items-center justify-center text-error dark:text-red-400 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">priority_high</span>
                            </div>
                            <span className="text-error bg-red-50 dark:bg-white/10 dark:text-white px-2 py-1 rounded-lg text-xs font-bold">Overdue</span>
                        </div>
                        <p className="text-outline dark:text-on-primary-container text-sm font-medium">Overdue Tasks</p>
                        <h3 className="text-3xl font-black mt-1 text-on-surface dark:text-white">03</h3>
                    </div>
                </div>
            </div>
        </>
    );
}
