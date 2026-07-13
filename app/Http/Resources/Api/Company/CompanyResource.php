<?php

namespace App\Http\Resources\Api\Company;

use App\Enums\CompanyStatus;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Company
 */
class CompanyResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $status = CompanyStatus::tryFrom((int) $this->status);

        return [
            'id' => $this->id,
            'company_name' => $this->company_name,
            'company_code' => $this->company_code,
            'email' => $this->email,
            'mobile' => $this->mobile,
            'owner_name' => $this->owner_name,
            'owner_mobile' => $this->owner_mobile,
            'landline' => $this->landline,
            'country_id' => $this->country_id,
            'state_id' => $this->state_id,
            'city_id' => $this->city_id,
            'area_id' => $this->area_id,
            'pincode' => $this->pincode,
            'address' => $this->address,
            'logo' => $this->profile,
            'status' => $status?->label() ?? 'unknown',
            'status_code' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
