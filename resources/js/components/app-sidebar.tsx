import { Link } from '@inertiajs/react';
import {
    BarChart3,
    CalendarDays,
    CheckSquare,
    FolderOpen,
    HelpCircle,
    LayoutGrid,
    LogOut,
    Settings,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { Button } from '@/components/ui/button';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const generalNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Tasks',
        href: '#',
        icon: CheckSquare,
    },
    {
        title: 'Projects',
        href: '#',
        icon: FolderOpen,
    },
];

const secondaryNavItems: NavItem[] = [
    {
        title: 'Calendar',
        href: '#',
        icon: CalendarDays,
    },
    {
        title: 'Analytics',
        href: '#',
        icon: BarChart3,
    },
    {
        title: 'Team',
        href: '#',
        icon: Users,
    },
    {
        title: 'Settings',
        href: '#',
        icon: Settings,
    },
    {
        title: 'Help',
        href: '#',
        icon: HelpCircle,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Logout',
        href: '#',
        icon: LogOut,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup className="px-2 py-2">
                    <SidebarGroupLabel>GENERAL</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {generalNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={{ children: item.title }}
                                    >
                                        <Link href={item.href} prefetch>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup className="px-2 py-2">
                    <SidebarGroupLabel>PROJECTS</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {secondaryNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={{ children: item.title }}
                                    >
                                        <Link href={item.href} prefetch>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="space-y-3 px-4 pb-4 pt-2">
                <Button className="w-full rounded-3xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/95" size="sm">
                    Download App
                </Button>
                <NavFooter items={footerNavItems} />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
