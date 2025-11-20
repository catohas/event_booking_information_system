<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReservationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'event_id' => ['required', 'integer', 'exists:events,id'],
            'seats' => ['required', 'array', 'min:1', 'max:5'],
            'seats.*.seat_row' => ['required', 'integer', 'min:1', 'max:65535'],
            'seats.*.seat_col' => ['required', 'integer', 'min:1', 'max:65535'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }

    public function messages(): array
    {
        return [
            'seats.required' => 'Musíte vybrat alespoň jedno sedadlo.',
            'seats.min' => 'Musíte vybrat alespoň jedno sedadlo.',
            'seats.max' => 'Můžete vybrat maximálně 5 sedadel.',
        ];
    }
}
