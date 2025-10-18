<?php

namespace App\Http\Resources;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Event */
class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $isAdminOrRedactor = $user && in_array($user->role, ['admin', 'redactor']);

        return [
            'id' => $this->id,
            'starts_at' => $this->starts_at,
            'price' => $this->price,
            'created_at' => $this->when($isAdminOrRedactor, $this->created_at),
            'updated_at' => $this->when($isAdminOrRedactor, $this->updated_at),
            'hall' => new HallResource($this->whenLoaded('hall')),
            'showing' => new ShowingResource($this->whenLoaded('showing')),
            'reservations' => ReservationResource::collection($this->whenLoaded('reservations')),
        ];
    }
}
