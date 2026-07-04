<?php

namespace App\Models;

use App\Enums\Specialization;
use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * HealthcareProfessionalProfile — Extended profile for medical candidate users.
 *
 * SRP: Schema + relationships only.
 * Application submission logic, CV management, and profile
 * completeness validation live in HealthcareProfessionalService.
 */
#[Fillable([
    'user_id',
    'first_name',
    'last_name',
    'specialization',
    'years_of_experience',
    'phone',
    'city',
    'bio',
    'profile_picture_url',
    'active_cv_id',
])]
class HealthcareProfessionalProfile extends Model
{
    use HasUuid;

    protected $table = 'healthcare_professional_profiles';

    // ─── Relationships ────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'healthcare_professional_profile_id');
    }

    public function cvs(): HasMany
    {
        return $this->hasMany(Cv::class, 'healthcare_professional_profile_id');
    }

    /**
     * The currently active CV (nullable reference).
     */
    public function activeCv(): BelongsTo
    {
        return $this->belongsTo(Cv::class, 'active_cv_id');
    }

    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class, 'healthcare_professional_profile_id');
    }

    // ─── Casts ────────────────────────────────────────────

    protected function casts(): array
    {
        return [
            'specialization' => Specialization::class,
            'years_of_experience' => 'integer',
        ];
    }
}
