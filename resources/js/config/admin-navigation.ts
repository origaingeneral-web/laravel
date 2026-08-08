import {
    BriefcaseBusiness,
    LayoutDashboard,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type AdminNavItem = {
    title: string;
    href: string;
    icon: LucideIcon;
    active?: string[];
    badge?: string;
    children?: AdminNavItem[];
    permission?: string;
    role?: string;
    /** When set, item is only shown for this auth guard. */
    guard?: 'super_admin' | 'web';
};

export type AdminNavGroup = {
    title: string;
    items: AdminNavItem[];
};

/** Super Admin panel navigation (`auth.guard === 'super_admin'`). */
export const superAdminNavigation: AdminNavGroup[] = [
    {
        title: 'Overview',
        items: [
            {
                title: 'Dashboard',
                href: '/admin/dashboard',
                icon: LayoutDashboard,
                active: ['/admin/dashboard'],
                guard: 'super_admin',
                permission: 'admin.access',
            },
        ],
    },
];

/** Web / company-user CRM shell navigation. */
export const webAdminNavigation: AdminNavGroup[] = [
    {
        title: 'Dashboards',
        items: [
            {
                title: 'Overview',
                href: '/dashboard',
                icon: LayoutDashboard,
                active: ['/dashboard'],
                guard: 'web',
            },
        ],
    },
];

/** @deprecated Use superAdminNavigation / webAdminNavigation */
export const adminNavigation = superAdminNavigation;
