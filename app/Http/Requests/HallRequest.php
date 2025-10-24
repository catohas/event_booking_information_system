<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HallRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'row_amt' => ['required', 'integer', 'min:1', 'max:65535'],
            'col_amt' => ['required', 'integer', 'min:1', 'max:65535'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
