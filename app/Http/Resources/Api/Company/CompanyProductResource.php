<?php

namespace App\Http\Resources\Api\Company;

use App\Models\CompanyProduct;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin CompanyProduct
 */
class CompanyProductResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->product_id,
            'subscription_id' => $this->id,
            'name' => $this->product?->name,
            'code' => $this->product?->code,
            'description' => $this->product?->description,
            'status' => $this->isExpired() ? 'expired' : $this->status,
            'is_accessible' => $this->isAccessible(),
            'starts_at' => $this->starts_at,
            'expires_at' => $this->expires_at,
            'staff_limit' => $this->staff_limit ?? $this->plan?->staff_limit,
            'features_count' => $this->features_count ?? null,
            'plan' => $this->whenLoaded('plan', fn () => $this->plan ? [
                'id' => $this->plan->id,
                'plan_name' => $this->plan->plan_name,
                'duration_in_days' => $this->plan->duration_in_days,
                'staff_limit' => $this->plan->staff_limit,
                'tracking_duration' => $this->plan->tracking_duration,
            ] : null),
        ];
    }
}
