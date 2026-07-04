<?php

namespace App\Contracts\Repositories;

use Illuminate\Pagination\LengthAwarePaginator;

/**
 * JobRepositoryInterface — Data access contract for Job entities.
 *
 * Adds healthcare-specific search and filtering capabilities
 * beyond the base CRUD surface.
 */
interface JobRepositoryInterface extends RepositoryInterface
{
    /**
     * Search jobs with healthcare-specific filters.
     *
     * @param  array{
     *     specialization?: string,
     *     job_type?: string,
     *     city?: string,
     *     salary_min_cents?: int,
     *     keyword?: string,
     * }  $filters
     */
    public function searchPublished(array $filters, int $perPage = 15): LengthAwarePaginator;

    /**
     * Get all jobs belonging to a specific clinic profile.
     */
    public function findByClinicProfileId(string $clinicProfileId, int $perPage = 15): LengthAwarePaginator;
}
