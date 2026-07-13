<?php

use App\Enums\CompanyStatus;
use App\Enums\RoleName;
use App\Models\Company;
use App\Models\CompanyProduct;
use App\Models\Plan;
use App\Models\Product;
use App\Models\User;
use App\Models\UserProductAccess;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

function makeMultiProductCompany(array $overrides = []): Company
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
        'company_name' => 'Multi Product Co',
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

/**
 * @return array{0: Product, 1: Product, 2: CompanyProduct, 3: CompanyProduct}
 */
function subscribeTwoProducts(Company $company): array
{
    $productA = Product::query()->create([
        'name' => 'F2 Super',
        'code' => 'f2_'.Str::lower(Str::random(4)),
        'is_active' => true,
    ]);

    $productB = Product::query()->create([
        'name' => 'Another App',
        'code' => 'app_'.Str::lower(Str::random(4)),
        'is_active' => true,
    ]);

    $planA = Plan::query()->create([
        'product_id' => $productA->id,
        'plan_name' => 'F2 Plan',
        'price' => 999,
        'duration_in_days' => 365,
        'staff_limit' => 25,
        'tracking_duration' => 24,
        'is_active' => true,
    ]);

    $planB = Plan::query()->create([
        'product_id' => $productB->id,
        'plan_name' => 'App Plan',
        'price' => 499,
        'duration_in_days' => 180,
        'staff_limit' => 10,
        'tracking_duration' => 12,
        'is_active' => true,
    ]);

    $subA = CompanyProduct::query()->create([
        'company_id' => $company->id,
        'product_id' => $productA->id,
        'plan_id' => $planA->id,
        'status' => 'active',
        'starts_at' => now()->subDay(),
        'expires_at' => now()->addYear(),
    ]);

    $subB = CompanyProduct::query()->create([
        'company_id' => $company->id,
        'product_id' => $productB->id,
        'plan_id' => $planB->id,
        'status' => 'active',
        'starts_at' => now()->subDay(),
        'expires_at' => now()->addMonths(6),
    ]);

    return [$productA, $productB, $subA, $subB];
}

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('one company can subscribe to multiple products with distinct plans', function () {
    $company = makeMultiProductCompany();
    [$productA, $productB] = subscribeTwoProducts($company);

    $admin = User::factory()->create([
        'company_id' => $company->id,
        'is_active' => true,
        'email' => 'multi.admin@example.com',
        'password' => 'password',
    ]);
    $admin->assignRole(RoleName::CompanyAdmin->value);

    $this->postJson('/api/login', [
        'email' => 'multi.admin@example.com',
        'password' => 'password',
    ])
        ->assertOk()
        ->assertJsonCount(2, 'data.products');

    $token = $admin->createToken('api')->plainTextToken;

    $this->withToken($token)
        ->getJson('/api/v1/company/products')
        ->assertOk()
        ->assertJsonCount(2, 'data.products');

    $this->withToken($token)
        ->getJson("/api/v1/company/products/{$productA->id}/plan")
        ->assertOk()
        ->assertJsonPath('data.plan.plan.plan_name', 'F2 Plan');

    $this->withToken($token)
        ->getJson("/api/v1/company/products/{$productB->id}/plan")
        ->assertOk()
        ->assertJsonPath('data.plan.plan.plan_name', 'App Plan');
});

test('employee can only access assigned products', function () {
    $company = makeMultiProductCompany();
    [$productA, $productB] = subscribeTwoProducts($company);

    $employee = User::factory()->create([
        'company_id' => $company->id,
        'is_active' => true,
    ]);
    $employee->assignRole(RoleName::Employee->value);

    UserProductAccess::query()->create([
        'user_id' => $employee->id,
        'company_id' => $company->id,
        'product_id' => $productA->id,
        'is_active' => true,
    ]);

    $token = $employee->createToken('api')->plainTextToken;

    $this->withToken($token)
        ->getJson('/api/v1/company/products')
        ->assertOk()
        ->assertJsonCount(1, 'data.products')
        ->assertJsonPath('data.products.0.id', $productA->id);

    $this->withToken($token)
        ->getJson("/api/v1/company/products/{$productA->id}")
        ->assertOk();

    $this->withToken($token)
        ->getJson("/api/v1/company/products/{$productB->id}")
        ->assertForbidden()
        ->assertJsonPath('message', 'You do not have access to this product.');
});

test('expired product is blocked while another active product remains usable', function () {
    $company = makeMultiProductCompany();
    [$productA, $productB, $subA] = subscribeTwoProducts($company);

    $subA->update([
        'expires_at' => now()->subDay(),
    ]);

    $admin = User::factory()->create([
        'company_id' => $company->id,
        'is_active' => true,
        'email' => 'partial.expired@example.com',
        'password' => 'password',
    ]);
    $admin->assignRole(RoleName::CompanyAdmin->value);

    $this->postJson('/api/login', [
        'email' => 'partial.expired@example.com',
        'password' => 'password',
    ])->assertOk();

    $token = $admin->createToken('api')->plainTextToken;

    $this->withToken($token)
        ->getJson("/api/v1/company/products/{$productA->id}/plan")
        ->assertStatus(422)
        ->assertJsonPath('message', 'This product subscription is inactive or expired.');

    $this->withToken($token)
        ->getJson("/api/v1/company/products/{$productB->id}/plan")
        ->assertOk()
        ->assertJsonPath('data.plan.plan.plan_name', 'App Plan');
});

test('company cannot access another company product by id', function () {
    $companyA = makeMultiProductCompany();
    $companyB = makeMultiProductCompany();
    [$productA] = subscribeTwoProducts($companyA);
    [$productB] = subscribeTwoProducts($companyB);

    $adminA = User::factory()->create([
        'company_id' => $companyA->id,
        'is_active' => true,
    ]);
    $adminA->assignRole(RoleName::CompanyAdmin->value);

    $this->withToken($adminA->createToken('api')->plainTextToken)
        ->getJson("/api/v1/company/products/{$productB->id}")
        ->assertNotFound();
});
