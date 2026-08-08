import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { superAdminNavigation, type AdminNavItem } from '@/config/admin-navigation';

function NavItem({ item, currentPath }: { item: AdminNavItem; currentPath: string }) {
    const hasChildren = Boolean(item.children?.length);
    const active = currentPath === item.href || Boolean(item.active?.some((p) => currentPath === p || currentPath.startsWith(`${p}/`)));
    const [expanded, setExpanded] = useState(active || currentPath.startsWith('/admin/master'));

    const Icon = item.icon;

    if (hasChildren) {
        return (
            <div className="w-full space-y-1">
                <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    className={cn(
                        'flex h-9 w-full items-center justify-between gap-2 rounded-md px-3 text-sm font-medium transition',
                        active
                            ? 'bg-muted text-primary'
                            : 'text-accent-foreground hover:bg-muted hover:text-primary',
                    )}
                >
                    <div className="flex items-center gap-2">
                        {Icon && <Icon className="size-4 shrink-0" aria-hidden="true" />}
                        <span>{item.title}</span>
                    </div>
                    <ChevronDown className={cn('size-4 transition-transform duration-200', expanded && 'rotate-180')} />
                </button>

                {expanded && (
                    <div className="pl-6 space-y-1">
                        {item.children?.map((child) => {
                            const childActive = currentPath === child.href || Boolean(child.active?.some((p) => currentPath === p || currentPath.startsWith(`${p}/`)));
                            const ChildIcon = child.icon;

                            return (
                                <Link
                                    key={child.href}
                                    to={child.href}
                                    className={cn(
                                        'flex h-8 w-full items-center gap-2 rounded-md px-3 text-xs font-medium transition',
                                        childActive
                                            ? 'bg-primary/10 text-primary font-semibold'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                    )}
                                >
                                    {ChildIcon && <ChildIcon className="size-3.5 shrink-0" />}
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
            to={item.href}
            title={item.title}
            className={cn(
                'flex h-9 w-full items-center gap-2 rounded-md px-3 text-sm font-medium transition',
                active
                    ? 'bg-muted text-primary'
                    : 'text-accent-foreground hover:bg-muted hover:text-primary',
            )}
        >
            {Icon && <Icon className="size-4 shrink-0" aria-hidden="true" />}
            <span>{item.title}</span>
        </Link>
    );
}

export function SidebarMenu() {
    const { pathname } = useLocation();

    return (
        <nav
            className="kt-scrollable-y-hover flex shrink-0 grow flex-col gap-4 overflow-y-auto px-5 py-5 lg:max-h-[calc(100vh-5.5rem)]"
            aria-label="Sidebar navigation"
        >
            {superAdminNavigation.map((group) => (
                <div key={group.title} className="space-y-1">
                    <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
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

