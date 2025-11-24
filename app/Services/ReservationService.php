<?php

namespace App\Services;

use App\Models\Event;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class ReservationService
{
    const MAX_RESERVATIONS_PER_EVENT = 5;

    /**
     * Validate that seats are within hall bounds.
     */
    public function validateSeatsWithinHall(Event $event, array $seats): array
    {
        $invalid = [];

        $rowMax = $event->hall->row_amt ?? null;
        $colMax = $event->hall->col_amt ?? null;

        // skip validation if hall dimensions are not defined
        if ($rowMax === null || $colMax === null) {
            return $invalid;
        }

        foreach ($seats as $seat) {
            $row = $seat['seat_row'] ?? null;
            $col = $seat['seat_col'] ?? null;

            if (!is_int($row) || !is_int($col) || $row < 1 || $col < 1 || $row > $rowMax || $col > $colMax) {
                $invalid[] = $seat;
            }
        }

        return $invalid;
    }

    /**
     * Validate that seats are available (not already reserved)
     */
    public function validateSeatsAvailable(int $eventId, array $seats): array
    {
        $conflicts = [];

        foreach ($seats as $seat) {
            $exists = Reservation::where('event_id', $eventId)
                ->where('seat_row', $seat['seat_row'])
                ->where('seat_col', $seat['seat_col'])
                ->active()
                ->exists();

            if ($exists) {
                $conflicts[] = $seat;
            }
        }

        return $conflicts;
    }

    /**
     * Count active reservations for a user for a specific event
     */
    public function countUserReservations(int $eventId, int $userId): int
    {
        return Reservation::where('event_id', $eventId)
            ->where('user_id', $userId)
            ->active()
            ->count();
    }

    /**
     * Create reservations for multiple seats
     */
    public function createReservations(int $eventId, array $seats, int $userId): Collection
    {
        return DB::transaction(function () use ($eventId, $seats, $userId) {

            $event = Event::with('hall')->findOrFail($eventId);

            $invalidSeats = $this->validateSeatsWithinHall($event, $seats);
            if (!empty($invalidSeats)) {
                throw new \Exception('Některá sedadla jsou mimo rozsah sálu: ' . json_encode($invalidSeats));
            }

            $conflicts = $this->validateSeatsAvailable($eventId, $seats);
            if (!empty($conflicts)) {
                throw new \Exception('Některá sedadla už jsou zarezervovaná: ' . json_encode($conflicts));
            }

            $currentCount = $this->countUserReservations($eventId, $userId);
            if ($currentCount + count($seats) > self::MAX_RESERVATIONS_PER_EVENT) {
                throw new \Exception('Je povoleno nejvýše ' . self::MAX_RESERVATIONS_PER_EVENT . ' rezervací na jednu událost');
            }

            $reservations = collect();
            foreach ($seats as $seat) {
                $reservation = Reservation::create([
                    'event_id' => $eventId,
                    'user_id' => $userId,
                    'seat_row' => $seat['seat_row'],
                    'seat_col' => $seat['seat_col'],
                    'status' => Reservation::STATUS_PENDING,
                ]);
                $reservations->push($reservation);
            }

            return $reservations;
        });
    }

    /**
     * Cancel a reservation
     */
    public function cancelReservation(Reservation $reservation): bool
    {
        $reservation->status = Reservation::STATUS_CANCELLED;
        return $reservation->save();
    }

    /**
     * Confirm a reservation (mark as paid)
     */
    public function confirmReservation(Reservation $reservation): bool
    {
        $reservation->status = Reservation::STATUS_CONFIRMED;
        $reservation->paid_date = now();
        return $reservation->save();
    }
}
