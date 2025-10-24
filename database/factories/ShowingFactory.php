<?php

namespace Database\Factories;

use App\Models\Showing;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class ShowingFactory extends Factory
{
    protected $model = Showing::class;

    public function definition(): array
    {
        return [
            'name' => ucfirst(join(' ', $this->faker->words(2))),
            'type' => $this->faker->randomElement(['Divadlo', 'Film', 'Muzikál', 'Přednáška']),
            'description' => $this->faker->text(),
            'length' => Carbon::now(),
            'image_path' => null,
            'actors' => $this->faker->name(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
