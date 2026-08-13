<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class SuperAdmin extends Authenticatable
{
    use HasApiTokens, HasRoles, Notifiable;

    protected $table = 'super_admin';

    /**
     * The default guard name for Spatie permissions.
     */
    protected string $guard_name = 'super_admin';

    protected $fillable = [
        'name',
        'email',
        'number',
        'password',
        'auth_token',
        'auth_token_expiry',
        'last_login',
    ];

    protected $hidden = [
        'password',
        'auth_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'auth_token_expiry' => 'datetime',
            'last_login' => 'datetime',
        ];
    }
}
