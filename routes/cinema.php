<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;
use App\Http\Controllers\HallController;
use App\Http\Controllers\ShowingController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ManagementController;
use \App\Http\Controllers\Auth\RegisteredUserController;

Route::get('/events', [EventController::class, 'index']);
Route::get('/halls', [HallController::class, 'index']);
Route::get('/showings', [ShowingController::class, 'index']);
Route::get('/reservations', [ReservationController::class, 'index']);

Route::get('/events/{event}/reservations', [ReservationController::class, 'eventReservations'])
    ->name('events.reservations');

Route::middleware(['auth'])->group(function () {
    Route::get('users', [RegisteredUserController::class, 'index'])
        ->name('users');

    Route::patch('users/{user}', [RegisteredUserController::class, 'update'])
        ->name('users.update');

    Route::delete('users/{user}', [RegisteredUserController::class, 'destroy'])
        ->name('users.destroy');

    Route::get('/management', [ManagementController::class, 'index'])
        ->name('management');

    Route::post('/halls', [HallController::class, 'store'])
        ->name('halls.store');
    Route::patch('/halls/{hall}', [HallController::class, 'update'])
        ->name('halls.update');
    Route::delete('/halls/{hall}', [HallController::class, 'destroy'])
        ->name('halls.destroy');

    Route::post('/showings', [ShowingController::class, 'store'])
        ->name('showings.store');
    Route::patch('/showings/{showing}', [ShowingController::class, 'update'])
        ->name('showings.update');
    Route::delete('/showings/{showing}', [ShowingController::class, 'destroy'])
        ->name('showings.destroy');

    Route::post('/events', [EventController::class, 'store'])
        ->name('events.store');
    Route::patch('/events/{event}', [EventController::class, 'update'])
        ->name('events.update');
    Route::delete('/events/{event}', [EventController::class, 'destroy'])
        ->name('events.destroy');
});
