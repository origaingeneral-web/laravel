<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $legacyProductIds = DB::table('products')->whereIn('code', ['f2_super', 'another_app'])->pluck('id');

        if ($legacyProductIds->isNotEmpty()) {
            DB::table('plan_products')->whereIn('product_id', $legacyProductIds)->delete();
            DB::table('plans')->whereIn('product_id', $legacyProductIds)->delete();
            DB::table('company_product_feature')->whereIn('product_id', $legacyProductIds)->delete();
            DB::table('user_product_access')->whereIn('product_id', $legacyProductIds)->delete();
            DB::table('company_product_credit_logs')->whereIn('product_id', $legacyProductIds)->delete();
            DB::table('company_product_credits')->whereIn('product_id', $legacyProductIds)->delete();
            DB::table('company_products')->whereIn('product_id', $legacyProductIds)->delete();
            DB::table('features')->whereIn('product_id', $legacyProductIds)->delete();
            DB::table('products')->whereIn('id', $legacyProductIds)->delete();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
