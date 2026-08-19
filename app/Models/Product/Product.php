<?php

namespace App\Models\Product;

use App\Models\Admin\Feature\Feature;
use App\Models\Admin\Master\Plan;
use App\Models\Company\Company;
use App\Models\Company\CompanyProduct;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'name',
        'code',
        'description',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function plans(): HasMany
    {
        return $this->hasMany(Plan::class);
    }

    public function multiPlans(): BelongsToMany
    {
        return $this->belongsToMany(Plan::class, 'plan_products')
            ->withPivot(['price_per_user', 'staff_limit'])
            ->withTimestamps();
    }

    public function features(): HasMany
    {
        return $this->hasMany(Feature::class);
    }

    public function companyProducts(): HasMany
    {
        return $this->hasMany(CompanyProduct::class);
    }

    public function companies(): BelongsToMany
    {
        return $this->belongsToMany(Company::class, 'company_products')
            ->withPivot(['plan_id', 'status', 'starts_at', 'expires_at', 'staff_limit', 'notes'])
            ->withTimestamps();
    }
}
