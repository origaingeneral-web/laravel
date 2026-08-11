<?php

namespace App\Http\Requests\Admin;

use App\Models\Admin\Master\Plan;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class SyncCompanyProductsRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user('super_admin');

        return ($user?->can('company.update') && $user?->can('plan.manage')) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'products' => ['present', 'array'],
            'products.*.product_id' => ['required', 'integer', 'distinct', 'exists:products,id'],
            'products.*.plan_id' => ['nullable', 'integer', 'exists:plans,id'],
            'products.*.status' => ['required', 'string', 'in:active,inactive,expired,cancelled'],
            'products.*.starts_at' => ['nullable', 'date'],
            'products.*.expires_at' => ['nullable', 'date', 'after_or_equal:products.*.starts_at'],
            'products.*.staff_limit' => ['nullable', 'integer', 'min:1', 'max:100000'],
            'products.*.notes' => ['nullable', 'string', 'max:1000'],
            'products.*.enable_default_features' => ['sometimes', 'boolean'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            foreach ($this->input('products', []) as $index => $row) {
                $planId = $row['plan_id'] ?? null;
                $productId = $row['product_id'] ?? null;

                if (! $planId || ! $productId) {
                    continue;
                }

                $belongs = Plan::query()
                    ->whereKey($planId)
                    ->where('product_id', $productId)
                    ->exists();

                if (! $belongs) {
                    $validator->errors()->add(
                        "products.{$index}.plan_id",
                        'Selected plan does not belong to this product.'
                    );
                }
            }
        });
    }
}
