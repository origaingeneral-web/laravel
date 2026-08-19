<?php

use App\Models\Admin\Feature\Feature;
use App\Models\Auth\SuperAdmin;
use App\Models\Product\Product;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\SuperAdminSeeder;

beforeEach(function (): void {
    $this->seed([
        RolePermissionSeeder::class,
        SuperAdminSeeder::class,
    ]);

    $this->superAdmin = SuperAdmin::query()->where('email', 'admin@example.com')->firstOrFail();
    $this->product = Product::query()->create([
        'name' => 'Test Product',
        'code' => 'test_product',
        'is_active' => true,
    ]);
});

test('super admin can view features index page', function (): void {
    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->get(route('admin.features.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/features/index')
            ->has('features.data')
            ->has('products')
        );
});

test('super admin can create a core feature with zero price', function (): void {
    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->post(route('admin.features.store'), [
            'product_id' => $this->product->id,
            'name' => 'Attendance Management',
            'description' => 'Core attendance tracking',
            'is_addon' => false,
            'is_active' => true,
        ]);

    $response->assertRedirect(route('admin.features.index'));

    $this->assertDatabaseHas('features', [
        'product_id' => $this->product->id,
        'name' => 'Attendance Management',
        'is_addon' => 0,
        'price' => 0.00,
        'is_active' => 1,
    ]);
});

test('super admin can create an addon feature with INR price', function (): void {
    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->post(route('admin.features.store'), [
            'product_id' => $this->product->id,
            'name' => 'AI Smart Assistant',
            'description' => 'Generative AI helper',
            'is_addon' => true,
            'price' => 799.50,
            'is_active' => true,
        ]);

    $response->assertRedirect(route('admin.features.index'));

    $this->assertDatabaseHas('features', [
        'product_id' => $this->product->id,
        'name' => 'AI Smart Assistant',
        'is_addon' => 1,
        'price' => 799.50,
        'is_active' => 1,
    ]);
});

test('super admin can update feature between core and addon with price update', function (): void {
    $feature = Feature::query()->create([
        'product_id' => $this->product->id,
        'name' => 'Advanced Analytics',
        'code' => 'advanced_analytics',
        'is_addon' => false,
        'price' => 0.00,
        'is_active' => true,
        'sort_order' => 1,
    ]);

    // Update to addon with price
    $response = $this->actingAs($this->superAdmin, 'super_admin')
        ->put(route('admin.features.update', $feature), [
            'product_id' => $this->product->id,
            'name' => 'Advanced Analytics Pro',
            'is_addon' => true,
            'price' => 1250.00,
            'is_active' => true,
        ]);

    $response->assertRedirect(route('admin.features.index'));

    $this->assertDatabaseHas('features', [
        'id' => $feature->id,
        'name' => 'Advanced Analytics Pro',
        'is_addon' => 1,
        'price' => 1250.00,
    ]);
});
