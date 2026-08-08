<?php

use Illuminate\Support\Facades\Route;
use Inertia\Testing\AssertableInertia as Assert;

test('missing web pages render the inertia 404 page', function () {
    $this->get('/missing-page-for-error-test')
        ->assertNotFound()
        ->assertInertia(fn (Assert $page) => $page
            ->component('errors/404')
        );
});

test('server errors render the inertia 500 page', function () {
    Route::get('/test-server-error-page', fn () => abort(500));

    $this->get('/test-server-error-page')
        ->assertStatus(500)
        ->assertInertia(fn (Assert $page) => $page
            ->component('errors/500')
        );
});
