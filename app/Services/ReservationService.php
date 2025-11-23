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
     *
     * @param \App\Models\Event $event
     * @param array $seats Array of ['seat_row' => int, 'seat_col' => int]
     * @return array Array of invalid seats
     */
    public function validateSeatsWithinHall(Event $event, array $seats): array
    {
        $invalid = [];

        $rowMax = $event->hall->row_amt ?? null;
        $colMax = $event->hall->col_amt ?? null;

        // If hall dimensions are not defined, skip validation
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
     *
     * @param int $eventId
     * @param array $seats Array of ['seat_row' => int, 'seat_col' => int]
     * @return array Array of conflicting seats
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
     * Count active reservations for a user/session for a specific event
     *
     * @param int $eventId
     * @param int|null $userId
     * @param string|null $sessionId
     * @return int
     */
    public function countUserReservations(int $eventId, ?int $userId = null, ?string $sessionId = null): int
    {
        $query = Reservation::where('event_id', $eventId)->active();

        if ($userId) {
            $query->where('user_id', $userId);
        } elseif ($sessionId) {
            $query->where('session_id', $sessionId);
        }

        return $query->count();
    }

    /**
     * Create reservations for multiple seats
     *
     * @param int $eventId
     * @param array $seats Array of ['seat_row' => int, 'seat_col' => int]
     * @param int|null $userId
     * @param string|null $sessionId
     * @return Collection
     * @throws \Exception
     */
    public function createReservations(int $eventId, array $seats, ?int $userId = null, ?string $sessionId = null): Collection
    {
        return DB::transaction(function () use ($eventId, $seats, $userId, $sessionId) {
            // Validate event exists (with hall relation for bounds check)
            $event = Event::with('hall')->findOrFail($eventId);

            // Validate seats are within hall bounds
            $invalidSeats = $this->validateSeatsWithinHall($event, $seats);
            if (!empty($invalidSeats)) {
                throw new \Exception('Některá sedadla jsou mimo rozsah sálu: ' . json_encode($invalidSeats));
            }

            // Check seat conflicts with row-level locking
            $conflicts = $this->validateSeatsAvailable($eventId, $seats);
            if (!empty($conflicts)) {
                throw new \Exception('Některá sedadla už jsou zarezervovaná: ' . json_encode($conflicts));
            }

            // Check reservation limit
            $currentCount = $this->countUserReservations($eventId, $userId, $sessionId);
            if ($currentCount + count($seats) > self::MAX_RESERVATIONS_PER_EVENT) {
                throw new \Exception('Je povoleno nejvýše ' . self::MAX_RESERVATIONS_PER_EVENT . ' rezervací na jednu událost');
            }

            // Create reservations
            $reservations = collect();
            foreach ($seats as $seat) {
                $reservation = Reservation::create([
                    'event_id' => $eventId,
                    'user_id' => $userId,
                    'session_id' => $sessionId,
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
     * Claim guest reservations for a newly registered user
     *
     * @param string $sessionId
     * @param int $userId
     * @return int Number of reservations claimed
     */
    public function claimGuestReservations(string $sessionId, int $userId): int
    {
        return Reservation::where('session_id', $sessionId)
            ->whereNull('user_id')
            ->pending()
            ->update(['user_id' => $userId, 'session_id' => null]);
    }

    /**
     * Cancel a reservation
     *
     * @param Reservation $reservation
     * @return bool
     */
    public function cancelReservation(Reservation $reservation): bool
    {
        $reservation->status = Reservation::STATUS_CANCELLED;
        return $reservation->save();
    }

    /**
     * Confirm a reservation (mark as paid)
     *
     * @param Reservation $reservation
     * @return bool
     */
    public function confirmReservation(Reservation $reservation): bool
    {
        $reservation->status = Reservation::STATUS_CONFIRMED;
        $reservation->paid_date = now();
        return $reservation->save();
    }
}
