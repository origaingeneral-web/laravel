<?php

namespace App\Http\Controllers\Api\Company;

use App\Http\Concerns\RespondsWithJson;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api\Company\CreditLogResource;
use App\Http\Resources\Api\Company\CreditResource;
use App\Models\CompanyProduct;
use App\Models\CompanyProductCredit;
use App\Models\CompanyProductCreditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductCreditController extends Controller
{
    use RespondsWithJson;

    public function show(Request $request, int $product): JsonResponse
    {
        /** @var CompanyProduct $subscription */
        $subscription = $request->attributes->get('company_product');

        // Read-only: do not create rows on GET (avoids write amplification at scale).
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
    }

    public function logs(Request $request, int $product): JsonResponse
    {
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
    }
}
