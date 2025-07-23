<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TimeCapsule;
use App\Models\User;

class TimeCapsuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        
        if ($users->count() === 0) {
            $this->command->warn('No users found. Please run UserSeeder first.');
            return;
        }
        foreach ($users as $user) {
            TimeCapsule::factory(
                fake()->numberBetween(3, 5)
            )->create([
                'user_id' => $user->id,
            ]);
        }
        TimeCapsule::factory(5)->create([
            'user_id' => $users->random()->id,
            'is_public' => true,
            'title' => fake()->sentence(4, true),
        ]);
        
        TimeCapsule::factory(8)->create([
            'user_id' => $users->random()->id,
            'is_public' => true,
            'reveal_date' => fake()->dateTimeBetween('-6 months', '-1 day')->format('Y-m-d H:i:s'),
            'title' => fake()->sentence(4, true),
        ]);
    }
}
