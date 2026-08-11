<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SyncCompanyProductFeaturesRequest;
use App\Http\Requests\Admin\SyncCompanyProductsRequest;
use App\Models\Admin\Master\Plan;
use App\Models\Company;
use App\Models\CompanyProduct;
use App\Models\Feature;
use App\Models\Product;
use App\Models\UserProductAccess;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CompanyProductAssignmentController extends Controller
{
    public function edit(Request $request, Company $company): Response
    {
        abort_unless(
            $request->user('super_admin')?->can('company.update')
                && $request->user('super_admin')?->can('plan.manage'),
            403
        );

        $company->load([
            'companyProducts.product:id,name,code',
            'companyProducts.plan:id,product_id,plan_name',
        ]);

        $products = Product::query()
            ->where('is_active', true)
            ->with([
                'plans' => fn ($query) => $query
                    ->where('is_active', true)
                    ->orderBy('plan_name')
                    ->select(['id', 'product_id', 'plan_name', 'duration_in_days', 'staff_limit', 'price']),
                'features' => fn ($query) => $query
                    ->where('is_active', true)
                    ->orderBy('sort_order')
                    ->select(['id', 'product_id', 'code', 'name', 'is_addon']),
            ])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'code', 'description']);

        $enabledFeatures = DB::table('company_product_feature')
            ->where('company_id', $company->id)
            ->get(['product_id', 'feature_id', 'is_enabled'])
            ->groupBy('product_id')
            ->map(fn ($rows) => $rows->mapWithKeys(
                fn ($row) => [(int) $row->feature_id => (bool) $row->is_enabled]
            ));

        return Inertia::render('admin/companies/products', [
            'company' => [
                'id' => $company->id,
                'company_name' => $company->company_name,
                'company_code' => $company->company_code,
            ],
            'assigned' => $company->companyProducts->map(fn (CompanyProduct $subscription) => [
                'product_id' => $subscription->product_id,
                'plan_id' => $subscription->plan_id,
                'status' => $subscription->status,
                'starts_at' => optional($subscription->starts_at)?->toDateString(),
                'expires_at' => optional($subscription->expires_at)?->toDateString(),
                'staff_limit' => $subscription->staff_limit,
                'notes' => $subscription->notes,
            ])->values(),
            'catalog' => $products->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $product->name,
                'code' => $product->code,
                'description' => $product->description,
                'plans' => $product->plans->map(fn (Plan $plan) => [
                    'id' => $plan->id,
                    'plan_name' => $plan->plan_name,
                    'duration_in_days' => $plan->duration_in_days,
                    'staff_limit' => $plan->staff_limit,
                    'price' => $plan->price,
                ]),
                'features' => $product->features->map(fn (Feature $feature) => [
                    'id' => $feature->id,
                    'code' => $feature->code,
                    'name' => $feature->name,
                    'is_addon' => $feature->is_addon,
                    'is_enabled' => (bool) ($enabledFeatures[$product->id][$feature->id] ?? false),
                ]),
            ]),
        ]);
    }

    public function update(SyncCompanyProductsRequest $request, Company $company): RedirectResponse
    {
        $rows = collect($request->validated('products', []));
        $keepProductIds = $rows->pluck('product_id')->map(fn ($id) => (int) $id)->all();

        DB::transaction(function () use ($company, $rows, $keepProductIds): void {
            $removals = CompanyProduct::query()
                ->where('company_id', $company->id)
                ->when(
                    $keepProductIds !== [],
                    fn ($query) => $query->whereNotIn('product_id', $keepProductIds),
                )
                ->get();

            foreach ($removals as $subscription) {
                DB::table('company_product_feature')
                    ->where('company_id', $subscription->company_id)
                    ->where('product_id', $subscription->product_id)
                    ->delete();

                UserProductAccess::query()
                    ->where('company_id', $subscription->company_id)
                    ->where('product_id', $subscription->product_id)
                    ->delete();

                $subscription->delete();
            }

            foreach ($rows as $row) {
                $productId = (int) $row['product_id'];
                $wasNew = ! CompanyProduct::query()
                    ->where('company_id', $company->id)
                    ->where('product_id', $productId)
                    ->exists();

                CompanyProduct::query()->updateOrCreate(
                    [
                        'company_id' => $company->id,
                        'product_id' => $productId,
                    ],
                    [
                        'plan_id' => $row['plan_id'] ?? null,
                        'status' => $row['status'],
                        'starts_at' => $row['starts_at'] ?? null,
                        'expires_at' => $row['expires_at'] ?? null,
                        'staff_limit' => $row['staff_limit'] ?? null,
                        'notes' => $row['notes'] ?? null,
                    ],
                );

                $enableDefaults = (bool) ($row['enable_default_features'] ?? $wasNew);

                if ($enableDefaults) {
                    $this->enableDefaultFeatures($company->id, $productId);
                }
            }
        });

        return redirect()
            ->route('admin.companies.products.edit', $company)
            ->with('success', 'Company products updated.');
    }

    public function syncFeatures(
        SyncCompanyProductFeaturesRequest $request,
        Company $company,
        int $product
    ): RedirectResponse {
        $subscription = CompanyProduct::query()
            ->where('company_id', $company->id)
            ->where('product_id', $product)
            ->firstOrFail();

        $now = now();

        DB::transaction(function () use ($request, $company, $subscription, $now): void {
            foreach ($request->validated('features', []) as $row) {
                DB::table('company_product_feature')->updateOrInsert(
                    [
                        'company_id' => $company->id,
                        'product_id' => $subscription->product_id,
                        'feature_id' => (int) $row['feature_id'],
                    ],
                    [
                        'is_enabled' => (bool) $row['is_enabled'],
                        'enabled_at' => $row['is_enabled'] ? $now : null,
                        'updated_at' => $now,
                        'created_at' => $now,
                    ],
                );
            }
        });

        return redirect()
            ->route('admin.companies.products.edit', $company)
            ->with('success', 'Product features updated.');
    }

    private function enableDefaultFeatures(int $companyId, int $productId): void
    {
        $now = now();

        $features = Feature::query()
            ->where('product_id', $productId)
            ->where('is_active', true)
            ->where('is_addon', false)
            ->get(['id']);

        foreach ($features as $feature) {
            DB::table('company_product_feature')->updateOrInsert(
                [
                    'company_id' => $companyId,
                    'product_id' => $productId,
                    'feature_id' => $feature->id,
                ],
                [
                    'is_enabled' => true,
                    'enabled_at' => $now,
                    'updated_at' => $now,
                    'created_at' => $now,
                ],
            );
        }
    }
}
