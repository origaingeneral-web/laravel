<?php

use App\Models\Auth\SuperAdmin;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SuperAdminSeeder;
use Inertia\Testing\AssertableInertia as Assert;

it('shows settings pages from path based group routes', function (string $group): void {
    $this->seed([
        RolePermissionSeeder::class,
        SuperAdminSeeder::class,
    ]);

    $admin = SuperAdmin::query()->where('email', 'admin@example.com')->firstOrFail();

    $this->withSession(['super_admin_secret_verified' => true])
        ->actingAs($admin, 'super_admin')
        ->get("/admin/settings/{$group}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/settings/edit')
            ->where('group', $group)
        );
})->with(['email', 'sms', 'whatsapp', 'payment', 'cron', 'firebase', 'ai', 'location']);

it('redirects legacy settings shortcuts to admin settings paths', function (): void {
    $this->seed([
        RolePermissionSeeder::class,
        SuperAdminSeeder::class,
    ]);

    $admin = SuperAdmin::query()->where('email', 'admin@example.com')->firstOrFail();

    $this->actingAs($admin, 'super_admin')
        ->get('/settings/whatsapp')
        ->assertRedirect('/admin/settings/whatsapp');
});
