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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();

            // $table->unsignedBigInteger('branch_id')->nullable()->comment('Branch ID from branches table');
            $table->unsignedBigInteger('business_category_id')->comment('Business Category ID from business_categories table');
            $table->string('company_name');
            $table->string('company_code', 4)->unique();
            $table->string('email')->unique();
            $table->string('mobile', 20);

            // Owner Details
            $table->string('owner_name');
            $table->string('owner_mobile', 20);

            // Location
            $table->foreignId('country_id')->constrained()->cascadeOnDelete();
            $table->foreignId('state_id')->constrained()->cascadeOnDelete();
            $table->foreignId('city_id')->constrained()->cascadeOnDelete();
            $table->foreignId('area_id')->nullable()->constrained()->nullOnDelete();
            $table->string('landline', 20)->nullable();
            $table->string('pincode', 10);
            $table->text('address');


            // Documents
            $table->string('profile')->nullable(); // need to check if is this required or not

            $table->string('id_type')->nullable();
            $table->string('id_proof')->nullable();
            $table->string('addr_type')->nullable();
            $table->string('addr_proof')->nullable();

            // Business
            $table->string('pan_number', 20)->nullable();
            $table->string('calling_pin', 10)->nullable();

            $table->text('remarks')->nullable();
            $table->tinyInteger('status', 1)->default(1)->comment('1 for active, 0 for inactive, -1 for disabled');
            $table->text('disabled_reason')->nullable();
            $table->date('mail_date')->nullable();
            $table->boolean('terms_accepted')->default(0);
            $table->timestamp('terms_accepted_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
