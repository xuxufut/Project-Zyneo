<?php

use App\Models\ApiToken;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can register and receive token', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Zyneo Admin',
        'email' => 'admin@zyneo.test',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response
        ->assertCreated()
        ->assertJsonStructure([
            'message',
            'token',
            'token_type',
            'user' => ['id', 'name', 'email'],
        ]);

    $this->assertDatabaseHas('users', [
        'email' => 'admin@zyneo.test',
    ]);

    $this->assertDatabaseCount('api_tokens', 1);
});

it('can login and use token to get current user', function () {
    $user = User::factory()->create([
        'email' => 'owner@zyneo.test',
        'password' => 'password123',
    ]);

    $loginResponse = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'password123',
    ]);

    $token = $loginResponse->json('token');

    $this->getJson('/api/me', [
        'Authorization' => 'Bearer '.$token,
    ])
        ->assertOk()
        ->assertJsonPath('user.email', $user->email);
});

it('rejects invalid login credentials', function () {
    User::factory()->create([
        'email' => 'owner@zyneo.test',
        'password' => 'password123',
    ]);

    $this->postJson('/api/login', [
        'email' => 'owner@zyneo.test',
        'password' => 'wrong-password',
    ])
        ->assertStatus(422)
        ->assertJsonPath('message', 'Email or password is invalid.');
});

it('can logout and revoke token', function () {
    $user = User::factory()->create();
    $plainToken = str_repeat('a', 64);

    ApiToken::factory()->create([
        'user_id' => $user->id,
        'token' => hash('sha256', $plainToken),
    ]);

    $this->postJson('/api/logout', [], [
        'Authorization' => 'Bearer '.$plainToken,
    ])->assertOk();

    $this->assertDatabaseCount('api_tokens', 0);
});
