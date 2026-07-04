<?php

namespace App\Repositories;

use App\Contracts\Repositories\ApplicationRepositoryInterface;
use App\Models\Application;

/**
 * EloquentApplicationRepository — Concrete Eloquent implementation for Application data access.
 *
 * SRP: Translates the ApplicationRepositoryInterface into Eloquent calls.
 * The uniqueness check (one application per job+professional) is a data-access
 * concern, but the business rule enforcement lives in ApplicationService.
 */
class EloquentApplicationRepository extends BaseRepository implements ApplicationRepositoryInterface
{
    public function __construct(Application $model)
    {
        parent::__construct($model);
    }

    public function existsForJobAndProfessional(string $jobId, string $healthcareProfessionalProfileId): bool
    {
        return $this->model->query()
            ->where('job_id', $jobId)
            ->where('healthcare_professional_profile_id', $healthcareProfessionalProfileId)
            ->exists();
    }

    public function findByJobAndProfessional(string $jobId, string $healthcareProfessionalProfileId): ?Application
    {
        /** @var Application|null */
        return $this->model->query()
            ->where('job_id', $jobId)
            ->where('healthcare_professional_profile_id', $healthcareProfessionalProfileId)
            ->first();
    }
}
