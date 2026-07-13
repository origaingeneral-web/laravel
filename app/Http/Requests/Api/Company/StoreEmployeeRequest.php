<?php

namespace App\Http\Requests\Api\Company;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreEmployeeRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email'),
            ],
            'password' => ['required', 'string', Password::defaults(), 'confirmed'],
            'user_prefix' => ['nullable', 'string', 'max:10', 'unique:users,user_prefix'],
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
