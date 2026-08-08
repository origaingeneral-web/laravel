import { LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/context/auth-context';
import { cn } from '@/lib/utils';
import { useSettings } from '@/providers/settings-provider';
import { SidebarHeader } from './sidebar-header';
import { SidebarMenu } from './sidebar-menu';

export function Sidebar() {
    const { settings } = useSettings();
    const { logout } = useAuth();
    const { pathname } = useLocation();

    return (
        <div
            className={cn(
                'sidebar shrink-0 flex-col items-stretch bg-background lg:fixed lg:top-0 lg:bottom-0 lg:z-20 lg:flex lg:border-e lg:border-border',
                (settings.layouts.demo1.sidebarTheme === 'dark' ||
                    pathname.includes('dark-sidebar')) &&
                    'dark',
            )}
        >
            <SidebarHeader />
            <div className="flex min-h-0 grow overflow-hidden">
                <div className="sidebar-wrapper flex min-h-0 grow flex-col">
                    <SidebarMenu />
                    <div className="shrink-0 border-t border-border px-5 py-4">
                        <button
                            type="button"
                            onClick={logout}
                            title="Logout"
                            className="flex h-9 w-full items-center gap-2 rounded-md px-3 text-sm font-medium text-accent-foreground transition hover:bg-muted hover:text-primary"
                        >
                            <LogOut
                                className="size-4 shrink-0"
                                data-slot="accordion-menu-icon"
                                aria-hidden="true"
                            />
                            <span data-slot="accordion-menu-title">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
