<?php

namespace App\Repositories;

use App\Contracts\Repositories\UserRepositoryInterface;
use App\Models\User;

/**
 * EloquentUserRepository — Concrete Eloquent implementation for User data access.
 *
 * SRP: This class translates the UserRepositoryInterface into Eloquent calls.
 * It has one reason to change: the data access mechanism evolves.
 */
class EloquentUserRepository extends BaseRepository implements UserRepositoryInterface
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    public function findByEmail(string $email): ?User
    {
        /** @var User|null */
        return $this->model->where('email', $email)->first();
    }
}
