<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ShowingRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'length' => ['required', 'date_format:H:i:s'],
            'image' => ['nullable', 'image', 'max:2048'],
            'actors' => ['nullable', 'string'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
