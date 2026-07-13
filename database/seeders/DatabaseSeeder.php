<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
         $this->call([
        SuperAdminSeeder::class,
    ]);
        $now = now();

        $businessCategoryId = DB::table('business_categories')->where('category', 'CRM')->value('id')
            ?? DB::table('business_categories')->insertGetId([
                'category' => 'CRM',
                'created_at' => $now,
                'updated_at' => $now,
            ]);

        $countryId = DB::table('countries')->where('iso3', 'IND')->value('id')
            ?? DB::table('countries')->insertGetId([
                'country' => 'India',
                'iso3' => 'IND',
                'phone_code' => '91',
                'created_at' => $now,
                'updated_at' => $now,
            ]);

        $stateId = DB::table('states')
            ->where('country_id', $countryId)
            ->where('code', 'MH')
            ->value('id')
            ?? DB::table('states')->insertGetId([
                'country_id' => $countryId,
                'state' => 'Maharashtra',
                'code' => 'MH',
                'created_at' => $now,
                'updated_at' => $now,
            ]);

        $cityId = DB::table('cities')
            ->where('state_id', $stateId)
            ->where('city', 'Mumbai')
            ->value('id')
            ?? DB::table('cities')->insertGetId([
                'state_id' => $stateId,
                'city' => 'Mumbai',
                'is_top_city' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

        $companyId = DB::table('companies')->where('company_code', 'TEST')->value('id')
            ?? DB::table('companies')->insertGetId([
                'business_category_id' => $businessCategoryId,
                'company_name' => 'Test Company',
                'company_code' => 'TEST',
                'email' => 'company@example.com',
                'mobile' => '9999999999',
                'owner_name' => 'Test Owner',
                'owner_mobile' => '9999999998',
                'country_id' => $countryId,
                'state_id' => $stateId,
                'city_id' => $cityId,
                'pincode' => '400001',
                'address' => 'Test Address',
                'status' => 1,
                'terms_accepted' => true,
                'terms_accepted_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

        DB::table('users')->updateOrInsert([
            'email' => 'test@example.com',
        ], [
            'company_id' => $companyId,
            'user_prefix' => 'TESTUSER',
            'name' => 'Test User',
            'email_verified_at' => $now,
            'password' => Hash::make('password'),
            'initial_role' => 'admin',
            'remember_token' => Str::random(10),
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }
    
}
