<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Message — Individual message within a conversation.
 *
 * SRP: Schema + relationships only.
 * Read receipts, notification triggers, and content validation
 * live in MessageService.
 */
#[Fillable([
    'conversation_id',
    'sender_id',
    'content',
    'is_read',
])]
class Message extends Model
{
    use HasUuid;

    // ─── Relationships ────────────────────────────────────

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    /**
     * The user who sent the message (can be clinic or healthcare professional).
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    // ─── Casts ────────────────────────────────────────────

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
        ];
    }
}
