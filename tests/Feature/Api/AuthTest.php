<?php

use App\Enums\CompanyStatus;
use App\Enums\RoleName;
use App\Models\Admin\Master\Plan;
use App\Models\Company\Company;
use App\Models\Company\CompanyProduct;
use App\Models\Product\Product;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

function makeAuthCompanyWithProduct(): array
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

    $company = Company::query()->create([
        'business_category_id' => $businessCategoryId,
        'company_name' => 'Auth Co',
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
    ]);

    $product = Product::query()->create([
        'name' => 'Auth Product',
        'code' => 'auth_'.Str::lower(Str::random(5)),
        'is_active' => true,
    ]);

    $plan = Plan::query()->create([
        'product_id' => $product->id,
        'plan_name' => 'Auth Plan',
        'price' => 100,
        'duration_in_days' => 365,
        'staff_limit' => 5,
        'tracking_duration' => 24,
        'is_active' => true,
    ]);

    CompanyProduct::query()->create([
        'company_id' => $company->id,
        'product_id' => $product->id,
        'plan_id' => $plan->id,
        'status' => 'active',
        'starts_at' => now()->subDay(),
        'expires_at' => now()->addYear(),
    ]);

    return [$company, $product];
}

test('api login returns token user roles permissions company and products', function () {
    [$company, $product] = makeAuthCompanyWithProduct();

    $user = User::factory()->create([
        'company_id' => $company->id,
        'email' => 'api.user@example.com',
        'password' => Hash::make('password'),
        'is_active' => true,
    ]);
    $user->assignRole(RoleName::CompanyAdmin->value);

    $response = $this->postJson('/api/login', [
        'email' => 'api.user@example.com',
        'password' => 'password',
    ]);

    $response
        ->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'token',
                'token_type',
                'user' => [
                    'id',
                    'email',
                    'roles',
                    'permissions',
                ],
                'company' => [
                    'id',
                ],
                'products',
            ],
        ])
        ->assertJsonPath('data.user.roles.0', RoleName::CompanyAdmin->value)
        ->assertJsonPath('data.company.id', $company->id)
        ->assertJsonPath('data.products.0.id', $product->id)
        ->assertJsonMissingPath('data.user.password');
});

test('api login rejects invalid credentials', function () {
    User::factory()->create([
        'email' => 'api.user@example.com',
        'password' => Hash::make('password'),
    ]);

    $this->postJson('/api/login', [
        'email' => 'api.user@example.com',
        'password' => 'wrong-password',
    ])
        ->assertUnprocessable()
        ->assertJsonPath('success', false)
        ->assertJsonStructure(['success', 'message', 'errors']);
});

test('api login rejects inactive users', function () {
    [$company] = makeAuthCompanyWithProduct();

    $user = User::factory()->inactive()->create([
        'company_id' => $company->id,
        'email' => 'inactive@example.com',
        'password' => Hash::make('password'),
    ]);
    $user->assignRole(RoleName::Employee->value);

    $this->postJson('/api/login', [
        'email' => 'inactive@example.com',
        'password' => 'password',
    ])
        ->assertUnprocessable()
        ->assertJsonPath('success', false);
});

test('api me requires authentication', function () {
    $this->getJson('/api/me')
        ->assertUnauthorized()
        ->assertJsonPath('success', false);
});

test('api me returns authenticated user with products', function () {
    [$company, $product] = makeAuthCompanyWithProduct();

    $user = User::factory()->create([
        'company_id' => $company->id,
    ]);
    $user->assignRole(RoleName::CompanyAdmin->value);
    $token = $user->createToken('api')->plainTextToken;

    $this->withToken($token)
        ->getJson('/api/me')
        ->assertOk()
        ->assertJsonPath('data.user.email', $user->email)
        ->assertJsonPath('data.user.roles.0', RoleName::CompanyAdmin->value)
        ->assertJsonPath('data.products.0.id', $product->id);
});

test('api logout revokes current token', function () {
    $user = User::factory()->create();
    $token = $user->createToken('api')->plainTextToken;

    $this->withToken($token)
        ->postJson('/api/logout')
        ->assertOk()
        ->assertJsonPath('success', true);

    expect(PersonalAccessToken::query()->count())->toBe(0);

    $this->app['auth']->forgetGuards();

    $this->withToken($token)
        ->getJson('/api/me')
        ->assertUnauthorized();
});
