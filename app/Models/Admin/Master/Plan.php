<?php

namespace App\Models\Admin\Master;

use App\Models\Company\CompanyProduct;
use App\Models\Product\Product;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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
        'features',
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
            'features' => 'array',
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
     * @return BelongsToMany<Product, $this>
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'plan_products')
            ->withPivot(['price_per_user', 'staff_limit'])
            ->withTimestamps();
    }

    /**
     * @return HasMany<CompanyProduct, $this>
     */
    public function companyProducts(): HasMany
    {
        return $this->hasMany(CompanyProduct::class);
    }
}
