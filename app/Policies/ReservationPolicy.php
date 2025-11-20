<?php

namespace App\Policies;

use App\Models\Reservation;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ReservationPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->role === 'admin' || $user->role == 'cashier';
    }

    public function view(User $user, Reservation $reservation): bool
    {
        return $user->id === $reservation->user_id || $user->role === 'admin' || $user->role == 'cashier';
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Reservation $reservation): bool
    {
        return $user->role === 'admin' || $user->role === 'cashier';
    }

    public function delete(User $user, Reservation $reservation): bool
    {
        if ($user->role === 'admin' || $user->role === 'cashier') {
            return true;
        }

        return $user->id === $reservation->user_id && $reservation->status === 'pending';
    }

    public function restore(User $user, Reservation $reservation): bool
    {
        return $user->role === 'admin' || $user->role === 'cashier';
    }

    public function forceDelete(User $user, Reservation $reservation): bool
    {
        return $user->role === 'admin' || $user->role === 'cashier';
    }
}
