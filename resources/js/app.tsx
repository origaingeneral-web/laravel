import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import * as HelmetAsync from 'react-helmet-async';
const HelmetProvider =
    HelmetAsync.HelmetProvider || (HelmetAsync as any).default?.HelmetProvider;
import { SettingsProvider } from '@/providers/settings-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { I18nProvider } from '@/providers/i18n-provider';
import { TooltipsProvider } from '@/providers/tooltips-provider';
import { QueryProvider } from '@/providers/query-provider';
import Demo1Layout from '@/layouts/demo1/layout';
import AuthLayout from '@/layouts/auth-layout';
import ErrorLayout from '@/layouts/error/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name === 'admin-login':
                return null;
            case name.startsWith('errors/'):
                return ErrorLayout;
            case name.startsWith('auth/'):
                return AuthLayout;
            default:
                return Demo1Layout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <HelmetProvider>
                <SettingsProvider>
                    <ThemeProvider>
                        <I18nProvider>
                            <TooltipsProvider>
                                <QueryProvider>
                                    <Toaster />
                                    {app}
                                </QueryProvider>
                            </TooltipsProvider>
                        </I18nProvider>
                    </ThemeProvider>
                </SettingsProvider>
            </HelmetProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
