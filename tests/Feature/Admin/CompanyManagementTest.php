<?php

use App\Enums\CompanyStatus;
use App\Enums\RoleName;
use App\Models\Company;
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

function makeSuperAdminUser(): SuperAdmin
{
    $admin = SuperAdmin::query()->create([
        'name' => 'Super Admin',
        'email' => 'super.'.Str::lower(Str::random(6)).'@example.com',
        'number' => '9999999999',
        'password' => Hash::make('password'),
    ]);
    $admin->assignRole(RoleName::SuperAdmin->value);

    return $admin;
}

/**
 * @return array{business_category_id: int, country_id: int, state_id: int, city_id: int}
 */
function seedLocationLookups(): array
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

    return [
        'business_category_id' => $businessCategoryId,
        'country_id' => $countryId,
        'state_id' => $stateId,
        'city_id' => $cityId,
    ];
}

test('guests cannot visit companies index', function () {
    $this->get(route('admin.companies.index'))
        ->assertRedirect(route('admin.login'));
});

test('super admin can view companies index', function () {
    $admin = makeSuperAdminUser();

    $this->actingAs($admin, 'super_admin')
        ->get(route('admin.companies.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/companies/index')
            ->has('companies'));
});

test('super admin can create company with optional admin user', function () {
    $admin = makeSuperAdminUser();
    $lookups = seedLocationLookups();

    $response = $this->actingAs($admin, 'super_admin')
        ->post(route('admin.companies.store'), [
            ...$lookups,
            'company_name' => 'Acme Industries',
            'company_code' => 'ACME',
            'email' => 'acme@example.com',
            'mobile' => '9999999999',
            'owner_name' => 'Owner',
            'owner_mobile' => '8888888888',
            'pincode' => '400001',
            'address' => 'Mumbai',
            'status' => CompanyStatus::Active->value,
            'create_admin' => true,
            'admin_name' => 'Acme Admin',
            'admin_email' => 'acme.admin@example.com',
            'admin_password' => 'password',
            'admin_password_confirmation' => 'password',
        ]);

    $company = Company::query()->where('company_code', 'ACME')->first();

    expect($company)->not->toBeNull()
        ->and($company?->company_name)->toBe('Acme Industries')
        ->and($company?->status)->toBe(CompanyStatus::Active->value);

    $companyAdmin = User::query()->where('email', 'acme.admin@example.com')->first();

    expect($companyAdmin)->not->toBeNull()
        ->and($companyAdmin?->company_id)->toBe($company?->id)
        ->and($companyAdmin?->hasRole(RoleName::CompanyAdmin->value))->toBeTrue();

    $response->assertRedirect(route('admin.companies.show', $company));
});

test('super admin can update company status', function () {
    $admin = makeSuperAdminUser();
    $lookups = seedLocationLookups();

    $company = Company::query()->create([
        ...$lookups,
        'company_name' => 'Update Co',
        'company_code' => 'UPDT',
        'email' => 'update@example.com',
        'mobile' => '9999999999',
        'owner_name' => 'Owner',
        'owner_mobile' => '8888888888',
        'pincode' => '400001',
        'address' => 'Address',
        'status' => CompanyStatus::Active->value,
        'terms_accepted' => true,
        'terms_accepted_at' => now(),
    ]);

    $this->actingAs($admin, 'super_admin')
        ->put(route('admin.companies.update', $company), [
            'company_name' => 'Updated Co',
            'status' => CompanyStatus::Inactive->value,
        ])
        ->assertRedirect(route('admin.companies.show', $company));

    expect($company->fresh()->company_name)->toBe('Updated Co')
        ->and($company->fresh()->status)->toBe(CompanyStatus::Inactive->value);
});
