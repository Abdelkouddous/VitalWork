<?php

namespace App\Http\Controllers\Api\V1;

use App\Contracts\Services\AuthServiceInterface;
use App\Http\Controllers\Api\BaseApiController;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * AuthController — Handles authentication HTTP endpoints.
 *
 * SRP: This controller has ONE responsibility — translate HTTP requests
 * into service calls and format the response. Zero business logic.
 *
 * - Validation lives in Form Requests (LoginRequest, RegisterRequest)
 * - Business logic lives in AuthServiceInterface
 * - Response formatting lives in UserResource
 */
class AuthController extends BaseApiController
{
    public function __construct(
        private readonly AuthServiceInterface $authService,
    ) {}

    /**
     * POST /api/v1/auth/register
     *
     * Register a new user account.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register($request->validated());

        return $this->created([
            'user' => new UserResource($result['user']),
            'token' => $result['token'],
        ], 'Account created successfully.');
    }

    /**
     * POST /api/v1/auth/login
     *
     * Authenticate and receive an API token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login($request->validated());

        return $this->success([
            'user' => new UserResource($result['user']),
            'token' => $result['token'],
        ], 'Logged in successfully.');
    }

    /**
     * POST /api/v1/auth/logout
     *
     * Revoke the current token.
     */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return $this->success(message: 'Logged out successfully.');
    }

    /**
     * GET /api/v1/auth/me
     *
     * Return the authenticated user's profile.
     */
    public function me(Request $request): JsonResponse
    {
        return $this->success(
            new UserResource($request->user()),
        );
    }
}
