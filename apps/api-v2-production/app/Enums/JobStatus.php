<?php

namespace App\Enums;

/**
 * JobStatus — State machine for job posting lifecycle.
 *
 * A job moves: DRAFT → PUBLISHED → (optionally PAUSED) → CLOSED → ARCHIVED.
 * This enum enforces valid states; transition logic lives in the Service layer.
 */
enum JobStatus: string
{
    case DRAFT = 'draft';
    case PUBLISHED = 'published';
    case PAUSED = 'paused';
    case CLOSED = 'closed';
    case ARCHIVED = 'archived';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Draft',
            self::PUBLISHED => 'Published',
            self::PAUSED => 'Paused',
            self::CLOSED => 'Closed',
            self::ARCHIVED => 'Archived',
        };
    }
}
