<?php

namespace Database\Seeders;

use App\Enums\RoleName;
use App\Models\SuperAdmin;
use Illuminate\Database\Seeder;

class SuperAdminSeeder extends Seeder
{
    /**
     * Seed the default Super Admin account.
     */
    public function run(): void
    {
        $admin = SuperAdmin::query()->updateOrCreate(
            ['email' => env('SUPER_ADMIN_EMAIL', 'admin@example.com')],
            [
                'name' => env('SUPER_ADMIN_NAME', 'Super Admin'),
                'number' => env('SUPER_ADMIN_NUMBER', '9999999999'),
                'password' => env('SUPER_ADMIN_PASSWORD', 'password'),
                'auth_token' => null,
                'auth_token_expiry' => null,
            ],
        );

        $admin->syncRoles([RoleName::SuperAdmin->value]);
    }
}
