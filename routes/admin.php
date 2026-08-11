<?php

use App\Http\Controllers\Auth\AdminLoginController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\Master\AreaWebController;
use App\Http\Controllers\Admin\Master\BusinessCategoryWebController;
use App\Http\Controllers\Admin\Master\CityWebController;
use App\Http\Controllers\Admin\Master\CountryWebController;
use App\Http\Controllers\Admin\Master\LanguageWebController;
use App\Http\Controllers\Admin\Master\PlanWebController;
use App\Http\Controllers\Admin\Master\StateWebController;
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
        Route::post('clear-cache', [MasterController::class, 'clearCache'])->name('clear-cache');

        Route::inertia('ai-assistant', 'admin/ai-assistant')->name('ai-assistant');

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
