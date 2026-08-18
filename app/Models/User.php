<?php

namespace App\Models;

use App\Concerns\TwoFactorAuthenticatable;
use App\Enums\RoleName;
use App\Models\Company\Company;
use App\Models\Company\CompanyProduct;
use App\Models\Product\Product;
use App\Models\Product\UserProductAccess;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

#[Fillable([
    'company_id',
    'user_prefix',
    'group_code',
    'name',
    'email',
    'password',
    'initial_role',
    'is_active',
])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasRoles, Notifiable, TwoFactorAuthenticatable;

    /**
     * The default guard name for Spatie permissions.
     */
    protected string $guard_name = 'web';

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function productAccess(): HasMany
    {
        return $this->hasMany(UserProductAccess::class);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'user_product_access')
            ->withPivot(['company_id', 'is_active'])
            ->withTimestamps();
    }

    /**
     * Whether this user may access a company-subscribed product.
     *
     * @param  bool  $subscriptionVerified  Skip company_products lookup when caller already verified membership.
     */
    public function hasProductAccess(int $productId, bool $subscriptionVerified = false): bool
    {
        if (! $this->company_id) {
            return false;
        }

        if (! $subscriptionVerified) {
            $subscribed = CompanyProduct::query()
                ->where('company_id', $this->company_id)
                ->where('product_id', $productId)
                ->exists();

            if (! $subscribed) {
                return false;
            }
        }

        if ($this->hasRole(RoleName::CompanyAdmin->value)) {
            return true;
        }

        return $this->productAccess()
            ->where('product_id', $productId)
            ->where('company_id', $this->company_id)
            ->where('is_active', true)
            ->exists();
    }

    /**
     * Query builder for company product subscriptions visible to this user.
     *
     * @return Builder<CompanyProduct>
     */
    public function accessibleCompanyProductsQuery(): Builder
    {
        $query = CompanyProduct::query()
            ->with([
                'product:id,name,code,description,is_active',
                'plan:id,product_id,plan_name,duration_in_days,staff_limit,tracking_duration',
            ])
            ->where('company_id', $this->company_id);

        if (! $this->hasRole(RoleName::CompanyAdmin->value)) {
            $query->whereIn('product_id', function ($sub): void {
                $sub->select('product_id')
                    ->from('user_product_access')
                    ->where('user_id', $this->id)
                    ->where('company_id', $this->company_id)
                    ->where('is_active', true);
            });
        }

        return $query->orderBy('company_products.id');
    }

    /**
     * Company product subscriptions visible to this user.
     *
     * @return Collection<int, CompanyProduct>
     */
    public function accessibleCompanyProducts(): Collection
    {
        if (! $this->company_id) {
            return collect();
        }

        return $this->accessibleCompanyProductsQuery()->get();
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }
}
