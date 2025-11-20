<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use App\Services\ReservationService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CashierController extends Controller
{
    use AuthorizesRequests;

    protected ReservationService $reservationService;

    public function __construct(ReservationService $reservationService)
    {
        $this->reservationService = $reservationService;
    }

    public function index(): Response
    {
        $this->authorize('viewAny', Reservation::class);

        $reservations = Reservation::with(['event.hall', 'event.showing', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('cashier/index', [
            'reservations' => ReservationResource::collection($reservations),
        ]);
    }

    public function confirm(Request $request, Reservation $reservation)
    {
        $this->authorize('update', $reservation);

        try {
            $this->reservationService->confirmReservation($reservation);
            return redirect()->back()->with('success', 'Rezervace byla potvrzena.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Nepodařilo se potvrdit rezervaci.');
        }
    }

    public function cancel(Reservation $reservation)
    {
        $this->authorize('delete', $reservation);

        try {
            $this->reservationService->cancelReservation($reservation);
            return redirect()->back()->with('success', 'Rezervace byla zrušena.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Nepodařilo se zrušit rezervaci.');
        }
    }
}
