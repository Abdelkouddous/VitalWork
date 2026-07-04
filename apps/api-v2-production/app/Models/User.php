<?php

namespace App\Models;

use App\Enums\UserRole;
use App\Models\Concerns\HasUuid;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * User — Authentication entity.
 *
 * SRP: This model defines the schema, relationships, and casts only.
 * Zero business logic. Authentication checks go in middleware,
 * role-based logic goes in the Service layer.
 */
#[Fillable(['name', 'email', 'password', 'role'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasUuid, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
        ];
    }

    // ─── Relationships ────────────────────────────────────

    /**
     * A clinic user has one clinic profile.
     */
    public function clinicProfile(): HasOne
    {
        return $this->hasOne(ClinicProfile::class);
    }

    /**
     * A healthcare professional user has one professional profile.
     */
    public function healthcareProfessionalProfile(): HasOne
    {
        return $this->hasOne(HealthcareProfessionalProfile::class);
    }
}
