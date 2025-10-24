<?php

namespace App\Http\Controllers;

use App\Http\Requests\EventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class EventController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $this->authorize('viewAny', Event::class);

        return EventResource::collection(
            Event::with(['hall', 'showing', 'reservations'])
                ->orderBy('starts_at', 'asc')
                ->get()
        );
    }

    public function store(EventRequest $request)
    {
        $this->authorize('create', Event::class);

        Event::create($request->validated());

        return back()->with('success', 'Událost úspěšně vytvořena.');
    }

    public function show(Event $event)
    {
        $this->authorize('view', $event);

        return $event;
    }

    public function update(EventRequest $request, Event $event)
    {
        $this->authorize('update', $event);

        try {
            $event->updateOrFail($request->validated());
            return back()->with('success', 'Událost úspěšně upravena.');
        }
        catch (\Throwable $e) {
            return back()->with('error', 'Událost se nepodařilo upravit.');
        }
    }

    public function destroy(Event $event)
    {
        $this->authorize('delete', $event);

        try {
            $event->delete();
            return back()->with('success', 'Událost úspěšně smazána.');
        }
        catch (\Exception $e) {
            return back()->with('error', 'Událost se nepodařilo smazat.');
        }

    }
}
