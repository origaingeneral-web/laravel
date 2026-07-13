<?php

use App\Enums\CompanyStatus;
use App\Enums\RoleName;
use App\Models\Company;
use App\Models\CompanyProduct;
use App\Models\Plan;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

function makeCompany(array $overrides = []): Company
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
        'company_name' => 'Acme Corp',
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

function subscribeCompanyToProduct(Company $company, ?Product $product = null, array $overrides = []): CompanyProduct
{
    $product ??= Product::query()->create([
        'name' => 'Product '.Str::random(4),
        'code' => 'prd_'.Str::lower(Str::random(6)),
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $plan = Plan::query()->create([
        'product_id' => $product->id,
        'plan_name' => 'Plan '.$product->code,
        'price' => 100,
        'duration_in_days' => 365,
        'staff_limit' => 10,
        'tracking_duration' => 24,
        'is_active' => true,
    ]);

    return CompanyProduct::query()->create(array_merge([
        'company_id' => $company->id,
        'product_id' => $product->id,
        'plan_id' => $plan->id,
        'status' => 'active',
        'starts_at' => now()->subDay(),
        'expires_at' => now()->addYear(),
        'staff_limit' => 10,
    ], $overrides));
}

function makeCompanyUser(Company $company, string $role = 'company_admin', array $overrides = []): User
{
    $user = User::factory()->create(array_merge([
        'company_id' => $company->id,
        'is_active' => true,
    ], $overrides));

    $user->assignRole($role === 'employee' ? RoleName::Employee->value : RoleName::CompanyAdmin->value);

    return $user->fresh();
}

function actingAsCompanyApi(User $user)
{
    return test()->withToken($user->createToken('api')->plainTextToken);
}

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('company admin can view and update profile', function () {
    $company = makeCompany(['company_name' => 'Original Name']);
    subscribeCompanyToProduct($company);
    $admin = makeCompanyUser($company);

    actingAsCompanyApi($admin)
        ->getJson('/api/v1/company/profile')
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.company.company_name', 'Original Name');

    actingAsCompanyApi($admin)
        ->putJson('/api/v1/company/profile', [
            'company_name' => 'Updated Name',
            'mobile' => '8888888888',
        ])
        ->assertOk()
        ->assertJsonPath('data.company.company_name', 'Updated Name')
        ->assertJsonPath('data.company.mobile', '8888888888');

    expect($company->fresh()->company_name)->toBe('Updated Name');
});

test('company profile update cannot change status', function () {
    $company = makeCompany(['status' => CompanyStatus::Active->value]);
    subscribeCompanyToProduct($company);
    $admin = makeCompanyUser($company);

    actingAsCompanyApi($admin)
        ->putJson('/api/v1/company/profile', [
            'company_name' => 'Still Active',
            'status' => CompanyStatus::Disabled->value,
        ])
        ->assertOk();

    expect($company->fresh()->status)->toBe(CompanyStatus::Active->value);
});

test('employee can view profile but cannot update', function () {
    $company = makeCompany();
    subscribeCompanyToProduct($company);
    $employee = makeCompanyUser($company, 'employee');

    actingAsCompanyApi($employee)
        ->getJson('/api/v1/company/profile')
        ->assertOk();

    actingAsCompanyApi($employee)
        ->putJson('/api/v1/company/profile', [
            'company_name' => 'Hacked',
        ])
        ->assertForbidden();
});

test('inactive company users cannot access company apis', function () {
    $company = makeCompany(['status' => CompanyStatus::Inactive->value]);
    subscribeCompanyToProduct($company);
    $admin = makeCompanyUser($company);

    actingAsCompanyApi($admin)
        ->getJson('/api/v1/company/profile')
        ->assertForbidden();
});

test('login includes company summary products and blocks inactive company', function () {
    $company = makeCompany();
    $subscription = subscribeCompanyToProduct($company);
    makeCompanyUser($company, 'company_admin', [
        'email' => 'login.admin@example.com',
        'password' => 'password',
    ]);

    $this->postJson('/api/login', [
        'email' => 'login.admin@example.com',
        'password' => 'password',
    ])
        ->assertOk()
        ->assertJsonPath('data.company.id', $company->id)
        ->assertJsonPath('data.user.email', 'login.admin@example.com')
        ->assertJsonPath('data.products.0.id', $subscription->product_id);

    $company->update(['status' => CompanyStatus::Inactive->value]);

    $this->postJson('/api/login', [
        'email' => 'login.admin@example.com',
        'password' => 'password',
    ])->assertUnprocessable();
});

test('login blocks when all product subscriptions are expired', function () {
    $company = makeCompany();
    subscribeCompanyToProduct($company, overrides: [
        'starts_at' => now()->subMonths(2),
        'expires_at' => now()->subDay(),
        'status' => 'active',
    ]);

    makeCompanyUser($company, 'company_admin', [
        'email' => 'expired@example.com',
        'password' => 'password',
    ]);

    $this->postJson('/api/login', [
        'email' => 'expired@example.com',
        'password' => 'password',
    ])->assertUnprocessable();
});
