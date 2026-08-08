<?php

use App\Enums\RoleName;
use App\Models\SuperAdmin;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SuperAdminMasterSeeder;
use Database\Seeders\SuperAdminSeeder;
use Illuminate\Support\Facades\Hash;

test('super admin seeder creates a login-ready admin user', function () {
    $this->seed([
        RolePermissionSeeder::class,
        SuperAdminSeeder::class,
    ]);

    $admin = SuperAdmin::query()->where('email', 'admin@example.com')->firstOrFail();

    expect($admin->name)->toBe('Super Admin')
        ->and($admin->number)->toBe('9999999999')
        ->and(Hash::check('password', $admin->password))->toBeTrue()
        ->and($admin->hasRole(RoleName::SuperAdmin->value))->toBeTrue();
});

test('super admin master seeder creates lookup data', function () {
    $this->seed(SuperAdminMasterSeeder::class);

    $this->assertDatabaseHas('business_categories', ['category' => 'CRM']);
    $this->assertDatabaseHas('languages', ['language' => 'English', 'code' => 'en']);
    $this->assertDatabaseHas('countries', ['country' => 'India', 'iso3' => 'IND']);
    $this->assertDatabaseHas('states', ['state' => 'Maharashtra', 'code' => 'MH']);
    $this->assertDatabaseHas('cities', ['city' => 'Mumbai', 'is_top_city' => 1]);
    $this->assertDatabaseHas('areas', ['area' => 'Andheri East', 'zipcode' => '400069']);
    $this->assertDatabaseHas('products', ['name' => 'F2 Super', 'code' => 'f2_super']);
    $this->assertDatabaseHas('plans', ['plan_name' => 'F2 Starter', 'staff_limit' => 25]);
});
