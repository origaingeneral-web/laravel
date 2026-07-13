<?php

namespace App\Policies;

use App\Enums\PermissionName;
use App\Enums\RoleName;
use App\Models\User;

class EmployeePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can(PermissionName::CompanyEmployeesView->value);
    }

    public function view(User $actor, User $employee): bool
    {
        return $this->sameCompany($actor, $employee)
            && $actor->can(PermissionName::CompanyEmployeesView->value);
    }

    public function create(User $user): bool
    {
        return $user->can(PermissionName::CompanyEmployeesManage->value);
    }

    public function update(User $actor, User $employee): bool
    {
        return $this->sameCompany($actor, $employee)
            && $actor->can(PermissionName::CompanyEmployeesManage->value)
            && ! $employee->hasRole(RoleName::SuperAdmin->value);
    }

    public function updateStatus(User $actor, User $employee): bool
    {
        return $this->update($actor, $employee)
            && (int) $actor->id !== (int) $employee->id;
    }

    public function resetPassword(User $actor, User $employee): bool
    {
        return $this->update($actor, $employee);
    }

    private function sameCompany(User $actor, User $employee): bool
    {
        return $actor->company_id !== null
            && (int) $actor->company_id === (int) $employee->company_id;
    }
}
