<?php

namespace Database\Factories;

use App\Models\Playstation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Playstation>
 */
class PlaystationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Paket '.$this->faker->unique()->word(),
            'type' => $this->faker->randomElement(['PlayStation 4', 'PlayStation 5']),
            'version' => $this->faker->randomElement(['Digital Edition', 'Disc Edition', '1TB']),
            'controllers' => $this->faker->numberBetween(1, 4),
            'price_per_day' => $this->faker->numberBetween(50000, 120000),
            'status' => $this->faker->randomElement(['available', 'rented']),
        ];
    }
}
