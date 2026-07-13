<?php

namespace App\Http\Requests\Api\Company;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateEmployeeRequest extends FormRequest
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
        $employeeId = $this->route('employee');

        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => [
                'sometimes',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($employeeId),
            ],
            'password' => ['sometimes', 'string', Password::defaults(), 'confirmed'],
            'is_active' => ['sometimes', 'boolean'],
            'product_ids' => ['sometimes', 'array'],
            'product_ids.*' => [
                'integer',
                Rule::exists('company_products', 'product_id')->where(
                    fn ($query) => $query->where('company_id', $this->user()?->company_id)
                ),
            ],
        ];
    }
}
