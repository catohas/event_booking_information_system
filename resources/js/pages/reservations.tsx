import { Head, Link } from '@inertiajs/react';
import { Event, SelectedSeat } from '@/types';
import React from 'react';
import { usePage } from '@inertiajs/react';
import SeatReservationMatrix from '@/pages/SeatReservationMatrix';

export default function Reservations() {
    const { props } = usePage<{ event: { data: Event } }>();
    const event = props.event.data;

    const handleReserve = (seats: SelectedSeat[]) => {
        console.log('Selected seats:', seats);
        alert(`Vybraná sedadla: ${JSON.stringify(seats)}`);
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
                    <Link href="/" className="text-sm text-blue-600">
                        Zpět
                    </Link>
                </div>

                <SeatReservationMatrix
                    row_amt={event.hall.row_amt}
                    col_amt={event.hall.col_amt}
                    reservations={event.reservations}
                    onReserve={handleReserve}
                />

            </div>
        </>
    );
}
