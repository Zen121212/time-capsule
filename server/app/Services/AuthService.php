<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function login(array $credentials): array
    {
        $token = Auth::attempt($credentials);
        
        if (!$token) {
            return [
                'success' => false,
                'message' => 'Invalid credentials'
            ];
        }

        return [
            'success' => true,
            'user' => Auth::user(),
            'token' => $token,
            'token_type' => 'bearer'
        ];
    }

    public function register(array $userData): array
    {
        $user = User::create([
            'name' => $userData['name'],
            'email' => $userData['email'],
            'password' => Hash::make($userData['password']),
        ]);

        $token = Auth::login($user);

        return [
            'success' => true,
            'user' => $user,
            'token' => $token,
            'token_type' => 'bearer'
        ];
    }

    public function logout(): bool
    {
        Auth::logout();
        return true;
    }

    public function refresh(): array
    {
        return [
            'success' => true,
            'user' => Auth::user(),
            'token' => Auth::refresh(),
            'token_type' => 'bearer'
        ];
    }

    public function emailExists(string $email): bool
    {
        return User::where('email', $email)->exists();
    }
}
