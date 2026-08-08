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

require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
// require __DIR__.'/settings.php';
