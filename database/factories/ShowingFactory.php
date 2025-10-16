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
            'type' => $this->faker->randomElement(['Play', 'Movie', 'Musical']),
            'description' => $this->faker->text(),
            'length' => Carbon::now(),
            'image_path' => $this->faker->filePath(),
            'actors' => $this->faker->name(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
