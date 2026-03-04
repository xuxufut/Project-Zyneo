<?php

namespace Database\Factories;

use App\Models\Playstation;
use App\Models\RentalSchedule;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RentalSchedule>
 */
class RentalScheduleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'playstation_id' => Playstation::factory(),
            'customer_name' => $this->faker->name(),
            'date' => $this->faker->date(),
            'start_time' => '10:00',
            'end_time' => '14:00',
            'status' => $this->faker->randomElement(['pending', 'confirmed']),
        ];
    }
}
