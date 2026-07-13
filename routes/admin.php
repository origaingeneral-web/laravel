<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AdminLoginController;

Route::get('/super-admin', function () {
    return redirect()->route('admin.login');
});

// Route::middleware('guest')->group(function () {
//     Route::get('/admin/login', function () {
//         return Inertia::render('auth/admin-login');
//     })->name('admin.login');
// });
Route::middleware('guest:super_admin')->group(function () {

    Route::get('/admin/login', [AdminLoginController::class, 'index'])
        ->name('admin.login');

    Route::post('/admin/login', [AdminLoginController::class, 'login'])
        ->name('admin.login.store');
});

Route::middleware('auth:super_admin')->group(function () {

    Route::get('/admin/dashboard', function () {
        return inertia('dashboard');
    })->name('admin.dashboard');

    Route::get('/admin/logout', [AdminLoginController::class, 'logout'])
        ->name('admin.logout');
});
