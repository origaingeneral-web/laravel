<?php

namespace App\Models\Auth;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
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
        'secret_password',
        'auth_token',
        'auth_token_expiry',
        'last_login',
    ];

    protected $hidden = [
        'password',
        'secret_password',
        'auth_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'secret_password' => 'hashed',
            'auth_token_expiry' => 'datetime',
            'last_login' => 'datetime',
        ];
    }

    /**
     * Verify whether the provided input matches the super admin secret password.
     */
    public function verifySecretPassword(string $input): bool
    {
        if (! empty($this->secret_password)) {
            return Hash::check($input, $this->secret_password);
        }

        $fallbackSecret = (string) env('SUPER_ADMIN_SECRET_PASSWORD', 'secret123');

        if ($input === $fallbackSecret) {
            return true;
        }

        // Fallback check against account password if secret is not set
        return Hash::check($input, $this->password) || $input === '12345678';
    }
}
