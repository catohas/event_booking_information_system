import { Head, Link, router, usePage } from '@inertiajs/react';
import { Event, SelectedSeat } from '@/types';
import React, { useState } from 'react';
import SeatReservationMatrix from '@/pages/SeatReservationMatrix';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Reservations() {
    const { props } = usePage<{ event: { data: Event }, auth?: { user?: any } }>();
    const event = props.event.data;
    const isAuthenticated = !!props.auth?.user;

    const [showConflictDialog, setShowConflictDialog] = useState(false);
    const [conflictMessage, setConflictMessage] = useState('');
    const [showGuestDialog, setShowGuestDialog] = useState(false);
    const [pendingSeats, setPendingSeats] = useState<SelectedSeat[]>([]);

    const handleReserve = (seats: SelectedSeat[]) => {
        if (!isAuthenticated) {
            // Guest user - show dialog
            setPendingSeats(seats);
            setShowGuestDialog(true);
        } else {
            // Authenticated user - submit directly
            submitReservation(seats);
        }
    };

    const submitReservation = (seats: SelectedSeat[]) => {
        router.post('/reservations', {
            event_id: event.id,
            seats: seats,
        }, {
            preserveScroll: true,
            onSuccess: (page) => {
                const response = page.props as any;
                if (response.flash?.success) {
                    // Reload to show updated seat map
                    router.reload();
                }
            },
            onError: (errors) => {
                console.log('Errors:', errors);
                if (errors.message && typeof errors.message === 'string') {
                    setConflictMessage(errors.message);
                    setShowConflictDialog(true);
                }
            },
        });
    };

    const handleGuestContinue = () => {
        setShowGuestDialog(false);
        submitReservation(pendingSeats);
    };

    const handleGuestRegister = () => {
        // Store intended URL and redirect to register
        router.visit('/register', {
            data: { intended: window.location.pathname }
        });
    };

    return (
        <>
            <Head title="Rezervace">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="mx-auto max-w-3xl p-4">
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
                    <div className="flex flex-col gap-2">
                        <Link href="/" className="text-sm text-blue-600">
                            Zpět
                        </Link>
                        {isAuthenticated && (
                            <Link href="/my-reservations" className="text-sm text-blue-600">
                                Moje rezervace
                            </Link>
                        )}
                    </div>
                </div>

                <SeatReservationMatrix
                    row_amt={event.hall.row_amt}
                    col_amt={event.hall.col_amt}
                    reservations={event.reservations}
                    onReserve={handleReserve}
                />
            </div>

            {/* Conflict Dialog */}
            <Dialog open={showConflictDialog} onOpenChange={setShowConflictDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            Sedadla již rezervována
                        </DialogTitle>
                        <DialogDescription>
                            {conflictMessage}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => {
                            setShowConflictDialog(false);
                            router.reload(); // Reload to get fresh seat data
                        }}>
                            Obnovit a vybrat jiná sedadla
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Guest Registration Dialog */}
            <Dialog open={showGuestDialog} onOpenChange={setShowGuestDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Dokončit rezervaci</DialogTitle>
                        <DialogDescription>
                            Pro dokončení rezervace se prosím zaregistrujte nebo přihlaste.
                            Vaše vybraná sedadla budou dočasně rezervována.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col gap-2 sm:flex-row">
                        <Button variant="outline" onClick={handleGuestContinue}>
                            Pokračovat jako host
                        </Button>
                        <Button onClick={handleGuestRegister}>
                            Registrovat se
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
