<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $businessCategoryId = DB::table('business_categories')->insertGetId([
            'category' => fake()->unique()->words(2, true),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $countryId = DB::table('countries')->insertGetId([
            'country' => fake()->country(),
            'iso3' => strtoupper(fake()->unique()->lexify('???')),
            'phone_code' => fake()->numberBetween(1, 999),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $stateId = DB::table('states')->insertGetId([
            'country_id' => $countryId,
            'state' => fake()->state(),
            'code' => strtoupper(fake()->unique()->lexify('??')),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $cityId = DB::table('cities')->insertGetId([
            'state_id' => $stateId,
            'city' => fake()->city(),
            'is_top_city' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $companyId = DB::table('companies')->insertGetId([
            'business_category_id' => $businessCategoryId,
            'company_name' => fake()->company(),
            'company_code' => strtoupper(fake()->unique()->bothify('??##')),
            'email' => fake()->unique()->companyEmail(),
            'mobile' => fake()->numerify('##########'),
            'owner_name' => fake()->name(),
            'owner_mobile' => fake()->numerify('##########'),
            'country_id' => $countryId,
            'state_id' => $stateId,
            'city_id' => $cityId,
            'pincode' => fake()->numerify('######'),
            'address' => fake()->address(),
            'password' => static::$password ??= Hash::make('password'),
            'status' => 1,
            'terms_accepted' => true,
            'terms_accepted_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return [
            'company_id' => $companyId,
            'user_prefix' => strtoupper(fake()->unique()->bothify('USR###')),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'initial_role' => 'user',
            'is_active' => true,
            'remember_token' => Str::random(10),
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ];
    }

    /**
     * Indicate that the user account is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the model has two-factor authentication configured.
     */
    public function withTwoFactor(): static
    {
        return $this->state(fn (array $attributes) => [
            'two_factor_secret' => encrypt('secret'),
            'two_factor_recovery_codes' => encrypt(json_encode(['recovery-code-1'])),
            'two_factor_confirmed_at' => now(),
        ]);
    }
}
