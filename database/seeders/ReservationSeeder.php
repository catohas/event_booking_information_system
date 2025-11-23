<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class ReservationSeeder extends Seeder
{
    /**
     * Seed reservations with different statuses.
     */
    public function run(): void
    {
        // Get users
        $testUser = User::where('email', 'test@example.com')->first();
        $cashier = User::where('email', 'cashier@c.com')->first();
        $redactor = User::where('email', 'redactor@r.com')->first();

        // Get events
        $events = Event::with('hall')->take(5)->get();

        if ($events->isEmpty()) {
            $this->command->warn('No events found. Please seed events first.');
            return;
        }

        $users = collect([$testUser, $cashier, $redactor])->filter();

        if ($users->isEmpty()) {
            $this->command->warn('No users found. Please seed users first.');
            return;
        }

        // Create confirmed reservations with paid dates
        foreach ($events->take(3) as $index => $event) {
            $user = $users->get($index % $users->count());
            $hallRows = $event->hall->row_amt;
            $hallCols = $event->hall->col_amt;

            // Create 2-3 confirmed reservations per event
            for ($i = 0; $i < rand(2, 3); $i++) {
                Reservation::create([
                    'event_id' => $event->id,
                    'user_id' => $user->id,
                    'seat_row' => rand(1, min($hallRows, 10)),
                    'seat_col' => rand(1, min($hallCols, 15)),
                    'paid_date' => Carbon::now()->subDays(rand(1, 5)),
                    'status' => Reservation::STATUS_CONFIRMED,
                    'created_at' => Carbon::now()->subDays(rand(1, 7)),
                    'updated_at' => Carbon::now()->subDays(rand(0, 3)),
                ]);
            }
        }

        // Create pending reservations (not yet paid)
        foreach ($events->take(4) as $index => $event) {
            $user = $users->get($index % $users->count());
            $hallRows = $event->hall->row_amt;
            $hallCols = $event->hall->col_amt;

            // Create 1-2 pending reservations per event
            for ($i = 0; $i < rand(1, 2); $i++) {
                Reservation::create([
                    'event_id' => $event->id,
                    'user_id' => $user->id,
                    'seat_row' => rand(1, min($hallRows, 10)),
                    'seat_col' => rand(1, min($hallCols, 15)),
                    'paid_date' => null,
                    'status' => Reservation::STATUS_PENDING,
                    'created_at' => Carbon::now()->subMinutes(rand(30, 120)),
                    'updated_at' => Carbon::now()->subMinutes(rand(15, 90)),
                ]);
            }
        }

        // Create cancelled reservations
        foreach ($events->take(3) as $index => $event) {
            $user = $users->get(($index + 1) % $users->count());
            $hallRows = $event->hall->row_amt;
            $hallCols = $event->hall->col_amt;

            // Create 1 cancelled reservation per event
            Reservation::create([
                'event_id' => $event->id,
                'user_id' => $user->id,
                'seat_row' => rand(1, min($hallRows, 10)),
                'seat_col' => rand(1, min($hallCols, 15)),
                'paid_date' => null,
                'status' => Reservation::STATUS_CANCELLED,
                'created_at' => Carbon::now()->subDays(rand(3, 10)),
                'updated_at' => Carbon::now()->subDays(rand(1, 5)),
            ]);
        }

        $this->command->info('Reservations seeded successfully!');
    }
}
