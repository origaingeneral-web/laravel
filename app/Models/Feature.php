<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Feature extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'product_id',
        'code',
        'name',
        'description',
        'is_addon',
        'is_active',
        'sort_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_addon' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
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
     * @return HasMany<AddonFeatureRequest, $this>
     */
    public function addonRequests(): HasMany
    {
        return $this->hasMany(AddonFeatureRequest::class);
    }
}
