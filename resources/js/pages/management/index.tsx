import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import React, { useState, FormEvent, useRef } from 'react';
import { useSort } from '@/hooks/use-sort';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Správa',
        href: '/management',
    },
];

interface Hall {
    id: number;
    name: string;
    row_amt: number;
    col_amt: number;
}

interface Showing {
    id: number;
    name: string;
    type: string;
    description: string | null;
    length: string;
    image_path: string | null;
    actors: string | null;
}

interface Event {
    id: number;
    starts_at: string;
    hall_id: number;
    showing_id: number;
    price: number;
    hall?: Hall;
    showing?: Showing;
}

interface ManagementIndexProps {
    halls: Hall[];
    showings: Showing[];
    events: Event[];
}

export default function ManagementIndex({ halls, showings, events }: ManagementIndexProps) {
    const [editingHall, setEditingHall] = useState<Hall | null>(null);
    const [deletingHall, setDeletingHall] = useState<Hall | null>(null);
    const [addingHall, setAddingHall] = useState(false);

    const [editingShowing, setEditingShowing] = useState<Showing | null>(null);
    const [deletingShowing, setDeletingShowing] = useState<Showing | null>(null);
    const [addingShowing, setAddingShowing] = useState(false);

    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
    const [addingEvent, setAddingEvent] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const hallForm = useForm({
        name: '',
        row_amt: '',
        col_amt: '',
    });

    const showingForm = useForm({
        name: '',
        type: '',
        description: '',
        length: '',
        actors: '',
        image: null as File | null,
    });

    const eventForm = useForm({
        starts_at: '',
        hall_id: '',
        showing_id: '',
        price: '',
    });

    // Hall sorting
    const {
        sortedItems: sortedHalls,
        sort: hallSort,
        toggleSort: toggleHallSort,
    } = useSort<Hall, 'name' | 'row_amt' | 'col_amt'>(halls, {
        key: 'name',
        direction: 'asc',
    }, {
        name: (a, b) => a.name.localeCompare(b.name),
        row_amt: (a, b) => a.row_amt - b.row_amt,
        col_amt: (a, b) => a.col_amt - b.col_amt,
    });

    // Showing sorting
    const {
        sortedItems: sortedShowings,
        sort: showingSort,
        toggleSort: toggleShowingSort,
    } = useSort<Showing, 'name' | 'type' | 'length'>(showings, {
        key: 'name',
        direction: 'asc',
    }, {
        name: (a, b) => a.name.localeCompare(b.name),
        type: (a, b) => a.type.localeCompare(b.type),
        length: (a, b) => a.length.localeCompare(b.length),
    });

    // Event sorting
    const {
        sortedItems: sortedEvents,
        sort: eventSort,
        toggleSort: toggleEventSort,
    } = useSort<Event, 'starts_at' | 'price' | 'hall' | 'showing'>(events, {
        key: 'starts_at',
        direction: 'asc',
    }, {
        starts_at: (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
        price: (a, b) => a.price - b.price,
        hall: (a, b) => (a.hall?.name || '').localeCompare(b.hall?.name || ''),
        showing: (a, b) => (a.showing?.name || '').localeCompare(b.showing?.name || ''),
    });

    const handleAddHall = () => {
        setAddingHall(true);
        hallForm.reset();
    };

    const handleEditHall = (hall: Hall) => {
        setEditingHall(hall);
        hallForm.setData({
            name: hall.name,
            row_amt: hall.row_amt.toString(),
            col_amt: hall.col_amt.toString(),
        });
    };

    const handleSaveHall = (e: FormEvent) => {
        e.preventDefault();
        if (editingHall) {
            router.patch(`/halls/${editingHall.id}`, hallForm.data, {
                onSuccess: () => {
                    setEditingHall(null);
                    hallForm.reset();
                },
                onError: () => {
                    console.log("error");
                }
            });
        } else {
            router.post('/halls', hallForm.data, {
                onSuccess: () => {
                    setAddingHall(false);
                    hallForm.reset();
                },
                onError: () => {
                    console.log("error");
                }
            });
        }
    };

    const handleDeleteHall = () => {
        if (!deletingHall) return;
        router.delete(`/halls/${deletingHall.id}`, {
            onSuccess: () => {
                setDeletingHall(null);
            },
        });
    };

    const handleAddShowing = () => {
        setAddingShowing(true);
        showingForm.reset();
        setSelectedImage(null);
    };

    const handleEditShowing = (showing: Showing) => {
        setEditingShowing(showing);
        showingForm.setData({
            name: showing.name,
            type: showing.type,
            description: showing.description || '',
            length: showing.length,
            actors: showing.actors || '',
            image: null,
        });
        setSelectedImage(null);
    };

    const handleSaveShowing = (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', showingForm.data.name);
        formData.append('type', showingForm.data.type);
        formData.append('description', showingForm.data.description);
        formData.append('length', showingForm.data.length);
        formData.append('actors', showingForm.data.actors);
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        if (editingShowing) {
            formData.append('_method', 'PATCH');
            router.post(`/showings/${editingShowing.id}`, formData, {
                onSuccess: () => {
                    setEditingShowing(null);
                    showingForm.reset();
                    setSelectedImage(null);
                },
            });
        } else {
            router.post('/showings', formData, {
                onSuccess: () => {
                    setAddingShowing(false);
                    showingForm.reset();
                    setSelectedImage(null);
                },
            });
        }
    };

    const handleDeleteShowing = () => {
        if (!deletingShowing) return;
        router.delete(`/showings/${deletingShowing.id}`, {
            onSuccess: () => {
                setDeletingShowing(null);
            },
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            showingForm.setData('image', file);
        }
    };

    const handleAddEvent = () => {
        setAddingEvent(true);
        eventForm.reset();
    };

    const handleEditEvent = (event: Event) => {
        setEditingEvent(event);
        eventForm.setData({
            starts_at: event.starts_at.slice(0, 16),
            hall_id: event.hall_id.toString(),
            showing_id: event.showing_id.toString(),
            price: event.price.toString(),
        });
    };

    const handleSaveEvent = (e: FormEvent) => {
        e.preventDefault();
        if (editingEvent) {
            router.patch(`/events/${editingEvent.id}`, eventForm.data, {
                onSuccess: () => {
                    setEditingEvent(null);
                    eventForm.reset();
                },
            });
        } else {
            router.post('/events', eventForm.data, {
                onSuccess: () => {
                    setAddingEvent(false);
                    eventForm.reset();
                },
            });
        }
    };

    const handleDeleteEvent = () => {
        if (!deletingEvent) return;
        router.delete(`/events/${deletingEvent.id}`, {
            onSuccess: () => {
                setDeletingEvent(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Správa kina" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Správa kina</CardTitle>
                        <CardDescription>
                            Spravujte sály, představení a události
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="halls" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="halls" className="cursor-pointer">Sály</TabsTrigger>
                                <TabsTrigger value="showings" className="cursor-pointer">Představení</TabsTrigger>
                                <TabsTrigger value="events" className="cursor-pointer">Události</TabsTrigger>
                            </TabsList>

                            <TabsContent value="halls" className="space-y-4">
                                <div className="flex justify-end">
                                    <Button onClick={handleAddHall}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Přidat sál
                                    </Button>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead
                                                className="cursor-pointer select-none"
                                                onClick={() => toggleHallSort('name')}
                                            >
                                                Název
                                                {hallSort.key === 'name' && (
                                                    <span className="ml-1 text-xs">
                                                        {hallSort.direction === 'asc' ? '▲' : '▼'}
                                                    </span>
                                                )}
                                            </TableHead>
                                            <TableHead
                                                className="cursor-pointer select-none"
                                                onClick={() => toggleHallSort('row_amt')}
                                            >
                                                Počet řad
                                                {hallSort.key === 'row_amt' && (
                                                    <span className="ml-1 text-xs">
                                                        {hallSort.direction === 'asc' ? '▲' : '▼'}
                                                    </span>
                                                )}
                                            </TableHead>
                                            <TableHead
                                                className="cursor-pointer select-none"
                                                onClick={() => toggleHallSort('col_amt')}
                                            >
                                                Počet sloupců
                                                {hallSort.key === 'col_amt' && (
                                                    <span className="ml-1 text-xs">
                                                        {hallSort.direction === 'asc' ? '▲' : '▼'}
                                                    </span>
                                                )}
                                            </TableHead>
                                            <TableHead className="text-right">Akce</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sortedHalls.map((hall) => (
                                            <TableRow key={hall.id}>
                                                <TableCell>{hall.name}</TableCell>
                                                <TableCell>{hall.row_amt}</TableCell>
                                                <TableCell>{hall.col_amt}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEditHall(hall)}
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setDeletingHall(hall)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TabsContent>

                            <TabsContent value="showings" className="space-y-4">
                                <div className="flex justify-end">
                                    <Button onClick={handleAddShowing}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Přidat představení
                                    </Button>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead
                                                className="cursor-pointer select-none"
                                                onClick={() => toggleShowingSort('name')}
                                            >
                                                Název
                                                {showingSort.key === 'name' && (
                                                    <span className="ml-1 text-xs">
                                                        {showingSort.direction === 'asc' ? '▲' : '▼'}
                                                    </span>
                                                )}
                                            </TableHead>
                                            <TableHead
                                                className="cursor-pointer select-none"
                                                onClick={() => toggleShowingSort('type')}
                                            >
                                                Typ
                                                {showingSort.key === 'type' && (
                                                    <span className="ml-1 text-xs">
                                                        {showingSort.direction === 'asc' ? '▲' : '▼'}
                                                    </span>
                                                )}
                                            </TableHead>
                                            <TableHead
                                                className="cursor-pointer select-none"
                                                onClick={() => toggleShowingSort('length')}
                                            >
                                                Délka
                                                {showingSort.key === 'length' && (
                                                    <span className="ml-1 text-xs">
                                                        {showingSort.direction === 'asc' ? '▲' : '▼'}
                                                    </span>
                                                )}
                                            </TableHead>
                                            <TableHead>Obrázek</TableHead>
                                            <TableHead className="text-right">Akce</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sortedShowings.map((showing) => (
                                            <TableRow key={showing.id}>
                                                <TableCell>{showing.name}</TableCell>
                                                <TableCell>{showing.type}</TableCell>
                                                <TableCell>{showing.length}</TableCell>
                                                <TableCell>
                                                    {showing.image_path ? (
                                                        <img
                                                            src={`/storage/${showing.image_path}`}
                                                            alt={showing.name}
                                                            className="h-10 w-10 object-cover rounded"
                                                        />
                                                    ) : (
                                                        <span className="text-gray-400">Žádný</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEditShowing(showing)}
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setDeletingShowing(showing)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TabsContent>

                            <TabsContent value="events" className="space-y-4">
                                <div className="flex justify-end">
                                    <Button onClick={handleAddEvent}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Přidat událost
                                    </Button>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead
                                                className="cursor-pointer select-none"
                                                onClick={() => toggleEventSort('showing')}
                                            >
                                                Představení
                                                {eventSort.key === 'showing' && (
                                                    <span className="ml-1 text-xs">
                                                        {eventSort.direction === 'asc' ? '▲' : '▼'}
                                                    </span>
                                                )}
                                            </TableHead>
                                            <TableHead
                                                className="cursor-pointer select-none"
                                                onClick={() => toggleEventSort('hall')}
                                            >
                                                Sál
                                                {eventSort.key === 'hall' && (
                                                    <span className="ml-1 text-xs">
                                                        {eventSort.direction === 'asc' ? '▲' : '▼'}
                                                    </span>
                                                )}
                                            </TableHead>
                                            <TableHead
                                                className="cursor-pointer select-none"
                                                onClick={() => toggleEventSort('starts_at')}
                                            >
                                                Začátek
                                                {eventSort.key === 'starts_at' && (
                                                    <span className="ml-1 text-xs">
                                                        {eventSort.direction === 'asc' ? '▲' : '▼'}
                                                    </span>
                                                )}
                                            </TableHead>
                                            <TableHead
                                                className="cursor-pointer select-none"
                                                onClick={() => toggleEventSort('price')}
                                            >
                                                Cena
                                                {eventSort.key === 'price' && (
                                                    <span className="ml-1 text-xs">
                                                        {eventSort.direction === 'asc' ? '▲' : '▼'}
                                                    </span>
                                                )}
                                            </TableHead>
                                            <TableHead className="text-right">Akce</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sortedEvents.map((event) => (
                                            <TableRow key={event.id}>
                                                <TableCell>{event.showing?.name}</TableCell>
                                                <TableCell>{event.hall?.name}</TableCell>
                                                <TableCell>
                                                    {new Date(event.starts_at).toLocaleString('cs-CZ')}
                                                </TableCell>
                                                <TableCell>{event.price} Kč</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleEditEvent(event)}
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setDeletingEvent(event)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={addingHall || editingHall !== null} onOpenChange={(open) => {
                if (!open) {
                    setAddingHall(false);
                    setEditingHall(null);
                    hallForm.reset();
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingHall ? 'Upravit sál' : 'Přidat sál'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingHall ? 'Upravte informace o sále' : 'Přidejte nový sál do systému'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveHall}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="hall-name">Název</Label>
                                <Input
                                    id="hall-name"
                                    value={hallForm.data.name}
                                    onChange={(e) => hallForm.setData('name', e.target.value)}
                                    maxLength={255}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="hall-row-amt">Počet řad</Label>
                                <Input
                                    id="hall-row-amt"
                                    type="number"
                                    value={hallForm.data.row_amt}
                                    onChange={(e) => hallForm.setData('row_amt', e.target.value)}
                                    min={1}
                                    max={65535}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="hall-col-amt">Počet sloupců</Label>
                                <Input
                                    id="hall-col-amt"
                                    type="number"
                                    value={hallForm.data.col_amt}
                                    onChange={(e) => hallForm.setData('col_amt', e.target.value)}
                                    min={1}
                                    max={65535}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={hallForm.processing}>
                                Uložit
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={addingShowing || editingShowing !== null} onOpenChange={(open) => {
                if (!open) {
                    setAddingShowing(false);
                    setEditingShowing(null);
                    showingForm.reset();
                    setSelectedImage(null);
                }
            }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingShowing ? 'Upravit představení' : 'Přidat představení'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingShowing ? 'Upravte informace o představení' : 'Přidejte nové představení do systému'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveShowing}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="showing-name">Název</Label>
                                <Input
                                    id="showing-name"
                                    value={showingForm.data.name}
                                    onChange={(e) => showingForm.setData('name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="showing-type">Typ</Label>
                                <Input
                                    id="showing-type"
                                    value={showingForm.data.type}
                                    onChange={(e) => showingForm.setData('type', e.target.value)}
                                    placeholder="např. Film, Koncert, Divadlo"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="showing-description">Popis</Label>
                                <Textarea
                                    id="showing-description"
                                    value={showingForm.data.description}
                                    onChange={(e) => showingForm.setData('description', e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="showing-length">Délka (HH:MM:SS)</Label>
                                <Input
                                    id="showing-length"
                                    type="text"
                                    value={showingForm.data.length}
                                    onChange={(e) => showingForm.setData('length', e.target.value)}
                                    placeholder="02:30:00"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="showing-actors">Herci</Label>
                                <Input
                                    id="showing-actors"
                                    value={showingForm.data.actors}
                                    onChange={(e) => showingForm.setData('actors', e.target.value)}
                                    placeholder="Jan Novák, Marie Procházková"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="showing-image">Obrázek</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="showing-image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        ref={fileInputRef}
                                        className="cursor-pointer"
                                    />
                                    {selectedImage && (
                                        <span className="text-sm text-green-600">
                                            ✓ {selectedImage.name}
                                        </span>
                                    )}
                                </div>
                                {editingShowing?.image_path && !selectedImage && (
                                    <div className="mt-2">
                                        <img
                                            src={`/storage/${editingShowing.image_path}`}
                                            alt="Current"
                                            className="h-20 w-20 object-cover rounded"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">Aktuální obrázek</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={showingForm.processing}>
                                Uložit
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={addingEvent || editingEvent !== null} onOpenChange={(open) => {
                if (!open) {
                    setAddingEvent(false);
                    setEditingEvent(null);
                    eventForm.reset();
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingEvent ? 'Upravit událost' : 'Přidat událost'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingEvent ? 'Upravte informace o události' : 'Přidejte novou událost do systému'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveEvent}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="event-showing">Představení</Label>
                                <Select
                                    value={eventForm.data.showing_id}
                                    onValueChange={(value) => eventForm.setData('showing_id', value)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Vyberte představení" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {showings.map((showing) => (
                                            <SelectItem key={showing.id} value={showing.id.toString()}>
                                                {showing.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="event-hall">Sál</Label>
                                <Select
                                    value={eventForm.data.hall_id}
                                    onValueChange={(value) => eventForm.setData('hall_id', value)}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Vyberte sál" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {halls.map((hall) => (
                                            <SelectItem key={hall.id} value={hall.id.toString()}>
                                                {hall.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="event-starts-at">Začátek</Label>
                                <Input
                                    id="event-starts-at"
                                    type="datetime-local"
                                    value={eventForm.data.starts_at}
                                    onChange={(e) => eventForm.setData('starts_at', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="event-price">Cena (Kč)</Label>
                                <Input
                                    id="event-price"
                                    type="number"
                                    value={eventForm.data.price}
                                    onChange={(e) => eventForm.setData('price', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={eventForm.processing}>
                                Uložit
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={deletingHall !== null} onOpenChange={(open) => !open && setDeletingHall(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Smazat sál</DialogTitle>
                        <DialogDescription>
                            Opravdu chcete smazat sál "{deletingHall?.name}"? Tato akce je nevratná.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingHall(null)}>
                            Zrušit
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteHall}>
                            Smazat
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={deletingShowing !== null} onOpenChange={(open) => !open && setDeletingShowing(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Smazat představení</DialogTitle>
                        <DialogDescription>
                            Opravdu chcete smazat představení "{deletingShowing?.name}"? Tato akce je nevratná.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingShowing(null)}>
                            Zrušit
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteShowing}>
                            Smazat
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={deletingEvent !== null} onOpenChange={(open) => !open && setDeletingEvent(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Smazat událost</DialogTitle>
                        <DialogDescription>
                            Opravdu chcete smazat tuto událost? Tato akce je nevratná.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingEvent(null)}>
                            Zrušit
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteEvent}>
                            Smazat
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </AppLayout>
    );
}
