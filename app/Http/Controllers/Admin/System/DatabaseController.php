<?php

namespace App\Http\Controllers\Admin\System;

use App\Http\Controllers\Controller;
use App\Models\Admin\Feature\Feature;
use App\Models\Company\Company;
use App\Models\Product\Product;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class DatabaseController extends Controller
{
    protected string $backupDir;

    public function __construct()
    {
        $this->backupDir = storage_path('app/backups');
        if (! File::exists($this->backupDir)) {
            File::makeDirectory($this->backupDir, 0755, true);
        }
    }

    /**
     * Display database backup & company maintenance page.
     */
    public function index(): Response
    {
        $companies = Company::select('id', 'company_name', 'company_code', 'email', 'status')
            ->orderBy('company_name')
            ->get();

        $backups = $this->getBackupFiles();
        $dbStats = $this->getDatabaseStats();

        return Inertia::render('admin/system/database', [
            'companies' => $companies,
            'backups' => $backups,
            'dbStats' => $dbStats,
        ]);
    }

    /**
     * Create full database SQL backup.
     */
    public function createFullBackup(): RedirectResponse
    {
        try {
            $filename = 'full_db_backup_'.now()->format('Y-m-d_His').'.sql';
            $filePath = $this->backupDir.DIRECTORY_SEPARATOR.$filename;

            $sqlDump = $this->generateFullSqlDump();
            File::put($filePath, $sqlDump);

            return back()->with('success', "Full database backup created successfully: {$filename}");
        } catch (\Throwable $e) {
            return back()->with('error', 'Failed to generate database backup: '.$e->getMessage());
        }
    }

    /**
     * Create company-wise data backup.
     */
    public function createCompanyBackup(Request $request): RedirectResponse
    {
        $request->validate([
            'company_id' => ['required', 'exists:companies,id'],
        ]);

        try {
            $company = Company::findOrFail($request->input('company_id'));
            $filename = 'company_'.($company->company_code ?: $company->id).'_backup_'.now()->format('Y-m-d_His').'.json';
            $filePath = $this->backupDir.DIRECTORY_SEPARATOR.$filename;

            $data = $this->getCompanyData($company->id);
            $payload = [
                'type' => 'company_backup',
                'company_id' => $company->id,
                'company_name' => $company->company_name,
                'company_code' => $company->company_code,
                'created_at' => now()->toDateTimeString(),
                'tables' => $data,
            ];

            File::put($filePath, json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

            return back()->with('success', "Company backup created for '{$company->company_name}': {$filename}");
        } catch (\Throwable $e) {
            return back()->with('error', 'Failed to generate company backup: '.$e->getMessage());
        }
    }

    /**
     * Purge company data after taking mandatory backup.
     * Preserves the company record in `companies` table.
     */
    public function purgeCompanyData(Request $request): RedirectResponse
    {
        $request->validate([
            'company_id' => ['required', 'exists:companies,id'],
            'confirmation' => ['required', 'string', 'in:PURGE,CONFIRM'],
        ]);

        try {
            $company = Company::findOrFail($request->input('company_id'));

            // 1. MANDATORY: Take complete backup of company data first
            $filename = 'auto_backup_before_purge_'.($company->company_code ?: $company->id).'_'.now()->format('Y-m-d_His').'.json';
            $filePath = $this->backupDir.DIRECTORY_SEPARATOR.$filename;

            $data = $this->getCompanyData($company->id);
            $payload = [
                'type' => 'auto_purge_backup',
                'company_id' => $company->id,
                'company_name' => $company->company_name,
                'company_code' => $company->company_code,
                'created_at' => now()->toDateTimeString(),
                'reason' => 'Auto-backup generated prior to data purge operation',
                'tables' => $data,
            ];

            File::put($filePath, json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

            // Verify backup exists on disk before proceeding with deletion
            if (! File::exists($filePath) || File::size($filePath) === 0) {
                return back()->with('error', 'Backup verification failed before purge. Operation aborted for safety.');
            }

            // 2. Perform safe deletion inside a database transaction
            $deletedCounts = [];

            DB::transaction(function () use ($company, &$deletedCounts): void {
                $cId = $company->id;

                // Payments
                if (Schema::hasTable('payments')) {
                    $deletedCounts['payments'] = DB::table('payments')->where('company_id', $cId)->delete();
                }

                // Communication Logs
                if (Schema::hasTable('communication_logs')) {
                    $deletedCounts['communication_logs'] = DB::table('communication_logs')->where('company_id', $cId)->delete();
                }

                // Credit Logs
                if (Schema::hasTable('company_product_credit_logs')) {
                    $deletedCounts['credit_logs'] = DB::table('company_product_credit_logs')->where('company_id', $cId)->delete();
                }

                // Product Credits
                if (Schema::hasTable('company_product_credits')) {
                    $deletedCounts['product_credits'] = DB::table('company_product_credits')->where('company_id', $cId)->delete();
                }

                // Addon Feature Requests
                if (Schema::hasTable('addon_feature_requests')) {
                    $deletedCounts['addon_requests'] = DB::table('addon_feature_requests')->where('company_id', $cId)->delete();
                }

                // Renewal Requests
                if (Schema::hasTable('renewal_requests')) {
                    $deletedCounts['renewal_requests'] = DB::table('renewal_requests')->where('company_id', $cId)->delete();
                }

                // Company Products / Subscriptions
                if (Schema::hasTable('company_products')) {
                    $deletedCounts['subscriptions'] = DB::table('company_products')->where('company_id', $cId)->delete();
                }

                // User Product Accesses
                if (Schema::hasTable('user_product_accesses')) {
                    $deletedCounts['product_access'] = DB::table('user_product_accesses')->where('company_id', $cId)->delete();
                }

                // FCM Tokens for company
                if (Schema::hasTable('fcm_tokens')) {
                    $deletedCounts['fcm_tokens'] = DB::table('fcm_tokens')->where('company_id', $cId)->delete();
                }

                // Company User accounts (excluding super admins)
                if (Schema::hasTable('users')) {
                    $deletedCounts['users'] = DB::table('users')->where('company_id', $cId)->delete();
                }
            });

            $totalDeleted = array_sum($deletedCounts);

            return back()->with('success', "Company data for '{$company->company_name}' was purged successfully ({$totalDeleted} records removed). Auto-backup saved: {$filename}");
        } catch (\Throwable $e) {
            return back()->with('error', 'Failed to purge company data: '.$e->getMessage());
        }
    }

    /**
     * Download a backup file.
     */
    public function download(string $filename): BinaryFileResponse|RedirectResponse
    {
        // Sanitize filename to prevent directory traversal
        $filename = basename($filename);
        $filePath = $this->backupDir.DIRECTORY_SEPARATOR.$filename;

        if (! File::exists($filePath)) {
            return back()->with('error', 'Backup file not found.');
        }

        return response()->download($filePath);
    }

    /**
     * Delete a backup file.
     */
    public function destroy(string $filename): RedirectResponse
    {
        $filename = basename($filename);
        $filePath = $this->backupDir.DIRECTORY_SEPARATOR.$filename;

        if (File::exists($filePath)) {
            File::delete($filePath);

            return back()->with('success', "Backup file '{$filename}' deleted successfully.");
        }

        return back()->with('error', 'Backup file not found.');
    }

    /**
     * Gather all company-related rows across all tables.
     */
    protected function getCompanyData(int $companyId): array
    {
        $tables = [
            'companies' => DB::table('companies')->where('id', $companyId)->get(),
            'users' => Schema::hasTable('users') ? DB::table('users')->where('company_id', $companyId)->get() : [],
            'company_products' => Schema::hasTable('company_products') ? DB::table('company_products')->where('company_id', $companyId)->get() : [],
            'company_product_credits' => Schema::hasTable('company_product_credits') ? DB::table('company_product_credits')->where('company_id', $companyId)->get() : [],
            'company_product_credit_logs' => Schema::hasTable('company_product_credit_logs') ? DB::table('company_product_credit_logs')->where('company_id', $companyId)->get() : [],
            'payments' => Schema::hasTable('payments') ? DB::table('payments')->where('company_id', $companyId)->get() : [],
            'communication_logs' => Schema::hasTable('communication_logs') ? DB::table('communication_logs')->where('company_id', $companyId)->get() : [],
            'addon_feature_requests' => Schema::hasTable('addon_feature_requests') ? DB::table('addon_feature_requests')->where('company_id', $companyId)->get() : [],
            'renewal_requests' => Schema::hasTable('renewal_requests') ? DB::table('renewal_requests')->where('company_id', $companyId)->get() : [],
            'user_product_accesses' => Schema::hasTable('user_product_accesses') ? DB::table('user_product_accesses')->where('company_id', $companyId)->get() : [],
        ];

        return $tables;
    }

    /**
     * Generate portable SQL dump string.
     */
    protected function generateFullSqlDump(): string
    {
        $pdo = DB::connection()->getPdo();
        $dbName = DB::connection()->getDatabaseName();

        $out = "-- ========================================================\n";
        $out .= "-- Full Database Backup: {$dbName}\n";
        $out .= '-- Generated at: '.now()->toDateTimeString()."\n";
        $out .= '-- Host: '.($_SERVER['SERVER_ADDR'] ?? '127.0.0.1')."\n";
        $out .= "-- ========================================================\n\n";
        $out .= "SET FOREIGN_KEY_CHECKS=0;\nSET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';\n\n";

        $tables = Schema::getTableListing();

        foreach ($tables as $table) {
            $out .= "-- --------------------------------------------------------\n";
            $out .= "-- Structure for table `{$table}`\n";
            $out .= "-- --------------------------------------------------------\n";
            $out .= "DROP TABLE IF EXISTS `{$table}`;\n";

            try {
                $createStmt = DB::select("SHOW CREATE TABLE `{$table}`");
                if (! empty($createStmt)) {
                    $row = (array) $createStmt[0];
                    $createSql = $row['Create Table'] ?? array_values($row)[1] ?? '';
                    $out .= $createSql.";\n\n";
                }
            } catch (\Throwable $e) {
                // If SHOW CREATE TABLE is not supported on driver, continue
            }

            // Dump data rows
            $rows = DB::table($table)->get();
            if ($rows->count() > 0) {
                $out .= "-- Dumping data for table `{$table}`\n";

                $columns = array_keys((array) $rows[0]);
                $columnList = implode('`, `', $columns);

                foreach ($rows->chunk(100) as $chunk) {
                    $valuesArr = [];
                    foreach ($chunk as $row) {
                        $values = [];
                        foreach ((array) $row as $val) {
                            if ($val === null) {
                                $values[] = 'NULL';
                            } else {
                                $values[] = $pdo->quote((string) $val);
                            }
                        }
                        $valuesArr[] = '('.implode(', ', $values).')';
                    }
                    $out .= "INSERT INTO `{$table}` (`{$columnList}`) VALUES\n".implode(",\n", $valuesArr).";\n";
                }
                $out .= "\n";
            }
        }

        $out .= "SET FOREIGN_KEY_CHECKS=1;\n";

        return $out;
    }

    /**
     * Get list of backups in storage directory.
     */
    protected function getBackupFiles(): array
    {
        if (! File::exists($this->backupDir)) {
            return [];
        }

        $files = File::files($this->backupDir);
        $backups = [];

        foreach ($files as $file) {
            $name = $file->getFilename();
            $type = 'full';
            $companyName = null;

            if (str_starts_with($name, 'company_')) {
                $type = 'company';
            } elseif (str_starts_with($name, 'auto_backup_before_purge_')) {
                $type = 'auto_purge';
            }

            $backups[] = [
                'filename' => $name,
                'type' => $type,
                'size' => $this->formatBytes($file->getSize()),
                'size_raw' => $file->getSize(),
                'created_at' => date('Y-m-d H:i:s', $file->getMTime()),
                'download_url' => route('admin.system.database.download', ['filename' => $name]),
            ];
        }

        // Sort latest first
        usort($backups, fn ($a, $b) => strcmp($b['created_at'], $a['created_at']));

        return $backups;
    }

    /**
     * Database statistics.
     */
    protected function getDatabaseStats(): array
    {
        $driver = config('database.default', 'mysql');
        $dbName = config("database.connections.{$driver}.database", 'laravel');
        $tableCount = count(Schema::getTableListing());

        return [
            'driver' => $driver,
            'database' => $dbName,
            'tables_count' => $tableCount,
            'backups_count' => count(File::files($this->backupDir)),
            'backup_dir' => $this->backupDir,
        ];
    }

    protected function formatBytes(float|int $bytes, int $precision = 2): string
    {
        if ($bytes <= 0) {
            return '0 B';
        }

        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);

        return round($bytes, $precision).' '.$units[$pow];
    }
}
