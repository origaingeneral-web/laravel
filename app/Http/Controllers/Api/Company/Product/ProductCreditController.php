<?php

namespace App\Http\Controllers\Api\Company\Product;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\Company\CreditLogResource;
use App\Http\Resources\Api\Company\CreditResource;
use App\Models\Company\CompanyProduct;
use App\Models\Company\CompanyProductCredit;
use App\Models\Company\CompanyProductCreditLog;
use App\Trait\TryCatchHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductCreditController extends Controller
{
    use TryCatchHandler;

    public function show(Request $request, int $product): JsonResponse
    {
        return $this->tryCatch(function () use ($request) {
            /** @var CompanyProduct $subscription */
            $subscription = $request->attributes->get('company_product');

            $credit = CompanyProductCredit::query()
                ->where('company_id', $subscription->company_id)
                ->where('product_id', $subscription->product_id)
                ->first()
                ?? new CompanyProductCredit([
                    'company_id' => $subscription->company_id,
                    'product_id' => $subscription->product_id,
                    'balance' => 0,
                ]);

            return $this->success([
                'credits' => new CreditResource($credit),
            ]);
        }, 'Failed to fetch credits.', 'products');
    }

    public function logs(Request $request, int $product): JsonResponse
    {
        return $this->tryCatch(function () use ($request) {
            /** @var CompanyProduct $subscription */
            $subscription = $request->attributes->get('company_product');

            $perPage = min(max((int) $request->integer('per_page', 15), 1), 50);

            $logs = CompanyProductCreditLog::query()
                ->select([
                    'id',
                    'company_id',
                    'product_id',
                    'amount',
                    'type',
                    'balance_after',
                    'description',
                    'created_at',
                ])
                ->where('company_id', $subscription->company_id)
                ->where('product_id', $subscription->product_id)
                ->orderByDesc('id')
                ->paginate($perPage);

            return $this->success([
                'logs' => CreditLogResource::collection($logs->items()),
                'meta' => [
                    'current_page' => $logs->currentPage(),
                    'last_page' => $logs->lastPage(),
                    'per_page' => $logs->perPage(),
                    'total' => $logs->total(),
                ],
            ]);
        }, 'Failed to fetch credit logs.', 'products');
    }
}
