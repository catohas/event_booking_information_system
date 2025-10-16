<?php

namespace Database\Factories;

use App\Models\Hall;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class HallFactory extends Factory
{
    protected $model = Hall::class;

    public function definition(): array
    {
        $randomMinutes = rand(0, 24 * 60);
        return [
            'name' => $this->faker->name(),
            'row_amt' => $this->faker->randomDigitNotZero(),
            'col_amt' => $this->faker->randomDigitNotZero(),
            'created_at' => Carbon::now()->subMinutes($randomMinutes), // sometime in the last 24 hours
            'updated_at' => Carbon::now()->subMinutes($randomMinutes),
        ];
    }
}
