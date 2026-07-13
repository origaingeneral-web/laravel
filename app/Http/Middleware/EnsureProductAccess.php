<?php

namespace App\Http\Middleware;

use App\Models\CompanyProduct;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureProductAccess
{
    /**
     * Ensure the route product belongs to the auth company and the user may access it.
     *
     * Single company_products lookup; access check skips a second subscription exists() call.
     *
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $productParam = $request->route('product');
        $productId = is_object($productParam) ? (int) $productParam->id : (int) $productParam;

        if (! $user || ! $productId) {
            return response()->json([
                'success' => false,
                'message' => 'Product context is required.',
                'errors' => null,
            ], 403);
        }

        $subscription = CompanyProduct::query()
            ->with([
                'product:id,name,code,description,is_active',
                'plan:id,product_id,plan_name,duration_in_days,staff_limit,tracking_duration',
            ])
            ->where('company_id', $user->company_id)
            ->where('product_id', $productId)
            ->first();

        if (! $subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Product is not assigned to your company.',
                'errors' => null,
            ], 404);
        }

        if (! $user->hasProductAccess($productId, subscriptionVerified: true)) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have access to this product.',
                'errors' => null,
            ], 403);
        }

        if (! $subscription->isAccessible()) {
            return response()->json([
                'success' => false,
                'message' => 'This product subscription is inactive or expired.',
                'errors' => [
                    'product_id' => [$productId],
                    'status' => [$subscription->isExpired() ? 'expired' : $subscription->status],
                ],
            ], 422);
        }

        $request->attributes->set('company_product', $subscription);
        $request->attributes->set('product', $subscription->product);

        return $next($request);
    }
}
