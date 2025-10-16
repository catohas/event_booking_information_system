<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReservationRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'event_id' => ['required', 'exists:events'],
            'user_id' => ['required', 'exists:users'],
            'seat_row' => ['required', 'integer'],
            'seat_col' => ['required', 'integer'],
            'paid_date' => ['nullable', 'date'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
