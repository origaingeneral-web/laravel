<?php

use App\Models\User;

test('guests are redirected from the account profile page', function () {
    $response = $this->get(route('account.profile'));

    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the account profile page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('account.profile'))
        ->assertOk();
});
