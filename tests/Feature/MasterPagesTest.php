<?php

use App\Models\User;

test('authenticated users can open master data pages', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->get(route('masters'))->assertOk();
    $this->get(route('master.create'))->assertOk();
    $this->get(route('master.edit', ['id' => 1]))->assertOk();
});
