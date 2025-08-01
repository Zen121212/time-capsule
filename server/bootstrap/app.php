<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Force JSON responses for all API routes
        $middleware->api(append: [
            App\Http\Middleware\ForceJsonResponse::class,
            App\Http\Middleware\Cors::class,
        ]);
        
        // Configure authentication to return JSON for API routes
        $middleware->redirectGuestsTo(function () {
            return request()->expectsJson() ? null : '/login';
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
