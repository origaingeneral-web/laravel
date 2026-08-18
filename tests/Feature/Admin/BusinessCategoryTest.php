<?php

use App\Models\Admin\Master\BusinessCategory;
use App\Models\Auth\SuperAdmin;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SuperAdminSeeder;

beforeEach(function (): void {
    $this->seed([
        RolePermissionSeeder::class,
        SuperAdminSeeder::class,
    ]);

    $this->superAdmin = SuperAdmin::query()->where('email', 'admin@example.com')->firstOrFail();
});

test('super admin can access business categories index page', function (): void {
    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->get(route('admin.master.business-categories.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page->component('admin/masters/business-categories/index'));
});

test('super admin can store a new business category', function (): void {
    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->post(route('admin.master.business-categories.store'), [
            'category' => 'Automotive',
        ]);

    $response->assertRedirect(route('admin.master.business-categories.index'));

    $this->assertDatabaseHas('business_categories', [
        'category' => 'Automotive',
    ]);
});

test('super admin can update an existing business category', function (): void {
    $category = BusinessCategory::query()->create([
        'category' => 'Logistics Old',
    ]);

    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->put(route('admin.master.business-categories.update', $category), [
            'category' => 'Logistics New',
        ]);

    $response->assertRedirect(route('admin.master.business-categories.index'));

    $this->assertDatabaseHas('business_categories', [
        'id' => $category->id,
        'category' => 'Logistics New',
    ]);
});

test('super admin can delete a business category', function (): void {
    $category = BusinessCategory::query()->create([
        'category' => 'Temporary Category',
    ]);

    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->delete(route('admin.master.business-categories.destroy', $category));

    $response->assertRedirect(route('admin.master.business-categories.index'));

    $this->assertDatabaseMissing('business_categories', [
        'id' => $category->id,
    ]);
});
