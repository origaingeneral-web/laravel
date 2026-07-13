<?php

namespace App\Http\Controllers\Api\Company;

use App\Http\Concerns\RespondsWithJson;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api\Company\CompanyProductPlanResource;
use App\Models\CompanyProduct;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductPlanController extends Controller
{
    use RespondsWithJson;

    public function show(Request $request, int $product): JsonResponse
    {
        /** @var CompanyProduct $subscription */
        $subscription = $request->attributes->get('company_product');

        return $this->success([
            'plan' => new CompanyProductPlanResource($subscription->loadMissing('plan')),
        ]);
    }
}
