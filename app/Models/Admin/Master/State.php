<?php

namespace App\Models\Admin\Master;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class State extends Model
{
    use HasFactory;

    protected $fillable = [
        'country_id',
        'state',
        'code',
    ];

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }
}
