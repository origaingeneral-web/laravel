import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-br from-[#f0f3ff] via-[#f9f9ff] to-[#e7eeff] dark:from-[#052659] dark:to-[#021024] p-6 md:p-10">
            <div className="w-full max-w-md glass-panel p-8 md:p-10 rounded-[32px] shadow-lg">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="w-12 h-12 bg-primary-container dark:bg-white/10 rounded-xl flex items-center justify-center mb-2 shadow-sm">
                                <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    dashboard
                                </span>
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-bold text-primary dark:text-white">{title}</h1>
                            <p className="text-center text-sm text-on-surface-variant dark:text-on-primary-container">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
