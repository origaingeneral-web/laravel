<?php

use App\Http\Controllers\Admin\Communication\CommunicationLogController;
use App\Http\Controllers\Admin\Company\CompanyController;
use App\Http\Controllers\Admin\Dashboard\DashboardController;
use App\Http\Controllers\Admin\Feature\FeatureController;
use App\Http\Controllers\Admin\Master\AreaWebController;
use App\Http\Controllers\Admin\Master\BusinessCategoryWebController;
use App\Http\Controllers\Admin\Master\CityWebController;
use App\Http\Controllers\Admin\Master\CountryWebController;
use App\Http\Controllers\Admin\Master\LanguageWebController;
use App\Http\Controllers\Admin\Master\StateWebController;
use App\Http\Controllers\Admin\Notification\NotificationController;
use App\Http\Controllers\Admin\Payment\PaymentController;
use App\Http\Controllers\Admin\Permission\PermissionController;
use App\Http\Controllers\Admin\Security\SecretAccessController;
use App\Http\Controllers\Admin\Setting\SettingController;
use App\Http\Controllers\Admin\Subscription\SubscriptionController;
use App\Http\Controllers\Admin\System\DatabaseController;
use App\Http\Controllers\Admin\System\EnvController;
use App\Http\Controllers\Admin\System\ServerController;
use App\Http\Controllers\Admin\Template\NotificationTemplateController;
use App\Http\Controllers\Auth\AdminLoginController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function (): void {
    // Guest Routes
    Route::middleware('guest:super_admin')->group(function (): void {
        Route::get('login', [AdminLoginController::class, 'index'])->name('login');
        Route::post('login', [AdminLoginController::class, 'login']);
    });

    // Authenticated Routes
    Route::middleware('auth:super_admin')->group(function (): void {
        Route::get('dashboard', DashboardController::class)->name('dashboard');
        Route::post('logout', [AdminLoginController::class, 'logout'])->name('logout');
        // Route::post('clear-cache', [MasterController::class, 'clearCache'])->name('clear-cache');

        Route::inertia('ai-assistant', 'admin/ai-assistant')->name('ai-assistant');

        Route::resource('companies', CompanyController::class);

        Route::get('payments', [PaymentController::class, 'index'])->name('payments.index');
        Route::get('subscriptions', [SubscriptionController::class, 'index'])->name('subscriptions.index');
        Route::resource('features', FeatureController::class);
        Route::resource('permissions', PermissionController::class);
        Route::resource('templates', NotificationTemplateController::class);
        Route::get('communication/logs', [CommunicationLogController::class, 'index'])->name('communication.logs');
        Route::get('communication/notifications/firebase', [NotificationController::class, 'indexFirebase'])->name('notifications.firebase.index');
        Route::get('communication/notifications/firebase/create', [NotificationController::class, 'createFirebase'])->name('notifications.firebase.create');
        Route::post('communication/notifications/firebase/create', [NotificationController::class, 'storeFirebase'])->name('notifications.firebase.store');
        Route::get('communication/notifications/panel', [NotificationController::class, 'indexPanel'])->name('notifications.panel.index');
        Route::get('communication/notifications/panel/create', [NotificationController::class, 'createPanel'])->name('notifications.panel.create');
        Route::post('communication/notifications/panel/create', [NotificationController::class, 'storePanel'])->name('notifications.panel.store');

        // Super Admin Secret Password Challenge Routes
        Route::get('secret-access/verify', [SecretAccessController::class, 'show'])->name('secret-access.show');
        Route::post('secret-access/verify', [SecretAccessController::class, 'verify'])->name('secret-access.verify');
        Route::post('secret-access/lock', [SecretAccessController::class, 'lock'])->name('secret-access.lock');

        // Sensitive Settings & System Routes (Protected by Secret Password)
        Route::middleware('super_admin.secret')->group(function (): void {
            Route::get('settings/{group}', [SettingController::class, 'edit'])->name('settings.edit');
            Route::post('settings/{group}', [SettingController::class, 'update'])->name('settings.update');

            // System Routes
            Route::get('system/server', [ServerController::class, 'index'])->name('system.server');
            Route::get('system/env', [EnvController::class, 'index'])->name('system.env');
            Route::post('system/env', [EnvController::class, 'update'])->name('system.env.update');
            Route::get('system/database', [DatabaseController::class, 'index'])->name('system.database');
            Route::post('system/database/full-backup', [DatabaseController::class, 'createFullBackup'])->name('system.database.full-backup');
            Route::post('system/database/company-backup', [DatabaseController::class, 'createCompanyBackup'])->name('system.database.company-backup');
            Route::post('system/database/purge-company', [DatabaseController::class, 'purgeCompanyData'])->name('system.database.purge-company');
            Route::get('system/database/download/{filename}', [DatabaseController::class, 'download'])->name('system.database.download');
            Route::delete('system/database/delete/{filename}', [DatabaseController::class, 'destroy'])->name('system.database.delete');
        });

        // Master Routes
        Route::prefix('master')->name('master.')->group(function (): void {
            Route::get('business-categories', [BusinessCategoryWebController::class, 'index'])->name('business-categories.index');
            Route::get('languages', [LanguageWebController::class, 'index'])->name('languages.index');
            Route::get('countries', [CountryWebController::class, 'index'])->name('countries.index');
            Route::get('states', [StateWebController::class, 'index'])->name('states.index');
            Route::get('cities', [CityWebController::class, 'index'])->name('cities.index');
            Route::get('areas', [AreaWebController::class, 'index'])->name('areas.index');
        });
    });
});
