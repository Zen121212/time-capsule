<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a specific admin user for testing
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@timecapsule.com',
            'password' => bcrypt('password123'),
        ]);
        
        // Create a specific test user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@timecapsule.com',
            'password' => bcrypt('password123'),
        ]);
        
        // Create 10 random users
        User::factory(10)->create();
    }
}
