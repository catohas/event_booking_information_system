<?php

namespace App\Http\Resources;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Reservation */
class ReservationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $isAdminOrCashier = $user && in_array($user->role, ['admin', 'cashier']);

        return [
            'id' => $this->when($isAdminOrCashier, $this->id),
            //'event_id' => $this->event_id,
            'user_id' => $this->when($isAdminOrCashier, $this->user_id),
            'seat_row' => $this->seat_row,
            'seat_col' => $this->seat_col,
            'paid_date' => $this->when($isAdminOrCashier, $this->paid_date),
            'created_at' => $this->when($isAdminOrCashier, $this->created_at),
            'updated_at' => $this->when($isAdminOrCashier, $this->updated_at),
            //'event' => new EventResource($this->whenLoaded('event')),
        ];
    }
}
