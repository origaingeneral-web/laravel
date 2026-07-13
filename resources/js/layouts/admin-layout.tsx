import { useState } from 'react';
import { AdminFooter } from '@/components/admin/admin-footer';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminTopbar } from '@/components/admin/admin-topbar';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const handleMenuClick = () => {
        setSidebarOpen(true);
    };

    const handleSidebarToggle = () => {
        setSidebarCollapsed((current) => !current);
    };

    return (
        <div className="min-h-screen bg-[#f7f7fb] text-slate-950 dark:bg-slate-950 dark:text-white">
            <AdminSidebar
                open={sidebarOpen}
                collapsed={sidebarCollapsed}
                onClose={() => setSidebarOpen(false)}
                onToggleCollapse={handleSidebarToggle}
            />

            <div className={cn('transition-[padding] duration-200', sidebarCollapsed ? 'lg:pl-[88px]' : 'lg:pl-[290px]')}>
                <AdminTopbar
                    onMenuClick={handleMenuClick}
                    onToggleCollapse={handleSidebarToggle}
                    collapsed={sidebarCollapsed}
                />
                <main className="min-h-[calc(100vh-5rem)] px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mx-auto w-full max-w-[1480px]">
                        {children}
                        <AdminFooter />
                    </div>
                </main>
            </div>
        </div>
    );
}
