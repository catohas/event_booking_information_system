<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ShowingRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'event_id' => ['required', 'exists:events'],
            'name' => ['required'],
            'type' => ['required'],
            'description' => ['nullable'],
            'length' => ['required', 'date'],
            'image_path' => ['nullable'],
            'actors' => ['nullable'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
