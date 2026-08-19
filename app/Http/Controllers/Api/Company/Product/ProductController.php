<?php

namespace App\Http\Controllers\Api\Company\Product;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\Company\CompanyProductResource;
use App\Models\Company\CompanyProduct;
use App\Trait\TryCatchHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    use TryCatchHandler;

    public function index(Request $request): JsonResponse
    {
        return $this->tryCatch(function () use ($request) {
            $user = $request->user();

            $subscriptions = $user->accessibleCompanyProductsQuery()->get();

            if ($subscriptions->isNotEmpty()) {
                $counts = DB::table('company_product_feature')
                    ->select('product_id', DB::raw('COUNT(*) as aggregate'))
                    ->where('company_id', $user->company_id)
                    ->whereIn('product_id', $subscriptions->pluck('product_id'))
                    ->where('is_enabled', true)
                    ->groupBy('product_id')
                    ->pluck('aggregate', 'product_id');

                $subscriptions->each(function (CompanyProduct $subscription) use ($counts): void {
                    $subscription->features_count = (int) ($counts[$subscription->product_id] ?? 0);
                });
            }

            return $this->success([
                'products' => CompanyProductResource::collection($subscriptions),
            ]);
        }, 'Failed to fetch products.', 'products');
    }

    public function show(Request $request, int $product): JsonResponse
    {
        return $this->tryCatch(function () use ($request) {
            /** @var CompanyProduct $subscription */
            $subscription = $request->attributes->get('company_product');

            $subscription->features_count = (int) DB::table('company_product_feature')
                ->where('company_id', $subscription->company_id)
                ->where('product_id', $subscription->product_id)
                ->where('is_enabled', true)
                ->count();

            return $this->success([
                'product' => new CompanyProductResource($subscription),
            ]);
        }, 'Failed to retrieve product.', 'products');
    }
}
