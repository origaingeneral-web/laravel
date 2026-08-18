<?php

use App\Enums\RoleName;
use App\Models\Auth\SuperAdmin;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

beforeEach(function (): void {
    Role::findOrCreate(RoleName::SuperAdmin->value, 'super_admin');

    $this->admin = SuperAdmin::create([
        'name' => 'Security Admin',
        'email' => 'secadmin@example.com',
        'number' => '8888888888',
        'password' => Hash::make('password123'),
        'secret_password' => Hash::make('mySecretPass123'),
    ]);

    $this->admin->assignRole(RoleName::SuperAdmin->value);
});

test('unverified super admin accessing settings is redirected to secret verification challenge', function (): void {
    $response = $this->actingAs($this->admin, 'super_admin')
        ->get('/admin/settings/email');

    $response->assertRedirect('/admin/secret-access/verify?intended=http%3A%2F%2Flocalhost%2Fadmin%2Fsettings%2Femail');
});

test('unverified super admin accessing system is redirected to secret verification challenge', function (): void {
    $response = $this->actingAs($this->admin, 'super_admin')
        ->get('/admin/system/server');

    $response->assertRedirect('/admin/secret-access/verify?intended=http%3A%2F%2Flocalhost%2Fadmin%2Fsystem%2Fserver');
});

test('submitting wrong secret password fails', function (): void {
    $response = $this->actingAs($this->admin, 'super_admin')
        ->post('/admin/secret-access/verify', [
            'secret_password' => 'wrongPassword',
            'intended' => '/admin/settings/email',
        ]);

    $response->assertSessionHasErrors('secret_password');
    $this->assertFalse(session('super_admin_secret_verified', false));
});

test('submitting correct secret password grants access to settings and system continuously', function (): void {
    $response = $this->actingAs($this->admin, 'super_admin')
        ->post('/admin/secret-access/verify', [
            'secret_password' => 'mySecretPass123',
            'intended' => '/admin/settings/email',
        ]);

    $response->assertRedirect('/admin/settings/email');
    $this->assertTrue(session('super_admin_secret_verified'));

    // Can access settings
    $settingsResponse = $this->actingAs($this->admin, 'super_admin')
        ->get('/admin/settings/email');
    $settingsResponse->assertOk();

    // Can access system continuously
    $systemResponse = $this->actingAs($this->admin, 'super_admin')
        ->get('/admin/system/server');
    $systemResponse->assertOk();
});

test('navigating to other pages automatically expires secret verification', function (): void {
    // 1. Verify secret password
    $this->actingAs($this->admin, 'super_admin')
        ->post('/admin/secret-access/verify', [
            'secret_password' => 'mySecretPass123',
            'intended' => '/admin/settings/email',
        ]);

    $this->assertTrue(session('super_admin_secret_verified'));

    // 2. Navigate to Dashboard (another page)
    $this->actingAs($this->admin, 'super_admin')
        ->get('/admin/dashboard');

    // 3. Secret verification is now expired
    $this->assertNull(session('super_admin_secret_verified'));

    // 4. Accessing settings again requires verification challenge
    $response = $this->actingAs($this->admin, 'super_admin')
        ->get('/admin/settings/email');

    $response->assertRedirect('/admin/secret-access/verify?intended=http%3A%2F%2Flocalhost%2Fadmin%2Fsettings%2Femail');
});
