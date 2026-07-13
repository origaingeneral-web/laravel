<?php

namespace App\Http\Resources\Api\Company;

use App\Models\CompanyProduct;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin CompanyProduct
 */
class CompanyProductPlanResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'product_id' => $this->product_id,
            'status' => $this->isExpired() ? 'expired' : $this->status,
            'is_accessible' => $this->isAccessible(),
            'is_expired' => $this->isExpired(),
            'starts_at' => $this->starts_at,
            'expires_at' => $this->expires_at,
            'staff_limit' => $this->staff_limit ?? $this->plan?->staff_limit,
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
