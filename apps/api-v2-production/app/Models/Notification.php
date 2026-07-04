<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Notification — Platform notification for application events,
 * messages, and system alerts.
 *
 * SRP: Schema + relationships only.
 * Notification dispatch, deduplication, and channel routing
 * live in NotificationService.
 */
#[Fillable([
    'recipient_id',
    'type',
    'title',
    'message',
    'is_read',
    'data',
])]
class Notification extends Model
{
    use HasUuid;

    // ─── Relationships ────────────────────────────────────

    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }

    // ─── Casts ────────────────────────────────────────────

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
            'data' => 'array',
        ];
    }
}
