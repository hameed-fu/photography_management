import { Link, usePage } from '@inertiajs/react';
import {
    Camera,
    LayoutGrid,
    Plus,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';
import weddings from '@/routes/weddings';
import type { Auth, NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const photographerNavItems: NavItem[] = [
    {
        title: 'My Weddings',
        href: weddings.index(),
        icon: Camera,
    },
    {
        title: 'New Wedding',
        href: weddings.create(),
        icon: Plus,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'All Weddings',
        href: admin.weddings(),
        icon: Camera,
    },
    {
        title: 'Users',
        href: admin.users(),
        icon: Users,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as unknown as { auth: Auth };
    const isAdmin = auth.user.role === 'admin';

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
                <NavMain items={mainNavItems} />
                <NavMain items={photographerNavItems} />
                {isAdmin && <NavMain items={adminNavItems} />}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
