<?php

use App\Models\Admin\Communication\CommunicationLog;
use App\Models\Auth\SuperAdmin;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SuperAdminSeeder;
use Inertia\Testing\AssertableInertia as Assert;

it('shows whatsapp logs from a path based type route', function (): void {
    $this->seed([
        RolePermissionSeeder::class,
        SuperAdminSeeder::class,
    ]);

    $admin = SuperAdmin::query()->where('email', 'admin@example.com')->firstOrFail();

    CommunicationLog::query()->create([
        'channel' => 'whatsapp',
        'recipient' => '+919999999999',
        'message' => 'WhatsApp message',
        'status' => 'success',
    ]);

    CommunicationLog::query()->create([
        'channel' => 'email',
        'recipient' => 'user@example.com',
        'subject' => 'Email subject',
        'message' => 'Email message',
        'status' => 'success',
    ]);

    $this->actingAs($admin, 'super_admin')
        ->get('/admin/communication/logs/whatsapp')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/communication/logs')
            ->where('filters.type', 'whatsapp')
            ->has('logs.data', 1)
            ->where('logs.data.0.channel', 'whatsapp')
        );
});

it('has path based routes for all communication log types', function (string $type): void {
    $this->seed([
        RolePermissionSeeder::class,
        SuperAdminSeeder::class,
    ]);

    $admin = SuperAdmin::query()->where('email', 'admin@example.com')->firstOrFail();

    $this->actingAs($admin, 'super_admin')
        ->get("/admin/communication/logs/{$type}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/communication/logs')
            ->where('filters.type', $type)
        );
})->with(['email', 'sms', 'whatsapp']);
