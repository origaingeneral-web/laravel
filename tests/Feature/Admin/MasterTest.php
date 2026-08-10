<?php

use App\Models\SuperAdmin;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SuperAdminSeeder;
use Illuminate\Support\Facades\DB;

beforeEach(function (): void {
    $this->seed([
        RolePermissionSeeder::class,
        SuperAdminSeeder::class,
    ]);

    $this->superAdmin = SuperAdmin::query()->where('email', 'admin@example.com')->firstOrFail();
});

test('super admin can access generic master index pages', function (string $entity): void {
    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->get(route('admin.master.index', ['entity' => $entity]));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/masters/index')
            ->where('entity', $entity)
        );
})->with(['languages', 'countries', 'states', 'cities', 'areas', 'plans']);

test('super admin can store, update, and delete languages master record', function (): void {
    // Store
    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->post(route('admin.master.store', ['entity' => 'languages']), [
            'language' => 'French',
            'code' => 'fr',
        ]);

    $response->assertRedirect(route('admin.master.index', ['entity' => 'languages']));
    $this->assertDatabaseHas('languages', ['language' => 'French', 'code' => 'fr']);

    $id = DB::table('languages')->where('language', 'French')->value('id');

    // Update
    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->put(route('admin.master.update', ['entity' => 'languages', 'id' => $id]), [
            'language' => 'French (Canadian)',
            'code' => 'fr-ca',
        ]);

    $response->assertRedirect(route('admin.master.index', ['entity' => 'languages']));
    $this->assertDatabaseHas('languages', ['id' => $id, 'language' => 'French (Canadian)', 'code' => 'fr-ca']);

    // Delete
    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->delete(route('admin.master.destroy', ['entity' => 'languages', 'id' => $id]));

    $response->assertRedirect(route('admin.master.index', ['entity' => 'languages']));
    $this->assertDatabaseMissing('languages', ['id' => $id]);
});

test('super admin can store, update, and delete countries master record', function (): void {
    // Store
    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->post(route('admin.master.store', ['entity' => 'countries']), [
            'country' => 'Testland',
            'iso3' => 'TSL',
            'phone_code' => '999',
        ]);

    $response->assertRedirect(route('admin.master.index', ['entity' => 'countries']));
    $this->assertDatabaseHas('countries', ['country' => 'Testland', 'iso3' => 'TSL']);

    $id = DB::table('countries')->where('country', 'Testland')->value('id');

    // Update
    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->put(route('admin.master.update', ['entity' => 'countries', 'id' => $id]), [
            'country' => 'Testland Prime',
            'iso3' => 'TLP',
            'phone_code' => '998',
        ]);

    $response->assertRedirect(route('admin.master.index', ['entity' => 'countries']));
    $this->assertDatabaseHas('countries', ['id' => $id, 'country' => 'Testland Prime']);

    // Delete
    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->delete(route('admin.master.destroy', ['entity' => 'countries', 'id' => $id]));

    $response->assertRedirect(route('admin.master.index', ['entity' => 'countries']));
    $this->assertDatabaseMissing('countries', ['id' => $id]);
});

test('super admin can bulk import states, cities, and areas', function (): void {
    $countryId = DB::table('countries')->insertGetId(['country' => 'Importland', 'iso3' => 'IMP', 'phone_code' => '123']);

    // 1. Import States
    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->post(route('admin.master.import', ['entity' => 'states']), [
            'rows' => [
                ['state' => 'Import State 1', 'country' => 'Importland', 'code' => 'IS1'],
                ['state' => 'Import State 2', 'country_id' => $countryId, 'code' => 'IS2'],
            ],
        ]);

    $response->assertRedirect(route('admin.master.index', ['entity' => 'states']));
    $this->assertDatabaseHas('states', ['state' => 'Import State 1', 'country_id' => $countryId]);
    $this->assertDatabaseHas('states', ['state' => 'Import State 2', 'country_id' => $countryId]);

    $stateId = DB::table('states')->where('state', 'Import State 1')->value('id');

    // 2. Import Cities
    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->post(route('admin.master.import', ['entity' => 'cities']), [
            'rows' => [
                ['city' => 'Import City 1', 'state' => 'Import State 1', 'is_top_city' => true],
                ['city' => 'Import City 2', 'state_id' => $stateId, 'is_top_city' => false],
            ],
        ]);

    $response->assertRedirect(route('admin.master.index', ['entity' => 'cities']));
    $this->assertDatabaseHas('cities', ['city' => 'Import City 1', 'state_id' => $stateId, 'is_top_city' => 1]);
    $this->assertDatabaseHas('cities', ['city' => 'Import City 2', 'state_id' => $stateId, 'is_top_city' => 0]);

    $cityId = DB::table('cities')->where('city', 'Import City 1')->value('id');

    // 3. Import Areas
    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->post(route('admin.master.import', ['entity' => 'areas']), [
            'rows' => [
                ['area' => 'Import Area 1', 'city' => 'Import City 1', 'zipcode' => '99001'],
                ['area' => 'Import Area 2', 'city_id' => $cityId, 'zipcode' => '99002'],
            ],
        ]);

    $response->assertRedirect(route('admin.master.index', ['entity' => 'areas']));
    $this->assertDatabaseHas('areas', ['area' => 'Import Area 1', 'city_id' => $cityId, 'zipcode' => '99001']);
    $this->assertDatabaseHas('areas', ['area' => 'Import Area 2', 'city_id' => $cityId, 'zipcode' => '99002']);
});
