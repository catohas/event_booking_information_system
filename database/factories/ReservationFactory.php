<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class ReservationFactory extends Factory
{
    protected $model = Reservation::class;

    public function definition(): array
    {
        return [
            'seat_row' => $this->faker->randomNumber(),
            'seat_col' => $this->faker->randomNumber(),
            'paid_date' => Carbon::now(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'event_id' => Event::factory(),
        ];
    }
}
