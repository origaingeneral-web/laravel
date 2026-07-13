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
};

export type AdminNavGroup = {
    title: string;
    items: AdminNavItem[];
};

export const adminNavigation: AdminNavGroup[] = [
    {
        title: 'Overview',
        items: [
            {
                title: 'Dashboard',
                href: '/admin/dashboard',
                icon: LayoutDashboard,
                active: ['/admin/dashboard'],
                permission: 'admin.access',
            },
        ],
    },
    {
        title: 'Tenants',
        items: [
            {
                title: 'Companies',
                href: '/admin/companies',
                icon: BriefcaseBusiness,
                active: ['/admin/companies'],
                permission: 'company.view',
            },
        ],
    },
];
