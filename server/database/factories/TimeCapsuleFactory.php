<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\TimeCapsule; 
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TimeCapsule>
 */
class TimeCapsuleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = TimeCapsule::class;
    public function definition(): array
    {
        $futureDate = fake()->dateTimeBetween('+1 month', '+2 years');
        
        $city = fake()->city();
        $country = fake()->country();
        $latitude = fake()->latitude();
        $longitude = fake()->longitude();
        
        return [
            'title' => fake()->sentence(3, true),
            'message' => fake()->paragraph(3),
            'location' => $city . ', ' . $country,
            'latitude' => $latitude,
            'longitude' => $longitude,
            'reveal_date' => $futureDate->format('Y-m-d H:i:s'),
            'is_public' => true,
            'color' => fake()->hexColor(),
            'emoji' => fake()->randomElement(['🌟', '💕', '🎯', '🎓', '🌈', '🔥']),
            'privacy' => 'public',
            'created_at' => fake()->dateTimeBetween('-6 months', 'now'),
        ];
    }
}
