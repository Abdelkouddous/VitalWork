<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * DomainException — Base class for all VitalWork business rule exceptions.
 *
 * SOLID PRINCIPLE: Open/Closed (OCP)
 * New domain errors extend this class without modifying the exception handler.
 * The handler renders any DomainException into a consistent JSON envelope.
 *
 * SRP: This class has one job — represent a domain-level error with
 * an HTTP status code and a machine-readable error code.
 */
abstract class DomainException extends Exception
{
    public function __construct(
        string $message,
        protected int $statusCode = Response::HTTP_BAD_REQUEST,
        protected string $errorCode = 'DOMAIN_ERROR',
    ) {
        parent::__construct($message, $statusCode);
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    public function getErrorCode(): string
    {
        return $this->errorCode;
    }

    /**
     * Render the exception as a consistent JSON API response.
     */
    public function render(): JsonResponse
    {
        return response()->json([
            'error' => [
                'code' => $this->errorCode,
                'message' => $this->getMessage(),
            ],
        ], $this->statusCode);
    }
}
