<?php

namespace App\Contracts\Repositories;

use App\Models\User;

/**
 * UserRepositoryInterface — Data access contract for User entities.
 *
 * Extends the base CRUD contract and adds domain-specific queries.
 * Services depend on this interface, NOT on the Eloquent implementation.
 */
interface UserRepositoryInterface extends RepositoryInterface
{
    /**
     * Find a user by email address.
     */
    public function findByEmail(string $email): ?User;
}
