<?php

use App\Models\SuperAdmin;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SuperAdminSeeder;
use Inertia\Testing\AssertableInertia as Assert;

test('admin login is available from admin urls', function () {
    $this->get('/admin')
        ->assertRedirect(route('admin.login'));

    $this->get('/admin/login')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin-login')
        );
});

test('authenticated super admin is sent from login to admin dashboard', function () {
    $this->seed([
        RolePermissionSeeder::class,
        SuperAdminSeeder::class,
    ]);

    $admin = SuperAdmin::query()->where('email', 'admin@example.com')->firstOrFail();

    $this->actingAs($admin, 'super_admin')
        ->get('/admin/login')
        ->assertRedirect(route('admin.dashboard'));
});

test('super admin can login from admin login page', function () {
    $this->seed([
        RolePermissionSeeder::class,
        SuperAdminSeeder::class,
    ]);

    $admin = SuperAdmin::query()->where('email', 'admin@example.com')->firstOrFail();

    $this->from('/admin/login')
        ->post('/admin/login', [
            'email' => 'admin@example.com',
            'password' => 'password',
        ])
        ->assertRedirect(route('admin.dashboard'));

    $this->assertAuthenticatedAs($admin, 'super_admin');
});

test('admin dashboard requires super admin authentication', function () {
    $this->get('/admin/dashboard')
        ->assertRedirect(route('admin.login'));
});

test('authenticated super admin can open admin dashboard page', function () {
    $this->seed([
        RolePermissionSeeder::class,
        SuperAdminSeeder::class,
    ]);

    $admin = SuperAdmin::query()->where('email', 'admin@example.com')->firstOrFail();

    $this->actingAs($admin, 'super_admin')
        ->get('/admin/dashboard')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
        );
});
