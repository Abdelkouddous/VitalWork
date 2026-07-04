<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * ClinicProfile — Extended profile for clinic/hospital/facility users.
 *
 * SRP: Schema + relationships only.
 * Quota enforcement and profile validation live in ClinicService.
 */
#[Fillable([
    'user_id',
    'company_name',
    'company_description',
    'company_website',
    'company_logo_url',
    'phone',
    'address',
    'city',
    'is_verified',
    'job_offers_quota',
])]
class ClinicProfile extends Model
{
    use HasUuid;

    protected $table = 'clinic_profiles';

    // ─── Relationships ────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function jobs(): HasMany
    {
        return $this->hasMany(Job::class, 'clinic_profile_id');
    }

    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class, 'clinic_profile_id');
    }

    // ─── Casts ────────────────────────────────────────────

    protected function casts(): array
    {
        return [
            'is_verified' => 'boolean',
            'job_offers_quota' => 'integer',
        ];
    }
}
