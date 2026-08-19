<?php

namespace App\Http\Requests\Admin;

use App\Enums\CompanyStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'owner_name' => ['nullable', 'string', 'max:255'],
            'owner_mobile' => ['nullable', 'string', 'max:20'],
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
            'admin_name' => ['nullable', 'string', 'max:255'],
            'admin_email' => [
                'nullable',
                'email',
                'max:255',
                'unique:users,email',
            ],
            'admin_password' => [
                'nullable',
                'string',
            ],
            'document_type' => ['nullable', 'string', 'max:50'],
            'document_number' => ['nullable', 'string', 'max:100'],
            'plan_id' => ['nullable', 'integer', 'exists:plans,id'],
            'billing_cycle' => ['nullable', 'string', 'in:monthly,yearly'],
            'calling_pin_code' => ['nullable', 'string', 'max:5'],
            'profile_picture' => ['nullable', 'file', 'max:2048', 'mimes:jpg,jpeg,png'],
            'id_type' => ['nullable', 'string', 'max:50'],
            'id_proof' => ['nullable', 'file', 'max:5120', 'mimes:jpg,jpeg,png,pdf'],
            'address_type' => ['nullable', 'string', 'max:50'],
            'address_proof' => ['nullable', 'file', 'max:5120', 'mimes:jpg,jpeg,png,pdf'],
            'remark' => ['nullable', 'string', 'max:1000'],
            'main_branch' => ['nullable', 'string', 'max:255'],
            'active_from' => ['nullable', 'date'],
            'active_to' => ['nullable', 'date'],
            'received_amount' => ['nullable', 'numeric'],
            'number_of_branch' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
