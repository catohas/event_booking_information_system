<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\Hall;
use App\Models\Showing;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $halls = Hall::factory(5)->create();
        $showings = Showing::factory(5)->create();

        Event::factory(10)->create([
            'hall_id' => fn() => $halls->random()->id,
            'showing_id' => fn() => $showings->random()->id,
        ]);
    }
}
