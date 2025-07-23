<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TimeCapsuleController;

Route::options('{any}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Requested-With');
})->where('any', '.*');

Route::middleware(['api'])->group(function () {
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->middleware('auth:api');
    
    Route::controller(AuthController::class)->group(function () {
        Route::post('login', 'login');
        Route::post('register', 'register');
        Route::post('logout', 'logout');
        Route::post('refresh', 'refresh');
    });
    
    Route::get('time-capsules/unlisted/{token}', [TimeCapsuleController::class, 'showByToken']);
    Route::get('time-capsules-public', [TimeCapsuleController::class, 'getPublicCapsules']);
    
    Route::middleware('auth:api')->group(function () {
        Route::apiResource('time-capsules', TimeCapsuleController::class);
        Route::post('time-capsules/{timeCapsule}/share', [TimeCapsuleController::class, 'generateShareLink']);
    });
    
});
