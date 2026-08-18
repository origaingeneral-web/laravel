<?php

namespace App\Models\Admin\Template;

use Illuminate\Database\Eloquent\Model;

class NotificationTemplate extends Model
{
    protected $fillable = [
        'purpose',
        'name',
        'email_subject',
        'email_body',
        'is_email_active',
        'sms_body',
        'is_sms_active',
        'whatsapp_body',
        'is_whatsapp_active',
    ];

    protected function casts(): array
    {
        return [
            'is_email_active' => 'boolean',
            'is_sms_active' => 'boolean',
            'is_whatsapp_active' => 'boolean',
        ];
    }
}
