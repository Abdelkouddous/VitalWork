<?php

namespace App\Models;

use App\Enums\ApplicationStatus;
use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Application — Candidate application to a job posting.
 *
 * SRP: Schema + relationships only.
 * Uniqueness checks (one application per job+candidate), status transitions,
 * and compatibility scoring live in ApplicationService.
 */
#[Fillable([
    'job_id',
    'healthcare_professional_profile_id',
    'status',
    'compatibility_score',
    'cover_letter',
    'cv_snapshot_url',
])]
class Application extends Model
{
    use HasUuid;

    // ─── Relationships ────────────────────────────────────

    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class);
    }

    public function healthcareProfessionalProfile(): BelongsTo
    {
        return $this->belongsTo(HealthcareProfessionalProfile::class);
    }

    // ─── Casts ────────────────────────────────────────────

    protected function casts(): array
    {
        return [
            'status' => ApplicationStatus::class,
            'compatibility_score' => 'integer',
        ];
    }
}
