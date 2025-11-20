<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReservationRequest;
use App\Http\Resources\EventResource;
use App\Http\Resources\HallResource;
use App\Http\Resources\ReservationResource;
use App\Models\Event;
use App\Models\Reservation;
use App\Services\ReservationService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReservationController extends Controller
{
    use AuthorizesRequests;

    protected ReservationService $reservationService;

    public function __construct(ReservationService $reservationService)
    {
        $this->reservationService = $reservationService;
    }

    public function index()
    {
        $this->authorize('viewAny', Reservation::class);

        return ReservationResource::collection(Reservation::all());
    }

    public function store(ReservationRequest $request)
    {
        try {
            $eventId = $request->validated()['event_id'];
            $seats = $request->validated()['seats'];
            $userId = Auth::id();
            $sessionId = !$userId ? session()->getId() : null;

            // Create reservations
            $reservations = $this->reservationService->createReservations(
                $eventId,
                $seats,
                $userId,
                $sessionId
            );

            return response()->json([
                'success' => true,
                'message' => $userId
                    ? 'Rezervace byla úspěšně vytvořena.'
                    : 'Rezervace byla vytvořena. Pro dokončení se prosím zaregistrujte.',
                'reservations' => ReservationResource::collection($reservations),
                'requires_registration' => !$userId,
            ]);

        } catch (\Exception $e) {
            // Check if it's a seat conflict error
            if (str_contains($e->getMessage(), 'already reserved')) {
                return response()->json([
                    'success' => false,
                    'error' => 'seat_conflict',
                    'message' => 'Některá vybraná sedadla byla již rezervována. Obnovte stránku a vyberte jiná sedadla.',
                ], 409);
            }

            if (str_contains($e->getMessage(), 'Maximum')) {
                return response()->json([
                    'success' => false,
                    'error' => 'reservation_limit',
                    'message' => $e->getMessage(),
                ], 422);
            }

            return response()->json([
                'success' => false,
                'error' => 'unknown',
                'message' => 'Nastala chyba při vytváření rezervace.',
            ], 500);
        }
    }

    public function myReservations()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $reservations = Reservation::with(['event.hall', 'event.showing'])
            ->forUser($user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('status');

        return Inertia::render('my-reservations', [
            'reservations' => [
                'pending' => ReservationResource::collection($reservations->get('pending', collect())),
                'confirmed' => ReservationResource::collection($reservations->get('confirmed', collect())),
                'cancelled' => ReservationResource::collection($reservations->get('cancelled', collect())),
            ],
        ]);
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

        $event->load(['hall', 'showing', 'reservations' => function ($query) {
            $query->active(); // Only load active reservations
        }]);

        return Inertia::render('reservations', [
            'event' => new EventResource($event),
        ]);
    }

}
