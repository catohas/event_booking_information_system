<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReservationRequest;
use App\Http\Resources\EventResource;
use App\Http\Resources\HallResource;
use App\Http\Resources\ReservationResource;
use App\Models\Event;
use App\Models\Reservation;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;

class ReservationController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $this->authorize('viewAny', Reservation::class);

        return ReservationResource::collection(Reservation::all());
    }

    public function store(ReservationRequest $request)
    {
        $this->authorize('create', Reservation::class);

        return Reservation::create($request->validated());
    }

    public function show(Reservation $reservation)
    {
        $this->authorize('view', $reservation);

        return $reservation;
    }

    public function update(ReservationRequest $request, Reservation $reservation)
    {
        $this->authorize('update', $reservation);

        $reservation->update($request->validated());

        return $reservation;
    }

    public function destroy(Reservation $reservation)
    {
        $this->authorize('delete', $reservation);

        $reservation->delete();

        return response()->json();
    }

    public function eventReservations(Event $event)
    {
        //$this->authorize('viewEvent', [Reservation::class, $event]);

        $event->load(['hall', 'showing', 'reservations']);

        return Inertia::render('reservations', [
            'event' => new EventResource($event),
        ]);
    }

}
