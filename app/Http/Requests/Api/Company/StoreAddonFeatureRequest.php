<?php

namespace App\Http\Requests\Api\Company;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAddonFeatureRequest extends FormRequest
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
        $productId = (int) $this->route('product');

        return [
            'feature_id' => [
                'required',
                'integer',
                Rule::exists('features', 'id')->where(
                    fn ($query) => $query
                        ->where('product_id', $productId)
                        ->where('is_addon', true)
                        ->where('is_active', true)
                ),
            ],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
