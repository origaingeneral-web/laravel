<?php

namespace App\Http\Requests\Admin;

use App\Enums\CompanyStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user('super_admin')?->can('company.update') ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $companyId = $this->route('company');

        return [
            'business_category_id' => ['sometimes', 'integer', 'exists:business_categories,id'],
            'company_name' => ['sometimes', 'string', 'max:255'],
            'company_code' => [
                'sometimes',
                'string',
                'size:4',
                Rule::unique('companies', 'company_code')->ignore($companyId),
            ],
            'email' => [
                'sometimes',
                'email',
                'max:255',
                Rule::unique('companies', 'email')->ignore($companyId),
            ],
            'mobile' => ['sometimes', 'string', 'max:20'],
            'owner_name' => ['sometimes', 'string', 'max:255'],
            'owner_mobile' => ['sometimes', 'string', 'max:20'],
            'country_id' => ['sometimes', 'integer', 'exists:countries,id'],
            'state_id' => ['sometimes', 'integer', 'exists:states,id'],
            'city_id' => ['sometimes', 'integer', 'exists:cities,id'],
            'area_id' => ['nullable', 'integer', 'exists:areas,id'],
            'landline' => ['nullable', 'string', 'max:20'],
            'pincode' => ['sometimes', 'string', 'max:10'],
            'address' => ['sometimes', 'string', 'max:2000'],
            'status' => ['sometimes', 'integer', Rule::in([
                CompanyStatus::Active->value,
                CompanyStatus::Inactive->value,
                CompanyStatus::Disabled->value,
            ])],
            'disabled_reason' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
