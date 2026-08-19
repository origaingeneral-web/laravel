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
        Schema::create('plan_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_id')->constrained('plans')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->decimal('price_per_user', 10, 2)->default(0.00);
            $table->timestamps();

            $table->unique(['plan_id', 'product_id']);
        });

        // Migrate existing product_id relations from plans table to plan_products
        if (Schema::hasColumn('plans', 'product_id')) {
            $plans = DB::table('plans')->whereNotNull('product_id')->get(['id', 'product_id', 'price']);
            $now = now();
            foreach ($plans as $plan) {
                DB::table('plan_products')->updateOrInsert(
                    ['plan_id' => $plan->id, 'product_id' => $plan->product_id],
                    ['price_per_user' => $plan->price ?? 0.00, 'created_at' => $now, 'updated_at' => $now]
                );
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plan_products');
    }
};
