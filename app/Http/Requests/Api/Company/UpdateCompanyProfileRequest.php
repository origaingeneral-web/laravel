<?php

namespace App\Http\Requests\Api\Company;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCompanyProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'company_name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255'],
            'mobile' => ['sometimes', 'string', 'max:20'],
            'owner_name' => ['sometimes', 'string', 'max:255'],
            'owner_mobile' => ['sometimes', 'string', 'max:20'],
            'landline' => ['sometimes', 'nullable', 'string', 'max:20'],
            'country_id' => ['sometimes', 'integer', 'exists:countries,id'],
            'state_id' => ['sometimes', 'integer', 'exists:states,id'],
            'city_id' => ['sometimes', 'integer', 'exists:cities,id'],
            'area_id' => ['sometimes', 'nullable', 'integer', 'exists:areas,id'],
            'pincode' => ['sometimes', 'string', 'max:10'],
            'address' => ['sometimes', 'string'],
            'logo' => ['sometimes', 'nullable', 'image', 'max:2048', 'mimes:jpg,jpeg,png,webp'],
        ];
    }
}
