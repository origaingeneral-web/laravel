<?php

namespace App\Http\Controllers\Api\Company;

use App\Http\Concerns\RespondsWithJson;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Company\StoreAddonFeatureRequest;
use App\Http\Resources\Api\Company\AddonFeatureRequestResource;
use App\Models\AddonFeatureRequest;
use App\Models\Admin\Feature;
use App\Models\CompanyProduct;
use Illuminate\Http\JsonResponse;

class ProductAddonFeatureRequestController extends Controller
{
    use RespondsWithJson;

    public function store(StoreAddonFeatureRequest $request, int $product): JsonResponse
    {
        /** @var CompanyProduct $subscription */
        $subscription = $request->attributes->get('company_product');

        $featureId = $request->integer('feature_id');

        $feature = Feature::query()
            ->whereKey($featureId)
            ->where('product_id', $subscription->product_id)
            ->where('is_addon', true)
            ->where('is_active', true)
            ->first();

        if (! $feature) {
            return $this->error('Addon feature not found for this product.', status: 422);
        }

        $existing = AddonFeatureRequest::query()
            ->where('company_id', $subscription->company_id)
            ->where('product_id', $subscription->product_id)
            ->where('feature_id', $featureId)
            ->where('status', 'pending')
            ->exists();

        if ($existing) {
            return $this->error('A pending request already exists for this feature.', status: 422);
        }

        $addonRequest = AddonFeatureRequest::query()->create([
            'company_id' => $subscription->company_id,
            'product_id' => $subscription->product_id,
            'feature_id' => $featureId,
            'requested_by' => $request->user()->id,
            'status' => 'pending',
            'notes' => $request->string('notes')->toString() ?: null,
        ]);

        return $this->success([
            'request' => new AddonFeatureRequestResource($addonRequest->load('feature')),
        ], 'Addon feature request submitted.', 201);
    }
}
