import {
    Activity,
    BarChart3,
    BriefcaseBusiness,
    CalendarDays,
    CheckSquare,
    CircleDollarSign,
    Database,
    Gauge,
    LayoutDashboard,
    Mail,
    MessageSquareText,
    Settings,
    Star,
    Users,
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
        title: 'Master',
        items: [
            {
                title: 'Master Records',
                href: '/masters',
                icon: Database,
                active: ['/masters'],
                children: [
                    {
                        title: 'Master Records',
                        href: '/masters',
                        icon: Database,
                        active: ['/masters'],
                    },
                    {
                        title: 'Create Master',
                        href: '/masters/create',
                        icon: Database,
                        active: ['/masters/create'],
                    },
                    {
                        title: 'Edit Master',
                        href: '/masters/1/edit',
                        icon: Database,
                        active: ['/masters/1/edit'],
                    },
                ],
            },
        ],
    },
    {
        title: 'Dashboards',
        items: [
            {
                title: 'Overview',
                href: '/dashboard',
                icon: LayoutDashboard,
                active: ['/dashboard'],
            },
            // {
            //     title: 'Sales',
            //     href: '/sales',
            //     icon: Gauge,
            //     active: ['/sales'],
            // },
            // {
            //     title: 'Finance',
            //     href: '/finance',
            //     icon: CircleDollarSign,
            //     active: ['/finance'],
            // },
            // {
            //     title: 'Analytics',
            //     href: '/analytics',
            //     icon: BarChart3,
            //     active: ['/analytics'],
            // },
        ],
    },
    // {
    //     title: 'CRM',
    //     items: [
    //         {
    //             title: 'Customers',
    //             href: '/customers',
    //             icon: Users,
    //             active: ['/customers'],
    //         },
    //         {
    //             title: 'Deals',
    //             href: '/deals',
    //             icon: BriefcaseBusiness,
    //             active: ['/deals'],
    //         },
    //         {
    //             title: 'Reviews',
    //             href: '/review',
    //             icon: Star,
    //             active: ['/review'],
    //         },
    //         {
    //             title: 'Activities',
    //             href: '/activities',
    //             icon: Activity,
    //             active: ['/activities'],
    //         },
    //     ],
    // },

    // {
    //     title: 'Workspace',
    //     items: [
    //         {
    //             title: 'Tasks',
    //             href: '/tasks',
    //             icon: CheckSquare,
    //             active: ['/tasks', '/task-management'],
    //         },
    //         {
    //             title: 'Team',
    //             href: '/team',
    //             icon: Users,
    //             active: ['/team', '/team-management', '/employee', '/user-management'],
    //             children: [
    //                 {
    //                     title: 'Team Overview',
    //                     href: '/team',
    //                     icon: Users,
    //                     active: ['/team', '/team-management'],
    //                 },
    //                 {
    //                     title: 'Employees',
    //                     href: '/employee',
    //                     icon: Users,
    //                     active: ['/employee'],
    //                 },
    //                 {
    //                     title: 'User Management',
    //                     href: '/user-management',
    //                     icon: Users,
    //                     active: ['/user-management'],
    //                 },
    //             ],
    //         },
    //         {
    //             title: 'Calendar',
    //             href: '/calendar',
    //             icon: CalendarDays,
    //             active: ['/calendar'],
    //         },
    //         {
    //             title: 'Email',
    //             href: '/email/inbox',
    //             icon: Mail,
    //             active: ['/email'],
    //             badge: '9',
    //         },
    //         {
    //             title: 'Chat',
    //             href: '/chat',
    //             icon: MessageSquareText,
    //             active: ['/chat', '/ai/new-chat'],
    //         },
    //     ],
    // },
    // {
    //     title: 'Account',
    //     items: [
    //         {
    //             title: 'Settings',
    //             href: '/settings/profile',
    //             icon: Settings,
    //             active: ['/settings'],
    //         },
    //     ],
    // },
];
