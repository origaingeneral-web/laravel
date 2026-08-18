<?php

namespace App\Models\Auth;

use App\Models\Admin\Feature\Feature;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends SpatiePermission
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'guard_name',
        'feature_id',
        'module_product_id',
        'module_item_id',
        'module_feature_id',
    ];

    /**
     * @return BelongsTo<Feature, $this>
     */
    public function feature(): BelongsTo
    {
        return $this->belongsTo(Feature::class);
    }
}
