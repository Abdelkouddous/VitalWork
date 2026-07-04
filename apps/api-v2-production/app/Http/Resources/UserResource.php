<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * UserResource — API response DTO for User entities.
 *
 * SRP: This class has ONE responsibility — transform User model data
 * into the shape the API client expects. It hides sensitive fields,
 * formats dates, and includes conditional relationships.
 *
 * WHY: Decoupling the API contract from the database schema.
 * The User model can add columns without breaking API consumers.
 */
class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'email_verified_at' => $this->email_verified_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),

            // Conditionally include profile based on role
            'clinic_profile' => $this->whenLoaded('clinicProfile'),
            'healthcare_professional_profile' => $this->whenLoaded('healthcareProfessionalProfile'),
        ];
    }
}
