<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;
use App\Http\Controllers\HallController;
use App\Http\Controllers\ShowingController;
use App\Http\Controllers\ReservationController;

Route::get('/events', [EventController::class, 'index']);
Route::get('/halls', [HallController::class, 'index']);
Route::get('/showings', [ShowingController::class, 'index']);
Route::get('/reservations', [ReservationController::class, 'index']);
