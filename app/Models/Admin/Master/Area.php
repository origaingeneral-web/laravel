<?php

namespace App\Models\Admin\Master;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Area extends Model
{
    use HasFactory;

    protected $fillable = [
        'city_id',
        'area',
        'zipcode',
    ];

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }
}
