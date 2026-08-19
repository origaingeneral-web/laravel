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
        Schema::table('plan_products', function (Blueprint $table) {
            $table->integer('staff_limit')->nullable()->default(10)->after('price_per_user');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plan_products', function (Blueprint $table) {
            $table->dropColumn('staff_limit');
        });
    }
};
