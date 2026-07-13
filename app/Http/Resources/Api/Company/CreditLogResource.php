<?php

namespace App\Http\Resources\Api\Company;

use App\Models\CompanyProductCreditLog;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin CompanyProductCreditLog
 */
class CreditLogResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_id' => $this->company_id,
            'product_id' => $this->product_id,
            'amount' => $this->amount,
            'type' => $this->type,
            'balance_after' => $this->balance_after,
            'description' => $this->description,
            'created_at' => $this->created_at,
        ];
    }
}
