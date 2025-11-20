import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
} from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { BookOpen, Folder, Users, Ticket } from 'lucide-react';

const footerNavItems: NavItem[] = [
    {
        title: 'Repozitář',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Dokumentace',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const page = usePage<SharedData>();
    const { auth } = page.props;

    const mainNavItems: NavItem[] = [];

    if (auth.user) {
        mainNavItems.push({
            title: 'Moje rezervace',
            href: '/my-reservations',
            icon: Ticket,
        });
    }

    if (auth.user && auth.user.role === 'admin') {
        mainNavItems.push({
            title: 'Uživatelé',
            href: '/users',
            icon: Users,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
