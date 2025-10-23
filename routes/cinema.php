<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;
use App\Http\Controllers\HallController;
use App\Http\Controllers\ShowingController;
use App\Http\Controllers\ReservationController;
use \App\Http\Controllers\Auth\RegisteredUserController;

Route::get('/events', [EventController::class, 'index']);
Route::get('/halls', [HallController::class, 'index']);
Route::get('/showings', [ShowingController::class, 'index']);
Route::get('/reservations', [ReservationController::class, 'index']);

Route::get('/events/{event}/reservations', [ReservationController::class, 'eventReservations'])
    ->name('events.reservations');

Route::get('users', [RegisteredUserController::class, 'index'])
    ->name('users');

Route::patch('users/{user}', [RegisteredUserController::class, 'update'])
    ->name('users.update');

Route::delete('users/{user}', [RegisteredUserController::class, 'destroy'])
    ->name('users.destroy');
