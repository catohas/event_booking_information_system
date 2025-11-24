import { Head, router } from '@inertiajs/react';
import { Reservation } from '@/types';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Armchair, MapPin, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MyReservationsProps {
    reservations: {
        pending: { data: Reservation[] };
        confirmed: { data: Reservation[] };
        cancelled: { data: Reservation[] };
    };
}

export default function MyReservations({ reservations }: MyReservationsProps) {
    const [cancellingReservation, setCancellingReservation] = useState<Reservation | null>(null);

    const handleCancel = () => {
        if (!cancellingReservation?.id) return;

        router.delete(`/reservations/${cancellingReservation.id}/cancel`, {
            preserveScroll: true,
            onSuccess: () => {
                setCancellingReservation(null);
            },
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('cs-CZ', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('cs-CZ', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const ReservationCard = ({ reservation, showCancel = true }: { reservation: Reservation; showCancel?: boolean }) => (
        <Card className="overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg">
                            {reservation.event?.showing?.name || 'Neznámá událost'}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {reservation.event?.hall?.name || 'Neznámý sál'}
                        </CardDescription>
                    </div>
                    {reservation.status && (
                        <Badge variant={
                            reservation.status === 'confirmed' ? 'default' :
                            reservation.status === 'pending' ? 'secondary' :
                            'destructive'
                        }>
                            {reservation.status === 'confirmed' ? 'Potvrzeno' :
                             reservation.status === 'pending' ? 'Čeká na platbu' :
                             'Zrušeno'}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                            {reservation.event?.starts_at
                                ? formatDate(reservation.event.starts_at)
                                : '-'}
                        </span>
                        <Clock className="h-4 w-4 ml-2" />
                        <span>
                            {reservation.event?.starts_at
                                ? formatTime(reservation.event.starts_at)
                                : '-'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Armchair className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                            Řada {reservation.seat_row}, Sedadlo {reservation.seat_col}
                        </span>
                    </div>
                    {reservation.paid_date && (
                        <div className="text-xs text-muted-foreground">
                            Zaplaceno: {formatDate(reservation.paid_date)} {formatTime(reservation.paid_date)}
                        </div>
                    )}
                    {showCancel && reservation.status === 'pending' && (
                        <Button
                            variant="destructive"
                            size="sm"
                            className="mt-2"
                            onClick={() => setCancellingReservation(reservation)}
                        >
                            <X className="h-4 w-4 mr-1" />
                            Zrušit rezervaci
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    const breadcrumbs = [
        { title: 'Moje rezervace', href: '/my-reservations' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Moje rezervace" />

            <div className="container mx-auto py-6 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Moje rezervace</h1>
                    <p className="text-muted-foreground mt-1">
                        Spravujte své rezervace míst na představení
                    </p>
                </div>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Čeká na platbu</h2>
                    {reservations.pending.data.length === 0 ? (
                        <Card>
                            <CardContent className="py-8 text-center text-muted-foreground">
                                Žádné čekající rezervace
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {reservations.pending.data.map((reservation) => (
                                <ReservationCard key={reservation.id} reservation={reservation} />
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Potvrzené rezervace</h2>
                    {reservations.confirmed.data.length === 0 ? (
                        <Card>
                            <CardContent className="py-8 text-center text-muted-foreground">
                                Žádné potvrzené rezervace
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {reservations.confirmed.data.map((reservation) => (
                                <ReservationCard key={reservation.id} reservation={reservation} showCancel={false} />
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Zrušené rezervace</h2>
                    {reservations.cancelled.data.length === 0 ? (
                        <Card>
                            <CardContent className="py-8 text-center text-muted-foreground">
                                Žádné zrušené rezervace
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {reservations.cancelled.data.map((reservation) => (
                                <ReservationCard key={reservation.id} reservation={reservation} showCancel={false} />
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <Dialog open={!!cancellingReservation} onOpenChange={(open) => !open && setCancellingReservation(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Zrušit rezervaci</DialogTitle>
                        <DialogDescription>
                            Opravdu chcete zrušit tuto rezervaci? Tuto akci nelze vrátit zpět.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCancellingReservation(null)}>
                            Zrušit
                        </Button>
                        <Button variant="destructive" onClick={handleCancel}>
                            Potvrdit zrušení
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </AppLayout>
    );
}
