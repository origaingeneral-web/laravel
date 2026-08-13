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
        Schema::create('notification_templates', function (Blueprint $table) {
            $table->id();
            $table->string('purpose')->unique();
            $table->string('name');
            $table->string('email_subject')->nullable();
            $table->text('email_body')->nullable();
            $table->boolean('is_email_active')->default(false);
            $table->text('sms_body')->nullable();
            $table->boolean('is_sms_active')->default(false);
            $table->text('whatsapp_body')->nullable();
            $table->boolean('is_whatsapp_active')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_templates');
    }
};
