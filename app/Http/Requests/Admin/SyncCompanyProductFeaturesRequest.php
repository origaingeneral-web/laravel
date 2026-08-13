<?php

namespace App\Http\Requests\Admin;

use App\Models\Admin\Feature;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class SyncCompanyProductFeaturesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user('super_admin')?->can('feature.assign') ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'features' => ['present', 'array'],
            'features.*.feature_id' => ['required', 'integer', 'distinct', 'exists:features,id'],
            'features.*.is_enabled' => ['required', 'boolean'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $productId = (int) $this->route('product');

        $validator->after(function (Validator $validator) use ($productId): void {
            foreach ($this->input('features', []) as $index => $row) {
                $featureId = $row['feature_id'] ?? null;

                if (! $featureId) {
                    continue;
                }

                $belongs = Feature::query()
                    ->whereKey($featureId)
                    ->where('product_id', $productId)
                    ->exists();

                if (! $belongs) {
                    $validator->errors()->add(
                        "features.{$index}.feature_id",
                        'Feature does not belong to this product.'
                    );
                }
            }
        });
    }
}
