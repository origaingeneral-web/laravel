import {
    BriefcaseBusiness,
    Building2,
    CreditCard,
    Database,
    Globe,
    Languages as LanguagesIcon,
    LayoutDashboard,
    Map,
    MapPin,
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
    {
        title: 'Master Management',
        items: [
            {
                title: 'Master',
                href: '/admin/master/business-categories',
                icon: Database,
                active: ['/admin/master'],
                guard: 'super_admin',
                permission: 'admin.access',
                children: [
                    {
                        title: 'Business Categories',
                        href: '/admin/master/business-categories',
                        icon: BriefcaseBusiness,
                        active: ['/admin/master/business-categories'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                    {
                        title: 'Languages',
                        href: '/admin/master/languages',
                        icon: LanguagesIcon,
                        active: ['/admin/master/languages'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                    {
                        title: 'Countries',
                        href: '/admin/master/countries',
                        icon: Globe,
                        active: ['/admin/master/countries'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                    {
                        title: 'States',
                        href: '/admin/master/states',
                        icon: Map,
                        active: ['/admin/master/states'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                    {
                        title: 'Cities',
                        href: '/admin/master/cities',
                        icon: Building2,
                        active: ['/admin/master/cities'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                    {
                        title: 'Areas',
                        href: '/admin/master/areas',
                        icon: MapPin,
                        active: ['/admin/master/areas'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                    {
                        title: 'Plans',
                        href: '/admin/master/plans',
                        icon: CreditCard,
                        active: ['/admin/master/plans'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                ],
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

