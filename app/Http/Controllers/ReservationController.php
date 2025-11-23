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
        // Ensure only authenticated users can create reservations
        if (!Auth::check()) {
            abort(401);
        }

        try {
            $eventId = $request->validated()['event_id'];
            $seats = $request->validated()['seats'];
            $userId = Auth::id();

            // Create reservations
            $reservations = $this->reservationService->createReservations(
                $eventId,
                $seats,
                $userId
            );

            return redirect()->back()->with('success', 'Rezervace byla úspěšně vytvořena.');

        } catch (\Exception $e) {

            if (str_contains($e->getMessage(), 'jsou mimo rozsah')) {
                return redirect()->back()->with('error', 'Některá vybraná sedadla jsou mimo rozsah sálu.');
            }

            if (str_contains($e->getMessage(), 'už jsou zarezervovaná')) {
                return redirect()->back()->with('error', 'Některá vybraná sedadla byla již rezervována. Obnovte stránku a vyberte jiná sedadla.');
            }

            if (str_contains($e->getMessage(), 'Je povoleno nejvýše')) {
                return redirect()->back()->with('error', $e->getMessage());
            }

            return redirect()->back()->with('error', 'Nastala chyba při vytváření rezervace.');
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

    public function eventReservations(int $event)
    {
        // attempt to find the event including relations, if it doesn't exist, redirect home
        $eventModel = Event::with(['hall', 'showing', 'reservations' => function ($query) {
            $query->active(); // only load active reservations
        }])->find($event);

        if (!$eventModel) {
            return redirect()->route('home')->with('info', 'Tato událost byla odstraněna.');
        }

        return Inertia::render('reservations', [
            'event' => new EventResource($eventModel),
        ]);
    }

}
