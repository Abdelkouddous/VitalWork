<?php

namespace App\Models;

use App\Enums\JobStatus;
use App\Enums\JobType;
use App\Enums\Specialization;
use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Job — Healthcare job posting.
 *
 * SRP: Schema + relationships only.
 * Status transitions, quota checks, and search logic live in JobService.
 *
 * MONEY GUARD: salary_min_cents and salary_max_cents are integers in centimes.
 * NEVER use floats for currency. Display formatting is the API Resource's job.
 */
#[Fillable([
    'clinic_profile_id',
    'title',
    'description',
    'specialization',
    'job_type',
    'job_status',
    'city',
    'address',
    'salary_min_cents',
    'salary_max_cents',
    'currency',
    'required_experience_years',
    'license_required',
    'shift_type',
    'department',
])]
class Job extends Model
{
    use HasUuid;

    // ─── Relationships ────────────────────────────────────

    public function clinicProfile(): BelongsTo
    {
        return $this->belongsTo(ClinicProfile::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class);
    }

    // ─── Casts ────────────────────────────────────────────

    protected function casts(): array
    {
        return [
            'specialization' => Specialization::class,
            'job_type' => JobType::class,
            'job_status' => JobStatus::class,
            'salary_min_cents' => 'integer',
            'salary_max_cents' => 'integer',
            'required_experience_years' => 'integer',
            'license_required' => 'boolean',
        ];
    }
}
