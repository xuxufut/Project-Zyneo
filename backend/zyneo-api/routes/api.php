<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PlaystationController;

Route::get('/ping', function () {
    return response()->json([
        'message' => 'Zyneo API is alive' 
    ]);
    
    Route::apiResource('playstations', PlaystationController::class);
});
