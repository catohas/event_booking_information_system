<?php

use App\Http\Controllers\EventController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function (EventController $eventController) {
        return Inertia::render('dashboard', [
            'events' => $eventController->index()
        ]);
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/cinema.php';
