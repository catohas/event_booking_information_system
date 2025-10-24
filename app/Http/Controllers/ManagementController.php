<?php

namespace App\Http\Controllers;

use App\Models\Hall;
use App\Models\Showing;
use App\Models\Event;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;
use Inertia\Response;

class ManagementController extends Controller
{
    use AuthorizesRequests;

    public function index(): Response
    {
        $this->authorize('viewAny', Hall::class);
        $this->authorize('viewAny', Showing::class);
        $this->authorize('viewAny', Event::class);

        return Inertia::render('management/index', [
            'halls' => Hall::all(),
            'showings' => Showing::all(),
            'events' => Event::with(['hall', 'showing'])->orderBy('starts_at')->get(),
        ]);
    }
}
