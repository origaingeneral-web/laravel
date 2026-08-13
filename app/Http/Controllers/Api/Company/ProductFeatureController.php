<?php

namespace App\Http\Controllers\Api\Company;

use App\Http\Concerns\RespondsWithJson;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api\Company\FeatureResource;
use App\Models\Admin\Feature;
use App\Models\CompanyProduct;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductFeatureController extends Controller
{
    use RespondsWithJson;

    public function index(Request $request, int $product): JsonResponse
    {
        /** @var CompanyProduct $subscription */
        $subscription = $request->attributes->get('company_product');

        $features = Feature::query()
            ->select([
                'features.id',
                'features.product_id',
                'features.code',
                'features.name',
                'features.description',
                'features.is_addon',
                'features.is_active',
                'features.sort_order',
                'cpf.is_enabled as pivot_is_enabled',
                'cpf.enabled_at as pivot_enabled_at',
                'cpf.expires_at as pivot_expires_at',
            ])
            ->join('company_product_feature as cpf', 'cpf.feature_id', '=', 'features.id')
            ->where('cpf.company_id', $subscription->company_id)
            ->where('cpf.product_id', $subscription->product_id)
            ->where('cpf.is_enabled', true)
            ->where('features.product_id', $subscription->product_id)
            ->where('features.is_active', true)
            ->orderBy('features.sort_order')
            ->orderBy('features.name')
            ->get();

        $accessMap = $features->mapWithKeys(
            fn (Feature $feature) => [$feature->code => true]
        );

        return $this->success([
            'features' => FeatureResource::collection($features),
            'access_map' => $accessMap,
        ]);
    }
}
