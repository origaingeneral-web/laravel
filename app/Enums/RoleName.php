<?php

namespace App\Enums;

enum RoleName: string
{
    case SuperAdmin = 'super_admin';
    case CompanyAdmin = 'company_admin';
    case Employee = 'employee';
}
