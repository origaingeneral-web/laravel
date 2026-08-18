<?php

namespace App\Http\Resources\Api\Company;

use App\Models\Admin\Feature\Feature;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Feature
 */
class FeatureResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
            'is_addon' => (bool) $this->is_addon,
            'is_enabled' => (bool) ($this->pivot_is_enabled ?? $this->pivot?->is_enabled ?? false),
            'enabled_at' => $this->pivot_enabled_at ?? $this->pivot?->enabled_at,
            'expires_at' => $this->pivot_expires_at ?? $this->pivot?->expires_at,
            'menu_key' => $this->code,
        ];
    }
}
