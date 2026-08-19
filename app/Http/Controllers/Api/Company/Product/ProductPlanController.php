<?php

namespace App\Http\Controllers\Api\Company\Product;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\Company\CompanyProductPlanResource;
use App\Models\Company\CompanyProduct;
use App\Trait\TryCatchHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductPlanController extends Controller
{
    use TryCatchHandler;

    public function show(Request $request, int $product): JsonResponse
    {
        return $this->tryCatch(function () use ($request) {
            /** @var CompanyProduct $subscription */
            $subscription = $request->attributes->get('company_product');

            return $this->success([
                'plan' => new CompanyProductPlanResource($subscription->loadMissing('plan')),
            ]);
        }, 'Failed to fetch plan.', 'products');
    }
}
