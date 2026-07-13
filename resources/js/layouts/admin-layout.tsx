import { useState } from 'react';
import { AdminFooter } from '@/components/admin/admin-footer';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminTopbar } from '@/components/admin/admin-topbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#f7f7fb] text-slate-950 dark:bg-slate-950 dark:text-white">
            <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="lg:pl-[290px]">
                <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />
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
