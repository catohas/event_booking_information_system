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

    }

    public function view(User $user, Showing $showing): bool
    {
    }

    public function create(User $user): bool
    {
    }

    public function update(User $user, Showing $showing): bool
    {
    }

    public function delete(User $user, Showing $showing): bool
    {
    }

    public function restore(User $user, Showing $showing): bool
    {
    }

    public function forceDelete(User $user, Showing $showing): bool
    {
    }
}
