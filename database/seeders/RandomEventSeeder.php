<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Reservation;
use App\Models\User;
use App\Models\Event;
use App\Models\Hall;
use App\Models\Showing;

class RandomEventSeeder extends Seeder
{
    public function run($user = null): void
    {
        $halls = Hall::factory(5)->create();
        $showings = Showing::factory(5)->create();

        $events = Event::factory(10)->create([
            'hall_id' => fn() => $halls->random()->id,
            'showing_id' => fn() => $showings->random()->id,
        ]);

        Reservation::factory(3)->create([
            'event_id' => fn() => $events->random()->id,
            'user_id' => fn() => $user?->id ?? User::inRandomOrder()->first()->id,
        ]);
    }
}
