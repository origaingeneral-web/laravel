<?php

use App\Models\Auth\SuperAdmin;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;

beforeEach(function (): void {
    $this->seed([
        RolePermissionSeeder::class,
        SuperAdminSeeder::class,
    ]);

    $this->superAdmin = SuperAdmin::query()->where('email', 'admin@example.com')->firstOrFail();
});

test('super admin can access generic master index pages', function (string $entity): void {
    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->get(route("admin.master.{$entity}.index"));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/masters/index')
            ->where('entity', $entity)
        );
})->with(['languages', 'countries', 'states', 'cities', 'areas', 'plans']);

test('super admin can store, update, and delete languages master record', function (): void {
    Sanctum::actingAs($this->superAdmin, ['*']);

    // Store
    $response = $this->postJson(route('api.v1.admin.master.languages.store'), [
        'language' => 'French',
        'code' => 'fr',
    ]);

    $response->assertCreated();
    $this->assertDatabaseHas('languages', ['language' => 'French', 'code' => 'fr']);

    $id = DB::table('languages')->where('language', 'French')->value('id');

    // Update
    $response = $this->putJson(route('api.v1.admin.master.languages.update', ['language' => $id]), [
        'language' => 'French (Canadian)',
        'code' => 'fr-ca',
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('languages', ['id' => $id, 'language' => 'French (Canadian)', 'code' => 'fr-ca']);

    // Delete
    $response = $this->deleteJson(route('api.v1.admin.master.languages.destroy', ['language' => $id]));

    $response->assertOk();
    $this->assertDatabaseMissing('languages', ['id' => $id]);
});

test('super admin can store, update, and delete countries master record', function (): void {
    Sanctum::actingAs($this->superAdmin, ['*']);

    // Store
    $response = $this->postJson(route('api.v1.admin.master.countries.store'), [
        'country' => 'Testland',
        'iso3' => 'TSL',
        'phone_code' => '999',
    ]);

    $response->assertCreated();
    $this->assertDatabaseHas('countries', ['country' => 'Testland', 'iso3' => 'TSL']);

    $id = DB::table('countries')->where('country', 'Testland')->value('id');

    // Update
    $response = $this->putJson(route('api.v1.admin.master.countries.update', ['country' => $id]), [
        'country' => 'Testland Prime',
        'iso3' => 'TLP',
        'phone_code' => '998',
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('countries', ['id' => $id, 'country' => 'Testland Prime']);

    // Delete
    $response = $this->deleteJson(route('api.v1.admin.master.countries.destroy', ['country' => $id]));

    $response->assertOk();
    $this->assertDatabaseMissing('countries', ['id' => $id]);
});

test('super admin can bulk import states, cities, and areas', function (): void {
    Sanctum::actingAs($this->superAdmin, ['*']);

    $countryId = DB::table('countries')->insertGetId(['country' => 'Importland', 'iso3' => 'IMP', 'phone_code' => '123']);

    // 1. Import States
    $response = $this->postJson(route('api.v1.admin.master.states.import'), [
        'rows' => [
            ['state' => 'Import State 1', 'country' => 'Importland', 'code' => 'IS1'],
            ['state' => 'Import State 2', 'country_id' => $countryId, 'code' => 'IS2'],
        ],
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('states', ['state' => 'Import State 1', 'country_id' => $countryId]);
    $this->assertDatabaseHas('states', ['state' => 'Import State 2', 'country_id' => $countryId]);

    $stateId = DB::table('states')->where('state', 'Import State 1')->value('id');

    // 2. Import Cities
    $response = $this->postJson(route('api.v1.admin.master.cities.import'), [
        'rows' => [
            ['city' => 'Import City 1', 'state' => 'Import State 1', 'is_top_city' => true],
            ['city' => 'Import City 2', 'state_id' => $stateId, 'is_top_city' => false],
        ],
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('cities', ['city' => 'Import City 1', 'state_id' => $stateId, 'is_top_city' => 1]);
    $this->assertDatabaseHas('cities', ['city' => 'Import City 2', 'state_id' => $stateId, 'is_top_city' => 0]);

    $cityId = DB::table('cities')->where('city', 'Import City 1')->value('id');

    // 3. Import Areas
    $response = $this->postJson(route('api.v1.admin.master.areas.import'), [
        'rows' => [
            ['area' => 'Import Area 1', 'city' => 'Import City 1', 'zipcode' => '99001'],
            ['area' => 'Import Area 2', 'city_id' => $cityId, 'zipcode' => '99002'],
        ],
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('areas', ['area' => 'Import Area 1', 'city_id' => $cityId, 'zipcode' => '99001']);
    $this->assertDatabaseHas('areas', ['area' => 'Import Area 2', 'city_id' => $cityId, 'zipcode' => '99002']);
});

test('super admin can fetch products and create plan with multi-product per-user costs', function (): void {
    Sanctum::actingAs($this->superAdmin, ['*']);

    $prod1Id = DB::table('products')->insertGetId([
        'name' => 'CRM Suite',
        'code' => 'crm_suite',
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $prod2Id = DB::table('products')->insertGetId([
        'name' => 'Field Force',
        'code' => 'field_force',
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    // 1. Fetch products list
    $prodResponse = $this->getJson(route('api.v1.admin.master.products'));
    $prodResponse->assertOk()
        ->assertJsonStructure(['data']);

    // 2. Create Plan with multiple products and product-wise limits
    $createResponse = $this->postJson(route('api.v1.admin.master.plans.store'), [
        'plan_name' => 'Enterprise Multi-Product Plan',
        'duration_in_days' => 365,
        'tracking_duration' => 24,
        'remarks' => 'Full enterprise package',
        'products' => [
            ['product_id' => $prod1Id, 'price_per_user' => 25.50, 'staff_limit' => 30],
            ['product_id' => $prod2Id, 'price_per_user' => 15.00, 'staff_limit' => 50],
        ],
    ]);

    $createResponse->assertCreated()
        ->assertJsonPath('data.plan_name', 'Enterprise Multi-Product Plan');

    $planId = $createResponse->json('data.id');

    $this->assertDatabaseHas('plans', [
        'id' => $planId,
        'plan_name' => 'Enterprise Multi-Product Plan',
        'duration_in_days' => 365,
        'tracking_duration' => 24,
    ]);

    $this->assertDatabaseHas('plan_products', [
        'plan_id' => $planId,
        'product_id' => $prod1Id,
        'price_per_user' => 25.50,
        'staff_limit' => 30,
    ]);

    $this->assertDatabaseHas('plan_products', [
        'plan_id' => $planId,
        'product_id' => $prod2Id,
        'price_per_user' => 15.00,
        'staff_limit' => 50,
    ]);

    // 3. Update Plan
    $updateResponse = $this->putJson(route('api.v1.admin.master.plans.update', ['plan' => $planId]), [
        'plan_name' => 'Enterprise Multi-Product Plan (Updated)',
        'duration_in_days' => 180,
        'tracking_duration' => 18,
        'remarks' => 'Updated package',
        'products' => [
            ['product_id' => $prod1Id, 'price_per_user' => 30.00, 'staff_limit' => 100],
        ],
    ]);

    $updateResponse->assertOk()
        ->assertJsonPath('data.plan_name', 'Enterprise Multi-Product Plan (Updated)');

    $this->assertDatabaseHas('plans', [
        'id' => $planId,
        'plan_name' => 'Enterprise Multi-Product Plan (Updated)',
        'duration_in_days' => 180,
        'tracking_duration' => 18,
    ]);

    // Validation: Tracking duration cannot exceed 24 hours
    $invalidResponse = $this->putJson(route('api.v1.admin.master.plans.update', ['plan' => $planId]), [
        'plan_name' => 'Invalid Plan',
        'duration_in_days' => 30,
        'staff_limit' => 10,
        'tracking_duration' => 25, // Invalid > 24
    ]);
    $invalidResponse->assertUnprocessable()
        ->assertJsonValidationErrors(['tracking_duration']);

    $this->assertDatabaseHas('plan_products', [
        'plan_id' => $planId,
        'product_id' => $prod1Id,
        'price_per_user' => 30.00,
        'staff_limit' => 100,
    ]);

    $this->assertDatabaseMissing('plan_products', [
        'plan_id' => $planId,
        'product_id' => $prod2Id,
    ]);

    // 4. Delete Plan
    $deleteResponse = $this->deleteJson(route('api.v1.admin.master.plans.destroy', ['plan' => $planId]));
    $deleteResponse->assertOk();

    $this->assertDatabaseMissing('plans', ['id' => $planId]);
    $this->assertDatabaseMissing('plan_products', ['plan_id' => $planId]);
});
