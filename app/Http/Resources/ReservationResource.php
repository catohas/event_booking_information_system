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
        $isOwner = $user && $this->user_id === $user->id;

        return [
            'id' => $this->when($isAdminOrCashier || $isOwner, $this->id),
            //'event_id' => $this->event_id,
            'user_id' => $this->when($isAdminOrCashier || $isOwner, $this->user_id),
            'seat_row' => $this->seat_row,
            'seat_col' => $this->seat_col,
            'status' => $this->when($isAdminOrCashier || $isOwner, $this->status),
            'paid_date' => $this->when($isAdminOrCashier || $isOwner, $this->paid_date),
            'created_at' => $this->when($isAdminOrCashier || $isOwner, $this->created_at),
            'updated_at' => $this->when($isAdminOrCashier || $isOwner, $this->updated_at),
            'event' => $this->when($isAdminOrCashier || $isOwner, new EventResource($this->whenLoaded('event'))),
            'user' => $this->when($isAdminOrCashier, function () {
                if ($this->relationLoaded('user') && $this->user) {
                    return [
                        'id' => $this->user->id,
                        'name' => $this->user->name,
                        'email' => $this->user->email,
                    ];
                }
                return null;
            }),
        ];
    }
}
