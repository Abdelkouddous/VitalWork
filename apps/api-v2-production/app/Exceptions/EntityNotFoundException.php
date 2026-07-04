<?php

namespace App\Exceptions;

use Symfony\Component\HttpFoundation\Response;

/**
 * EntityNotFoundException — Thrown when a requested resource does not exist.
 *
 * Separates "not found" from generic 404s so the service layer can throw
 * semantically meaningful errors without importing HTTP concerns.
 */
class EntityNotFoundException extends DomainException
{
    public function __construct(string $entity, string $id)
    {
        parent::__construct(
            message: "{$entity} with ID [{$id}] was not found.",
            statusCode: Response::HTTP_NOT_FOUND,
            errorCode: 'ENTITY_NOT_FOUND',
        );
    }
}
