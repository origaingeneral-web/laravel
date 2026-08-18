<?php

namespace App\Enums;

use App\Models\Auth\SuperAdmin;

enum RoleName: string
{
    case SuperAdmin = 'super_admin';
    case CompanyAdmin = 'company_admin';
    case Employee = 'employee';
}
