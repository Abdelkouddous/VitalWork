<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Blog — Content marketing / clinic branding posts.
 *
 * SRP: Schema + relationships only.
 * Content moderation, publishing workflow, and SEO optimization
 * live in BlogService.
 */
#[Fillable([
    'author_id',
    'title',
    'slug',
    'content',
    'excerpt',
    'cover_image_url',
    'is_published',
    'published_at',
])]
class Blog extends Model
{
    use HasUuid;

    // ─── Relationships ────────────────────────────────────

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    // ─── Casts ────────────────────────────────────────────

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'published_at' => 'datetime',
        ];
    }
}
