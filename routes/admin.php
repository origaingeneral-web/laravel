<?php

use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\CompanyProductAssignmentController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Auth\AdminLoginController;
use App\Http\Middleware\EnsureAdminAccess;
use Illuminate\Support\Facades\Route;

Route::redirect('/super-admin', '/admin/login');

Route::middleware('guest:super_admin')->prefix('admin')->name('admin.')->group(function () {
    Route::get('login', [AdminLoginController::class, 'index'])->name('login');
    Route::post('login', [AdminLoginController::class, 'login'])->name('login.store');
});

Route::middleware(['auth:super_admin', EnsureAdminAccess::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::post('logout', [AdminLoginController::class, 'logout'])->name('logout');

    Route::get('companies', [CompanyController::class, 'index'])->name('companies.index');
    Route::get('companies/create', [CompanyController::class, 'create'])->name('companies.create');
    Route::post('companies', [CompanyController::class, 'store'])->name('companies.store');
    Route::get('companies/{company}', [CompanyController::class, 'show'])->name('companies.show');
    Route::get('companies/{company}/edit', [CompanyController::class, 'edit'])->name('companies.edit');
    Route::put('companies/{company}', [CompanyController::class, 'update'])->name('companies.update');

    Route::get('companies/{company}/products', [CompanyProductAssignmentController::class, 'edit'])
        ->name('companies.products.edit');
    Route::put('companies/{company}/products', [CompanyProductAssignmentController::class, 'update'])
        ->name('companies.products.update');
    Route::put('companies/{company}/products/{product}/features', [CompanyProductAssignmentController::class, 'syncFeatures'])
        ->whereNumber('product')
        ->name('companies.products.features.update');
});
