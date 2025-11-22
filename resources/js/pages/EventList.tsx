import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Event } from '@/types';
import { Link } from '@inertiajs/react';
import { Film, Calendar, Clock, Ticket, Armchair } from 'lucide-react';
import { reservations } from '@/routes/events';

interface EventListProps {
    events: Event[];
}

export default function EventList({ events }: EventListProps) {
    const formatDate = (iso: string) =>
        new Intl.DateTimeFormat('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(
            new Date(iso),
        );
    const formatTime = (iso: string) =>
        new Intl.DateTimeFormat('cs-CZ', { hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
                const totalSeats = event.hall.row_amt * event.hall.col_amt;
                const availableSeats = Math.max(totalSeats - event.reservations.length, 0);

                return (
                    <Card
                        key={event.id}
                        className="group overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md py-0 pb-6"
                    >
                        {/* Image / Poster */}
                        <div className="relative aspect-video w-full bg-muted/40">
                            {event.showing.image_path ? (
                                <img
                                    src={`/storage/${event.showing.image_path}`}
                                    alt={event.showing.name}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <Film className="h-14 w-14" />
                                </div>
                            )}

                            {/* Overlays */}
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-15 bg-gradient-to-t from-background/100 to-transparent" />
                            <div className="absolute left-3 top-3 flex items-center gap-2">
                                {event.showing.type && (
                                    <Badge variant="secondary" className="backdrop-blur-sm">
                                        {event.showing.type}
                                    </Badge>
                                )}
                                <Badge variant="secondary" className="backdrop-blur-sm">
                                    <Calendar className="mr-1 h-3.5 w-3.5" /> {formatDate(event.starts_at)}
                                </Badge>
                            </div>
                            <div className="absolute right-3 top-3">
                                <Badge className="backdrop-blur-sm">{event.price} Kč</Badge>
                            </div>
                        </div>

                        {/* Textual content */}
                        <CardHeader className="gap-2">
                            <CardTitle className="text-base sm:text-lg">{event.showing.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <Film className="h-4 w-4 opacity-70" /> Sál: {event.hall.name}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="grid gap-3 text-sm">
                            <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                                <span className="inline-flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" /> {formatTime(event.starts_at)}
                                </span>
                                {event.showing.length && (
                                    <span className="inline-flex items-center gap-1.5">
                                        <Ticket className="h-4 w-4" /> {event.showing.length}
                                    </span>
                                )}
                                <span className={"inline-flex items-center gap-1.5 " + (availableSeats > 0 ? '' : 'text-red-600 dark:text-red-400')}>
                                    <Armchair className="h-4 w-4" /> {availableSeats}/{totalSeats} míst volných
                                </span>
                            </div>

                            {event.showing.description && (
                                <p className="line-clamp-2 text-sm text-muted-foreground">{event.showing.description}</p>
                            )}
                        </CardContent>

                        <CardFooter className="justify-between gap-3">
                            <div className="text-sm text-muted-foreground">
                                Cena lístku: <span className="text-foreground font-medium">{event.price} Kč</span>
                            </div>
                            <Button asChild className="shrink-0">
                                <Link href={reservations.url(event.id)}>Zobrazit rezervace</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
