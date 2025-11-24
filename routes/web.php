<?php

use App\Http\Controllers\EventController;
use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $now = now();

    $upcomingEvents = Event::with(['hall', 'showing', 'reservations' => function ($query) {
        $query->active();
    }])
        ->where('starts_at', '>=', $now)
        ->orderBy('starts_at', 'asc')
        ->get();

    $pastEvents = Event::with(['hall', 'showing', 'reservations' => function ($query) {
        $query->active();
    }])
        ->where('starts_at', '<', $now)
        ->orderBy('starts_at', 'desc')
        ->get();

    return Inertia::render('welcome', [
        'upcomingEvents' => EventResource::collection($upcomingEvents),
        'pastEvents' => EventResource::collection($pastEvents),
    ]);
})->name('home');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/cinema.php';
