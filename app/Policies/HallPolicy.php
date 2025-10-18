<?php

namespace App\Policies;

use App\Models\Hall;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class HallPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->role == 'admin' || $user->role == 'redactor';
    }

    public function view(User $user, Hall $hall): bool
    {
        return $user->role == 'admin' || $user->role == 'redactor';
    }

    public function create(User $user): bool
    {
        return $user->role == 'admin' || $user->role == 'redactor';
    }

    public function update(User $user, Hall $hall): bool
    {
        return $user->role == 'admin' || $user->role == 'redactor';
    }

    public function delete(User $user, Hall $hall): bool
    {
        return $user->role == 'admin' || $user->role == 'redactor';
    }

    public function restore(User $user, Hall $hall): bool
    {
        return $user->role == 'admin' || $user->role == 'redactor';
    }

    public function forceDelete(User $user, Hall $hall): bool
    {
        return $user->role == 'admin' || $user->role == 'redactor';
    }
}
