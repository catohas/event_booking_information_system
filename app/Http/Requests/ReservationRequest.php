<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReservationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'event_id' => ['required', 'integer', 'exists:events,id'],
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'seat_row' => ['required', 'integer', 'min:0', 'max:65535'],
            'seat_col' => ['required', 'integer', 'min:0', 'max:65535'],
            'paid_date' => ['nullable', 'date'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
