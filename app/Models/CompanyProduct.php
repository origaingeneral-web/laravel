<?php

namespace App\Models;

use App\Models\Admin\Master\Plan;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CompanyProduct extends Model
{
    protected $fillable = [
        'company_id',
        'product_id',
        'plan_id',
        'status',
        'starts_at',
        'expires_at',
        'staff_limit',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'expires_at' => 'datetime',
            'staff_limit' => 'integer',
        ];
    }

    public function isExpired(): bool
    {
        if ($this->status === 'expired') {
            return true;
        }

        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    public function isAccessible(): bool
    {
        return $this->status === 'active' && ! $this->isExpired();
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function credit(): HasOne
    {
        return $this->hasOne(CompanyProductCredit::class, 'product_id', 'product_id')
            ->where('company_id', $this->company_id);
    }
}
