<?php

use App\Enums\RoleName;
use App\Models\SuperAdmin;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);
});

test('guests cannot visit admin dashboard', function () {
    $this->get(route('admin.dashboard'))
        ->assertRedirect(route('admin.login'));
});

test('super admin can visit dashboard', function () {
    $admin = SuperAdmin::query()->create([
        'name' => 'Super Admin',
        'email' => 'admin@example.com',
        'number' => '9999999999',
        'password' => Hash::make('password'),
    ]);
    $admin->assignRole(RoleName::SuperAdmin->value);

    $this->actingAs($admin, 'super_admin')
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->has('stats.companies')
            ->has('stats.users')
            ->has('stats.active_plans'));
});
