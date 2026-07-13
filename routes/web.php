<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('login');
})->name('home');

Route::prefix('nexlink')->name('nexlink.')->group(function () {
    Route::get('/', function () {
        return view('nexlink.index');
    })->name('home');

    Route::get('/{page}', function (string $page) {
        $page = trim($page, '/');
        $page = preg_replace('/\.html$/', '', $page);

        abort_unless(preg_match('/^[A-Za-z0-9_\/-]+$/', $page), 404);

        $view = 'nexlink.'.str_replace('/', '.', $page);

        abort_unless(view()->exists($view), 404);

        return view($view);
    })->where('page', '.*')->name('page');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('masters', 'masters')->name('masters');
    Route::inertia('masters/create', 'masters/create')->name('master.create');
    Route::inertia('masters/{id}/edit', 'masters/edit')->whereNumber('id')->name('master.edit');
    Route::inertia('tasks', 'tasks')->name('tasks');
    Route::inertia('analytics', 'analytics')->name('analytics');
    Route::inertia('team', 'team')->name('team');
    Route::inertia('sales', 'sales')->name('sales');
    Route::inertia('finance', 'finance')->name('finance');
    Route::inertia('customers', 'customers')->name('customers');
    Route::inertia('deals', 'deals')->name('deals');
    Route::inertia('review', 'review')->name('review');
    Route::inertia('activities', 'activities')->name('activities');
    Route::inertia('employee', 'employee')->name('employee');
    Route::inertia('user-management', 'user-management')->name('user-management');
    Route::inertia('calendar', 'calendar')->name('calendar');
    Route::inertia('chat', 'chat')->name('chat');
    Route::inertia('email/inbox', 'email/inbox')->name('email.inbox');
    Route::inertia('email/compose', 'email/compose')->name('email.compose');
    Route::inertia('email/read-email', 'email/read-email')->name('email.read');
});

require __DIR__.'/admin.php';
require __DIR__.'/settings.php';
