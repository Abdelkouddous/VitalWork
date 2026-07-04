<?php

namespace App\Exceptions;

use Symfony\Component\HttpFoundation\Response;

/**
 * BusinessRuleViolationException — Thrown when a domain invariant is violated.
 *
 * Examples:
 * - Employer tries to publish more jobs than their quota allows.
 * - Candidate applies to a job they've already applied to.
 * - Attempting to transition an application to an invalid status.
 */
class BusinessRuleViolationException extends DomainException
{
    public function __construct(string $message)
    {
        parent::__construct(
            message: $message,
            statusCode: Response::HTTP_UNPROCESSABLE_ENTITY,
            errorCode: 'BUSINESS_RULE_VIOLATION',
        );
    }
}
