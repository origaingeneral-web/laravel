<?php

namespace App\Enums;

enum PermissionName: string
{
    case AdminAccess = 'admin.access';

    case UsersView = 'users.view';
    case UsersCreate = 'users.create';
    case UsersUpdate = 'users.update';
    case UsersDelete = 'users.delete';

    case RolesView = 'roles.view';
    case RolesAssign = 'roles.assign';

    case CompanyView = 'company.view';
    case CompanyCreate = 'company.create';
    case CompanyUpdate = 'company.update';

    case PlanManage = 'plan.manage';
    case FeatureAssign = 'feature.assign';

    case CompanyProfileView = 'company.profile.view';
    case CompanyProfileUpdate = 'company.profile.update';
    case CompanyEmployeesView = 'company.employees.view';
    case CompanyEmployeesManage = 'company.employees.manage';
    case CompanyProductsView = 'company.products.view';
    case CompanyPlanView = 'company.plan.view';
    case CompanyFeaturesView = 'company.features.view';
    case CompanyCreditsView = 'company.credits.view';

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * @return list<string>
     */
    public static function companyAdminPermissions(): array
    {
        return [
            self::CompanyProfileView->value,
            self::CompanyProfileUpdate->value,
            self::CompanyEmployeesView->value,
            self::CompanyEmployeesManage->value,
            self::CompanyProductsView->value,
            self::CompanyPlanView->value,
            self::CompanyFeaturesView->value,
            self::CompanyCreditsView->value,
            // Legacy aliases still useful for older checks
            self::CompanyView->value,
            self::CompanyUpdate->value,
            self::UsersView->value,
            self::UsersCreate->value,
            self::UsersUpdate->value,
        ];
    }

    /**
     * @return list<string>
     */
    public static function employeePermissions(): array
    {
        return [
            self::CompanyProfileView->value,
            self::CompanyProductsView->value,
            self::CompanyFeaturesView->value,
            self::CompanyPlanView->value,
            self::CompanyCreditsView->value,
            self::CompanyView->value,
        ];
    }
}
