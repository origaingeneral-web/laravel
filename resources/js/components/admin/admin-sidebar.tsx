import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { adminNavigation } from '@/config/admin-navigation';
import type { AdminNavGroup, AdminNavItem } from '@/config/admin-navigation';
import { cn } from '@/lib/utils';

type Props = {
    open: boolean;
    onClose: () => void;
};

function isItemActive(item: AdminNavItem, currentUrl: string): boolean {
    const patterns = item.active ?? [item.href];

    return patterns.some((pattern) => currentUrl === pattern || currentUrl.startsWith(`${pattern}/`));
}

function canShowItem(item: AdminNavItem, auth: Record<string, unknown>): boolean {
    const user = auth.user as Record<string, unknown> | null | undefined;
    const roles = (auth.roles as string[] | undefined) ?? [];
    const permissions = (auth.permissions as string[] | undefined) ?? [];

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
}: {
    item: AdminNavItem;
    currentUrl: string;
    onNavigate: () => void;
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
                        active
                            ? 'bg-nexlink-primary/10 text-nexlink-primary dark:bg-white/10 dark:text-white'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                    )}
                    aria-expanded={expanded}
                    onClick={() => setExpanded((value) => !value)}
                >
                    <Icon className="size-4" aria-hidden="true" />
                    <span className="flex-1 text-left">{item.title}</span>
                    <ChevronDown className={cn('size-4 transition-transform', expanded && 'rotate-180')} aria-hidden="true" />
                </button>

                {expanded && (
                    <div className="mt-1 space-y-1 pl-7">
                        {item.children?.map((child) => {
                            const childActive = isItemActive(child, currentUrl);

                            return (
                                <Link
                                    key={child.href}
                                    href={child.href}
                                    prefetch
                                    onClick={onNavigate}
                                    className={cn(
                                        'block rounded-xl px-3 py-2 text-sm transition',
                                        childActive
                                            ? 'bg-nexlink-primary text-white shadow-sm'
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white'
                                    )}
                                >
                                    {child.title}
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
            className={cn(
                'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition',
                active
                    ? 'bg-nexlink-primary text-white shadow-sm shadow-nexlink-primary/25'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
            )}
        >
            <Icon className="size-4" aria-hidden="true" />
            <span className="flex-1">{item.title}</span>
            {item.badge && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold text-current">{item.badge}</span>
            )}
        </Link>
    );
}

export function AdminSidebar({ open, onClose }: Props) {
    const { url, props } = usePage();
    const groups = useMemo(
        () => filterGroups(adminNavigation, (props.auth ?? {}) as Record<string, unknown>),
        [props.auth]
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
                    'fixed inset-y-0 left-0 z-50 flex w-[290px] flex-col border-r border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-950/10 backdrop-blur-xl transition-transform dark:border-white/10 dark:bg-slate-950/95 lg:translate-x-0',
                    open ? 'translate-x-0' : '-translate-x-full'
                )}
                aria-label="Admin navigation"
            >
                <div className="flex h-20 items-center justify-between px-5">
                    <Link href="/dashboard" prefetch className="flex items-center gap-3" onClick={onClose}>
                        <span className="flex size-11 items-center justify-center rounded-2xl bg-nexlink-primary text-white shadow-lg shadow-nexlink-primary/25">
                            N
                        </span>
                        <span>
                            <span className="block text-lg font-black tracking-tight text-slate-950 dark:text-white">NexLink</span>
                            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">CRM Admin</span>
                        </span>
                    </Link>
                    <button
                        type="button"
                        className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-white/10 dark:hover:text-white lg:hidden"
                        onClick={onClose}
                        aria-label="Close sidebar"
                    >
                        <X className="size-5" aria-hidden="true" />
                    </button>
                </div>

                <nav className="custom-scrollbar flex-1 space-y-6 overflow-y-auto px-4 pb-5">
                    {groups.map((group) => (
                        <section key={group.title} className="space-y-2">
                            <h2 className="px-3 text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                                {group.title}
                            </h2>
                            <div className="space-y-1">
                                {group.items.map((item) => (
                                    <NavItem key={item.href} item={item} currentUrl={url} onNavigate={onClose} />
                                ))}
                            </div>
                        </section>
                    ))}
                </nav>

                <div className="m-4 rounded-3xl bg-gradient-to-br from-nexlink-primary to-[#3f3ab8] p-4 text-white shadow-xl shadow-nexlink-primary/25">
                    <p className="text-sm font-black">Upgrade workspace</p>
                    <p className="mt-1 text-xs text-white/75">Unlock advanced CRM insights and automations.</p>
                    <Link
                        href="/settings/profile"
                        className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-nexlink-primary transition hover:bg-white/90"
                        onClick={onClose}
                    >
                        Manage plan
                    </Link>
                </div>
            </aside>
        </>
    );
}
