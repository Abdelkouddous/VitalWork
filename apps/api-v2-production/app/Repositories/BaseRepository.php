<?php

namespace App\Repositories;

use App\Contracts\Repositories\RepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * BaseRepository — Concrete Eloquent implementation of RepositoryInterface.
 *
 * SOLID PRINCIPLE: Open/Closed (OCP)
 * Domain repositories extend this and only override what they need.
 * Common CRUD is implemented once here, domain-specific queries
 * are added in child classes.
 *
 * SRP: This class has one responsibility — translate the RepositoryInterface
 * contract into Eloquent query builder calls.
 */
abstract class BaseRepository implements RepositoryInterface
{
    public function __construct(protected Model $model) {}

    public function all(array $filters = [], array $relations = []): Collection
    {
        return $this->applyFilters($this->model->query(), $filters)
            ->with($relations)
            ->get();
    }

    public function paginate(int $perPage = 15, array $filters = [], array $relations = []): LengthAwarePaginator
    {
        return $this->applyFilters($this->model->query(), $filters)
            ->with($relations)
            ->paginate($perPage);
    }

    public function findById(string $id, array $relations = []): ?Model
    {
        return $this->model->with($relations)->find($id);
    }

    public function findByIdOrFail(string $id, array $relations = []): Model
    {
        return $this->model->with($relations)->findOrFail($id);
    }

    public function create(array $attributes): Model
    {
        return $this->model->create($attributes);
    }

    public function update(string $id, array $attributes): Model
    {
        $record = $this->findByIdOrFail($id);
        $record->update($attributes);

        return $record->fresh();
    }

    public function delete(string $id): bool
    {
        return (bool) $this->findByIdOrFail($id)->delete();
    }

    /**
     * Apply simple where-clause filters to a query builder.
     * Override in child repositories for complex filtering logic.
     *
     * @param  Builder  $query
     * @param  array<string, mixed>  $filters
     */
    protected function applyFilters(Builder $query, array $filters): Builder
    {
        foreach ($filters as $column => $value) {
            if (is_null($value)) {
                continue;
            }

            if (is_array($value)) {
                $query->whereIn($column, $value);
            } else {
                $query->where($column, $value);
            }
        }

        return $query;
    }
}
