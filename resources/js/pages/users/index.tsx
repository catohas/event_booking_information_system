import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Edit2, Trash2 } from 'lucide-react';
import { useState, FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Uživatelé',
        href: '/users',
    },
];

interface UsersIndexProps {
    users: User[];
}

export default function UsersIndex({ users }: UsersIndexProps) {
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);

    const { data, setData, processing, errors, reset } = useForm({
        name: '',
        role: 'viewer' as User['role'],
    });

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setData({
            name: user.name,
            role: user.role,
        });
    };

    const handleUpdate = (e: FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        router.patch(`/users/${editingUser.id}`, data, {
            onSuccess: () => {
                setEditingUser(null);
                reset();
            },
        });
    };

    const handleDelete = () => {
        if (!deletingUser) return;

        router.delete(`/users/${deletingUser.id}`, {
            onSuccess: () => {
                setDeletingUser(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Správa uživatelů" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Správa uživatelů</CardTitle>
                        <CardDescription>
                            Spravujte uživatelské úcty a jejich role
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Jméno</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Čas vytvoření</TableHead>
                                    <TableHead className="text-right">
                                        Akce
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell className="font-medium">
                                            {user.name}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize">
                                                {user.role}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                user.created_at,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleEdit(user)
                                                    }
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        setDeletingUser(user)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Edit User Dialog */}
            <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upravit uživatele</DialogTitle>
                        <DialogDescription>
                            Upravit informace a roli uživatele
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Jméno</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={data.role}
                                    onValueChange={(value) =>
                                        setData('role', value as User['role'])
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">
                                            Administrátor
                                        </SelectItem>
                                        <SelectItem value="redactor">
                                            Redaktor
                                        </SelectItem>
                                        <SelectItem value="cashier">
                                            Pokladní
                                        </SelectItem>
                                        <SelectItem value="viewer">
                                            Divák
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.role && (
                                    <p className="text-sm text-destructive">
                                        {errors.role}
                                    </p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingUser(null)}
                            >
                                Zrušit
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Uložit změny
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete User Dialog */}
            <Dialog
                open={!!deletingUser}
                onOpenChange={() => setDeletingUser(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Smazat uživatele</DialogTitle>
                        <DialogDescription>
                            Opravdu chcete smazat uživatele {deletingUser?.name}?
                            Tuto akci nelze vrátit zpět.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeletingUser(null)}
                        >
                            Zrušit
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            Smazat
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
