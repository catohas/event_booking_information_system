<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HallRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required'],
            'row_amt' => ['required', 'integer'],
            'col_amt' => ['required', 'integer'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
