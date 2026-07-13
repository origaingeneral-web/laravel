<?php

namespace App\Models;

use App\Enums\CompanyStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;

class Company extends Model
{
    use SoftDeletes;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'business_category_id',
        'company_name',
        'company_code',
        'email',
        'mobile',
        'owner_name',
        'owner_mobile',
        'country_id',
        'state_id',
        'city_id',
        'area_id',
        'landline',
        'pincode',
        'address',
        'profile',
        'status',
        'disabled_reason',
        'terms_accepted',
        'terms_accepted_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => 'integer',
            'terms_accepted' => 'boolean',
            'terms_accepted_at' => 'datetime',
        ];
    }

    public function isAccessible(): bool
    {
        return $this->status === CompanyStatus::Active->value && ! $this->trashed();
    }

    /**
     * @return HasMany<User, $this>
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * @return HasMany<CompanyProduct, $this>
     */
    public function companyProducts(): HasMany
    {
        return $this->hasMany(CompanyProduct::class);
    }

    /**
     * @return BelongsToMany<Product, $this>
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'company_products')
            ->withPivot(['id', 'plan_id', 'status', 'starts_at', 'expires_at', 'staff_limit', 'notes'])
            ->withTimestamps();
    }

    /**
     * Active (non-expired) product subscriptions for this company.
     *
     * @return Collection<int, CompanyProduct>
     */
    public function accessibleCompanyProducts(): Collection
    {
        return $this->companyProducts()
            ->with(['product', 'plan'])
            ->get()
            ->filter(fn (CompanyProduct $subscription) => $subscription->isAccessible())
            ->values();
    }
}
