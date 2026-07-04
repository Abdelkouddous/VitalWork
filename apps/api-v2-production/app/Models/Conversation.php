<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Conversation — Communication channel between a clinic and a healthcare professional,
 * optionally contextualized by a specific job posting.
 *
 * SRP: Schema + relationships only.
 * Access control (who can view/message) lives in ConversationService.
 */
#[Fillable([
    'clinic_profile_id',
    'healthcare_professional_profile_id',
    'job_id',
])]
class Conversation extends Model
{
    use HasUuid;

    // ─── Relationships ────────────────────────────────────

    public function clinicProfile(): BelongsTo
    {
        return $this->belongsTo(ClinicProfile::class);
    }

    public function healthcareProfessionalProfile(): BelongsTo
    {
        return $this->belongsTo(HealthcareProfessionalProfile::class);
    }

    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }
}
