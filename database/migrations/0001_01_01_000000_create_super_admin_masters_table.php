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
        Schema::create('business_categories', function (Blueprint $table) {
            $table->id();
            $table->string('category');
            $table->timestamps();
        });
        Schema::create('languages', function (Blueprint $table) {
            $table->id();
            $table->string('language');
            $table->string('code', 5)->nullable();
            $table->timestamps();
        });
        Schema::create('countries', function (Blueprint $table) {
            $table->id();
            $table->string('country');
            $table->string('iso3', 3)->nullable(); // IND, USA
            $table->string('phone_code')->nullable();
            $table->timestamps();
        });
        Schema::create('states', function (Blueprint $table) {
            $table->id();
            $table->foreignId('country_id')->constrained()->cascadeOnDelete();
            $table->string('state');
            $table->string('code')->nullable(); // CG, MH, DL
            $table->timestamps();
        });
        Schema::create('cities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('state_id')->constrained()->cascadeOnDelete();
            $table->string('city');
            $table->tinyInteger('is_top_city')->default(0)->comment('1 for top city, 0 for not top city');
            $table->timestamps();
        });
        Schema::create('areas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('city_id')->constrained()->cascadeOnDelete();
            $table->string('area');
            $table->string('zipcode')->nullable();
            $table->timestamps();
        });
        // Schema::create('branches', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('branch_name');
        //     $table->timestamps();
        // });
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('plan_name');
            $table->decimal('price', 10, 2);
            $table->integer('duration_in_days');
            $table->integer('staff_limit');
            $table->integer('tracking_duration')->default(24)->comment('in hours');
            $table->string('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_categories');
        Schema::dropIfExists('countries');
        Schema::dropIfExists('states');
        Schema::dropIfExists('cities');
        Schema::dropIfExists('areas');
    }
};
