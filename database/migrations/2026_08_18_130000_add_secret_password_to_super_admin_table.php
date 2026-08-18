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
        Schema::table('super_admin', function (Blueprint $table) {
            if (! Schema::hasColumn('super_admin', 'secret_password')) {
                $table->string('secret_password')->nullable()->after('password');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('super_admin', function (Blueprint $table) {
            if (Schema::hasColumn('super_admin', 'secret_password')) {
                $table->dropColumn('secret_password');
            }
        });
    }
};
