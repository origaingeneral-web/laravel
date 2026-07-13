<?php

namespace App\Http\Resources\Api\Company;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin User
 */
class EmployeeResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_id' => $this->company_id,
            'user_prefix' => $this->user_prefix,
            'name' => $this->name,
            'email' => $this->email,
            'is_active' => (bool) $this->is_active,
            'initial_role' => $this->initial_role,
            'roles' => $this->whenLoaded('roles', fn () => $this->getRoleNames()->values()->all()),
            'product_ids' => $this->whenLoaded(
                'productAccess',
                fn () => $this->productAccess->where('is_active', true)->pluck('product_id')->values()->all()
            ),
            'email_verified_at' => $this->email_verified_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
