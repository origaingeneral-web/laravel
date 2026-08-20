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
})->with(['languages', 'countries', 'states', 'cities', 'areas']);

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
