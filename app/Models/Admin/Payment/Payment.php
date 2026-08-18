<?php

namespace App\Models\Admin\Payment;

use App\Models\Company\Company;
use App\Models\Company\CompanyProduct;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'company_id',
        'company_product_id',
        'amount',
        'currency',
        'status',
        'payment_method',
        'transaction_id',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
        ];
    }

    /**
     * @return BelongsTo<Company, $this>
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * @return BelongsTo<CompanyProduct, $this>
     */
    public function companyProduct(): BelongsTo
    {
        return $this->belongsTo(CompanyProduct::class);
    }
}
