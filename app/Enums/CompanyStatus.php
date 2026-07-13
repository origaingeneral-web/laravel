<?php

namespace App\Enums;

enum CompanyStatus: int
{
    case Disabled = -1;
    case Inactive = 0;
    case Active = 1;

    public function label(): string
    {
        return match ($this) {
            self::Active => 'active',
            self::Inactive => 'inactive',
            self::Disabled => 'disabled',
        };
    }
}
