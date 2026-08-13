import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router-dom';
import { usePage } from '@inertiajs/react';
import { AlertCircle, X } from 'lucide-react';
import { MENU_SIDEBAR } from '@/config/menu.config';
import { useMenu } from '@/hooks/use-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSettings } from '@/providers/settings-provider';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { NetworkError } from './components/network-error';
import { Sidebar } from './components/sidebar';

export default function Demo1Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isMobile = useIsMobile();
    const { pathname } = useLocation();
    const { getCurrentItem } = useMenu(pathname);
    const item = getCurrentItem(MENU_SIDEBAR);
    const { settings, setOption } = useSettings();
    const [hasNetworkError, setHasNetworkError] = useState(
        () => typeof navigator !== 'undefined' && !navigator.onLine,
    );
    const { app_notifications } = usePage<any>().props;
    const bannerNotifications = (app_notifications || []).filter((n: any) => n.panel_display_style === 'banner');
    const [dismissedBanners, setDismissedBanners] = useState<number[]>([]);

    useEffect(() => {
        const bodyClass = document.body.classList;

        if (settings.layouts.demo1.sidebarCollapse) {
            bodyClass.add('sidebar-collapse');
        } else {
            bodyClass.remove('sidebar-collapse');
        }
    }, [settings]); // Runs only on settings update

    useEffect(() => {
        // Set current layout
        setOption('layout', 'demo1');
    }, [setOption]);

    useEffect(() => {
        const handleOffline = () => setHasNetworkError(true);
        const handleOnline = () => setHasNetworkError(false);

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        const removeNetworkErrorListener = router.on('networkError', () => {
            setHasNetworkError(true);
        });

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
            removeNetworkErrorListener();
        };
    }, []);

    useEffect(() => {
        const bodyClass = document.body.classList;

        // Add a class to the body element
        bodyClass.add('demo1');
        bodyClass.add('sidebar-fixed');
        bodyClass.add('header-fixed');
        bodyClass.add('overflow-x-clip');

        const timer = setTimeout(() => {
            bodyClass.add('layout-initialized');
        }, 1000); // 1000 milliseconds

        // Remove the class when the component is unmounted
        return () => {
            bodyClass.remove('demo1');
            bodyClass.remove('sidebar-fixed');
            bodyClass.remove('sidebar-collapse');
            bodyClass.remove('header-fixed');
            bodyClass.remove('overflow-x-clip');
            bodyClass.remove('layout-initialized');
            clearTimeout(timer);
        };
    }, []); // Runs only once on mount

    return (
        <>
            <Helmet>
                <title>{item?.title}</title>
            </Helmet>

            {!isMobile && <Sidebar />}

            <div className="wrapper flex min-h-screen min-w-0 grow flex-col">
                {bannerNotifications.map((notification: any) => {
                    if (dismissedBanners.includes(notification.id)) return null;
                    return (
                        <div key={notification.id} className="bg-blue-600 text-white px-4 py-2 flex items-start sm:items-center justify-between shadow-sm z-50">
                            <div className="flex items-start sm:items-center gap-3">
                                <AlertCircle className="size-5 shrink-0 text-blue-200" />
                                <div>
                                    <strong className="font-semibold">{notification.title}</strong>
                                    <span className="hidden sm:inline mx-2 text-blue-300">&bull;</span>
                                    <span className="text-sm text-blue-100">{notification.message}</span>
                                </div>
                            </div>
                            <button onClick={() => setDismissedBanners([...dismissedBanners, notification.id])} className="p-1 hover:bg-blue-700 rounded-full transition-colors shrink-0">
                                <X className="size-4" />
                            </button>
                        </div>
                    );
                })}
                <Header />

                <main className="grow pt-5" role="content">
                    {hasNetworkError ? <NetworkError /> : children}
                </main>

                <Footer />
            </div>
        </>
    );
}
