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
        
        return [
            'title' => fake()->sentence(3, true),
            'message' => fake()->paragraph(3),
            'location' => fake()->city(),
            'reveal_date' => $futureDate->format('Y-m-d H:i:s'), // Using timestamp as integer
            'is_public' => fake()->boolean(70), // 70% chance of being public
            'color' => fake()->hexColor(),
            'emoji' => fake()->randomElement(['🎉', '❤️', '🌟', '🚀', '🎈', '🌸', '⭐', '🎭']),
            'privacy' => fake()->randomElement(['Public', 'Private']),
            'created_at' => fake()->dateTimeBetween('-6 months', 'now'),
        ];
    }
}
