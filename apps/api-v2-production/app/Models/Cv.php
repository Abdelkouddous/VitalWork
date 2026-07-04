<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Cv — Candidate uploaded/generated CV record.
 *
 * SRP: Schema + relationships only.
 * File upload handling, parsing, and generated-data population
 * live in CvService.
 */
#[Fillable([
    'healthcare_professional_profile_id',
    'cv_type',
    'cv_url',
    'original_filename',
    'generated_data',
])]
class Cv extends Model
{
    use HasUuid;

    protected $table = 'cvs';

    // ─── Relationships ────────────────────────────────────

    public function healthcareProfessionalProfile(): BelongsTo
    {
        return $this->belongsTo(HealthcareProfessionalProfile::class);
    }

    // ─── Casts ────────────────────────────────────────────

    protected function casts(): array
    {
        return [
            'generated_data' => 'array',
        ];
    }
}
