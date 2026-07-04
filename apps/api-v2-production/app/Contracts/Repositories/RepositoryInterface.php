<?php

namespace App\Contracts\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * RepositoryInterface — Base contract for all data access layers.
 *
 * SOLID PRINCIPLE: Dependency Inversion (DIP)
 * Services depend on this abstraction, not on concrete Eloquent queries.
 * This allows swapping implementations (e.g., Eloquent → API client)
 * without modifying any service class.
 *
 * SRP: This interface has one reason to change — the data access contract evolves.
 */
interface RepositoryInterface
{
    /**
     * Retrieve all records, optionally filtered by column-value pairs.
     *
     * @param  array<string, mixed>  $filters
     * @param  array<string>  $relations  Eager-load relationships
     */
    public function all(array $filters = [], array $relations = []): Collection;

    /**
     * Paginate records with optional filters.
     *
     * @param  int  $perPage
     * @param  array<string, mixed>  $filters
     * @param  array<string>  $relations
     */
    public function paginate(int $perPage = 15, array $filters = [], array $relations = []): LengthAwarePaginator;

    /**
     * Find a single record by UUID. Returns null if not found.
     */
    public function findById(string $id, array $relations = []): ?Model;

    /**
     * Find a single record by UUID or throw ModelNotFoundException.
     */
    public function findByIdOrFail(string $id, array $relations = []): Model;

    /**
     * Create a new record with the given attributes.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): Model;

    /**
     * Update an existing record by UUID.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function update(string $id, array $attributes): Model;

    /**
     * Delete a record by UUID. Returns true on success.
     */
    public function delete(string $id): bool;
}
