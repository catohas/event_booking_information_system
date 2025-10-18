<?php

namespace App\Http\Resources;

use App\Models\Hall;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Hall */
class HallResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $isAdminOrRedactor = $user && in_array($user->role, ['admin', 'redactor']);

        return [
            'id' => $this->when($isAdminOrRedactor, $this->id),
            'name' => $this->name,
            'row_amt' => $this->row_amt,
            'col_amt' => $this->col_amt,
            'created_at' => $this->when($isAdminOrRedactor, $this->created_at),
            'updated_at' => $this->when($isAdminOrRedactor, $this->updated_at),
            //'event' => EventResource::collection($this->whenLoaded('event')),
            //'event' => EventResource::collection($this->event),
            //'event' => $this->event->toResourceCollection(),
        ];
    }
}
