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

    const isDarkTheme =
        settings.layouts.demo1.sidebarTheme === 'dark' ||
        pathname.includes('dark-sidebar');

    return (
        <div
            className={cn(
                'sidebar shrink-0 flex-col items-stretch lg:fixed lg:top-0 lg:bottom-0 lg:z-20 lg:flex lg:border-e',
                isDarkTheme
                    ? 'dark bg-[#111522] border-border/80 text-slate-200'
                    : 'bg-card border-border text-foreground',
            )}
        >
            <SidebarHeader />
            <div className="flex min-h-0 grow overflow-hidden">
                <div className="sidebar-wrapper flex min-h-0 grow flex-col">
                    <SidebarMenu />
                    <div className="shrink-0 border-t border-border/60 px-3.5 py-3.5">
                        <button
                            type="button"
                            onClick={logout}
                            title="Logout"
                            className="flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-sm font-medium transition-all duration-150 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                            <LogOut
                                className="size-4.5 shrink-0 text-inherit"
                                data-slot="accordion-menu-icon"
                                aria-hidden="true"
                            />
                            <span data-slot="accordion-menu-title" className="truncate">
                                Logout
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
