<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('tasks', 'tasks')->name('tasks');
    Route::inertia('analytics', 'analytics')->name('analytics');
    Route::inertia('team', 'team')->name('team');
});

require __DIR__.'/settings.php';
