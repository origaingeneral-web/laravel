import {
    Bot,
    BriefcaseBusiness,
    Building2,
    CreditCard,
    Database,
    Globe,
    Languages as LanguagesIcon,
    LayoutDashboard,
    Map,
    MapPin,
    ShieldCheck,
    Star,
    Settings,
    Mail,
    MessageSquare,
    Phone,
    Clock,
    Send,
    Flame,
    Bell,
    Server,
    HardDrive,
    Cpu,
    KeyRound,
    SlidersHorizontal,
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
        title: 'Company Management',
        items: [
            {
                title: 'Companies',
                href: '/admin/companies',
                icon: Building2,
                active: ['/admin/companies'],
                guard: 'super_admin',
                permission: 'company.view',
            },
            {
                title: 'Subscriptions',
                href: '/admin/subscriptions',
                icon: ShieldCheck,
                active: ['/admin/subscriptions'],
                guard: 'super_admin',
                permission: 'company.view',
            },
            {
                title: 'Payments',
                href: '/admin/payments',
                icon: CreditCard,
                active: ['/admin/payments'],
                guard: 'super_admin',
                permission: 'company.view',
            },
            {
                title: 'Features',
                href: '/admin/features',
                icon: Star,
                active: ['/admin/features'],
                guard: 'super_admin',
                permission: 'company.view',
            },
            {
                title: 'Permissions',
                href: '/admin/permissions',
                icon: KeyRound,
                active: ['/admin/permissions'],
                guard: 'super_admin',
                permission: 'company.view',
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
    {
        title: 'Communication',
        items: [
            {
                title: 'Templates',
                href: '/admin/templates',
                icon: Send,
                active: ['/admin/templates'],
                guard: 'super_admin',
                permission: 'admin.access',
                children: [
                    {
                        title: 'Email',
                        href: '/admin/templates?type=email',
                        icon: Mail,
                        active: ['/admin/templates?type=email'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                    {
                        title: 'SMS',
                        href: '/admin/templates?type=sms',
                        icon: MessageSquare,
                        active: ['/admin/templates?type=sms'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                    {
                        title: 'WhatsApp',
                        href: '/admin/templates?type=whatsapp',
                        icon: Phone,
                        active: ['/admin/templates?type=whatsapp'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                ],
            },
            {
                title: 'Notifications',
                href: '/admin/communication/notifications',
                icon: Bell,
                active: ['/admin/communication/notifications'],
                guard: 'super_admin',
                permission: 'admin.access',
                children: [
                    {
                        title: 'Firebase Push',
                        href: '/admin/communication/notifications/firebase',
                        icon: Flame,
                        active: ['/admin/communication/notifications/firebase'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                    {
                        title: 'Panel Notice',
                        href: '/admin/communication/notifications/panel',
                        icon: Bell,
                        active: ['/admin/communication/notifications/panel'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                ],
            },
            {
                title: 'Logs',
                href: '/admin/communication/logs',
                icon: Database,
                active: ['/admin/communication/logs'],
                guard: 'super_admin',
                permission: 'admin.access',
                children: [
                    {
                        title: 'Email History',
                        href: '/admin/communication/logs?type=email',
                        icon: Mail,
                        active: ['/admin/communication/logs?type=email'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                    {
                        title: 'SMS History',
                        href: '/admin/communication/logs?type=sms',
                        icon: MessageSquare,
                        active: ['/admin/communication/logs?type=sms'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                    {
                        title: 'WhatsApp History',
                        href: '/admin/communication/logs?type=whatsapp',
                        icon: Phone,
                        active: ['/admin/communication/logs?type=whatsapp'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                ],
            },
        ],
    },
    {
        title: 'Configuration',
        items: [
            {
                title: 'Settings',
                href: '/admin/settings/email',
                icon: Settings,
                active: ['/admin/settings'],
                guard: 'super_admin',
                permission: 'admin.access',
                children: [
                    {
                        title: 'Email Configuration',
                        href: '/admin/settings/email',
                        icon: Mail,
                        active: ['/admin/settings/email'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                    {
                        title: 'SMS Configuration',
                        href: '/admin/settings/sms',
                        icon: MessageSquare,
                        active: ['/admin/settings/sms'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                    {
                        title: 'WhatsApp Config',
                        href: '/admin/settings/whatsapp',
                        icon: Phone,
                        active: ['/admin/settings/whatsapp'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                    {
                        title: 'Payment Gateway',
                        href: '/admin/settings/payment',
                        icon: CreditCard,
                        active: ['/admin/settings/payment'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                    {
                        title: 'Cron Jobs',
                        href: '/admin/settings/cron',
                        icon: Clock,
                        active: ['/admin/settings/cron'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                    {
                        title: 'Firebase Config',
                        href: '/admin/settings/firebase',
                        icon: Flame,
                        active: ['/admin/settings/firebase'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                    {
                        title: 'AI Configuration',
                        href: '/admin/settings/ai',
                        icon: Bot,
                        active: ['/admin/settings/ai'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                    {
                        title: 'Location Tracking',
                        href: '/admin/settings/location',
                        icon: MapPin,
                        active: ['/admin/settings/location'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                ],
            },
        ],
    },
    {
        title: 'System',
        items: [
            {
                title: 'System',
                href: '/admin/system/server',
                icon: Server,
                active: ['/admin/system'],
                guard: 'super_admin',
                permission: 'admin.access',
                children: [
                    {
                        title: 'Server Information',
                        href: '/admin/system/server',
                        icon: Server,
                        active: ['/admin/system/server'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                    {
                        title: 'Environment Config',
                        href: '/admin/system/env',
                        icon: SlidersHorizontal,
                        active: ['/admin/system/env'],
                        guard: 'super_admin',
                        permission: 'admin.access',
                    },
                    {
                        title: 'Database & Backup',
                        href: '/admin/system/database',
                        icon: Database,
                        active: ['/admin/system/database'],
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

