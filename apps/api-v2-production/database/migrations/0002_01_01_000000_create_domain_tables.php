<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * VitalWork Domain Tables — All UUID primary/foreign keys.
 *
 * DESIGN DECISIONS:
 * - UUID PKs everywhere (Sharding Guard)
 * - Integer cents for salary (Money Guard)
 * - PostgreSQL-native JSONB for flexible data (generated_data, notification data)
 * - Composite unique constraints for business rules (one application per job+professional)
 * - Indexed columns for common query patterns
 *
 * UBIQUITOUS LANGUAGE:
 * - clinic_profiles: The hiring entity (hospital, clinic, facility)
 * - healthcare_professional_profiles: The medical candidate
 */
return new class extends Migration
{
    public function up(): void
    {
        // ─── Clinic Profiles ──────────────────────────────
        Schema::create('clinic_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('company_name');
            $table->text('company_description')->nullable();
            $table->string('company_website')->nullable();
            $table->string('company_logo_url')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->integer('job_offers_quota')->default(5);
            $table->timestamps();

            $table->index('city');
        });

        // ─── Healthcare Professional Profiles ─────────────
        Schema::create('healthcare_professional_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('specialization')->nullable();
            $table->integer('years_of_experience')->default(0);
            $table->string('phone')->nullable();
            $table->string('city')->nullable();
            $table->text('bio')->nullable();
            $table->string('profile_picture_url')->nullable();
            $table->uuid('active_cv_id')->nullable(); // FK added after cvs table
            $table->timestamps();

            $table->index('specialization');
            $table->index('city');
        });

        // ─── CVs ─────────────────────────────────────────
        Schema::create('cvs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('healthcare_professional_profile_id')
                ->constrained('healthcare_professional_profiles')
                ->cascadeOnDelete();
            $table->string('cv_type')->default('uploaded'); // 'uploaded' | 'generated'
            $table->string('cv_url');
            $table->string('original_filename')->nullable();
            $table->jsonb('generated_data')->nullable(); // PostgreSQL JSONB
            $table->timestamps();
        });

        // Add FK for active_cv_id now that cvs table exists
        Schema::table('healthcare_professional_profiles', function (Blueprint $table) {
            $table->foreign('active_cv_id')
                ->references('id')
                ->on('cvs')
                ->nullOnDelete();
        });

        // ─── Jobs ─────────────────────────────────────────
        Schema::create('jobs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('clinic_profile_id')
                ->constrained('clinic_profiles')
                ->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->string('specialization');
            $table->string('job_type');
            $table->string('job_status')->default('draft');
            $table->string('city')->nullable();
            $table->string('address')->nullable();
            $table->integer('salary_min_cents')->nullable(); // Money Guard: integer cents
            $table->integer('salary_max_cents')->nullable(); // Money Guard: integer cents
            $table->string('currency', 3)->default('DZD');
            $table->integer('required_experience_years')->default(0);
            $table->boolean('license_required')->default(false);
            $table->string('shift_type')->nullable(); // 'day' | 'night' | 'rotating'
            $table->string('department')->nullable();
            $table->timestamps();

            $table->index('specialization');
            $table->index('job_status');
            $table->index('city');
            $table->index('job_type');
        });

        // ─── Applications ─────────────────────────────────
        Schema::create('applications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('job_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('healthcare_professional_profile_id')
                ->constrained('healthcare_professional_profiles')
                ->cascadeOnDelete();
            $table->string('status')->default('pending');
            $table->integer('compatibility_score')->nullable();
            $table->text('cover_letter')->nullable();
            $table->string('cv_snapshot_url')->nullable(); // Frozen CV at application time
            $table->timestamps();

            // Business rule: one application per (job, healthcare professional)
            $table->unique(['job_id', 'healthcare_professional_profile_id'], 'applications_job_professional_unique');
            $table->index('status');
        });

        // ─── Conversations ────────────────────────────────
        Schema::create('conversations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('clinic_profile_id')
                ->constrained('clinic_profiles')
                ->cascadeOnDelete();
            $table->foreignUuid('healthcare_professional_profile_id')
                ->constrained('healthcare_professional_profiles')
                ->cascadeOnDelete();
            $table->foreignUuid('job_id')->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->timestamps();

            $table->unique(
                ['clinic_profile_id', 'healthcare_professional_profile_id', 'job_id'],
                'conversations_clinic_professional_job_unique'
            );
        });

        // ─── Messages ─────────────────────────────────────
        Schema::create('messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('conversation_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignUuid('sender_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->text('content');
            $table->boolean('is_read')->default(false);
            $table->timestamps();

            $table->index(['conversation_id', 'created_at']);
        });

        // ─── Blogs ────────────────────────────────────────
        Schema::create('blogs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('author_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('content');
            $table->text('excerpt')->nullable();
            $table->string('cover_image_url')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index('is_published');
        });

        // ─── Comments ─────────────────────────────────────
        Schema::create('comments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('blog_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('author_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->text('content');
            $table->timestamps();
        });

        // ─── Notifications ────────────────────────────────
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('recipient_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->string('type'); // e.g., 'application_received', 'status_changed'
            $table->string('title');
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->jsonb('data')->nullable(); // PostgreSQL JSONB for flexible metadata
            $table->timestamps();

            $table->index(['recipient_id', 'is_read']);
            $table->index('type');
        });
    }

    public function down(): void
    {
        // Drop in reverse dependency order
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('comments');
        Schema::dropIfExists('blogs');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('conversations');
        Schema::dropIfExists('applications');
        Schema::dropIfExists('jobs');

        // Remove FK before dropping table
        Schema::table('healthcare_professional_profiles', function (Blueprint $table) {
            $table->dropForeign(['active_cv_id']);
        });

        Schema::dropIfExists('cvs');
        Schema::dropIfExists('healthcare_professional_profiles');
        Schema::dropIfExists('clinic_profiles');
    }
};
