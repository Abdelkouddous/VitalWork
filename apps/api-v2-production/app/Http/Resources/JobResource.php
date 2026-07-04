<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * JobResource — API response DTO for Job entities.
 *
 * SRP: Transforms Job model into the API output contract.
 *
 * MONEY GUARD: salary_min_cents and salary_max_cents are stored as integers.
 * This resource exposes both the raw cents AND formatted display values
 * so the frontend can choose what to render.
 */
class JobResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'specialization' => $this->specialization,
            'job_type' => $this->job_type,
            'job_status' => $this->job_status,
            'city' => $this->city,
            'address' => $this->address,
            'department' => $this->department,
            'shift_type' => $this->shift_type,
            'license_required' => $this->license_required,
            'required_experience_years' => $this->required_experience_years,

            // Money Guard: expose both raw cents and formatted display
            'salary' => [
                'min_cents' => $this->salary_min_cents,
                'max_cents' => $this->salary_max_cents,
                'currency' => $this->currency ?? 'DZD',
                'min_display' => $this->salary_min_cents ? number_format($this->salary_min_cents / 100, 2) : null,
                'max_display' => $this->salary_max_cents ? number_format($this->salary_max_cents / 100, 2) : null,
            ],

            'clinic_profile' => $this->whenLoaded('clinicProfile'),
            'applications_count' => $this->whenCounted('applications'),

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
