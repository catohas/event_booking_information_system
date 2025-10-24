import { SidebarProvider } from '@/components/ui/sidebar';
import { ToastHandler } from '@/components/toast-handler';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Toaster } from 'sonner';
import { useAppearance } from '@/hooks/use-appearance';
import React from 'react';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const isOpen = usePage<SharedData>().props.sidebarOpen;
    const { appearance } = useAppearance();

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">
                {children}
                <Toaster position="bottom-right" richColors theme={appearance} />
                <ToastHandler />
            </div>
        );
    }
    else {
        return (
            <SidebarProvider defaultOpen={isOpen}>
                {children}
                <Toaster position="top-right" richColors theme={appearance} />
                <ToastHandler />
            </SidebarProvider>
        );
    }

}
