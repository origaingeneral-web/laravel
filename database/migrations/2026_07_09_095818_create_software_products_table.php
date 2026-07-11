<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('software_products', function (Blueprint $table) {
            $table->id();

            $table->string('product_name', 100);
            $table->string('slug')->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('software_product_id')->constrained()->cascadeOnDelete();
            $table->string('module_name', 100);
            $table->string('slug');
            $table->string('icon')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->unique(['software_product_id', 'slug']);
            $table->timestamps();
        });
        Schema::create('module_features', function (Blueprint $table) {
            $table->id();

            $table->foreignId('software_product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('module_id')->constrained()->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('features')->nullOnDelete();

            $table->foreignId('depends_on_feature_id')->nullable()->constrained('features')->nullOnDelete();

            $table->string('name');
            $table->string('slug');
            $table->string('route_name')->nullable();
            $table->text('search_keywords')->nullable();

            $table->boolean('is_default')->default(false);
            $table->boolean('is_paid')->default(false);

            $table->boolean('hide_in_branch_manager_access')->default(false);
            $table->boolean('default_for_branch_manager')->default(false);
            $table->boolean('hide_in_quick_search')->default(false);
            $table->boolean('hide_in_quick_menu')->default(false);
            $table->boolean('hide_in_module_assign')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->json('settings')->nullable();
            $table->timestamps();

            $table->unique(['module_id', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
