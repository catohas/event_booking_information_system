<?php

namespace App\Http\Resources;

use App\Models\Showing;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Showing */
class ShowingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $isAdminOrRedactor = $user && in_array($user->role, ['admin', 'redactor']);

        return [
            'id' => $this->when($isAdminOrRedactor, $this->id),
            'name' => $this->name,
            'type' => $this->type,
            'description' => $this->description,
            'length' => $this->length,
            'image_path' => $this->image_path,
            'actors' => $this->actors,
            'created_at' => $this->when($isAdminOrRedactor, $this->created_at),
            'updated_at' => $this->when($isAdminOrRedactor, $this->updated_at),
            //'event' => EventResource::collection($this->whenLoaded('event')),
        ];
    }
}
