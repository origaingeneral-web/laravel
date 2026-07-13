<?php

namespace App\Http\Requests\Admin;

use App\Enums\CompanyStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user('super_admin')?->can('company.create') ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'business_category_id' => ['required', 'integer', 'exists:business_categories,id'],
            'company_name' => ['required', 'string', 'max:255'],
            'company_code' => ['nullable', 'string', 'size:4', 'unique:companies,company_code'],
            'email' => ['required', 'email', 'max:255', 'unique:companies,email'],
            'mobile' => ['required', 'string', 'max:20'],
            'owner_name' => ['required', 'string', 'max:255'],
            'owner_mobile' => ['required', 'string', 'max:20'],
            'country_id' => ['required', 'integer', 'exists:countries,id'],
            'state_id' => ['required', 'integer', 'exists:states,id'],
            'city_id' => ['required', 'integer', 'exists:cities,id'],
            'area_id' => ['nullable', 'integer', 'exists:areas,id'],
            'landline' => ['nullable', 'string', 'max:20'],
            'pincode' => ['required', 'string', 'max:10'],
            'address' => ['required', 'string', 'max:2000'],
            'status' => ['sometimes', 'integer', Rule::in([
                CompanyStatus::Active->value,
                CompanyStatus::Inactive->value,
                CompanyStatus::Disabled->value,
            ])],
            'create_admin' => ['sometimes', 'boolean'],
            'admin_name' => ['required_if:create_admin,true', 'nullable', 'string', 'max:255'],
            'admin_email' => [
                'required_if:create_admin,true',
                'nullable',
                'email',
                'max:255',
                'unique:users,email',
            ],
            'admin_password' => [
                'required_if:create_admin,true',
                'nullable',
                'string',
                Password::defaults(),
                'confirmed',
            ],
        ];
    }
}
