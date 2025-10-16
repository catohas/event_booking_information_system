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
            'name' => $this->faker->name(),
            'type' => $this->faker->word(),
            'description' => $this->faker->text(),
            'length' => Carbon::now(),
            'image_path' => $this->faker->word(),
            'actors' => $this->faker->word(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
