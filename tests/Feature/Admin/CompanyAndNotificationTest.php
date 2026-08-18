<?php

use App\Models\Auth\SuperAdmin;

beforeEach(function () {
    $this->superAdmin = SuperAdmin::query()->create([
        'name' => 'Super Admin',
        'email' => 'superadmin_test@test.com',
        'number' => '9876543210',
        'password' => 'password123',
    ]);
});

test('super admin can access company index without 403 forbidden', function () {
    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->get(route('admin.companies.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/companies/index'));
});

test('super admin can access company create page', function () {
    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->get(route('admin.companies.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('admin/companies/create'));
});

test('super admin can access firebase notifications index with lookup data for modal form', function () {
    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->get(route('admin.notifications.firebase.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/communication/notifications/firebase/index')
        ->has('notifications')
        ->has('companies')
        ->has('users')
    );
});

test('super admin can access panel notifications index with lookup data for modal form', function () {
    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->get(route('admin.notifications.panel.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('admin/communication/notifications/panel/index')
        ->has('notifications')
        ->has('companies')
        ->has('users')
    );
});

test('inertia shares app_debug boolean to client', function () {
    config()->set('app.debug', false);

    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->get(route('admin.companies.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->where('app_debug', false));

    config()->set('app.debug', true);

    $responseTrue = $this->actingAs($this->superAdmin, 'super_admin')
        ->get(route('admin.companies.index'));

    $responseTrue->assertOk();
    $responseTrue->assertInertia(fn ($page) => $page->where('app_debug', true));
});
