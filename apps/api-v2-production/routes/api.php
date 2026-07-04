<?php

/**
 * VitalWork API Routes — Version 1
 *
 * All routes are prefixed with /api/v1.
 * Route groups enforce SRP: each group handles one domain concern.
 *
 * Architecture:
 * Route → FormRequest (validate) → Controller (translate) → Service (logic) → Repository (data)
 */

use App\Http\Controllers\Api\V1\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes (no authentication required)
|--------------------------------------------------------------------------
*/
Route::prefix('v1')->group(function (): void {

    // ─── Authentication ───────────────────────────────────
    Route::prefix('auth')->group(function (): void {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
    });

    // ─── Public Job Search ────────────────────────────────
    // TODO: Route::get('/jobs', [JobController::class, 'index']);
    // TODO: Route::get('/jobs/{id}', [JobController::class, 'show']);

    // ─── Public Blog ──────────────────────────────────────
    // TODO: Route::get('/blogs', [BlogController::class, 'index']);
    // TODO: Route::get('/blogs/{slug}', [BlogController::class, 'show']);

    /*
    |--------------------------------------------------------------------------
    | Authenticated Routes (Sanctum token required)
    |--------------------------------------------------------------------------
    */
    Route::middleware('auth:sanctum')->group(function (): void {

        // ─── Auth Session ─────────────────────────────────
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // ─── Clinic Routes ────────────────────────────────
        // TODO: Route::apiResource('clinic/jobs', ClinicJobController::class);
        // TODO: Route::get('clinic/applications', [ClinicApplicationController::class, 'index']);
        // TODO: Route::patch('clinic/applications/{id}/status', [ClinicApplicationController::class, 'updateStatus']);
        // TODO: Route::get('clinic/dashboard', [ClinicDashboardController::class, 'index']);

        // ─── Healthcare Professional Routes ───────────────
        // TODO: Route::get('professional/profile', [HealthcareProfessionalProfileController::class, 'show']);
        // TODO: Route::put('professional/profile', [HealthcareProfessionalProfileController::class, 'update']);
        // TODO: Route::post('professional/applications', [ApplicationController::class, 'store']);
        // TODO: Route::get('professional/applications', [ApplicationController::class, 'index']);
        // TODO: Route::apiResource('professional/cvs', CvController::class)->except(['update']);

        // ─── Messaging ────────────────────────────────────
        // TODO: Route::apiResource('conversations', ConversationController::class)->only(['index', 'show', 'store']);
        // TODO: Route::post('conversations/{id}/messages', [MessageController::class, 'store']);

        // ─── Notifications ────────────────────────────────
        // TODO: Route::get('notifications', [NotificationController::class, 'index']);
        // TODO: Route::patch('notifications/{id}/read', [NotificationController::class, 'markRead']);
    });
});
