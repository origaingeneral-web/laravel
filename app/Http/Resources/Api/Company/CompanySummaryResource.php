<?php

namespace App\Http\Resources\Api\Company;

use App\Models\Company\Company;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Lightweight company payload for login / me responses.
 *
 * @mixin Company
 */
class CompanySummaryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_name' => $this->company_name,
            'company_code' => $this->company_code,
            'email' => $this->email,
            'status_code' => $this->status,
            'logo' => $this->profile,
        ];
    }
}
