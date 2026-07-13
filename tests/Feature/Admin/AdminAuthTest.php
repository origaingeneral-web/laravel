<?php

use App\Enums\RoleName;
use App\Models\SuperAdmin;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\Hash;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('admin login screen can be rendered', function () {
    $this->get(route('admin.login'))->assertOk();
});

test('super admin can authenticate', function () {
    $admin = SuperAdmin::query()->create([
        'name' => 'Super Admin',
        'email' => 'admin@example.com',
        'number' => '9999999999',
        'password' => Hash::make('password'),
    ]);
    $admin->assignRole(RoleName::SuperAdmin->value);

    $response = $this->post(route('admin.login.store'), [
        'email' => 'admin@example.com',
        'password' => 'password',
    ]);

    $response->assertRedirect(route('admin.dashboard'));
    $this->assertAuthenticated('super_admin');
});

test('admin login rejects users without admin access', function () {
    SuperAdmin::query()->create([
        'name' => 'No Role Admin',
        'email' => 'norole@example.com',
        'number' => '9999999998',
        'password' => Hash::make('password'),
    ]);

    $this->post(route('admin.login.store'), [
        'email' => 'norole@example.com',
        'password' => 'password',
    ])->assertSessionHasErrors('email');

    $this->assertGuest('super_admin');
});

test('super admin can logout', function () {
    $admin = SuperAdmin::query()->create([
        'name' => 'Super Admin',
        'email' => 'admin@example.com',
        'number' => '9999999999',
        'password' => Hash::make('password'),
    ]);
    $admin->assignRole(RoleName::SuperAdmin->value);

    $this->actingAs($admin, 'super_admin')
        ->post(route('admin.logout'))
        ->assertRedirect(route('admin.login'));

    $this->assertGuest('super_admin');
});
