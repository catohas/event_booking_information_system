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
            ['email' => 'viewer@iisprojekt.com'],
            [
                'name' => 'Petr Novák',
                'password' => 'iis_viewer',
                'role' => 'viewer',
                'email_verified_at' => now(),
            ]
        );

         User::firstOrCreate(
            ['email' => 'admin@iisprojekt.com'],
            [
                'name' => 'Kateřina Novotná',
                'password' => 'iis_admin',
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'cashier@iisprojekt.com'],
            [
                'name' => 'Karel Hrubý',
                'password' => 'iis_cashier',
                'role' => 'cashier',
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'redactor@iisprojekt.com'],
            [
                'name' => 'Filip Hartel',
                'password' => 'iis_redactor',
                'role' => 'redactor',
                'email_verified_at' => now(),
            ]
        );

        $this->callWith(EventSeeder::class);
        $this->call(ReservationSeeder::class);
    }
}
