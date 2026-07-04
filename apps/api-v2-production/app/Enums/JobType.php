<?php

namespace App\Enums;

/**
 * JobType — Employment contract classifications.
 *
 * Healthcare-specific contract types including locum (temporary medical staffing)
 * which is unique to the medical recruitment domain.
 */
enum JobType: string
{
    case FULL_TIME = 'full_time';
    case PART_TIME = 'part_time';
    case CONTRACT = 'contract';
    case LOCUM = 'locum';       // Temporary medical staffing
    case INTERNSHIP = 'internship';

    public function label(): string
    {
        return match ($this) {
            self::FULL_TIME => 'Full Time',
            self::PART_TIME => 'Part Time',
            self::CONTRACT => 'Contract',
            self::LOCUM => 'Locum / Temporary',
            self::INTERNSHIP => 'Internship',
        };
    }
}
