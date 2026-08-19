import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '@/types/navigation';

export type AppLayoutProps = {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
};

export type AppVariant = 'header' | 'sidebar';

export type FlashToast = {
    title?: string;
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
    description?: string;
    errors?: Record<string, string[] | string> | string[];
    statusCode?: number;
};

export type AuthLayoutProps = {
    children?: ReactNode;
    name?: string;
    title?: string;
    description?: string;
};
