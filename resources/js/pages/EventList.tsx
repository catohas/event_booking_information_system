import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Event } from '@/types';
import { Link } from '@inertiajs/react';

interface EventListProps {
    events: Event[];
}

export default function EventList({ events }: EventListProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {events.map((event) => {
                return (
                    <Card key={event.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle>{event.showing.name}</CardTitle>
                            <CardDescription>Sál: {event.hall.name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Typ: {event.showing.type}</p>
                            <p>Datum: {new Date(event.starts_at).toLocaleDateString()}</p>
                            <p>Čas: {new Date(event.starts_at).toLocaleTimeString()}</p>
                            <p>{event.hall.row_amt * event.hall.col_amt} míst k sezení</p>
                            <p>{(event.hall.row_amt * event.hall.col_amt) - event.reservations.length} dostupných míst</p>
                            <p>Cena za lístek: {event.price} Kč</p>
                            <Link href={`/events/${event.id}/reservations`} className={"bg-gray-700 hover:bg-gray-600 active:bg-gray-500 p-1 rounded cursor-pointer"}>Zobrazit Rezervace</Link>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
