import { Link } from '@inertiajs/react';
import { Reservation, Event } from '@/types';
import React, { useEffect } from 'react';

interface ReservationsProps {
    reservations?: Reservation[];
    event?: Event;
}

export default function Reservations({ reservations = [], event }: ReservationsProps) {
    { /*
    useEffect(() => {
        console.log(event)  ;
    });
    */ }
    return (
        <div className="mx-auto max-w-3xl p-4">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Reservations for{' '}
                        {event?.data.showing?.name ?? `Event #${event?.data.id ?? ''}`}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Hall: {event?.data.hall?.name ?? '—'}
                    </p>
                </div>
                <Link href="/" className="text-sm text-blue-600">
                    Back
                </Link>
            </div>

            {reservations.data.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                    No reservations yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {reservations.data.map((r) => (
                        <div key={r.id} className="rounded border p-3">
                            <div className="font-medium">
                                Reservation #{r.id}
                            </div>
                            <div className="text-sm">
                                Seat: {r.seat_row ?? '?'} - {r.seat_col ?? '?'}
                            </div>
                            <div className="text-sm">
                                Created:{' '}
                                {r.created_at
                                    ? new Date(r.created_at).toLocaleString()
                                    : '—'}
                            </div>
                            {r.user && (
                                <div className="text-sm">
                                    User: {r.user.name} ({r.user.email})
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
