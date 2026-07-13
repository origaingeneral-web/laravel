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
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('company_id')->nullable()->change();
            $table->boolean('is_active')->default(true)->after('initial_role');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreign('company_id')
                ->references('id')
                ->on('companies')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
            $table->dropColumn('is_active');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('company_id')->nullable(false)->change();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreign('company_id')
                ->references('id')
                ->on('companies')
                ->cascadeOnDelete();
        });
    }
};
