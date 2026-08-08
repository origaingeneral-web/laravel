import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, LogOut, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { superAdminNavigation, webAdminNavigation } from '@/config/admin-navigation';
import { logout } from '@/routes';
import type { AdminNavGroup, AdminNavItem } from '@/config/admin-navigation';
import { cn } from '@/lib/utils';
import type { Auth } from '@/types';

type Props = {
    open: boolean;
    collapsed: boolean;
    onClose: () => void;
    onToggleCollapse: () => void;
};

function isItemActive(item: AdminNavItem, currentUrl: string): boolean {
    const patterns = item.active ?? [item.href];

    return patterns.some((pattern) => currentUrl === pattern || currentUrl.startsWith(`${pattern}/`));
}

function canShowItem(item: AdminNavItem, auth: Record<string, unknown>): boolean {
    const user = auth.user as Record<string, unknown> | null | undefined;
    const roles = (auth.roles as string[] | undefined) ?? [];
    const permissions = (auth.permissions as string[] | undefined) ?? [];
    const guard = auth.guard as string | undefined;

    if (item.guard && item.guard !== guard) {
        return false;
    }

    if (item.role && user?.initial_role !== item.role && !roles.includes(item.role)) {
        return false;
    }

    if (item.permission && !permissions.includes(item.permission)) {
        return false;
    }

    return true;
}

function filterGroups(groups: AdminNavGroup[], auth: Record<string, unknown>): AdminNavGroup[] {
    return groups
        .map((group) => ({
            ...group,
            items: group.items
                .filter((item) => canShowItem(item, auth))
                .map((item) => ({
                    ...item,
                    children: item.children?.filter((child) => canShowItem(child, auth)),
                })),
        }))
        .filter((group) => group.items.length > 0);
}

function NavItem({
    item,
    currentUrl,
    onNavigate,
    collapsed,
}: {
    item: AdminNavItem;
    currentUrl: string;
    onNavigate: () => void;
    collapsed: boolean;
}) {
    const active = isItemActive(item, currentUrl);
    const hasChildren = Boolean(item.children?.length);
    const [expanded, setExpanded] = useState(active);
    const Icon = item.icon;

    if (hasChildren) {
        return (
            <div>
                <button
                    type="button"
                    className={cn(
                        'flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition',
                        collapsed && 'justify-center px-2',
                        active
                            ? 'bg-nexlink-primary/10 text-nexlink-primary dark:bg-white/10 dark:text-white'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                    )}
                    aria-expanded={expanded}
                    onClick={() => setExpanded((value) => !value)}
                    title={collapsed ? item.title : undefined}
                >
                    <Icon className="size-4" aria-hidden="true" />
                    {!collapsed && <span className="flex-1 text-left">{item.title}</span>}
                    {!collapsed && <ChevronDown className={cn('size-4 transition-transform', expanded && 'rotate-180')} aria-hidden="true" />}
                </button>

                {!collapsed && expanded && (
                    <div className="mt-1 space-y-1 pl-7">
                        {item.children?.map((child) => {
                            const childActive = isItemActive(child, currentUrl);
                            const ChildIcon = child.icon;

                            return (
                                <Link
                                    key={child.href}
                                    href={child.href}
                                    prefetch
                                    onClick={onNavigate}
                                    className={cn(
                                        'flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition',
                                        childActive
                                            ? 'bg-nexlink-primary text-white shadow-sm'
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white'
                                    )}
                                >
                                    {ChildIcon && <ChildIcon className="size-4 shrink-0" aria-hidden="true" />}
                                    <span>{child.title}</span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }


    return (

        <Link
            href={item.href}
            prefetch
            onClick={onNavigate}
            title={collapsed ? item.title : undefined}
            className={cn(
                'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition',
                collapsed && 'justify-center px-2',
                active
                    ? 'bg-nexlink-primary text-white shadow-sm shadow-nexlink-primary/25'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
            )}
        >
            <Icon className="size-4" aria-hidden="true" />
            {!collapsed && <span className="flex-1">{item.title}</span>}
            {!collapsed && item.badge && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold text-current">{item.badge}</span>
            )}
        </Link>
    );
}

export function AdminSidebar({ open, collapsed, onClose, onToggleCollapse }: Props) {
    const { url, props } = usePage();
    const auth = props.auth as Auth;

    const dashboardUrl =
        auth.guard === 'super_admin'
            ? '/admin/dashboard'
            : '/dashboard';

    const navigation = auth.guard === 'super_admin' ? superAdminNavigation : webAdminNavigation;

    const groups = useMemo(
        () => filterGroups(navigation, (props.auth ?? {}) as Record<string, unknown>),
        [navigation, props.auth]
    );

    return (
        <>
            <div
                className={cn(
                    'fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm transition-opacity lg:hidden',
                    open ? 'opacity-100' : 'pointer-events-none opacity-0'
                )}
                aria-hidden="true"
                onClick={onClose}
            />

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-950/10 backdrop-blur-xl transition-all duration-200 dark:border-white/10 dark:bg-slate-950/95 lg:translate-x-0',
                    collapsed ? 'w-[88px]' : 'w-[290px]',
                    open ? 'translate-x-0' : '-translate-x-full'
                )}
                aria-label="Admin navigation"
            >
                <div className="flex h-20 items-center justify-between px-5">
                    <Link
                        href={dashboardUrl}
                        prefetch
                        className={cn('flex items-center gap-3', collapsed && 'justify-center')}
                        onClick={onClose}
                    >
                        <span className="flex size-11 items-center justify-center rounded-2xl bg-nexlink-primary text-white shadow-lg shadow-nexlink-primary/25">
                            N
                        </span>
                        {!collapsed && (
                            <span>
                                <span className="block text-lg font-black tracking-tight text-slate-950 dark:text-white">NexLink</span>
                                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">CRM Admin</span>
                            </span>
                        )}
                    </Link>
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-white/10 dark:hover:text-white lg:hidden"
                            onClick={onClose}
                            aria-label="Close sidebar"
                        >
                            <X className="size-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <nav className="custom-scrollbar flex-1 space-y-6 overflow-y-auto px-4 pb-5">
                    {groups.map((group) => (
                        <section key={group.title} className="space-y-2">
                            <h2 className="px-3 text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                                {group.title}
                            </h2>
                            <div className="space-y-1">
                                {group.items.map((item) => (
                                    <NavItem key={item.href} item={item} currentUrl={url} onNavigate={onClose} collapsed={collapsed} />
                                ))}
                            </div>
                        </section>
                    ))}
                </nav>

                <div className="sticky bottom-0 border-t border-slate-200/80 bg-white/95 px-4 py-4 dark:border-white/10 dark:bg-slate-950/95">
                    <Link
                        href={auth.guard === 'super_admin' ? '/admin/logout' : logout()}
                        method="post"
                        as="button"
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:border-slate-700 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
                    >
                        <LogOut className="size-4" />
                        {!collapsed && 'Sign out'}
                    </Link>
                </div>
            </aside>
        </>
    );
}
