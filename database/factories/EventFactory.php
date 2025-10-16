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
        return [
            'starts_at' => Carbon::now(),
            'price' => $this->faker->randomNumber(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'hall_id' => Hall::factory(),
            'showing_id' => Showing::factory(),
        ];
    }
}
