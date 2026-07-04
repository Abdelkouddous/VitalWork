<?php

namespace App\Models\Concerns;

use Illuminate\Support\Str;

/**
 * HasUuid — Enforces UUID primary keys on all Eloquent models.
 *
 * WHY: Auto-incrementing integers leak entity count, create merge conflicts
 * in distributed systems, and prevent future sharding. UUIDs solve all three.
 *
 * USAGE: Use this trait on every model alongside `$table->uuid('id')->primary()`
 * in the corresponding migration.
 */
trait HasUuid
{
    /**
     * Boot the trait: generate a UUID v4 when creating a new model.
     */
    protected static function bootHasUuid(): void
    {
        static::creating(function ($model): void {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid()->toString();
            }
        });
    }

    /**
     * UUIDs are strings, not integers.
     */
    public function getKeyType(): string
    {
        return 'string';
    }

    /**
     * Disable auto-incrementing — UUIDs are application-generated.
     */
    public function getIncrementing(): bool
    {
        return false;
    }
}
