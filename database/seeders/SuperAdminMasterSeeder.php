<?php

namespace Database\Seeders;

use Carbon\CarbonInterface;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SuperAdminMasterSeeder extends Seeder
{
    /**
     * Seed Super Admin master lookup data.
     */
    public function run(): void
    {
        $now = now();

        foreach (['CRM', 'Retail', 'Healthcare', 'Education', 'Real Estate', 'Manufacturing'] as $category) {
            DB::table('business_categories')->updateOrInsert(
                ['category' => $category],
                ['created_at' => $now, 'updated_at' => $now],
            );
        }

        foreach ($this->languages() as $language) {
            DB::table('languages')->updateOrInsert(
                ['code' => $language['code']],
                [...$language, 'created_at' => $now, 'updated_at' => $now],
            );
        }

        $indiaId = $this->upsertCountry($now);
        $this->seedLocations($indiaId, $now);
        $this->seedProductsAndPlans($now);
    }

    /**
     * @return list<array{language: string, code: string}>
     */
    private function languages(): array
    {
        return [
            ['language' => 'English', 'code' => 'en'],
            ['language' => 'Hindi', 'code' => 'hi'],
            ['language' => 'Marathi', 'code' => 'mr'],
            ['language' => 'Gujarati', 'code' => 'gu'],
        ];
    }

    private function upsertCountry(CarbonInterface $now): int
    {
        $indiaId = DB::table('countries')->where('iso3', 'IND')->value('id');

        if ($indiaId) {
            DB::table('countries')->where('id', $indiaId)->update([
                'country' => 'India',
                'phone_code' => '91',
                'updated_at' => $now,
            ]);

            return (int) $indiaId;
        }

        return DB::table('countries')->insertGetId([
            'country' => 'India',
            'iso3' => 'IND',
            'phone_code' => '91',
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    private function seedLocations(int $countryId, CarbonInterface $now): void
    {
        foreach ($this->states() as $state) {
            $stateId = DB::table('states')
                ->where('country_id', $countryId)
                ->where('code', $state['code'])
                ->value('id');

            if ($stateId) {
                DB::table('states')->where('id', $stateId)->update([
                    'state' => $state['state'],
                    'updated_at' => $now,
                ]);
            } else {
                $stateId = DB::table('states')->insertGetId([
                    'country_id' => $countryId,
                    'state' => $state['state'],
                    'code' => $state['code'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }

            foreach ($state['cities'] as $city) {
                $cityId = DB::table('cities')
                    ->where('state_id', $stateId)
                    ->where('city', $city['city'])
                    ->value('id');

                if ($cityId) {
                    DB::table('cities')->where('id', $cityId)->update([
                        'is_top_city' => $city['is_top_city'],
                        'updated_at' => $now,
                    ]);
                } else {
                    $cityId = DB::table('cities')->insertGetId([
                        'state_id' => $stateId,
                        'city' => $city['city'],
                        'is_top_city' => $city['is_top_city'],
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                }

                foreach ($city['areas'] as $area) {
                    DB::table('areas')->updateOrInsert(
                        ['city_id' => $cityId, 'area' => $area['area']],
                        ['zipcode' => $area['zipcode'], 'created_at' => $now, 'updated_at' => $now],
                    );
                }
            }
        }
    }

    /**
     * @return list<array{state: string, code: string, cities: list<array{city: string, is_top_city: int, areas: list<array{area: string, zipcode: string}>}>}>
     */
    private function states(): array
    {
        return [
            [
                'state' => 'Maharashtra',
                'code' => 'MH',
                'cities' => [
                    [
                        'city' => 'Mumbai',
                        'is_top_city' => 1,
                        'areas' => [
                            ['area' => 'Andheri East', 'zipcode' => '400069'],
                            ['area' => 'Bandra West', 'zipcode' => '400050'],
                        ],
                    ],
                    [
                        'city' => 'Pune',
                        'is_top_city' => 1,
                        'areas' => [
                            ['area' => 'Hinjewadi', 'zipcode' => '411057'],
                            ['area' => 'Kharadi', 'zipcode' => '411014'],
                        ],
                    ],
                ],
            ],
            [
                'state' => 'Delhi',
                'code' => 'DL',
                'cities' => [
                    [
                        'city' => 'New Delhi',
                        'is_top_city' => 1,
                        'areas' => [
                            ['area' => 'Connaught Place', 'zipcode' => '110001'],
                            ['area' => 'Saket', 'zipcode' => '110017'],
                        ],
                    ],
                ],
            ],
        ];
    }

    private function seedProductsAndPlans(CarbonInterface $now): void
    {
        foreach ($this->products() as $product) {
            $productId = DB::table('products')->where('code', $product['code'])->value('id');

            if ($productId) {
                DB::table('products')->where('id', $productId)->update([
                    'name' => $product['name'],
                    'description' => $product['description'],
                    'is_active' => true,
                    'sort_order' => $product['sort_order'],
                    'updated_at' => $now,
                ]);
            } else {
                $productId = DB::table('products')->insertGetId([
                    'name' => $product['name'],
                    'code' => $product['code'],
                    'description' => $product['description'],
                    'is_active' => true,
                    'sort_order' => $product['sort_order'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }

            foreach ($product['plans'] as $plan) {
                $planData = $plan;
                if (isset($planData['features'])) {
                    $planData['features'] = json_encode($planData['features']);
                }

                DB::table('plans')->updateOrInsert(
                    ['product_id' => $productId, 'plan_name' => $plan['plan_name']],
                    [...$planData, 'is_active' => true, 'created_at' => $now, 'updated_at' => $now],
                );

                $planId = DB::table('plans')
                    ->where('product_id', $productId)
                    ->where('plan_name', $plan['plan_name'])
                    ->value('id');

                if ($planId) {
                    DB::table('plan_products')->updateOrInsert(
                        ['plan_id' => $planId, 'product_id' => $productId],
                        [
                            'price_per_user' => $plan['price'] ?? 0.00,
                            'staff_limit' => $plan['staff_limit'] ?? null,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ],
                    );
                }
            }
        }
    }

    /**
     * @return list<array{code: string, name: string, description: string, sort_order: int, plans: list<array{plan_name: string, price: int, duration_in_days: int, staff_limit: int, tracking_duration: int, remarks: string, features?: list<string>}>}>
     */
    private function products(): array
    {
        return [
            [
                'code' => 'flash_force',
                'name' => 'Flash Force',
                'description' => 'Fast and agile field operations management',
                'sort_order' => 1,
                'plans' => [
                    [
                        'plan_name' => 'Flash Starter',
                        'price' => 499,
                        'duration_in_days' => 365,
                        'staff_limit' => 20,
                        'tracking_duration' => 24,
                        'remarks' => 'Entry plan for Flash Force',
                        'features' => ['Fast Tracking', 'Basic CRM'],
                    ],
                ],
            ],
            [
                'code' => 'mega_force',
                'name' => 'Mega Force',
                'description' => 'Comprehensive mega enterprise operations suite',
                'sort_order' => 2,
                'plans' => [
                    [
                        'plan_name' => 'Mega Pro',
                        'price' => 1499,
                        'duration_in_days' => 365,
                        'staff_limit' => 50,
                        'tracking_duration' => 24,
                        'remarks' => 'Comprehensive workforce package',
                        'features' => ['Enterprise CRM', 'Real-time Tracking', 'Advanced Reports'],
                    ],
                ],
            ],
            [
                'code' => 'force_ignitor',
                'name' => 'Force Ignitor',
                'description' => 'Advanced automation and performance accelerator',
                'sort_order' => 3,
                'plans' => [
                    [
                        'plan_name' => 'Ignitor Boost',
                        'price' => 999,
                        'duration_in_days' => 180,
                        'staff_limit' => 30,
                        'tracking_duration' => 12,
                        'remarks' => 'Performance accelerator plan',
                        'features' => ['Automations', 'Speed Tracking'],
                    ],
                ],
            ],
        ];
    }
}
