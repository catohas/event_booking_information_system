<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Hall;
use App\Models\Showing;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class CuratedEventSeeder extends Seeder
{
    public function run(): void
    {
        $halls = $this->seedHalls();
        $showings = $this->seedShowings();

        foreach ($this->events() as $data) {
            $hall = $halls[$data['hall_key']];
            $showing = $showings[$data['showing_key']];

            $startsAt = Carbon::now()
                ->addDays($data['days_from_now'])
                ->setTime($data['time'][0], $data['time'][1]);

            Event::updateOrCreate(
                [
                    'hall_id' => $hall->id,
                    'showing_id' => $showing->id,
                    'starts_at' => $startsAt,
                ],
                [
                    'price' => $data['price'],
                ]
            );
        }
    }

    private function seedHalls(): array
    {
        $map = [];

        $map['a1'] = Hall::firstOrCreate(
            ['name' => 'A1'],
            [
                'row_amt' => 12,
                'col_amt' => 20,
            ],
        );

        $map['a2'] = Hall::firstOrCreate(
            ['name' => 'A2'],
            [
                'row_amt' => 16,
                'col_amt' => 24,
            ],
        );

        $map['b1'] = Hall::firstOrCreate(
            ['name' => 'B1'],
            [
                'row_amt' => 8,
                'col_amt' => 12,
            ],
        );

        return $map;
    }

    private function seedShowings(): array
    {
        $map = [];

        $map['play'] = Showing::firstOrCreate(
            ['name' => 'Krásná vzpomínka'],
            [
                'type' => 'Divadlo',
                'description' => 'Divadelní představení Krásná vzpomínka.',
                'length' => '01:30:00',
                'image_path' => 'posters/play.jpg',
                'actors' => 'Karel Novák, Marta Peroutková',
            ],
        );

        $map['movie'] = Showing::firstOrCreate(
            ['name' => 'Avengers: Infinity War'],
            [
                'type' => 'Film',
                'description' => 'Film Avengers: Infinity War.',
                'length' => '02:29:00',
                'image_path' => 'posters/movie.jpg',
                'actors' => 'Robert Downey Jr., Chris Hemsworth, Josh Brolin a další',
            ],
        );

        $map['musical'] = Showing::firstOrCreate(
            ['name' => 'Veselá vdova'],
            [
                'type' => 'Muzikál',
                'description' => 'Muzíkál Veselá vdova.',
                'length' => '01:20:00',
                'image_path' => 'posters/musical.jpg',
                'actors' => 'Jiří Václavek, Monika Horáková, Jaroslava Krausová',
            ],
        );

        $map['lecture'] = Showing::firstOrCreate(
            ['name' => 'Historie Říma'],
            [
                'type' => 'Přednáška',
                'description' => 'Přednáška o historii Říma',
                'length' => '01:00:00',
                'image_path' => 'posters/lecture.jpg',
                'actors' => 'Pavel Vaněk',
            ],
        );

        return $map;
    }

    private function events(): array
    {
        return [
            [
                'title' => 'Krásná vzpomínka',
                'hall_key' => 'a1',
                'showing_key' => 'play',
                'days_from_now' => 1,
                'time' => [19, 30],
                'price' => 220,
            ],
            [
                'title' => 'Avengers: Infinity War',
                'hall_key' => 'a1',
                'showing_key' => 'movie',
                'days_from_now' => 3,
                'time' => [15, 0],
                'price' => 350,
            ],
            [
                'title' => 'Veselá vdova',
                'hall_key' => 'a2',
                'showing_key' => 'musical',
                'days_from_now' => 5,
                'time' => [20, 0],
                'price' => 260,
            ],
            [
                'title' => 'Historie Říma',
                'hall_key' => 'b1',
                'showing_key' => 'lecture',
                'days_from_now' => 2,
                'time' => [21, 45],
                'price' => 200,
            ],
        ];
    }
}
