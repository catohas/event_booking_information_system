<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        //User::factory(10)->create();

         User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'role' => 'viewer',
                'email_verified_at' => now(),
            ]
        );

         User::firstOrCreate(
            ['email' => 'admin@a.com'],
            [
                'name' => 'Admin User',
                'password' => 'admin',
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'cashier@c.com'],
            [
                'name' => 'Cashier User',
                'password' => 'cashier',
                'role' => 'cashier',
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'redactor@r.com'],
            [
                'name' => 'Redactor User',
                'password' => 'redactor',
                'role' => 'redactor',
                'email_verified_at' => now(),
            ]
        );

        $this->callWith(EventSeeder::class);
        $this->call(ReservationSeeder::class);
    }
}
