<?php

namespace App\Services;

use App\Contracts\Repositories\UserRepositoryInterface;
use App\Contracts\Services\AuthServiceInterface;
use App\Exceptions\BusinessRuleViolationException;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

/**
 * AuthService — Concrete implementation of authentication logic.
 *
 * SRP: This service orchestrates authentication flows only.
 * It does NOT handle HTTP concerns (that's the controller's job),
 * it does NOT build queries (that's the repository's job),
 * and it does NOT format responses (that's the API Resource's job).
 *
 * DIP: Depends on UserRepositoryInterface, not on Eloquent directly.
 */
class AuthService implements AuthServiceInterface
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function register(array $data): array
    {
        // --- Business rule: email uniqueness ---
        if ($this->userRepository->findByEmail($data['email'])) {
            throw new BusinessRuleViolationException(
                'An account with this email address already exists.'
            );
        }

        /** @var User $user */
        $user = $this->userRepository->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'], // Hashed by model cast
            'role' => $data['role'],
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function login(array $credentials): array
    {
        $user = $this->userRepository->findByEmail($credentials['email']);

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw new BusinessRuleViolationException(
                'The provided credentials are incorrect.'
            );
        }

        // Revoke previous tokens before issuing a new one (single-session enforcement)
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    public function logout(User $user): void
    {
        // Revoke the token that was used for the current request
        $user->currentAccessToken()->delete();
    }
}
