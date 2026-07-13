<?php

namespace App\Http\Resources\Api\Company;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CreditResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'company_id' => $this->company_id,
            'product_id' => $this->product_id ?? null,
            'balance' => $this->balance,
            'updated_at' => $this->updated_at,
        ];
    }
}
