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
        Schema::create('app_announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('message');
            $table->enum('target_type', ['all', 'company', 'user'])->default('all');
            $table->unsignedBigInteger('target_id')->nullable();
            $table->enum('type', ['firebase', 'panel'])->default('panel');
            $table->enum('panel_display_style', ['banner', 'bell'])->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('app_announcements');
    }
};
