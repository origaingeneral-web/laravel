<?php

namespace App\Http\Resources\Api\Company;

use App\Models\CompanyProduct;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Lightweight product payload for login / me.
 *
 * @mixin CompanyProduct
 */
class CompanyProductSummaryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->product_id,
            'name' => $this->product?->name,
            'code' => $this->product?->code,
            'status' => $this->isExpired() ? 'expired' : $this->status,
            'is_accessible' => $this->isAccessible(),
            'expires_at' => $this->expires_at,
            'plan' => $this->whenLoaded('plan', fn () => $this->plan ? [
                'id' => $this->plan->id,
                'plan_name' => $this->plan->plan_name,
            ] : null),
        ];
    }
}
