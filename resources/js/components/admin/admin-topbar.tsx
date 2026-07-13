import { Link, usePage } from '@inertiajs/react';
import { Bell, CalendarDays, Menu, Moon, PanelLeftClose, PanelLeftOpen, Search, Sun } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { adminNavigation } from '@/config/admin-navigation';
import { useAppearance } from '@/hooks/use-appearance';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import type { User } from '@/types';

type Props = {
    onMenuClick: () => void;
    onToggleCollapse: () => void;
    collapsed: boolean;
};

const notifications = [
    {
        title: 'New lead assigned',
        body: 'Emma Smith needs a follow-up call.',
        time: '7 hr ago',
    },
    {
        title: 'Deal moved to review',
        body: 'Enterprise CRM package is ready.',
        time: '1 day ago',
    },
    {
        title: 'Invoice paid',
        body: 'Acme Studio cleared the latest invoice.',
        time: '2 days ago',
    },
];

function getPageTitle(url: string): string {
    const items = adminNavigation.flatMap((group) =>
        group.items.flatMap((item) => [item, ...(item.children ?? [])])
    );
    const matched = items.find((item) => (item.active ?? [item.href]).some((pattern) => url === pattern || url.startsWith(`${pattern}/`)));

    return matched?.title ?? 'Dashboard';
}

export function AdminTopbar({ onMenuClick, onToggleCollapse, collapsed }: Props) {
    const { props, url } = usePage();
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const getInitials = useInitials();
    const auth = props.auth as { user?: User } | undefined;
    const user = auth?.user;
    const [query, setQuery] = useState('');
    const pageTitle = getPageTitle(url);
    const searchItems = useMemo(
        () =>
            adminNavigation
                .flatMap((group) => group.items.flatMap((item) => [item, ...(item.children ?? [])]))
                .filter((item) => item.title.toLowerCase().includes(query.toLowerCase())),
        [query]
    );

    const dark = resolvedAppearance === 'dark';

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-[#f7f7fb]/80 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80">
            <div className="flex h-20 items-center gap-3 px-2 sm:px-4 lg:px-6">
                <button
                    type="button"
                    className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white lg:hidden"
                    onClick={onMenuClick}
                    aria-label="Open sidebar"
                >
                    <Menu className="size-5" aria-hidden="true" />
                </button>

                <button
                    type="button"
                    className="hidden rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white lg:inline-flex"
                    onClick={onToggleCollapse}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? <PanelLeftOpen className="size-5" aria-hidden="true" /> : <PanelLeftClose className="size-5" aria-hidden="true" />}
                </button>

                {/* <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Workspace</p>
                    <h1 className="truncate text-xl font-black text-slate-950 dark:text-white sm:text-2xl">{pageTitle}</h1>
                </div> */}

                <Dialog>
                    <DialogTrigger asChild>
                        <button
                            type="button"
                            className="hidden w-full max-w-sm items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-left text-sm text-slate-400 shadow-sm transition hover:border-nexlink-primary/30 hover:text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:text-white md:flex"
                        >
                            <Search className="size-4" aria-hidden="true" />
                            Search dashboards, apps, settings
                        </button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl border-white/50 bg-white/95 p-0 dark:border-white/10 dark:bg-slate-950/95">
                        <DialogHeader className="border-b border-slate-100 p-5 dark:border-white/10">
                            <DialogTitle>Search NexLink</DialogTitle>
                            <DialogDescription>Jump quickly to a dashboard, app, or account page.</DialogDescription>
                        </DialogHeader>
                        <div className="p-5">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                                <input
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-nexlink-primary focus:ring-4 focus:ring-nexlink-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                                    placeholder="Type a page name..."
                                    autoFocus
                                />
                            </div>
                            <div className="mt-4 max-h-72 space-y-1 overflow-y-auto">
                                {searchItems.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                                        >
                                            <Icon className="size-4" aria-hidden="true" />
                                            {item.title}
                                        </Link>
                                    );
                                })}
                                {searchItems.length === 0 && (
                                    <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-white/5 dark:text-slate-400">
                                        No matching page found.
                                    </p>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <div className="ml-auto flex items-center gap-2">
                    <button
                        type="button"
                        className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition hover:text-nexlink-primary dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white"
                        onClick={() => updateAppearance(dark ? 'light' : 'dark')}
                        aria-label="Toggle appearance"
                    >
                        {dark ? <Sun className="size-5" aria-hidden="true" /> : <Moon className="size-5" aria-hidden="true" />}
                    </button>

                    <Link
                        href="/calendar"
                        prefetch
                        className="hidden rounded-full border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition hover:text-nexlink-primary dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white sm:inline-flex"
                        aria-label="Open calendar"
                    >
                        <CalendarDays className="size-5" aria-hidden="true" />
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="relative rounded-full border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm transition hover:text-nexlink-primary dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white"
                                aria-label="Open notifications"
                            >
                                <Bell className="size-5" aria-hidden="true" />
                                <span className="absolute right-2 top-2 size-2 rounded-full bg-nexlink-primary ring-2 ring-white dark:ring-slate-950" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80 rounded-3xl p-2">
                            <DropdownMenuLabel className="flex items-center justify-between px-3 py-2">
                                <span>Notifications</span>
                                <span className="rounded-full bg-nexlink-primary/10 px-2 py-0.5 text-xs font-black text-nexlink-primary">
                                    9
                                </span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {notifications.map((notification) => (
                                <DropdownMenuItem key={notification.title} className="items-start rounded-2xl p-3">
                                    <span className="mt-1 size-2 rounded-full bg-nexlink-primary" />
                                    <span className="ml-3">
                                        <span className="block font-semibold">{notification.title}</span>
                                        <span className="block text-xs text-muted-foreground">{notification.body}</span>
                                        <span className="mt-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                            {notification.time}
                                        </span>
                                    </span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className={cn(
                                        'ml-1 flex items-center gap-3 rounded-full border border-slate-200 bg-white p-1 pr-3 shadow-sm transition hover:border-nexlink-primary/30 dark:border-white/10 dark:bg-white/5'
                                    )}
                                >
                                    <Avatar className="size-10">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback className="bg-nexlink-primary/10 font-black text-nexlink-primary dark:bg-white/10 dark:text-white">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden text-left md:block">
                                        <span className="block text-sm font-black leading-4 text-slate-950 dark:text-white">{user.name}</span>
                                        <span className="block max-w-36 truncate text-xs text-slate-400">{user.email}</span>
                                    </span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 rounded-3xl p-2">
                                <UserMenuContent user={user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </header>
    );
}
