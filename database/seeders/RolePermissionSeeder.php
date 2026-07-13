<?php

namespace Database\Seeders;

use App\Enums\PermissionName;
use App\Enums\RoleName;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Seed roles and permissions for Super Admin (web) and API clients.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $this->seedGuardPermissions('super_admin');
        $this->seedGuardPermissions('web');

        $superAdminRole = Role::findOrCreate(RoleName::SuperAdmin->value, 'super_admin');
        $superAdminRole->syncPermissions(Permission::where('guard_name', 'super_admin')->get());

        $companyAdminRole = Role::findOrCreate(RoleName::CompanyAdmin->value, 'web');
        $companyAdminRole->syncPermissions(PermissionName::companyAdminPermissions());

        $employeeRole = Role::findOrCreate(RoleName::Employee->value, 'web');
        $employeeRole->syncPermissions(PermissionName::employeePermissions());
    }

    private function seedGuardPermissions(string $guardName): void
    {
        foreach (PermissionName::values() as $permission) {
            Permission::findOrCreate($permission, $guardName);
        }
    }
}
