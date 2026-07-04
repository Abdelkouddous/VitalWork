<?php

namespace App\Enums;

/**
 * ApplicationStatus — Hiring pipeline states for candidate applications.
 *
 * Flow: PENDING → REVIEWED → SHORTLISTED → INTERVIEW → OFFERED → HIRED
 *                                                           ↘ REJECTED (at any stage)
 *                                                           ↘ WITHDRAWN (by candidate)
 */
enum ApplicationStatus: string
{
    case PENDING = 'pending';
    case REVIEWED = 'reviewed';
    case SHORTLISTED = 'shortlisted';
    case INTERVIEW = 'interview';
    case OFFERED = 'offered';
    case HIRED = 'hired';
    case REJECTED = 'rejected';
    case WITHDRAWN = 'withdrawn';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pending Review',
            self::REVIEWED => 'Under Review',
            self::SHORTLISTED => 'Shortlisted',
            self::INTERVIEW => 'Interview Stage',
            self::OFFERED => 'Offer Extended',
            self::HIRED => 'Hired',
            self::REJECTED => 'Rejected',
            self::WITHDRAWN => 'Withdrawn',
        };
    }

    /**
     * Whether this status represents a terminal (final) state.
     */
    public function isTerminal(): bool
    {
        return in_array($this, [self::HIRED, self::REJECTED, self::WITHDRAWN]);
    }
}
