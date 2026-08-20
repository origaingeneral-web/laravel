<?php

use App\Models\Admin\Template\NotificationTemplate;
use App\Models\Auth\SuperAdmin;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SuperAdminSeeder;
use Inertia\Testing\AssertableInertia as Assert;

it('shows email templates from a path based channel route', function (): void {
    $this->seed([
        RolePermissionSeeder::class,
        SuperAdminSeeder::class,
    ]);

    $admin = SuperAdmin::query()->where('email', 'admin@example.com')->firstOrFail();

    NotificationTemplate::query()->create([
        'name' => 'Email only',
        'purpose' => 'email_only',
        'is_email_active' => true,
        'email_subject' => 'Subject',
        'email_body' => 'Body',
        'is_sms_active' => false,
        'is_whatsapp_active' => false,
    ]);

    NotificationTemplate::query()->create([
        'name' => 'SMS only',
        'purpose' => 'sms_only',
        'is_email_active' => false,
        'is_sms_active' => true,
        'sms_body' => 'SMS body',
        'is_whatsapp_active' => false,
    ]);

    $this->actingAs($admin, 'super_admin')
        ->get('/admin/templates/email')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/templates/index')
            ->where('filters.channel', 'email')
            ->has('templates.data', 1)
            ->where('templates.data.0.name', 'Email only')
        );
});

it('has path based routes for all template channels', function (string $channel): void {
    $this->seed([
        RolePermissionSeeder::class,
        SuperAdminSeeder::class,
    ]);

    $admin = SuperAdmin::query()->where('email', 'admin@example.com')->firstOrFail();

    $this->actingAs($admin, 'super_admin')
        ->get("/admin/templates/{$channel}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/templates/index')
            ->where('filters.channel', $channel)
        );
})->with(['email', 'sms', 'whatsapp']);
