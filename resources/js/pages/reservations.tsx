import { Head, Link, router, usePage } from '@inertiajs/react';
import { Event, SelectedSeat } from '@/types';
import React, { useState } from 'react';
import SeatReservationMatrix from '@/pages/SeatReservationMatrix';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

export default function Reservations() {
    const { props } = usePage<{ event: { data: Event }, auth?: { user?: { id: number } } }>();
    const event = props.event.data;
    const isAuthenticated = !!props.auth?.user;
    const currentUserId = props.auth?.user?.id;

    const [showAuthRequiredDialog, setShowAuthRequiredDialog] = useState(false);

    const handleReserve = (seats: SelectedSeat[]) => {
        if (!isAuthenticated) {
            // Guest user - show information dialog and redirect to login/registration
            setShowAuthRequiredDialog(true);
            return;
        }

        submitReservation(seats);
    };

    const submitReservation = (seats: SelectedSeat[]) => {
        router.post('/reservations', {
            event_id: event.id,
            seats: seats as any,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload();
            },
        });
    };

    const redirectToLogin = () => {
        router.visit('/login', {
            data: { intended: window.location.pathname },
        });
    };

    const redirectToRegister = () => {
        router.visit('/register', {
            data: { intended: window.location.pathname },
        });
    };

    return (
        <AppLayout>
            <Head title="Rezervace">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="mx-auto max-w-3xl p-15">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Rezervace pro událost{' '}
                            {event.showing.name ?? `Událost číslo ${event.id ?? ''}`}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Sál: {event.hall.name ?? '-'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Datum: {event.starts_at ? new Date(event.starts_at).toLocaleDateString() + ' ' + new Date(event.starts_at).toLocaleTimeString() : '-'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {event.hall.row_amt * event.hall.col_amt} Míst k sezení
                        </p>
                    </div>
                    <Link href="/" className="text-sm text-blue-600">
                        Zpět
                    </Link>
                </div>

                <SeatReservationMatrix
                    row_amt={event.hall.row_amt}
                    col_amt={event.hall.col_amt}
                    reservations={event.reservations}
                    onReserve={handleReserve}
                    currentUserId={currentUserId}
                />
            </div>


            {/* Auth Required Dialog for guests */}
            <Dialog open={showAuthRequiredDialog} onOpenChange={setShowAuthRequiredDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Pro dokončení rezervace je nutné přihlášení</DialogTitle>
                        <DialogDescription>
                            Pro vytvoření rezervace se prosím přihlaste nebo zaregistrujte. Po přihlášení budete moci znovu vybrat svá sedadla a rezervaci dokončit.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col gap-2 sm:flex-row">
                        <Button variant="outline" onClick={redirectToLogin}>
                            Přihlásit se
                        </Button>
                        <Button onClick={redirectToRegister}>
                            Registrovat se
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
