<?php

namespace App\Contracts\Repositories;

use App\Models\Application;

/**
 * ApplicationRepositoryInterface — Data access contract for Application entities.
 *
 * Adds domain-specific queries for the hiring pipeline.
 */
interface ApplicationRepositoryInterface extends RepositoryInterface
{
    /**
     * Check if a healthcare professional has already applied to a specific job.
     * Enforces the business rule: one application per (job, healthcare professional).
     */
    public function existsForJobAndProfessional(string $jobId, string $healthcareProfessionalProfileId): bool;

    /**
     * Find the application for a specific job+healthcare professional pair.
     */
    public function findByJobAndProfessional(string $jobId, string $healthcareProfessionalProfileId): ?Application;
}
