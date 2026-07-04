<?php

namespace App\Enums;

/**
 * UserRole — Exhaustive role definitions for the VitalWork platform.
 *
 * WHY ENUMS: Eliminates magic strings like 'admin', 'employer' scattered
 * across the codebase. Provides type safety, IDE autocompletion, and
 * compile-time exhaustiveness checking via match expressions.
 */
enum UserRole: string
{
    case ADMIN = 'admin';
    case EMPLOYER = 'clinic';
    case JOB_SEEKER = 'job_seeker';

    /**
     * Human-readable label for UI/API responses.
     */
    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Administrator',
            self::EMPLOYER => 'Employer',
            self::JOB_SEEKER => 'Healthcare Professional',
        };
    }
}
