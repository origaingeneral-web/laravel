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

function makeCompanyForEmployees(array $overrides = []): Company
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
        'company_name' => 'Staff Co',
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

function subscribeEmployeeCompany(Company $company): CompanyProduct
{
    $product = Product::query()->create([
        'name' => 'Staff Product',
        'code' => 'staff_'.Str::lower(Str::random(5)),
        'is_active' => true,
    ]);

    $plan = Plan::query()->create([
        'product_id' => $product->id,
        'plan_name' => 'Staff Plan',
        'price' => 50,
        'duration_in_days' => 365,
        'staff_limit' => 20,
        'tracking_duration' => 24,
        'is_active' => true,
    ]);

    return CompanyProduct::query()->create([
        'company_id' => $company->id,
        'product_id' => $product->id,
        'plan_id' => $plan->id,
        'status' => 'active',
        'starts_at' => now()->subDay(),
        'expires_at' => now()->addYear(),
    ]);
}

function makeStaffUser(Company $company, string $role = 'company_admin', array $overrides = []): User
{
    $user = User::factory()->create(array_merge([
        'company_id' => $company->id,
        'is_active' => true,
    ], $overrides));

    $user->assignRole($role === 'employee' ? RoleName::Employee->value : RoleName::CompanyAdmin->value);

    return $user->fresh();
}

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('company admin can create list and manage employees with product access', function () {
    $company = makeCompanyForEmployees();
    $subscription = subscribeEmployeeCompany($company);
    $admin = makeStaffUser($company);

    $this->withToken($admin->createToken('api')->plainTextToken)
        ->postJson('/api/v1/company/employees', [
            'name' => 'New Employee',
            'email' => 'new.employee@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'product_ids' => [$subscription->product_id],
        ])
        ->assertCreated()
        ->assertJsonPath('data.employee.email', 'new.employee@example.com')
        ->assertJsonPath('data.employee.roles.0', RoleName::Employee->value)
        ->assertJsonPath('data.employee.product_ids.0', $subscription->product_id);

    $employee = User::query()->where('email', 'new.employee@example.com')->first();

    expect(UserProductAccess::query()
        ->where('user_id', $employee->id)
        ->where('product_id', $subscription->product_id)
        ->exists())->toBeTrue();

    $this->withToken($admin->createToken('api')->plainTextToken)
        ->getJson('/api/v1/company/employees')
        ->assertOk()
        ->assertJsonPath('success', true);

    $this->withToken($admin->createToken('api')->plainTextToken)
        ->patchJson("/api/v1/company/employees/{$employee->id}/status", [
            'is_active' => false,
        ])
        ->assertOk()
        ->assertJsonPath('data.employee.is_active', false);

    expect($employee->fresh()->is_active)->toBeFalse();
});

test('employee cannot manage staff', function () {
    $company = makeCompanyForEmployees();
    subscribeEmployeeCompany($company);
    $employee = makeStaffUser($company, 'employee');

    $this->withToken($employee->createToken('api')->plainTextToken)
        ->getJson('/api/v1/company/employees')
        ->assertForbidden();

    $this->withToken($employee->createToken('api')->plainTextToken)
        ->postJson('/api/v1/company/employees', [
            'name' => 'X',
            'email' => 'x@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])
        ->assertForbidden();
});

test('cannot access employee from another company', function () {
    $companyA = makeCompanyForEmployees();
    $companyB = makeCompanyForEmployees();
    subscribeEmployeeCompany($companyA);
    subscribeEmployeeCompany($companyB);
    $adminA = makeStaffUser($companyA);
    $employeeB = makeStaffUser($companyB, 'employee');

    $this->withToken($adminA->createToken('api')->plainTextToken)
        ->getJson("/api/v1/company/employees/{$employeeB->id}")
        ->assertNotFound();
});
