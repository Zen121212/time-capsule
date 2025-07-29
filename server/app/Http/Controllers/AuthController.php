<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\ApiResponse;
use App\Services\AuthService;
class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
        $this->middleware('auth:api', ['except' => ['login','register']]);
    }
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
        
        $credentials = $request->only('email', 'password');
        $result = $this->authService->login($credentials);
        
        if (!$result['success']) {
            return ApiResponse::error($result['message'], 401);
        }
        
        return ApiResponse::success([
            'user' => $result['user'],
            'authorisation' => [
                'token' => $result['token'],
                'type' => $result['token_type'],
            ]
        ]);
    }
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $userData = $request->only('name', 'email', 'password');
        $result = $this->authService->register($userData);
        
        return ApiResponse::success([
            'user' => $result['user'],
            'authorisation' => [
                'token' => $result['token'],
                'type' => $result['token_type'],
            ]
        ], 'User created successfully', 201);
    }
    public function logout()
    {
        $this->authService->logout();
        return ApiResponse::success(null, 'Successfully logged out');
    }
    public function refresh()
    {
        $result = $this->authService->refresh();
        
        return ApiResponse::success([
            'user' => $result['user'],
            'authorisation' => [
                'token' => $result['token'],
                'type' => $result['token_type'],
            ]
        ]);
    }

}