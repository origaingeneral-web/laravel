<?php

namespace App\Http\Resources\Api\Company;

use App\Models\AddonFeatureRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin AddonFeatureRequest
 */
class AddonFeatureRequestResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'notes' => $this->notes,
            'feature' => $this->whenLoaded('feature', fn () => [
                'id' => $this->feature->id,
                'code' => $this->feature->code,
                'name' => $this->feature->name,
            ]),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
