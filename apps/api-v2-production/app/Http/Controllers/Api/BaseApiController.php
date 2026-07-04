<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Symfony\Component\HttpFoundation\Response;

/**
 * BaseApiController — Shared response envelope helpers.
 *
 * SRP: This class provides a consistent JSON response format.
 * It does NOT contain business logic or validation.
 *
 * All API controllers extend this to inherit the envelope pattern:
 * { "data": ..., "message": "..." } for success
 * { "error": { "code": "...", "message": "..." } } for errors
 */
abstract class BaseApiController extends Controller
{
    /**
     * Return a success response with data.
     */
    protected function success(
        mixed $data = null,
        string $message = 'Success',
        int $statusCode = Response::HTTP_OK,
    ): JsonResponse {
        return response()->json([
            'data' => $data,
            'message' => $message,
        ], $statusCode);
    }

    /**
     * Return a success response for resource creation.
     */
    protected function created(mixed $data = null, string $message = 'Resource created successfully'): JsonResponse
    {
        return $this->success($data, $message, Response::HTTP_CREATED);
    }

    /**
     * Return a no-content response (204).
     */
    protected function noContent(): JsonResponse
    {
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
