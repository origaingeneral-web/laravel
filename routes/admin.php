<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\Master\BusinessCategoryController;
use App\Http\Controllers\Admin\MasterController;
use App\Http\Controllers\Auth\AdminLoginController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/admin', function () {
    if (Auth::guard('super_admin')->check()) {
        return redirect()->route('admin.dashboard');
    }

    return redirect()->route('admin.login');
})->name('admin');

Route::get('/admin/login', [AdminLoginController::class, 'index'])
    ->name('admin.login');

Route::post('/admin/login', [AdminLoginController::class, 'login'])
    ->name('admin.login.store');

Route::middleware(['auth:super_admin', 'admin.access'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function (): void {
        Route::get('/dashboard', DashboardController::class)->name('dashboard');
        Route::post('/logout', [AdminLoginController::class, 'logout'])->name('logout');

        // Master Routes
        Route::prefix('master')->name('master.')->group(function (): void {
            Route::resource('business-categories', BusinessCategoryController::class)
                ->except(['create', 'show', 'edit']);
            Route::get('/{entity}', [MasterController::class, 'index'])->name('index');
            Route::post('/{entity}', [MasterController::class, 'store'])->name('store');
            Route::post('/{entity}/{id}', [MasterController::class, 'update'])->name('update');
            Route::put('/{entity}/{id}', [MasterController::class, 'update']);
            Route::delete('/{entity}/{id}', [MasterController::class, 'destroy'])->name('destroy');
        });
    });
