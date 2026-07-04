<?php

namespace App\Exceptions;

use Symfony\Component\HttpFoundation\Response;

/**
 * UnauthorizedActionException — Thrown when a user attempts an action
 * they do not have permission for.
 *
 * Separates authorization failures from authentication failures (401).
 * This is a 403 — the user is authenticated but not allowed.
 */
class UnauthorizedActionException extends DomainException
{
    public function __construct(string $message = 'You are not authorized to perform this action.')
    {
        parent::__construct(
            message: $message,
            statusCode: Response::HTTP_FORBIDDEN,
            errorCode: 'UNAUTHORIZED_ACTION',
        );
    }
}
