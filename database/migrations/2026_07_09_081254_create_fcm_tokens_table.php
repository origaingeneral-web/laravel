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
        Schema::create('fcm_credentials', function (Blueprint $table) {
            $table->id();
            $table->string('app_name');
            $table->string('project_key');
            $table->string('json_file_path');
            $table->timestamps();
        });

        Schema::create('fcm_tokens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedBigInteger('user_id')->index();
            $table->string('model_type', 100)->index();
            $table->text('fcm_token');
            $table->string('device_id')->index();
            $table->string('platform', 20); // android, ios, web
            $table->string('device_name')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fcm_tokens');
        Schema::dropIfExists('fcm_credentials');
    }
};
