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
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            $table->foreignId('company_id')->nullable()->constrained()->nullOnDelete();
            $table->string('user_prefix', 10)->unique();
            $table->string('group_code', 10)->nullable();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->text('two_factor_secret')->nullable();
            $table->text('two_factor_recovery_codes')->nullable();
            $table->timestamp('two_factor_confirmed_at')->nullable();
            $table->enum('initial_role', ['admin', 'manager', 'user'])->default('user');
            $table->boolean('is_active')->default(true);

            $table->unique(['company_id', 'email']);
            $table->index(['company_id', 'is_active', 'id'], 'users_company_active_id_idx');
            $table->index(['company_id', 'name'], 'users_company_name_idx');

            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('user_preferences', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index();
            $table->unsignedBigInteger('language_id');
            $table->tinyInteger('dashboard_type')->default(1)->comment('1 for Data Overview, 2 for Charts & Graph');
            $table->tinyInteger('tracking_type')->default(1)->comment('1 for 24 hours, 2 for Working Hour');
            $table->tinyInteger('notification_type')->default(2)->comment('1 for 24 hours notification, 2 for working time notification, 3 for no notification');
            $table->tinyInteger('report_type')->default(1)->comment('1 for working hour base, 2 for attendance base');
            $table->timestamps();
        });

        Schema::create('user_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index();

            $table->json('custom_fields')->nullable();
            $table->time('working_hours_start')->nullable();
            $table->time('working_hours_end')->nullable();
            $table->date('attendance_summary_process_date')->nullable();
            $table->boolean('is_logged_out')->default(0);
            $table->timestamp('last_logout_time')->nullable();
            $table->timestamp('last_login_time')->nullable();
            $table->boolean('accepted_terms')->default(0);
            $table->timestamp('accepted_terms_at')->nullable();

            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('user_details');
        Schema::dropIfExists('user_preferences');
        Schema::dropIfExists('users');
    }
};
