<?php

use App\Models\Playstation;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can list playstations', function () {
    Playstation::factory()->count(2)->create();

    $response = $this->getJson('/api/playstations');

    $response
        ->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonStructure([
            'data' => [
                ['id', 'name', 'type', 'version', 'controllers', 'price_per_day', 'status'],
            ],
        ]);
});

it('can create a playstation', function () {
    $payload = [
        'name' => 'Paket Turnamen',
        'type' => 'PlayStation 5',
        'version' => 'Disc Edition',
        'controllers' => 4,
        'price_per_day' => 120000,
        'status' => 'available',
    ];

    $response = $this->postJson('/api/playstations', $payload);

    $response
        ->assertCreated()
        ->assertJsonPath('data.name', 'Paket Turnamen');

    $this->assertDatabaseHas('playstations', [
        'name' => 'Paket Turnamen',
        'controllers' => 4,
    ]);
});

it('can update a playstation', function () {
    $playstation = Playstation::factory()->create();

    $response = $this->putJson("/api/playstations/{$playstation->id}", [
        'status' => 'rented',
        'price_per_day' => 99000,
    ]);

    $response
        ->assertOk()
        ->assertJsonPath('data.status', 'rented')
        ->assertJsonPath('data.price_per_day', 99000);

    $this->assertDatabaseHas('playstations', [
        'id' => $playstation->id,
        'status' => 'rented',
    ]);
});

it('can delete a playstation', function () {
    $playstation = Playstation::factory()->create();

    $response = $this->deleteJson("/api/playstations/{$playstation->id}");

    $response->assertOk();

    $this->assertDatabaseMissing('playstations', [
        'id' => $playstation->id,
    ]);
});
