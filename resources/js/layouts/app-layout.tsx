import { Link, usePage } from '@inertiajs/react';
import { logout } from '@/routes';
import { useInitials } from '@/hooks/use-initials';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type BreadcrumbItem = {
    title: string;
    href?: string;
};

export default function AppLayout({
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    const { auth, url } = usePage().props as any;
    const getInitials = useInitials();

    const isDashboard = url === '/dashboard';
    // const isTasks = url.startsWith('/tasks');
    // const isAnalytics = url.startsWith('/analytics');
    // const isTeam = url.startsWith('/team');
    // const isSettings = url.startsWith('/settings');

    const getLinkClass = (isActive: boolean) =>
        isActive
            ? 'flex items-center gap-3 bg-primary/10 text-on-secondary-container dark:bg-white/10 dark:text-white border-l-4 border-primary dark:border-white px-4 py-3 rounded-r-full font-bold transition-all'
            : 'flex items-center gap-3 text-on-surface-variant dark:text-on-primary-container hover:text-primary dark:hover:text-white px-4 py-3 transition-all duration-200 group';

    return (
        <div className="flex min-h-screen w-full bg-background dark:bg-primary-container text-foreground">
            {/* SideNavBar */}
            <aside className="fixed left-0 top-0 h-full w-[280px] bg-white/70 dark:bg-primary-container/70 backdrop-blur-xl border-r border-white/40 dark:border-white/10 shadow-sm z-50 flex flex-col py-8 gap-6 overflow-y-auto custom-scrollbar">
                {/* Brand Header */}
                <div className="px-8 flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-container dark:bg-white/10 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                                dashboard
                            </span>
                        </div>
                        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface dark:text-white">Donezo</h1>
                    </div>
                    <p className="text-label-sm font-label-sm text-outline dark:text-on-primary-container px-1 uppercase tracking-widest">
                        Enterprise Admin
                    </p>
                </div>

                {/* Navigation Clusters */}
                <nav className="flex-1 flex flex-col gap-8 px-4">
                    {/* General Section */}
                    <div className="flex flex-col gap-2">
                        <p className="px-4 text-label-sm font-label-sm uppercase tracking-widest text-outline dark:text-on-primary-container">
                            General
                        </p>
                        <div className="flex flex-col gap-1">
                            <Link href="/dashboard" className={getLinkClass(isDashboard)}>
                                <span className="material-symbols-outlined">dashboard</span>
                                <span className="font-body-md text-body-md">Dashboard</span>
                            </Link>

                            {/* <Link href="/tasks" className={getLinkClass(isTasks)}>
                                <span className="material-symbols-outlined">assignment</span>
                                <span className="font-body-md text-body-md">Tasks</span>
                            </Link>

                            <Link href="/analytics" className={getLinkClass(isAnalytics)}>
                                <span className="material-symbols-outlined">bar_chart</span>
                                <span className="font-body-md text-body-md">Analytics</span>
                            </Link>

                            <Link href="/team" className={getLinkClass(isTeam)}>
                                <span className="material-symbols-outlined">group</span>
                                <span className="font-body-md text-body-md">Team</span>
                            </Link> */}
                        </div>
                    </div>

                    {/* Footer Navigation */}
                    <div className="mt-auto flex flex-col gap-2 border-t border-outline-variant/20 dark:border-white/10 pt-6">
                        {/* <Link href="/settings/profile" className={getLinkClass(isSettings)}>
                            <span className="material-symbols-outlined">settings</span>
                            <span className="font-body-md text-body-md">Settings</span>
                        </Link> */}

                        <Link
                            href={logout()}
                            method="post"
                            as="button"
                            className="flex items-center gap-3 text-error px-4 py-3 hover:bg-error/5 transition-colors w-full text-left font-body-md text-body-md rounded-xl"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            <span>Logout</span>
                        </Link>
                    </div>
                </nav>

                {/* CTA Widget */}
                <div className="mx-6 p-4 rounded-2xl bg-primary-container dark:bg-white/5 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col gap-2">
                        <p className="text-on-primary font-bold text-body-md">Download Mobile App</p>
                        <p className="text-on-primary-container text-xs">Get Donezo on the go.</p>
                        <button className="mt-2 py-2 px-4 bg-white dark:bg-white/10 text-primary-container dark:text-white rounded-lg font-bold text-xs hover:scale-105 transition-transform active:scale-95">
                            Download Now
                        </button>
                    </div>
                </div>
            </aside>

            {/* TopNavBar */}
            <header className="fixed top-0 right-0 w-[calc(100%-280px)] h-20 bg-white/70 dark:bg-primary-container/70 backdrop-blur-xl border-b border-white/40 dark:border-white/10 shadow-sm flex justify-between items-center px-margin-desktop z-40">
                <div className="flex items-center gap-6 w-1/3">
                    <div className="relative w-full max-w-md group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-on-primary-container group-focus-within:text-primary transition-colors">
                            search
                        </span>
                        <input
                            className="w-full bg-surface-container-low dark:bg-white/5 border-none rounded-full py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 dark:focus:ring-white/20 font-body-md transition-all text-on-surface dark:text-white placeholder-outline"
                            placeholder="Search task..."
                            type="text"
                        />
                    </div>
                </div>

                <nav className="flex items-center gap-8">
                    <Link
                        href="/dashboard"
                        className={`font-title-md text-title-md py-1 ${isDashboard ? 'text-primary dark:text-white font-bold border-b-2 border-primary dark:border-white' : 'text-on-surface-variant dark:text-on-primary-container hover:text-primary dark:hover:text-white transition-colors'}`}
                    >
                        Overview
                    </Link>
                    {/* <Link
                        href="/tasks"
                        className={`font-title-md text-title-md py-1 ${isTasks ? 'text-primary dark:text-white font-bold border-b-2 border-primary dark:border-white' : 'text-on-surface-variant dark:text-on-primary-container hover:text-primary dark:hover:text-white transition-colors'}`}
                    >
                        Tasks
                    </Link>
                    <Link
                        href="/analytics"
                        className={`font-title-md text-title-md py-1 ${isAnalytics ? 'text-primary dark:text-white font-bold border-b-2 border-primary dark:border-white' : 'text-on-surface-variant dark:text-on-primary-container hover:text-primary dark:hover:text-white transition-colors'}`}
                    >
                        Analytics
                    </Link> */}
                </nav>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant dark:text-on-primary-container hover:bg-surface-container dark:hover:bg-white/10 rounded-full transition-colors relative">
                            <span className="material-symbols-outlined">mail</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant dark:text-on-primary-container hover:bg-surface-container dark:hover:bg-white/10 rounded-full transition-colors relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary dark:bg-white rounded-full animate-pulse"></span>
                        </button>
                    </div>

                    <div className="h-8 w-px bg-outline-variant/30 dark:bg-white/10 mx-2"></div>

                    <div className="flex items-center gap-3">
                        {auth.user && (
                            <>
                                <div className="text-right">
                                    <p className="font-title-md text-sm font-bold text-on-surface dark:text-white">
                                        {auth.user.name}
                                    </p>
                                    <p className="text-[10px] text-outline dark:text-on-primary-container">
                                        {auth.user.email}
                                    </p>
                                </div>
                                <Avatar className="h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-sm">
                                    <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                    <AvatarFallback className="bg-neutral-200 text-black dark:bg-white/10 dark:text-white font-bold">
                                        {getInitials(auth.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content Canvas */}
            <main className="ml-[280px] mt-20 p-margin-desktop w-full max-w-container-max mx-auto flex-1 min-h-[calc(100vh-80px)]">
                {children}
            </main>
        </div>
    );
}

