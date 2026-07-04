<?php

namespace App\Providers;

use App\Contracts\Repositories\ApplicationRepositoryInterface;
use App\Contracts\Repositories\JobRepositoryInterface;
use App\Contracts\Repositories\UserRepositoryInterface;
use App\Contracts\Services\AuthServiceInterface;
use App\Repositories\EloquentApplicationRepository;
use App\Repositories\EloquentJobRepository;
use App\Repositories\EloquentUserRepository;
use App\Services\AuthService;
use Illuminate\Support\ServiceProvider;

/**
 * RepositoryServiceProvider — The DI wiring hub.
 *
 * SOLID PRINCIPLE: Dependency Inversion (DIP)
 * This is the ONLY place in the application that knows about concrete implementations.
 * Every other class depends on interfaces. Swapping an Eloquent repository for
 * an API-based one requires changing ONLY this file.
 *
 * SRP: One reason to change — a binding needs to be added, removed, or swapped.
 */
class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register interface-to-implementation bindings.
     */
    public function register(): void
    {
        // ─── Repository Bindings ──────────────────────────
        $this->app->bind(UserRepositoryInterface::class, EloquentUserRepository::class);
        $this->app->bind(JobRepositoryInterface::class, EloquentJobRepository::class);
        $this->app->bind(ApplicationRepositoryInterface::class, EloquentApplicationRepository::class);

        // ─── Service Bindings ─────────────────────────────
        $this->app->bind(AuthServiceInterface::class, AuthService::class);

        // TODO: Add bindings as new domain modules are implemented:
        // $this->app->bind(JobServiceInterface::class, JobService::class);
        // $this->app->bind(ApplicationServiceInterface::class, ApplicationService::class);
        // $this->app->bind(EmployerServiceInterface::class, EmployerService::class);
        // $this->app->bind(JobSeekerServiceInterface::class, JobSeekerService::class);
    }
}
