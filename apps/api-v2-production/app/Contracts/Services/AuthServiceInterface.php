<?php

namespace App\Contracts\Services;

use App\Models\User;

/**
 * AuthServiceInterface — Contract for authentication operations.
 *
 * SOLID PRINCIPLE: Dependency Inversion (DIP)
 * Controllers depend on this interface, not on a concrete class.
 * This allows swapping authentication strategies (Sanctum → Passport)
 * without modifying any controller.
 *
 * SRP: One reason to change — the authentication contract evolves.
 */
interface AuthServiceInterface
{
    /**
     * Register a new user account.
     *
     * @param  array{name: string, email: string, password: string, role: string}  $data
     * @return array{user: User, token: string}
     */
    public function register(array $data): array;

    /**
     * Authenticate user with credentials and return token.
     *
     * @param  array{email: string, password: string}  $credentials
     * @return array{user: User, token: string}
     */
    public function login(array $credentials): array;

    /**
     * Revoke the current user's active token.
     */
    public function logout(User $user): void;
}
