import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Reservation } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Check, X } from 'lucide-react';
import React, { useState } from 'react';
import { useSort } from '@/hooks/use-sort';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pokladna',
        href: '/cashier',
    },
];

interface CashierIndexProps {
    reservations: { data: Reservation[] };
}

export default function CashierIndex({ reservations }: CashierIndexProps) {
    const [confirmingReservation, setConfirmingReservation] = useState<Reservation | null>(null);
    const [cancelingReservation, setCancelingReservation] = useState<Reservation | null>(null);

    const { sortedItems: sortedReservations, sort, toggleSort } = useSort<Reservation, 'id' | 'customer' | 'event' | 'event_date' | 'hall' | 'seat' | 'price' | 'created_at' | 'status'>(
        reservations.data,
        { key: 'created_at', direction: 'desc' },
        {
            id: (a, b) => (a.id ?? 0) - (b.id ?? 0),
            customer: (a, b) => (a.user?.name || '').localeCompare(b.user?.name || ''),
            event: (a, b) => (a.event?.showing?.name || '').localeCompare(b.event?.showing?.name || ''),
            event_date: (a, b) => {
                const da = a.event?.starts_at ? new Date(a.event.starts_at).getTime() : 0;
                const db = b.event?.starts_at ? new Date(b.event.starts_at).getTime() : 0;
                return da - db;
            },
            hall: (a, b) => (a.event?.hall?.name || '').localeCompare(b.event?.hall?.name || ''),
            seat: (a, b) => {
                if (a.seat_row === b.seat_row) {
                    return a.seat_col - b.seat_col;
                }
                return a.seat_row - b.seat_row;
            },
            price: (a, b) => {
                const pa = a.event?.price ?? 0;
                const pb = b.event?.price ?? 0;
                return pa - pb;
            },
            created_at: (a, b) => {
                const da = a.created_at ? new Date(a.created_at).getTime() : 0;
                const db = b.created_at ? new Date(b.created_at).getTime() : 0;
                return da - db;
            },
            status: (a, b) => (a.status || '').localeCompare(b.status || ''),
        },
    );

    const handleConfirm = () => {
        if (!confirmingReservation?.id) return;
        router.post(`/cashier/${confirmingReservation.id}/confirm`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setConfirmingReservation(null);
            },
        });
    };

    const handleCancel = () => {
        if (!cancelingReservation?.id) return;
        router.delete(`/cashier/${cancelingReservation.id}/cancel`, {
            preserveScroll: true,
            onSuccess: () => {
                setCancelingReservation(null);
            },
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('cs-CZ', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pokladna" />
            <div className="container mx-auto py-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Správa rezervací</CardTitle>
                        <CardDescription>
                            Prohlížejte a spravujte rezervace zákazníků
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        className="cursor-pointer select-none"
                                        onClick={() => toggleSort('id')}
                                    >
                                        ID
                                        {sort.key === 'id' && (
                                            <span className="ml-1 text-xs">
                                                {sort.direction === 'asc' ? '▲' : '▼'}
                                            </span>
                                        )}
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer select-none"
                                        onClick={() => toggleSort('customer')}
                                    >
                                        Zákazník
                                        {sort.key === 'customer' && (
                                            <span className="ml-1 text-xs">
                                                {sort.direction === 'asc' ? '▲' : '▼'}
                                            </span>
                                        )}
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer select-none"
                                        onClick={() => toggleSort('event')}
                                    >
                                        Událost
                                        {sort.key === 'event' && (
                                            <span className="ml-1 text-xs">
                                                {sort.direction === 'asc' ? '▲' : '▼'}
                                            </span>
                                        )}
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer select-none"
                                        onClick={() => toggleSort('event_date')}
                                    >
                                        Datum představení
                                        {sort.key === 'event_date' && (
                                            <span className="ml-1 text-xs">
                                                {sort.direction === 'asc' ? '▲' : '▼'}
                                            </span>
                                        )}
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer select-none"
                                        onClick={() => toggleSort('hall')}
                                    >
                                        Sál
                                        {sort.key === 'hall' && (
                                            <span className="ml-1 text-xs">
                                                {sort.direction === 'asc' ? '▲' : '▼'}
                                            </span>
                                        )}
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer select-none"
                                        onClick={() => toggleSort('seat')}
                                    >
                                        Sedadlo
                                        {sort.key === 'seat' && (
                                            <span className="ml-1 text-xs">
                                                {sort.direction === 'asc' ? '▲' : '▼'}
                                            </span>
                                        )}
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer select-none"
                                        onClick={() => toggleSort('price')}
                                    >
                                        Cena
                                        {sort.key === 'price' && (
                                            <span className="ml-1 text-xs">
                                                {sort.direction === 'asc' ? '▲' : '▼'}
                                            </span>
                                        )}
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer select-none"
                                        onClick={() => toggleSort('created_at')}
                                    >
                                        Vytvořeno
                                        {sort.key === 'created_at' && (
                                            <span className="ml-1 text-xs">
                                                {sort.direction === 'asc' ? '▲' : '▼'}
                                            </span>
                                        )}
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer select-none"
                                        onClick={() => toggleSort('status')}
                                    >
                                        Stav
                                        {sort.key === 'status' && (
                                            <span className="ml-1 text-xs">
                                                {sort.direction === 'asc' ? '▲' : '▼'}
                                            </span>
                                        )}
                                    </TableHead>
                                    <TableHead className="text-right">Akce</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedReservations.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center text-muted-foreground">
                                            Žádné rezervace
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sortedReservations.map((reservation) => (
                                        <TableRow key={reservation.id}>
                                            <TableCell className="font-medium">
                                                {reservation.id}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {reservation.user?.name || 'N/A'}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {reservation.user?.email || 'N/A'}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {reservation.event?.showing?.name || 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {reservation.event?.starts_at
                                                    ? formatDate(reservation.event.starts_at)
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {reservation.event?.hall?.name || 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                Řada {reservation.seat_row}, Sedadlo {reservation.seat_col}
                                            </TableCell>
                                            <TableCell>
                                                {reservation.event?.price
                                                    ? `${reservation.event.price} Kč`
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {reservation.created_at
                                                    ? formatDate(reservation.created_at)
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {reservation.status === 'confirmed' ? (
                                                    <Badge variant="default" className="bg-green-600">
                                                        Potvrzeno
                                                    </Badge>
                                                ) : reservation.status === 'pending' ? (
                                                    <Badge variant="secondary">
                                                        Čeká na platbu
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="destructive">
                                                        Zrušeno
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {reservation.status === 'pending' && reservation.id && (
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            onClick={() => setConfirmingReservation(reservation)}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            <Check className="mr-1 h-4 w-4" />
                                                            Potvrdit
                                                        </Button>
                                                    )}
                                                    {reservation.status !== 'cancelled' && reservation.id && (
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => setCancelingReservation(reservation)}
                                                        >
                                                            <X className="mr-1 h-4 w-4" />
                                                            Zrušit
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={!!confirmingReservation} onOpenChange={(open) => !open && setConfirmingReservation(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Potvrdit rezervaci</DialogTitle>
                        <DialogDescription>
                            Opravdu chcete potvrdit platbu této rezervace?
                        </DialogDescription>
                    </DialogHeader>
                    {confirmingReservation && (
                        <div className="space-y-2 py-4">
                            <p className="text-sm">
                                <span className="font-medium">Zákazník:</span> {confirmingReservation.user?.name || 'N/A'}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Událost:</span> {confirmingReservation.event?.showing?.name || 'N/A'}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Sedadlo:</span> Řada {confirmingReservation.seat_row}, Sedadlo {confirmingReservation.seat_col}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Cena:</span> {confirmingReservation.event?.price ? `${confirmingReservation.event.price} Kč` : 'N/A'}
                            </p>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmingReservation(null)}>
                            Zrušit
                        </Button>
                        <Button onClick={handleConfirm} className="bg-green-600 hover:bg-green-700">
                            <Check className="mr-2 h-4 w-4" />
                            Potvrdit platbu
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Cancellation Dialog */}
            <Dialog open={!!cancelingReservation} onOpenChange={(open) => !open && setCancelingReservation(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Zrušit rezervaci</DialogTitle>
                        <DialogDescription>
                            Opravdu chcete zrušit tuto rezervaci? Tato akce je nevratná.
                        </DialogDescription>
                    </DialogHeader>
                    {cancelingReservation && (
                        <div className="space-y-2 py-4">
                            <p className="text-sm">
                                <span className="font-medium">Zákazník:</span> {cancelingReservation.user?.name || 'N/A'}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Událost:</span> {cancelingReservation.event?.showing?.name || 'N/A'}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Sedadlo:</span> Řada {cancelingReservation.seat_row}, Sedadlo {cancelingReservation.seat_col}
                            </p>
                            <p className="text-sm">
                                <span className="font-medium">Cena:</span> {cancelingReservation.event?.price ? `${cancelingReservation.event.price} Kč` : 'N/A'}
                            </p>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCancelingReservation(null)}>
                            Zpět
                        </Button>
                        <Button variant="destructive" onClick={handleCancel}>
                            <X className="mr-2 h-4 w-4" />
                            Zrušit rezervaci
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
