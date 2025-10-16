<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class ReservationFactory extends Factory
{
    protected $model = Reservation::class;

    public function definition(): array
    {
        $randomMinutes = rand(0, 24 * 60);
        return [
            'seat_row' => $this->faker->randomDigitNotZero(),
            'seat_col' => $this->faker->randomDigitNotZero(),
            'paid_date' => Carbon::now(),
            'created_at' => Carbon::now()->subMinutes($randomMinutes),
            'updated_at' => Carbon::now()->subMinutes($randomMinutes),

            'event_id' => Event::factory(),
            'user_id' => User::factory(),
        ];
    }
}
