import { login, register } from '@/routes';
import { type SharedData, type Event, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import EventList from '@/pages/EventList';
import AppLayout from '@/layouts/app-layout';
import { Film } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Vítejte',
        href: '/',
    },
];

export default function Welcome() {
    const { props } = usePage<{ upcomingEvents: { data: Event[] }, pastEvents: { data: Event[] } }>();
    const upcomingEvents = props.upcomingEvents.data;
    const pastEvents = props.pastEvents.data;

    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vítejte">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen">
                <div className="relative overflow-hidden">

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                        {!auth.user && (
                            <div className="absolute top-6 right-6 flex items-center gap-3">
                                <Link
                                    href={login()}
                                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    Přihlášení
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                                >
                                    Registrace
                                </Link>
                            </div>
                        )}

                        <div className="text-center space-y-6 max-w-3xl mx-auto">
                            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Aktuální program
                            </h1>

                            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Vyberte si z naší nabídky událostí a rezervujte si sedadla
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    {upcomingEvents.length > 0 ? (
                        <div className="space-y-8 mb-16">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Nadcházející události
                                </h2>
                                <span className="text-md text-gray-500 dark:text-gray-400">
                                    {upcomingEvents.length} {upcomingEvents.length === 1 ? 'událost' : upcomingEvents.length < 5 ? 'události' : 'událostí'}
                                </span>
                            </div>
                            <EventList events={upcomingEvents} />
                        </div>
                    ) : (
                        <div className="text-center py-20 mb-16">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                                <Film className="w-8 h-8 text-gray-900 dark:text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Žádné nadcházející události
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Zatím zde nejsou vystaveny žádné události. Vraťte se prosím později.
                            </p>
                        </div>
                    )}

                    {pastEvents.length > 0 && (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Předchozí události
                                </h2>
                                <span className="text-md text-gray-500 dark:text-gray-400">
                                    {pastEvents.length} {pastEvents.length === 1 ? 'událost' : pastEvents.length < 5 ? 'události' : 'událostí'}
                                </span>
                            </div>
                            <EventList events={pastEvents} />
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    );
}
