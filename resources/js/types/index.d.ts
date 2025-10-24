import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    flash?: {
        success?: string;
        error?: string;
        info?: string;
        warning?: string;
    };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'redactor' | 'cashier' | 'viewer';
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Hall {
    id?: number;
    name: string;
    row_amt: number;
    col_amt: number;
    created_at?: string;
    updated_at?: string;
}

export interface Showing {
    id?: number;
    name: string;
    type: string;
    description: string | null;
    length: string;
    image_path: string | null;
    actors: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface Reservation {
    id?: number;
    seat_row: number;
    seat_col: number;
    paid_date?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}

export interface Event {
    id: number;
    starts_at: string;
    price: number;
    created_at?: string;
    updated_at?: string;
    hall: Hall;
    showing: Showing;
    reservations: Reservation[];
}

export interface SelectedSeat {
    seat_row: number;
    seat_col: number;
}
