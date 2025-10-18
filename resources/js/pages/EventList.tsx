import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
export default function EventList({ events }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {events.map((event) => {
                const startDate = new Date(event.starts_at);
                const date = startDate.toLocaleDateString();
                const time = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                    <Card key={event.id} className="hover:shadow-md transition-shadow">
                        {/*
                        <CardHeader>
                            <CardTitle>Event #{event.id}</CardTitle>
                            <CardDescription>Showing ID: {event.showing_id}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Date: {date}</p>
                            <p>Time: {time}</p>
                            <p>Hall: {event.hall_id}</p>
                            <p>Price: ${event.price}</p>
                        </CardContent>
                        <CardFooter>
                            <small className="text-muted-foreground">
                                Created at: {new Date(event.created_at).toLocaleString()}
                            </small>
                        </CardFooter>
                        */}
                        <CardHeader>
                            <CardTitle>{event.showing.name}</CardTitle>
                            <CardDescription>{event.hall.name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Type: {event.showing.type}</p>
                            <p>Date: {new Date(event.starts_at).toLocaleDateString()}</p>
                            <p>Time: {new Date(event.starts_at).toLocaleTimeString()}</p>
                            <p>{event.hall.row_amt * event.hall.col_amt} míst k sezení</p>
                            { /* <p>Reservations: {event.reservation_count}</p> */ }
                            <p>Price: {event.price} Kč</p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
