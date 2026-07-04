<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Comment — User comment on a blog post.
 *
 * SRP: Schema + relationships only.
 */
#[Fillable([
    'blog_id',
    'author_id',
    'content',
])]
class Comment extends Model
{
    use HasUuid;

    // ─── Relationships ────────────────────────────────────

    public function blog(): BelongsTo
    {
        return $this->belongsTo(Blog::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
