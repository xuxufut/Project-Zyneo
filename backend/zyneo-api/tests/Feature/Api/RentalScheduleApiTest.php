<?php

use App\Models\ApiToken;
use App\Models\Playstation;
use App\Models\RentalSchedule;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function authHeadersForRentalSchedule(): array
{
    $user = User::factory()->create();
    $plainToken = str_repeat((string) random_int(1, 9), 64);

    ApiToken::factory()->create([
        'user_id' => $user->id,
        'token' => hash('sha256', $plainToken),
    ]);

    return [
        'Authorization' => 'Bearer '.$plainToken,
    ];
}

it('can list rental schedules', function () {
    RentalSchedule::factory()->count(2)->create();

    $response = $this->getJson('/api/rental-schedules', authHeadersForRentalSchedule());

    $response
        ->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonStructure([
            'data' => [
                ['id', 'playstation_id', 'customer_name', 'date', 'start_time', 'end_time', 'status'],
            ],
        ]);
});

it('can create rental schedule', function () {
    $playstation = Playstation::factory()->create();

    $payload = [
        'playstation_id' => $playstation->id,
        'customer_name' => 'Budi Santoso',
        'date' => '2026-02-20',
        'start_time' => '09:00',
        'end_time' => '12:00',
        'status' => 'pending',
    ];

    $response = $this->postJson('/api/rental-schedules', $payload, authHeadersForRentalSchedule());

    $response
        ->assertCreated()
        ->assertJsonPath('data.customer_name', 'Budi Santoso');

    $this->assertDatabaseHas('rental_schedules', [
        'customer_name' => 'Budi Santoso',
        'playstation_id' => $playstation->id,
    ]);
});

it('can update rental schedule status', function () {
    $schedule = RentalSchedule::factory()->create(['status' => 'pending']);

    $response = $this->putJson("/api/rental-schedules/{$schedule->id}", [
        'status' => 'confirmed',
    ], authHeadersForRentalSchedule());

    $response
        ->assertOk()
        ->assertJsonPath('data.status', 'confirmed');

    $this->assertDatabaseHas('rental_schedules', [
        'id' => $schedule->id,
        'status' => 'confirmed',
    ]);
});

it('can delete rental schedule', function () {
    $schedule = RentalSchedule::factory()->create();

    $response = $this->deleteJson("/api/rental-schedules/{$schedule->id}", [], authHeadersForRentalSchedule());

    $response->assertOk();

    $this->assertDatabaseMissing('rental_schedules', [
        'id' => $schedule->id,
    ]);
});
