<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\Hall;
use App\Models\Showing;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        $randomMinutes = rand(0, 24 * 60);
        return [
            'starts_at' => Carbon::now()->addMinutes($randomMinutes),
            'price' => $this->faker->randomNumber(3),
            'created_at' => Carbon::now()->subMinutes($randomMinutes),
            'updated_at' => Carbon::now()->subMinutes($randomMinutes),

            'hall_id' => Hall::factory(),
            'showing_id' => Showing::factory(),
        ];
    }
}
