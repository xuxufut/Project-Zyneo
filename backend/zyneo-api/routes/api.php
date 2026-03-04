<?php

use App\Http\Controllers\Api\PlaystationController;
use App\Http\Controllers\Api\RentalScheduleController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response()->json([
        'message' => 'Zyneo API is alive',
    ]);
});

Route::apiResource('playstations', PlaystationController::class);
Route::apiResource('rental-schedules', RentalScheduleController::class);
