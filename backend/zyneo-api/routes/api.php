<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PlaystationController;
use App\Http\Controllers\Api\RentalScheduleController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response()->json([
        'message' => 'Zyneo API is alive',
    ]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('api.token')->group(function (): void {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('playstations', PlaystationController::class);
    Route::apiResource('rental-schedules', RentalScheduleController::class);
});
