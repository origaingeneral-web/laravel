<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;

class SuperAdmin extends Authenticatable
{
    use Notifiable;
    protected $table = 'super_admin';

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
    ];  //

    protected $casts = [
        'password' => 'hashed',
        'auth_token_expiry' => 'datetime',
        'last_login' => 'datetime',
    ];
}
