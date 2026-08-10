<?php

use App\Http\Controllers\Admin\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\Master\BusinessCategoryController;
use App\Http\Controllers\Admin\MasterController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function (): void {
    // Guest Routes
    Route::middleware('guest:admin')->group(function (): void {
        Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
        Route::post('login', [AuthenticatedSessionController::class, 'store']);
    });

    // Authenticated Routes
    Route::middleware('auth:super_admin')->group(function (): void {
        Route::get('dashboard', DashboardController::class)->name('dashboard');
        Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
        Route::post('clear-cache', [MasterController::class, 'clearCache'])->name('clear-cache');

        Route::inertia('ai-assistant', 'admin/ai-assistant')->name('ai-assistant');

        // Master Routes
        Route::prefix('master')->name('master.')->group(function (): void {
            Route::resource('business-categories', BusinessCategoryController::class)
                ->except(['create', 'show', 'edit']);
            Route::post('/{entity}/import', [MasterController::class, 'import'])->name('import');
            Route::get('/{entity}', [MasterController::class, 'index'])->name('index');
            Route::post('/{entity}', [MasterController::class, 'store'])->name('store');
            Route::post('/{entity}/{id}', [MasterController::class, 'update'])->name('update');
            Route::put('/{entity}/{id}', [MasterController::class, 'update']);
            Route::delete('/{entity}/{id}', [MasterController::class, 'destroy'])->name('destroy');
        });
    });
});
