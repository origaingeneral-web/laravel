<?php

test('renders login page on home for guests', function () {
    $response = $this->get(route('home'));

    $response->assertStatus(200);
});
