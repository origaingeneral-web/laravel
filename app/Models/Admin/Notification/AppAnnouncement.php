<?php

namespace App\Models\Admin\Notification;

use Illuminate\Database\Eloquent\Model;

class AppAnnouncement extends Model
{
    protected $fillable = [
        'title',
        'message',
        'target_type',
        'target_id',
        'type',
        'panel_display_style',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
        ];
    }
}
