<?php

namespace App\Repositories;

use App\Contracts\Repositories\JobRepositoryInterface;
use App\Enums\JobStatus;
use App\Models\Job;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * EloquentJobRepository — Concrete Eloquent implementation for Job data access.
 *
 * SRP: This class translates the JobRepositoryInterface into Eloquent calls.
 * Complex healthcare-specific filtering logic is encapsulated here,
 * keeping the Service layer free from query-building concerns.
 */
class EloquentJobRepository extends BaseRepository implements JobRepositoryInterface
{
    public function __construct(Job $model)
    {
        parent::__construct($model);
    }

    public function searchPublished(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->query()
            ->where('job_status', JobStatus::PUBLISHED);

        // --- Healthcare-specific filters ---

        if (! empty($filters['specialization'])) {
            $query->where('specialization', $filters['specialization']);
        }

        if (! empty($filters['job_type'])) {
            $query->where('job_type', $filters['job_type']);
        }

        if (! empty($filters['city'])) {
            $query->where('city', 'ilike', '%' . $filters['city'] . '%');
        }

        if (! empty($filters['salary_min_cents'])) {
            $query->where('salary_min_cents', '>=', $filters['salary_min_cents']);
        }

        if (! empty($filters['keyword'])) {
            $keyword = '%' . $filters['keyword'] . '%';
            $query->where(function ($q) use ($keyword): void {
                $q->where('title', 'ilike', $keyword)
                    ->orWhere('description', 'ilike', $keyword);
            });
        }

        return $query->with('clinicProfile')
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    public function findByClinicProfileId(string $clinicProfileId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->query()
            ->where('clinic_profile_id', $clinicProfileId)
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }
}
