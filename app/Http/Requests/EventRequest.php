<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EventRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'starts_at' => ['required', 'date', 'after_or_equal:now'],
            'hall_id' => ['required', 'integer', 'exists:halls,id'],
            'showing_id' => ['required', 'integer', 'exists:showings,id'],
            'price' => ['required', 'integer', 'min:0', 'max:16777215'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
