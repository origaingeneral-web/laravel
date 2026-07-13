<?php

namespace App\Policies;

use App\Enums\PermissionName;
use App\Models\Company;
use App\Models\User;

class CompanyPolicy
{
    public function view(User $user, Company $company): bool
    {
        return $this->ownsCompany($user, $company)
            && $user->can(PermissionName::CompanyProfileView->value);
    }

    public function update(User $user, Company $company): bool
    {
        return $this->ownsCompany($user, $company)
            && $user->can(PermissionName::CompanyProfileUpdate->value);
    }

    public function viewPlan(User $user, Company $company): bool
    {
        return $this->ownsCompany($user, $company)
            && $user->can(PermissionName::CompanyPlanView->value);
    }

    public function viewFeatures(User $user, Company $company): bool
    {
        return $this->ownsCompany($user, $company)
            && $user->can(PermissionName::CompanyFeaturesView->value);
    }

    public function viewCredits(User $user, Company $company): bool
    {
        return $this->ownsCompany($user, $company)
            && $user->can(PermissionName::CompanyCreditsView->value);
    }

    public function requestAddon(User $user, Company $company): bool
    {
        return $this->ownsCompany($user, $company)
            && $user->can(PermissionName::CompanyFeaturesView->value)
            && $user->hasRole('company_admin');
    }

    private function ownsCompany(User $user, Company $company): bool
    {
        return (int) $user->company_id === (int) $company->id;
    }
}
