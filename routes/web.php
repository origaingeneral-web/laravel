<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;

Route::get('/', [AuthenticatedSessionController::class, 'create'])
    ->middleware('guest')
    ->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('account/home/user-profile', 'account/home/user-profile')
        ->name('account.profile');
});

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/admin/settings/payment');
    Route::redirect('settings/{group}', '/admin/settings/{group}');
    Route::redirect('system', '/admin/system/server');
    Route::redirect('system/server', '/admin/system/server');
    Route::redirect('system/env', '/admin/system/env');
    Route::redirect('env', '/admin/system/env');
    Route::redirect('system/database', '/admin/system/database');
    Route::redirect('database', '/admin/system/database');
});

require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
// require __DIR__.'/settings.php';
