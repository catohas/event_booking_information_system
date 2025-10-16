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

    }

    public function view(User $user, Hall $hall): bool
    {
    }

    public function create(User $user): bool
    {
    }

    public function update(User $user, Hall $hall): bool
    {
    }

    public function delete(User $user, Hall $hall): bool
    {
    }

    public function restore(User $user, Hall $hall): bool
    {
    }

    public function forceDelete(User $user, Hall $hall): bool
    {
    }
}
