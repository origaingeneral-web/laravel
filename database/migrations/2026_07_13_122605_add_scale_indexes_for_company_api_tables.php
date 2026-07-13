<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Hot-path indexes for multi-tenant company API at large user volume.
     */
    public function up(): void
    {
        $this->addIndexIfMissing('users', 'users_company_active_id_idx', ['company_id', 'is_active', 'id']);
        $this->addIndexIfMissing('users', 'users_company_name_idx', ['company_id', 'name']);
        $this->addIndexIfMissing('company_products', 'company_products_company_expires_idx', ['company_id', 'expires_at']);
        $this->addIndexIfMissing('company_products', 'company_products_status_expires_idx', ['status', 'expires_at']);
        $this->addIndexIfMissing('company_product_feature', 'cpf_company_product_enabled_idx', ['company_id', 'product_id', 'is_enabled']);
        $this->addIndexIfMissing('user_product_access', 'upa_user_active_product_idx', ['user_id', 'is_active', 'product_id']);
        $this->addIndexIfMissing('user_product_access', 'upa_company_user_active_idx', ['company_id', 'user_id', 'is_active']);
        $this->addIndexIfMissing('features', 'features_product_active_sort_idx', ['product_id', 'is_active', 'sort_order']);
        $this->addIndexIfMissing('plans', 'plans_product_active_idx', ['product_id', 'is_active']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        foreach ([
            'users' => ['users_company_active_id_idx', 'users_company_name_idx'],
            'company_products' => ['company_products_company_expires_idx', 'company_products_status_expires_idx'],
            'company_product_feature' => ['cpf_company_product_enabled_idx'],
            'user_product_access' => ['upa_user_active_product_idx', 'upa_company_user_active_idx'],
            'features' => ['features_product_active_sort_idx'],
            'plans' => ['plans_product_active_idx'],
        ] as $table => $indexes) {
            foreach ($indexes as $index) {
                $this->dropIndexIfExists($table, $index);
            }
        }
    }

    /**
     * @param  list<string>  $columns
     */
    private function addIndexIfMissing(string $table, string $index, array $columns): void
    {
        $indexes = collect(Schema::getIndexes($table))->pluck('name');

        if ($indexes->contains($index)) {
            return;
        }

        Schema::table($table, function (Blueprint $blueprint) use ($columns, $index): void {
            $blueprint->index($columns, $index);
        });
    }

    private function dropIndexIfExists(string $table, string $index): void
    {
        $indexes = collect(Schema::getIndexes($table))->pluck('name');

        if (! $indexes->contains($index)) {
            return;
        }

        Schema::table($table, function (Blueprint $blueprint) use ($index): void {
            $blueprint->dropIndex($index);
        });
    }
};
