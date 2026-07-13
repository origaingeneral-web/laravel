<?php

namespace App\Http\Requests\Api\Company;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SyncEmployeeProductsRequest extends FormRequest
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
        $companyId = $this->user()?->company_id;

        return [
            'product_ids' => ['required', 'array'],
            'product_ids.*' => [
                'integer',
                Rule::exists('company_products', 'product_id')->where(
                    fn ($query) => $query->where('company_id', $companyId)
                ),
            ],
        ];
    }
}
