<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReservationRequest;
use App\Models\Reservation;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ReservationController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $this->authorize('viewAny', Reservation::class);

        return Reservation::all();
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
}
