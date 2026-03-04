<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePlaystationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'type' => ['sometimes', 'string', 'max:255'],
            'version' => ['sometimes', 'string', 'max:255'],
            'controllers' => ['sometimes', 'integer', 'min:1', 'max:8'],
            'price_per_day' => ['sometimes', 'integer', 'min:1'],
            'status' => ['sometimes', 'in:available,rented'],
        ];
    }
}
