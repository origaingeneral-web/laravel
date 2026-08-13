<?php

use App\Http\Controllers\Admin\CommunicationLogController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FeatureController;
use App\Http\Controllers\Admin\Master\AreaWebController;
use App\Http\Controllers\Admin\Master\BusinessCategoryWebController;
use App\Http\Controllers\Admin\Master\CityWebController;
use App\Http\Controllers\Admin\Master\CountryWebController;
use App\Http\Controllers\Admin\Master\LanguageWebController;
use App\Http\Controllers\Admin\Master\PlanWebController;
use App\Http\Controllers\Admin\Master\StateWebController;
use App\Http\Controllers\Admin\NotificationTemplateController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\SubscriptionController;
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
        Route::resource('templates', NotificationTemplateController::class);
        Route::get('communication/logs', [CommunicationLogController::class, 'index'])->name('communication.logs');
        Route::get('communication/notifications/firebase', [NotificationController::class, 'indexFirebase'])->name('notifications.firebase.index');
        Route::get('communication/notifications/firebase/create', [NotificationController::class, 'createFirebase'])->name('notifications.firebase.create');
        Route::post('communication/notifications/firebase/create', [NotificationController::class, 'storeFirebase'])->name('notifications.firebase.store');
        Route::get('communication/notifications/panel', [NotificationController::class, 'indexPanel'])->name('notifications.panel.index');
        Route::get('communication/notifications/panel/create', [NotificationController::class, 'createPanel'])->name('notifications.panel.create');
        Route::post('communication/notifications/panel/create', [NotificationController::class, 'storePanel'])->name('notifications.panel.store');

        Route::get('settings/{group}', [SettingController::class, 'edit'])->name('settings.edit');
        Route::post('settings/{group}', [SettingController::class, 'update'])->name('settings.update');

        // Master Routes
        Route::prefix('master')->name('master.')->group(function (): void {
            Route::get('business-categories', [BusinessCategoryWebController::class, 'index'])->name('business-categories.index');
            Route::get('languages', [LanguageWebController::class, 'index'])->name('languages.index');
            Route::get('countries', [CountryWebController::class, 'index'])->name('countries.index');
            Route::get('states', [StateWebController::class, 'index'])->name('states.index');
            Route::get('cities', [CityWebController::class, 'index'])->name('cities.index');
            Route::get('areas', [AreaWebController::class, 'index'])->name('areas.index');
            Route::get('plans', [PlanWebController::class, 'index'])->name('plans.index');
        });
    });
});
