<?php

use App\Enums\CompanyStatus;
use App\Enums\RoleName;
use App\Models\Company;
use App\Models\CompanyProduct;
use App\Models\Feature;
use App\Models\Plan;
use App\Models\Product;
use App\Models\SuperAdmin;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

function makeAssignSuperAdmin(): SuperAdmin
{
    $admin = SuperAdmin::query()->create([
        'name' => 'Super Admin',
        'email' => 'assign.'.Str::lower(Str::random(6)).'@example.com',
        'number' => '9999999999',
        'password' => Hash::make('password'),
    ]);
    $admin->assignRole(RoleName::SuperAdmin->value);

    return $admin;
}

function makeAssignableCompany(): Company
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

    return Company::query()->create([
        'business_category_id' => $businessCategoryId,
        'company_name' => 'Assign Co',
        'company_code' => strtoupper(Str::random(4)),
        'email' => Str::lower(Str::random(8)).'@example.com',
        'mobile' => '9999999999',
        'owner_name' => 'Owner',
        'owner_mobile' => '8888888888',
        'country_id' => $countryId,
        'state_id' => $stateId,
        'city_id' => $cityId,
        'pincode' => '400001',
        'address' => 'Address',
        'status' => CompanyStatus::Active->value,
        'terms_accepted' => true,
        'terms_accepted_at' => $now,
    ]);
}

/**
 * @return array{0: Product, 1: Product, 2: Plan, 3: Plan, 4: Feature}
 */
function makeTwoProductsWithPlans(): array
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

    $feature = Feature::query()->create([
        'product_id' => $productA->id,
        'code' => 'crm',
        'name' => 'CRM',
        'is_addon' => false,
        'is_active' => true,
        'sort_order' => 1,
    ]);

    return [$productA, $productB, $planA, $planB, $feature];
}

test('super admin can open product assignment page', function () {
    $admin = makeAssignSuperAdmin();
    $company = makeAssignableCompany();
    makeTwoProductsWithPlans();

    $this->actingAs($admin, 'super_admin')
        ->get(route('admin.companies.products.edit', $company))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/companies/products')
            ->has('catalog')
            ->has('assigned'));
});

test('super admin can assign multiple products with distinct plans', function () {
    $admin = makeAssignSuperAdmin();
    $company = makeAssignableCompany();
    [$productA, $productB, $planA, $planB] = makeTwoProductsWithPlans();

    $this->actingAs($admin, 'super_admin')
        ->put(route('admin.companies.products.update', $company), [
            'products' => [
                [
                    'product_id' => $productA->id,
                    'plan_id' => $planA->id,
                    'status' => 'active',
                    'starts_at' => now()->toDateString(),
                    'expires_at' => now()->addYear()->toDateString(),
                    'staff_limit' => 25,
                    'enable_default_features' => true,
                ],
                [
                    'product_id' => $productB->id,
                    'plan_id' => $planB->id,
                    'status' => 'active',
                    'starts_at' => now()->toDateString(),
                    'expires_at' => now()->addMonths(6)->toDateString(),
                    'staff_limit' => 10,
                    'enable_default_features' => true,
                ],
            ],
        ])
        ->assertRedirect(route('admin.companies.products.edit', $company));

    expect(CompanyProduct::query()->where('company_id', $company->id)->count())->toBe(2);

    expect(CompanyProduct::query()
        ->where('company_id', $company->id)
        ->where('product_id', $productA->id)
        ->where('plan_id', $planA->id)
        ->exists())->toBeTrue();

    expect(DB::table('company_product_feature')
        ->where('company_id', $company->id)
        ->where('product_id', $productA->id)
        ->where('is_enabled', true)
        ->exists())->toBeTrue();
});

test('cannot assign plan that belongs to another product', function () {
    $admin = makeAssignSuperAdmin();
    $company = makeAssignableCompany();
    [$productA, $productB, $planA, $planB] = makeTwoProductsWithPlans();

    $this->actingAs($admin, 'super_admin')
        ->put(route('admin.companies.products.update', $company), [
            'products' => [
                [
                    'product_id' => $productA->id,
                    'plan_id' => $planB->id,
                    'status' => 'active',
                ],
            ],
        ])
        ->assertSessionHasErrors('products.0.plan_id');
});

test('assigned products appear on company admin api login', function () {
    $admin = makeAssignSuperAdmin();
    $company = makeAssignableCompany();
    [$productA, $productB, $planA, $planB] = makeTwoProductsWithPlans();

    $this->actingAs($admin, 'super_admin')
        ->put(route('admin.companies.products.update', $company), [
            'products' => [
                [
                    'product_id' => $productA->id,
                    'plan_id' => $planA->id,
                    'status' => 'active',
                    'starts_at' => now()->subDay()->toDateString(),
                    'expires_at' => now()->addYear()->toDateString(),
                ],
                [
                    'product_id' => $productB->id,
                    'plan_id' => $planB->id,
                    'status' => 'active',
                    'starts_at' => now()->subDay()->toDateString(),
                    'expires_at' => now()->addYear()->toDateString(),
                ],
            ],
        ])
        ->assertRedirect();

    $companyAdmin = User::factory()->create([
        'company_id' => $company->id,
        'email' => 'tenant.admin@example.com',
        'password' => Hash::make('password'),
        'is_active' => true,
    ]);
    $companyAdmin->assignRole(RoleName::CompanyAdmin->value);

    $this->postJson('/api/login', [
        'email' => 'tenant.admin@example.com',
        'password' => 'password',
    ])
        ->assertOk()
        ->assertJsonCount(2, 'data.products');
});

test('super admin can sync product features', function () {
    $admin = makeAssignSuperAdmin();
    $company = makeAssignableCompany();
    [$productA, , $planA, , $feature] = makeTwoProductsWithPlans();

    CompanyProduct::query()->create([
        'company_id' => $company->id,
        'product_id' => $productA->id,
        'plan_id' => $planA->id,
        'status' => 'active',
        'starts_at' => now()->subDay(),
        'expires_at' => now()->addYear(),
    ]);

    $this->actingAs($admin, 'super_admin')
        ->put(route('admin.companies.products.features.update', [$company, $productA->id]), [
            'features' => [
                [
                    'feature_id' => $feature->id,
                    'is_enabled' => true,
                ],
            ],
        ])
        ->assertRedirect(route('admin.companies.products.edit', $company));

    expect(DB::table('company_product_feature')
        ->where('company_id', $company->id)
        ->where('product_id', $productA->id)
        ->where('feature_id', $feature->id)
        ->where('is_enabled', true)
        ->exists())->toBeTrue();
});
