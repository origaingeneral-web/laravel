<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'product_id',
        'plan_name',
        'price',
        'duration_in_days',
        'staff_limit',
        'tracking_duration',
        'remarks',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'duration_in_days' => 'integer',
            'staff_limit' => 'integer',
            'tracking_duration' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * @return HasMany<CompanyProduct, $this>
     */
    public function companyProducts(): HasMany
    {
        return $this->hasMany(CompanyProduct::class);
    }
}
