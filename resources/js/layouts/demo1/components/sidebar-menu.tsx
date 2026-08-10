import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { superAdminNavigation, type AdminNavItem } from '@/config/admin-navigation';

function NavItem({ item, currentPath }: { item: AdminNavItem; currentPath: string }) {
    const hasChildren = Boolean(item.children?.length);
    const hasActiveChild = Boolean(
        item.children?.some(
            (child) =>
                currentPath === child.href ||
                Boolean(child.active?.some((p) => currentPath === p || currentPath.startsWith(`${p}/`))),
        ),
    );
    const active =
        currentPath === item.href ||
        Boolean(item.active?.some((p) => currentPath === p || currentPath.startsWith(`${p}/`))) ||
        hasActiveChild;

    const [expanded, setExpanded] = useState(active || currentPath.startsWith('/admin/master'));

    const Icon = item.icon;

    if (hasChildren) {
        return (
            <div className="w-full space-y-1">
                <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    className={cn(
                        'flex h-9 w-full items-center justify-between gap-2.5 rounded-lg px-3 text-sm font-medium transition-all duration-150',
                        active
                            ? 'bg-blue-500/10 text-blue-600 font-semibold dark:bg-blue-500/20 dark:text-blue-400'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white',
                    )}
                >
                    <div className="flex items-center gap-2.5 min-w-0">
                        {Icon && <Icon className="size-4.5 shrink-0 text-inherit" aria-hidden="true" />}
                        <span data-slot="accordion-menu-title" className="truncate">
                            {item.title}
                        </span>
                    </div>
                    <ChevronDown
                        data-slot="accordion-menu-sub-indicator"
                        className={cn('size-4 shrink-0 transition-transform duration-200', expanded && 'rotate-180')}
                    />
                </button>

                {expanded && (
                    <div data-slot="accordion-menu-sub-content" className="pl-6 space-y-1 pt-0.5">
                        {item.children?.map((child) => {
                            const childActive =
                                currentPath === child.href ||
                                Boolean(child.active?.some((p) => currentPath === p || currentPath.startsWith(`${p}/`)));
                            const ChildIcon = child.icon;

                            return (
                                <Link
                                    key={child.href}
                                    to={child.href}
                                    className={cn(
                                        'flex h-8.5 w-full items-center gap-2.5 rounded-md px-3 text-xs font-medium transition-all duration-150',
                                        childActive
                                            ? 'bg-blue-600 text-white font-semibold shadow-xs dark:bg-blue-600 dark:text-white'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white',
                                    )}
                                >
                                    {ChildIcon && <ChildIcon className="size-3.5 shrink-0 text-inherit" />}
                                    <span data-slot="accordion-menu-title" className="truncate">
                                        {child.title}
                                    </span>
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
            to={item.href}
            title={item.title}
            className={cn(
                'flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-sm font-medium transition-all duration-150',
                active
                    ? 'bg-blue-600 text-white font-semibold shadow-xs dark:bg-blue-600 dark:text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white',
            )}
        >
            {Icon && <Icon className="size-4.5 shrink-0 text-inherit" aria-hidden="true" />}
            <span data-slot="accordion-menu-title" className="truncate">
                {item.title}
            </span>
        </Link>
    );
}

export function SidebarMenu() {
    const { pathname } = useLocation();

    return (
        <nav
            className="kt-scrollable-y-hover flex shrink-0 grow flex-col gap-4 overflow-y-auto px-3.5 py-4 lg:max-h-[calc(100vh-5.5rem)]"
            aria-label="Sidebar navigation"
        >
            {superAdminNavigation.map((group) => (
                <div key={group.title} className="space-y-1">
                    <div
                        data-slot="accordion-menu-label"
                        className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400/80"
                    >
                        {group.title}
                    </div>
                    <div className="space-y-1">
                        {group.items.map((item) => (
                            <NavItem key={item.title} item={item} currentPath={pathname} />
                        ))}
                    </div>
                </div>
            ))}
        </nav>
    );
}
