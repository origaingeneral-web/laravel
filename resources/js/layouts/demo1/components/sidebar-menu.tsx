import { LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

export function SidebarMenu() {
    const { pathname } = useLocation();
    const active = pathname === '/' || pathname === '/dashboard';

    return (
        <nav
            className="kt-scrollable-y-hover flex shrink-0 grow px-5 py-5 lg:max-h-[calc(100vh-5.5rem)]"
            aria-label="Sidebar navigation"
        >
            <Link
                to="/dashboard"
                title="Dashboard"
                className={cn(
                    'flex h-8 w-full items-center gap-2 rounded-md px-3 text-sm font-medium transition',
                    active
                        ? 'bg-muted text-primary'
                        : 'text-accent-foreground hover:bg-muted hover:text-primary',
                )}
            >
                <LayoutDashboard
                    className="size-4 shrink-0"
                    data-slot="accordion-menu-icon"
                    aria-hidden="true"
                />
                <span data-slot="accordion-menu-title">Dashboard</span>
            </Link>
        </nav>
    );
}
