<?php

namespace App\Http\Controllers\Api\Company;

use App\Http\Concerns\RespondsWithJson;
use App\Http\Controllers\Controller;
use App\Models\CompanyProduct;
use App\Models\RenewalRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductRenewalRequestController extends Controller
{
    use RespondsWithJson;

    public function store(Request $request, int $product): JsonResponse
    {
        /** @var CompanyProduct $subscription */
        $subscription = $request->attributes->get('company_product');

        $request->validate([
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $pending = RenewalRequest::query()
            ->where('company_id', $subscription->company_id)
            ->where('product_id', $subscription->product_id)
            ->where('status', 'pending')
            ->exists();

        if ($pending) {
            return $this->error('A pending renewal request already exists for this product.', status: 422);
        }

        $renewal = RenewalRequest::query()->create([
            'company_id' => $subscription->company_id,
            'product_id' => $subscription->product_id,
            'requested_by' => $request->user()->id,
            'status' => 'pending',
            'notes' => $request->string('notes')->toString() ?: null,
        ]);

        return $this->success([
            'request' => [
                'id' => $renewal->id,
                'product_id' => $renewal->product_id,
                'status' => $renewal->status,
                'notes' => $renewal->notes,
                'created_at' => $renewal->created_at,
            ],
        ], 'Renewal request submitted.', 201);
    }
}
