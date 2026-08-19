<?php

namespace App\Http\Controllers\Api\Admin\Master;

use App\Http\Controllers\Controller;
use App\Models\Admin\Master\Plan;
use App\Models\Product\Product;
use App\Trait\TryCatchHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PlanApiController extends Controller
{
    use TryCatchHandler;

    public function index(): JsonResponse
    {
        return $this->tryCatch(function () {
            $plans = Plan::query()
                ->with(['products:id,name,code'])
                ->orderBy('plan_name')
                ->get();

            return $this->success($plans);
        }, 'Failed to fetch plans.', 'masters');
    }

    public function products(): JsonResponse
    {
        return $this->tryCatch(function () {
            $products = Product::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(['id', 'name', 'code', 'description']);

            return $this->success($products);
        }, 'Failed to fetch products.', 'masters');
    }

    public function store(Request $request): JsonResponse
    {
        return $this->tryCatch(function () use ($request) {
            $validated = $request->validate([
                'plan_name' => ['required', 'string', 'max:255'],
                'price' => ['nullable', 'numeric', 'min:0'],
                'duration_in_days' => ['required', 'integer', 'min:1'],
                'staff_limit' => ['nullable', 'integer', 'min:1'],
                'tracking_duration' => ['required', 'integer', 'min:1', 'max:24'],
                'remarks' => ['nullable', 'string', 'max:1024'],
                'products' => ['nullable', 'array'],
                'products.*.product_id' => ['required_with:products', 'integer', 'exists:products,id'],
                'products.*.price_per_user' => ['required_with:products', 'numeric', 'min:0'],
                'products.*.staff_limit' => ['nullable', 'integer', 'min:1'],
            ]);

            $plan = DB::transaction(function () use ($validated, $request) {
                $productsInput = $request->input('products', []);
                $totalPrice = $validated['price'] ?? 0;

                if (empty($totalPrice) && ! empty($productsInput)) {
                    $totalPrice = collect($productsInput)->sum('price_per_user');
                }

                $firstProductId = ! empty($productsInput) ? (int) $productsInput[0]['product_id'] : null;
                $overallStaffLimit = $validated['staff_limit'] ?? (! empty($productsInput) ? (int) collect($productsInput)->max('staff_limit') : 10);

                $plan = Plan::query()->create([
                    'product_id' => $firstProductId,
                    'plan_name' => $validated['plan_name'],
                    'price' => $totalPrice,
                    'duration_in_days' => $validated['duration_in_days'],
                    'staff_limit' => $overallStaffLimit ?: 10,
                    'tracking_duration' => $validated['tracking_duration'],
                    'remarks' => $validated['remarks'] ?? null,
                ]);

                if (! empty($productsInput)) {
                    $syncData = [];
                    foreach ($productsInput as $item) {
                        $syncData[(int) $item['product_id']] = [
                            'price_per_user' => (float) ($item['price_per_user'] ?? 0),
                            'staff_limit' => isset($item['staff_limit']) && $item['staff_limit'] !== '' ? (int) $item['staff_limit'] : 10,
                        ];
                    }
                    $plan->products()->sync($syncData);
                }

                return $plan->load('products:id,name,code');
            });

            return $this->success($plan, 'Plan created successfully.', 201);
        }, 'Failed to create plan.', 'masters');
    }

    public function update(Request $request, Plan $plan): JsonResponse
    {
        return $this->tryCatch(function () use ($plan, $request) {
            $validated = $request->validate([
                'plan_name' => ['required', 'string', 'max:255'],
                'price' => ['nullable', 'numeric', 'min:0'],
                'duration_in_days' => ['required', 'integer', 'min:1'],
                'staff_limit' => ['nullable', 'integer', 'min:1'],
                'tracking_duration' => ['required', 'integer', 'min:1', 'max:24'],
                'remarks' => ['nullable', 'string', 'max:1024'],
                'products' => ['nullable', 'array'],
                'products.*.product_id' => ['required_with:products', 'integer', 'exists:products,id'],
                'products.*.price_per_user' => ['required_with:products', 'numeric', 'min:0'],
                'products.*.staff_limit' => ['nullable', 'integer', 'min:1'],
            ]);

            $plan = DB::transaction(function () use ($plan, $validated, $request) {
                $productsInput = $request->input('products', []);
                $totalPrice = $validated['price'] ?? 0;

                if (empty($totalPrice) && ! empty($productsInput)) {
                    $totalPrice = collect($productsInput)->sum('price_per_user');
                }

                $firstProductId = ! empty($productsInput) ? (int) $productsInput[0]['product_id'] : $plan->product_id;
                $overallStaffLimit = $validated['staff_limit'] ?? (! empty($productsInput) ? (int) collect($productsInput)->max('staff_limit') : $plan->staff_limit);

                $plan->update([
                    'product_id' => $firstProductId,
                    'plan_name' => $validated['plan_name'],
                    'price' => $totalPrice,
                    'duration_in_days' => $validated['duration_in_days'],
                    'staff_limit' => $overallStaffLimit ?: 10,
                    'tracking_duration' => $validated['tracking_duration'],
                    'remarks' => $validated['remarks'] ?? null,
                ]);

                if ($request->has('products')) {
                    $syncData = [];
                    foreach ($productsInput as $item) {
                        $syncData[(int) $item['product_id']] = [
                            'price_per_user' => (float) ($item['price_per_user'] ?? 0),
                            'staff_limit' => isset($item['staff_limit']) && $item['staff_limit'] !== '' ? (int) $item['staff_limit'] : 10,
                        ];
                    }
                    $plan->products()->sync($syncData);
                }

                return $plan->load('products:id,name,code');
            });

            return $this->success($plan, 'Plan updated successfully.');
        }, 'Failed to update plan.', 'masters');
    }

    public function destroy(Plan $plan): JsonResponse
    {
        return $this->tryCatch(function () use ($plan) {
            DB::transaction(function () use ($plan) {
                $plan->products()->detach();
                $plan->delete();
            });

            return $this->success(null, 'Plan deleted successfully.');
        }, 'Failed to delete plan.', 'masters');
    }
}
