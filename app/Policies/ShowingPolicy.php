<?php

namespace App\Policies;

use App\Models\Showing;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ShowingPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->role === 'admin' || $user->role === 'redactor';
    }

    public function view(User $user, Showing $showing): bool
    {
        return $user->role === 'admin' || $user->role === 'redactor';
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin' || $user->role === 'redactor';
    }

    public function update(User $user, Showing $showing): bool
    {
        return $user->role === 'admin' || $user->role === 'redactor';
    }

    public function delete(User $user, Showing $showing): bool
    {
        return $user->role === 'admin' || $user->role === 'redactor';
    }

    public function restore(User $user, Showing $showing): bool
    {
        return $user->role === 'admin' || $user->role === 'redactor';
    }

    public function forceDelete(User $user, Showing $showing): bool
    {
        return $user->role === 'admin' || $user->role === 'redactor';
    }
}
