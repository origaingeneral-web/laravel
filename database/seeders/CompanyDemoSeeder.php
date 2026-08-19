<?php

namespace Database\Seeders;

use App\Enums\CompanyStatus;
use App\Enums\RoleName;
use App\Models\Admin\Feature\Feature;
use App\Models\Admin\Master\Plan;
use App\Models\Auth\Permission;
use App\Models\Company\Company;
use App\Models\Company\CompanyProduct;
use App\Models\Company\CompanyProductCredit;
use App\Models\Company\CompanyProductCreditLog;
use App\Models\Product\Product;
use App\Models\Product\UserProductAccess;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CompanyDemoSeeder extends Seeder
{
    /**
     * Seed a demo company subscribed to TWO products, with admin (both) and employee (one).
     */
    public function run(): void
    {
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

        $company = Company::query()->updateOrCreate(
            ['company_code' => 'DEMO'],
            [
                'business_category_id' => $businessCategoryId,
                'company_name' => 'KeenThemes Demo Corp',
                'email' => 'demo@kt.com',
                'mobile' => '9999999999',
                'owner_name' => 'Demo Admin',
                'owner_mobile' => '9999999998',
                'country_id' => $countryId,
                'state_id' => $stateId,
                'city_id' => $cityId,
                'pincode' => '400001',
                'address' => 'KeenThemes HQ, Tech Park',
                'status' => CompanyStatus::Active->value,
                'terms_accepted' => true,
                'terms_accepted_at' => $now,
            ],
        );

        $flash = Product::query()->updateOrCreate(
            ['code' => 'flash_force'],
            [
                'name' => 'Flash Force',
                'description' => 'Primary field operations management',
                'is_active' => true,
                'sort_order' => 1,
            ],
        );

        $mega = Product::query()->updateOrCreate(
            ['code' => 'mega_force'],
            [
                'name' => 'Mega Force',
                'description' => 'Secondary enterprise operations suite',
                'is_active' => true,
                'sort_order' => 2,
            ],
        );

        $flashPlan = Plan::query()->updateOrCreate(
            [
                'product_id' => $flash->id,
                'plan_name' => 'Flash Starter',
            ],
            [
                'price' => 499,
                'duration_in_days' => 365,
                'staff_limit' => 20,
                'tracking_duration' => 24,
                'remarks' => 'Demo Flash Force plan',
                'is_active' => true,
            ],
        );

        $megaPlan = Plan::query()->updateOrCreate(
            [
                'product_id' => $mega->id,
                'plan_name' => 'Mega Pro',
            ],
            [
                'price' => 1499,
                'duration_in_days' => 365,
                'staff_limit' => 50,
                'tracking_duration' => 24,
                'remarks' => 'Demo Mega Force plan',
                'is_active' => true,
            ],
        );

        CompanyProduct::query()->updateOrCreate(
            [
                'company_id' => $company->id,
                'product_id' => $flash->id,
            ],
            [
                'plan_id' => $flashPlan->id,
                'status' => 'active',
                'starts_at' => $now->copy()->subDay(),
                'expires_at' => $now->copy()->addYear(),
                'staff_limit' => $flashPlan->staff_limit,
            ],
        );

        CompanyProduct::query()->updateOrCreate(
            [
                'company_id' => $company->id,
                'product_id' => $mega->id,
            ],
            [
                'plan_id' => $megaPlan->id,
                'status' => 'active',
                'starts_at' => $now->copy()->subDays(3),
                'expires_at' => $now->copy()->addMonths(6),
                'staff_limit' => $megaPlan->staff_limit,
            ],
        );

        $crm = Feature::query()->updateOrCreate(
            ['product_id' => $flash->id, 'code' => 'crm'],
            [
                'name' => 'CRM',
                'description' => 'Core CRM module',
                'is_addon' => false,
                'is_active' => true,
                'sort_order' => 1,
            ],
        );

        $analytics = Feature::query()->updateOrCreate(
            ['product_id' => $flash->id, 'code' => 'analytics'],
            [
                'name' => 'Analytics',
                'description' => 'Reporting and analytics',
                'is_addon' => false,
                'is_active' => true,
                'sort_order' => 2,
            ],
        );

        $aiAddon = Feature::query()->updateOrCreate(
            ['product_id' => $flash->id, 'code' => 'ai_assistant'],
            [
                'name' => 'AI Assistant',
                'description' => 'Optional AI addon',
                'is_addon' => true,
                'is_active' => true,
                'sort_order' => 10,
            ],
        );

        $inventory = Feature::query()->updateOrCreate(
            ['product_id' => $mega->id, 'code' => 'inventory'],
            [
                'name' => 'Inventory',
                'description' => 'Stock management',
                'is_addon' => false,
                'is_active' => true,
                'sort_order' => 1,
            ],
        );

        $recruitment = Feature::query()->updateOrCreate(
            ['product_id' => $flash->id, 'code' => 'recruitment'],
            [
                'name' => 'Recruitment',
                'description' => 'Job openings, candidates and interview workflows',
                'is_addon' => false,
                'is_active' => true,
                'sort_order' => 3,
            ],
        );

        // Seed feature-linked permissions
        $featurePermissionsMap = [
            $recruitment->id => ['recruitment.job_opening', 'recruitment.candidates', 'recruitment.interview'],
            $crm->id => ['crm.leads', 'crm.deals', 'crm.contacts'],
            $analytics->id => ['analytics.reports', 'analytics.dashboard'],
            $inventory->id => ['inventory.items', 'inventory.stock'],
        ];

        foreach ($featurePermissionsMap as $featId => $perms) {
            foreach ($perms as $permName) {
                foreach (['web', 'super_admin'] as $guard) {
                    Permission::query()->updateOrCreate(
                        ['name' => $permName, 'guard_name' => $guard],
                        ['feature_id' => $featId]
                    );
                }
            }
        }

        foreach ([$crm, $analytics, $recruitment] as $feature) {
            DB::table('company_product_feature')->updateOrInsert(
                [
                    'company_id' => $company->id,
                    'product_id' => $flash->id,
                    'feature_id' => $feature->id,
                ],
                [
                    'is_enabled' => true,
                    'enabled_at' => $now,
                    'expires_at' => null,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            );
        }

        DB::table('company_product_feature')->updateOrInsert(
            [
                'company_id' => $company->id,
                'product_id' => $flash->id,
                'feature_id' => $aiAddon->id,
            ],
            [
                'is_enabled' => false,
                'enabled_at' => null,
                'expires_at' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        );

        DB::table('company_product_feature')->updateOrInsert(
            [
                'company_id' => $company->id,
                'product_id' => $mega->id,
                'feature_id' => $inventory->id,
            ],
            [
                'is_enabled' => true,
                'enabled_at' => $now,
                'expires_at' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        );

        CompanyProductCredit::query()->updateOrCreate(
            [
                'company_id' => $company->id,
                'product_id' => $flash->id,
            ],
            ['balance' => 500],
        );

        if (! CompanyProductCreditLog::query()
            ->where('company_id', $company->id)
            ->where('product_id', $flash->id)
            ->exists()) {
            CompanyProductCreditLog::query()->create([
                'company_id' => $company->id,
                'product_id' => $flash->id,
                'amount' => 500,
                'type' => 'credit',
                'balance_after' => 500,
                'description' => 'Initial Flash Force credit allocation',
            ]);
        }

        CompanyProductCredit::query()->updateOrCreate(
            [
                'company_id' => $company->id,
                'product_id' => $mega->id,
            ],
            ['balance' => 100],
        );

        $admin = User::query()->updateOrCreate(
            ['email' => 'demo@kt.com'],
            [
                'company_id' => $company->id,
                'user_prefix' => 'CMPADMIN',
                'name' => 'Demo Admin',
                'email_verified_at' => $now,
                'password' => 'demo123',
                'initial_role' => 'admin',
                'is_active' => true,
                'remember_token' => Str::random(10),
            ],
        );
        $admin->syncRoles([RoleName::CompanyAdmin->value]);

        foreach ([$flash->id, $mega->id] as $productId) {
            UserProductAccess::query()->updateOrCreate(
                [
                    'user_id' => $admin->id,
                    'product_id' => $productId,
                ],
                [
                    'company_id' => $company->id,
                    'is_active' => true,
                ],
            );
        }

        $employee = User::query()->updateOrCreate(
            ['email' => 'employee@example.com'],
            [
                'company_id' => $company->id,
                'user_prefix' => 'EMPdemo1',
                'name' => 'Demo Employee',
                'email_verified_at' => $now,
                'password' => 'password',
                'initial_role' => 'user',
                'is_active' => true,
                'remember_token' => Str::random(10),
            ],
        );
        $employee->syncRoles([RoleName::Employee->value]);

        UserProductAccess::query()->where('user_id', $employee->id)->delete();
        UserProductAccess::query()->updateOrCreate(
            [
                'user_id' => $employee->id,
                'product_id' => $flash->id,
            ],
            [
                'company_id' => $company->id,
                'is_active' => true,
            ],
        );
    }
}
