<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DemoCompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = [];
        for ($i = 1; $i <= 6; $i++) {
            $companies[] = [
                'company_name' => 'Demo Company '.$i,
                'company_code' => 'DEM'.$i,
                'business_category_id' => 1,
                'country_id' => 1,
                'state_id' => 1,
                'city_id' => 1,
                'area_id' => 1,
                'pincode' => '12345'.$i,
                'address' => 'Demo Address '.$i,
                'mobile' => '987654321'.$i,
                'email' => 'demo'.$i.'@example.com',
                'owner_name' => 'Owner '.$i,
                'owner_mobile' => '987654321'.$i,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('companies')->insert($companies);
    }
}
