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
        // Get all users to assign time capsules to them
        $users = User::all();
        
        if ($users->count() === 0) {
            $this->command->warn('No users found. Please run UserSeeder first.');
            return;
        }
        
        // Create 3-5 time capsules for each user
        foreach ($users as $user) {
            TimeCapsule::factory(
                fake()->numberBetween(3, 5)
            )->create([
                'user_id' => $user->id,
            ]);
        }
        
        // Create some specific public time capsules for testing
        TimeCapsule::factory(5)->create([
            'user_id' => $users->random()->id,
            'is_public' => true,
            'title' => fake()->sentence(4, true),
        ]);
    }
}
