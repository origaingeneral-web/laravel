<?php

use App\Enums\CompanyStatus;
use App\Enums\RoleName;
use App\Models\Admin\Feature\Feature;
use App\Models\Admin\Master\Plan;
use App\Models\Company\Company;
use App\Models\Company\CompanyProduct;
use App\Models\Company\CompanyProductCredit;
use App\Models\Company\CompanyProductCreditLog;
use App\Models\Product\Product;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

function makeCompanyForPlan(array $overrides = []): Company
{
    $now = now();

    $businessCategoryId = DB::table('business_categories')->insertGetId([
        'category' => 'Cat '.Str::random(5),
        'created_at' => $now,
        'updated_at' => $now,
    ]);

    $countryId = DB::table('countries')->insertGetId([
        'country' => 'Country '.Str::random(4),
        'iso3' => strtoupper(Str::random(3)),
        'phone_code' => '91',
        'created_at' => $now,
        'updated_at' => $now,
    ]);

    $stateId = DB::table('states')->insertGetId([
        'country_id' => $countryId,
        'state' => 'State',
        'code' => strtoupper(Str::random(2)),
        'created_at' => $now,
        'updated_at' => $now,
    ]);

    $cityId = DB::table('cities')->insertGetId([
        'state_id' => $stateId,
        'city' => 'City',
        'is_top_city' => 0,
        'created_at' => $now,
        'updated_at' => $now,
    ]);

    return Company::query()->create(array_merge([
        'business_category_id' => $businessCategoryId,
        'company_name' => 'Plan Co',
        'company_code' => strtoupper(Str::random(4)),
        'email' => Str::lower(Str::random(8)).'@example.com',
        'mobile' => '9999999999',
        'owner_name' => 'Owner',
        'owner_mobile' => '9999999998',
        'country_id' => $countryId,
        'state_id' => $stateId,
        'city_id' => $cityId,
        'pincode' => '400001',
        'address' => 'Address',
        'status' => CompanyStatus::Active->value,
        'terms_accepted' => true,
        'terms_accepted_at' => $now,
    ], $overrides));
}

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('company can view per-product plan features and credits', function () {
    $company = makeCompanyForPlan();

    $product = Product::query()->create([
        'name' => 'F2 Super',
        'code' => 'f2_'.Str::lower(Str::random(4)),
        'is_active' => true,
    ]);

    $plan = Plan::query()->create([
        'product_id' => $product->id,
        'plan_name' => 'Pro',
        'price' => 1999,
        'duration_in_days' => 365,
        'staff_limit' => 50,
        'tracking_duration' => 24,
        'is_active' => true,
    ]);

    CompanyProduct::query()->create([
        'company_id' => $company->id,
        'product_id' => $product->id,
        'plan_id' => $plan->id,
        'starts_at' => now()->subDay(),
        'expires_at' => now()->addYear(),
        'status' => 'active',
        'staff_limit' => 50,
    ]);

    $feature = Feature::query()->create([
        'product_id' => $product->id,
        'code' => 'crm',
        'name' => 'CRM',
        'is_addon' => false,
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $addon = Feature::query()->create([
        'product_id' => $product->id,
        'code' => 'ai_assistant',
        'name' => 'AI Assistant',
        'is_addon' => true,
        'is_active' => true,
        'sort_order' => 2,
    ]);

    DB::table('company_product_feature')->insert([
        'company_id' => $company->id,
        'product_id' => $product->id,
        'feature_id' => $feature->id,
        'is_enabled' => true,
        'enabled_at' => now(),
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    CompanyProductCredit::query()->create([
        'company_id' => $company->id,
        'product_id' => $product->id,
        'balance' => 250,
    ]);

    CompanyProductCreditLog::query()->create([
        'company_id' => $company->id,
        'product_id' => $product->id,
        'amount' => 250,
        'type' => 'credit',
        'balance_after' => 250,
        'description' => 'Top up',
    ]);

    $admin = User::factory()->create([
        'company_id' => $company->id,
        'is_active' => true,
    ]);
    $admin->assignRole(RoleName::CompanyAdmin->value);
    $token = $admin->createToken('api')->plainTextToken;

    $this->withToken($token)
        ->getJson("/api/v1/company/products/{$product->id}/plan")
        ->assertOk()
        ->assertJsonPath('data.plan.plan.plan_name', 'Pro')
        ->assertJsonMissingPath('data.plan.plan.price');

    $this->withToken($token)
        ->getJson("/api/v1/company/products/{$product->id}/features")
        ->assertOk()
        ->assertJsonPath('data.access_map.crm', true);

    $this->withToken($token)
        ->getJson("/api/v1/company/products/{$product->id}/credits")
        ->assertOk()
        ->assertJsonPath('data.credits.balance', '250.00')
        ->assertJsonPath('data.credits.product_id', $product->id);

    $this->withToken($token)
        ->getJson("/api/v1/company/products/{$product->id}/credits/logs")
        ->assertOk()
        ->assertJsonPath('data.logs.0.description', 'Top up');

    $this->withToken($token)
        ->postJson("/api/v1/company/products/{$product->id}/addon-feature-requests", [
            'feature_id' => $addon->id,
            'notes' => 'Please enable AI',
        ])
        ->assertCreated()
        ->assertJsonPath('data.request.status', 'pending');

    $this->withToken($token)
        ->postJson("/api/v1/company/products/{$product->id}/renewal-requests", [
            'notes' => 'Please renew',
        ])
        ->assertCreated()
        ->assertJsonPath('data.request.status', 'pending');
});
