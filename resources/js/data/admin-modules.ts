import {
    Activity,
    Banknote,
    BriefcaseBusiness,
    CircleDollarSign,
    ClipboardList,
    Gauge,
    MessageCircle,
    Star,
    Users,
} from 'lucide-react';
import type { ModulePageConfig } from '@/components/admin/module-page';

const defaultRows = [
    {
        name: 'Acme Studio',
        meta: 'CRM onboarding package',
        owner: 'Emma Smith',
        value: '$12,840',
        status: 'Active',
    },
    {
        name: 'Nexora Retail',
        meta: 'Automation workflow review',
        owner: 'David Miller',
        value: '$8,320',
        status: 'In Progress',
    },
    {
        name: 'LayoutDrop Labs',
        meta: 'Enterprise support renewal',
        owner: 'Olivia Brown',
        value: '$24,600',
        status: 'Review',
    },
    {
        name: 'Vertex Digital',
        meta: 'Pending contract signature',
        owner: 'Noah Wilson',
        value: '$4,900',
        status: 'Pending',
    },
] satisfies ModulePageConfig['rows'];

export const adminModuleConfigs: Record<string, ModulePageConfig> = {
    sales: {
        title: 'Sales Dashboard',
        description: 'Track pipeline movement, revenue targets, and high-value CRM opportunities.',
        ctaLabel: 'New deal',
        stats: [
            { label: 'Revenue', value: '$128.4k', trend: '+18.2% this month', icon: CircleDollarSign, tone: 'primary' },
            { label: 'Won Deals', value: '74', trend: '+12 new wins', icon: BriefcaseBusiness, tone: 'success' },
            { label: 'Open Leads', value: '312', trend: '27 added today', icon: Users, tone: 'info' },
            { label: 'Review Queue', value: '18', trend: '5 need action', icon: ClipboardList, tone: 'warning' },
        ],
        rows: defaultRows,
    },
    finance: {
        title: 'Finance Dashboard',
        description: 'Monitor invoices, payments, collections, and financial health across companies.',
        ctaLabel: 'Create invoice',
        stats: [
            { label: 'Collected', value: '$92.1k', trend: '+9.4% vs last month', icon: Banknote, tone: 'success' },
            { label: 'Outstanding', value: '$31.8k', trend: '11 invoices pending', icon: CircleDollarSign, tone: 'warning' },
            { label: 'Expenses', value: '$18.6k', trend: '-3.2% controlled', icon: Gauge, tone: 'info' },
            { label: 'Overdue', value: '6', trend: '2 escalated', icon: ClipboardList, tone: 'danger' },
        ],
        rows: defaultRows.map((row, index) => ({ ...row, status: index === 3 ? 'Pending' : row.status })),
    },
    customers: {
        title: 'Customers',
        description: 'Manage company contacts, owners, lifecycle stages, and customer health.',
        ctaLabel: 'Add customer',
        stats: [
            { label: 'Total Customers', value: '1,284', trend: '+42 this week', icon: Users, tone: 'primary' },
            { label: 'Active Accounts', value: '932', trend: '72.5% active', icon: Activity, tone: 'success' },
            { label: 'Needs Review', value: '38', trend: '8 high priority', icon: ClipboardList, tone: 'warning' },
            { label: 'Disabled', value: '12', trend: '2 this month', icon: Gauge, tone: 'danger' },
        ],
        rows: defaultRows,
    },
    deals: {
        title: 'Deals',
        description: 'Review deal stages, account owners, expected values, and close probability.',
        ctaLabel: 'Add deal',
        stats: [
            { label: 'Pipeline Value', value: '$342k', trend: '+21% forecast', icon: BriefcaseBusiness, tone: 'primary' },
            { label: 'Negotiation', value: '46', trend: '14 closing soon', icon: MessageCircle, tone: 'info' },
            { label: 'Won', value: '29', trend: '+7 this week', icon: Star, tone: 'success' },
            { label: 'At Risk', value: '11', trend: 'Needs attention', icon: Gauge, tone: 'danger' },
        ],
        rows: defaultRows,
    },
    review: {
        title: 'Review Center',
        description: 'Inspect customer feedback, product reviews, approvals, and moderation queues.',
        ctaLabel: 'Request review',
        stats: [
            { label: 'New Reviews', value: '84', trend: '+16 today', icon: Star, tone: 'primary' },
            { label: 'Average Rating', value: '4.8', trend: '+0.3 improved', icon: Gauge, tone: 'success' },
            { label: 'Pending Approval', value: '19', trend: '6 urgent', icon: ClipboardList, tone: 'warning' },
            { label: 'Flagged', value: '3', trend: 'Manual review', icon: Activity, tone: 'danger' },
        ],
        rows: defaultRows.map((row, index) => ({ ...row, status: index === 0 ? 'Completed' : row.status })),
    },
    activities: {
        title: 'Activities',
        description: 'Track calls, meetings, notes, follow-ups, and daily CRM activity.',
        ctaLabel: 'Log activity',
        stats: [
            { label: 'Completed', value: '156', trend: '+31 today', icon: Activity, tone: 'success' },
            { label: 'Calls', value: '64', trend: '18 connected', icon: MessageCircle, tone: 'primary' },
            { label: 'Follow-ups', value: '28', trend: 'Due this week', icon: ClipboardList, tone: 'warning' },
            { label: 'Team Load', value: '82%', trend: 'Healthy pace', icon: Gauge, tone: 'info' },
        ],
        rows: defaultRows,
    },
    employee: {
        title: 'Employees',
        description: 'Manage employee profiles, roles, work status, and team availability.',
        ctaLabel: 'Add employee',
        stats: [
            { label: 'Employees', value: '126', trend: '+4 joined', icon: Users, tone: 'primary' },
            { label: 'Available', value: '91', trend: '72% capacity', icon: Activity, tone: 'success' },
            { label: 'In Review', value: '12', trend: 'Profile updates', icon: ClipboardList, tone: 'warning' },
            { label: 'Inactive', value: '5', trend: 'Access disabled', icon: Gauge, tone: 'danger' },
        ],
        rows: defaultRows.map((row) => ({ ...row, value: 'Full-time' })),
    },
    'user-management': {
        title: 'User Management',
        description: 'Control access, user roles, status, and account activity for the admin portal.',
        ctaLabel: 'Invite user',
        stats: [
            { label: 'Users', value: '384', trend: '+18 this month', icon: Users, tone: 'primary' },
            { label: 'Admins', value: '24', trend: '6 super users', icon: Star, tone: 'info' },
            { label: 'Pending Invites', value: '13', trend: 'Awaiting signup', icon: ClipboardList, tone: 'warning' },
            { label: 'Disabled', value: '7', trend: 'Policy review', icon: Gauge, tone: 'danger' },
        ],
        rows: defaultRows.map((row, index) => ({ ...row, value: index === 0 ? 'Admin' : 'User' })),
    },
};
